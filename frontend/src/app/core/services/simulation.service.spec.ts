import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SimulationService } from './simulation.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ArchitectureConnection, ArchitectureNode, HealthStatus } from '../models/architecture.model';

const VALID_STATUSES: HealthStatus[] = ['normal', 'busy', 'overloaded', 'failing', 'offline'];
const TICK_MS = 180;

/**
 * Characterization tests for the deterministic traffic engine, driven through
 * its public lifecycle with fake timers. They assert structural invariants
 * (tick advances, statuses stay valid, metrics never go NaN, lifecycle
 * transitions) rather than exact per-tick numbers, which include randomness.
 */
describe('SimulationService', () => {
  let sim: SimulationService;
  let factory: ArchitectureFactoryService;

  beforeEach(() => {
    vi.useFakeTimers();
    factory = new ArchitectureFactoryService(new AwsCatalogService());
    sim = new SimulationService(factory);
  });

  afterEach(() => {
    sim.stop();
    vi.useRealTimers();
  });

  /** A minimal but valid client → ec2 graph. */
  function clientToEc2(): { nodes: ArchitectureNode[]; connections: ArchitectureConnection[] } {
    const client = factory.createNode('client', 0, 0);
    const ec2 = factory.createNode('ec2', 300, 0);
    const out = client.ports.find((p) => p.direction === 'output')!;
    const inp = ec2.ports.find((p) => p.direction === 'input')!;
    const conn = factory.createConnection(client.id, out.id, ec2.id, inp.id, out.type);
    return { nodes: [client, ec2], connections: [conn] };
  }

  function assertHealthySnapshot(): void {
    const snap = sim.snapshot$.value;
    for (const node of snap.nodes) {
      expect(VALID_STATUSES).toContain(node.status);
      for (const value of Object.values(node.metrics)) {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
    expect(Number.isFinite(snap.totals.processed)).toBe(true);
    expect(Number.isFinite(snap.totals.dropped)).toBe(true);
    expect(Number.isFinite(snap.totals.avgLatency)).toBe(true);
  }

  it('emits a running snapshot immediately on start', () => {
    const { nodes, connections } = clientToEc2();
    sim.start(nodes, connections);
    expect(sim.snapshot$.value.mode).toBe('running');
    expect(sim.snapshot$.value.tick).toBe(0);
  });

  it('advances ticks and keeps node state valid each step', () => {
    const { nodes, connections } = clientToEc2();
    sim.start(nodes, connections);

    vi.advanceTimersByTime(TICK_MS * 3);

    expect(sim.snapshot$.value.tick).toBeGreaterThanOrEqual(3);
    expect(sim.snapshot$.value.mode).toBe('running');
    assertHealthySnapshot();
  });

  it('does not mutate the caller’s original node objects', () => {
    const { nodes, connections } = clientToEc2();
    const originalStatus = nodes[1].status;
    sim.start(nodes, connections);
    vi.advanceTimersByTime(TICK_MS * 2);
    // The engine works on its own copies; the input array’s nodes are untouched.
    expect(nodes[1].status).toBe(originalStatus);
  });

  it('pauses without advancing, then resumes', () => {
    const { nodes, connections } = clientToEc2();
    sim.start(nodes, connections);
    vi.advanceTimersByTime(TICK_MS * 2);
    const tickAtPause = sim.snapshot$.value.tick;

    sim.pause();
    expect(sim.snapshot$.value.mode).toBe('paused');
    vi.advanceTimersByTime(TICK_MS * 5);
    expect(sim.snapshot$.value.tick).toBe(tickAtPause);

    sim.resume();
    vi.advanceTimersByTime(TICK_MS * 2);
    expect(sim.snapshot$.value.tick).toBeGreaterThan(tickAtPause);
  });

  it('returns to idle and clears packets on stop', () => {
    const { nodes, connections } = clientToEc2();
    sim.start(nodes, connections);
    vi.advanceTimersByTime(TICK_MS * 3);

    sim.stop();
    expect(sim.snapshot$.value.mode).toBe('idle');
    expect(sim.snapshot$.value.packets).toEqual([]);
  });

  describe('dynamic RPS helpers', () => {
    function connect(a: ArchitectureNode, b: ArchitectureNode): ArchitectureConnection {
      const out = a.ports.find((p) => p.direction === 'output')!;
      const inp = b.ports.find((p) => p.direction === 'input') ?? b.ports[0];
      return factory.createConnection(a.id, out.id, b.id, inp ? inp.id : 'in', out.type);
    }

    it('estimateDemand propagates rate through weights and cache offload', () => {
      const client = factory.createNode('client', 0, 0);
      client.config.requestRate = 1000;
      const cdn = factory.createNode('cloudfront', 300, 0);
      cdn.config.cacheHitRate = 80;
      const ecs = factory.createNode('ecs', 600, 0);
      const connections = [connect(client, cdn), connect(cdn, ecs)];
      const demand = sim.estimateDemand([client, cdn, ecs], connections);
      expect(demand.get(cdn.id)).toBe(1000);
      // Only the 20% cache misses reach the origin, further shaped by the
      // engine's 0.72 CDN edge factor (mirrors propagateNodeOutput).
      expect(demand.get(ecs.id)).toBeCloseTo(1000 * 0.2 * 0.72, 5);
    });

    it('autoSizeForDemand sizes ECS so the demand runs without overload', () => {
      const client = factory.createNode('client', 0, 0);
      client.config.requestRate = 1000;
      client.config['variableTraffic'] = false;
      const ecs = factory.createNode('ecs', 300, 0);
      const updates = sim.autoSizeForDemand(ecs, 1000)!;
      expect(updates).toBeTruthy();
      expect(Number(updates['tasks'])).toBeGreaterThan(Number(ecs.config['tasks']) || 2);
      Object.assign(ecs.config, updates);

      sim.start([client, ecs], [connect(client, ecs)]);
      sim.pause();
      for (let i = 0; i < 25; i++) (sim as any).step('running');
      const node = (sim as any).nodes.find((n: ArchitectureNode) => n.id === ecs.id)!;
      expect(['normal', 'busy']).toContain(node.status);
      expect(node.metrics.errorRate).toBe(0);
    });
  });

  /**
   * Golden test: locks in the exact per-tick node metrics for a fixed graph.
   * The metrics path is deterministic when no client uses Variable Traffic, so
   * this snapshot catches any behavioral drift while step() is refactored.
   */
  it('matches the recorded metrics for a fixed graph after 10 ticks', () => {
    const client = factory.createNode('client', 0, 0);
    const ec2 = factory.createNode('ec2', 300, 0);
    const rds = factory.createNode('rds', 600, 0);
    const connect = (a: ArchitectureNode, b: ArchitectureNode) => {
      const out = a.ports.find((p) => p.direction === 'output')!;
      const inp = b.ports.find((p) => p.direction === 'input')!;
      return factory.createConnection(a.id, out.id, b.id, inp.id, out.type);
    };
    const nodes = [client, ec2, rds];
    const connections = [connect(client, ec2), connect(ec2, rds)];

    sim.start(nodes, connections);
    vi.advanceTimersByTime(TICK_MS * 10);

    const round = (n: number) => Math.round(n * 1000) / 1000;
    const snap = sim.snapshot$.value;
    const view = {
      tick: snap.tick,
      nodes: snap.nodes.map((n) => ({
        type: n.type,
        status: n.status,
        throughput: round(n.metrics.throughput),
        avgLatency: round(n.metrics.avgLatency),
        queueSize: round(n.metrics.queueSize),
        cpuPressure: round(n.metrics.cpuPressure),
        errorRate: round(n.metrics.errorRate),
      })),
    };
    expect(view).toMatchSnapshot();
  });
});
