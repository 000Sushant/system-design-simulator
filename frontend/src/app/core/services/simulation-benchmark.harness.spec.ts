/**
 * simulation-benchmark.harness.spec.ts
 *
 * NOT a unit test — a benchmark harness that drives the real SimulationService
 * through a standardized load-scenario suite for every service in the catalog
 * and scores the observed behavior against the expected AWS saturation
 * semantics (reject / queue / degrade / unbounded) from service-bottleneck.json.
 *
 * Scenarios per service (client → service graph, deterministic, no variable
 * traffic):
 *   UNDER   ρ=0.5   healthy operation: no errors, no stress states
 *   NEAR    ρ=0.92  approach saturation: queueing latency for resource-bound
 *                   services, flat latency for fail-fast managed services
 *   OVER    ρ=1.6 (reject/queue) or ρ=2.0 (degrade): correct saturation
 *                   behavior for the service's class
 *   RECOVER ρ=0.3   after overload: managed services recover instantly,
 *                   queues drain, resource-bound services stay collapsed
 *                   (engine models no auto-recovery — informational)
 *
 * Only runs when BM_SIM_OUT is set, so `npm test` is unaffected:
 *   BM_SIM_OUT=../docs/benchmark-data/simulation-accuracy.json npx vitest run \
 *     src/app/core/services/simulation-benchmark.harness.spec.ts
 */
import { describe, it } from 'vitest';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { SimulationService } from './simulation.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ArchitectureNode, AwsServiceType } from '../models/architecture.model';
import bottleneckData from '../data/service-bottleneck.json';

const OUT = process.env['BM_SIM_OUT'];
const enabled = Boolean(OUT);

interface Check {
  name: string;
  pass: boolean;
  detail: string;
  informational?: boolean;
}

interface ServiceResult {
  type: string;
  name: string;
  category: string;
  kind: string;
  failureMode: string;
  saturation: string;
  capacitySource: 'formula' | 'quota' | 'unbounded' | 'legacy-knob';
  capacity: number;
  baseLatencyMs: number;
  checks: Check[];
  score: number;
  notes: string[];
}

const bn = bottleneckData as unknown as Record<
  string,
  {
    kind: string;
    failureMode: 'throttle' | 'offline' | 'none';
    offlineAtRatio?: number;
    capacityRps?: number;
    saturation?: 'reject' | 'queue' | 'degrade';
    atSaturation?: string;
  }
>;

function saturationOf(type: string): 'reject' | 'queue' | 'degrade' | 'none' {
  const spec = bn[type];
  if (!spec) return 'degrade';
  if (spec.failureMode === 'none') return 'none';
  if (spec.saturation) return spec.saturation;
  return spec.failureMode === 'offline' ? 'degrade' : 'reject';
}

/** Service types with a native sizing formula in computeNodeCapacity. */
const FORMULA_TYPES = new Set([
  'lambda', 'dynamoDb', 'kinesis', 'appRunner', 'rds', 'ecs', 'elastiCache',
  'openSearch', 'ec2', 'elasticBeanstalk', 'autoScalingGroup', 'eks', 'emr',
  'sageMaker', 'redshift', 'aurora', 'documentDb', 'neptune',
]);

describe('Simulation accuracy benchmark', () => {
  (enabled ? it : it.skip)('scores saturation behavior for every catalog service', () => {
    const catalog = new AwsCatalogService();
    const factory = new ArchitectureFactoryService(catalog);

    interface TickSample {
      status: string;
      errorRate: number;
      avgLatency: number;
      queueSize: number;
      received: number;
    }

    function makeSim(type: AwsServiceType, rps: number) {
      const sim = new SimulationService(factory);
      const client = factory.createNode('client', 0, 0);
      client.config['variableTraffic'] = false;
      client.config.requestRate = rps;
      const svc = factory.createNode(type, 300, 0);
      const outPort = client.ports.find((p) => p.direction === 'output')!;
      const inPort = svc.ports.find((p) => p.direction === 'input') ?? svc.ports[0];
      const conn = factory.createConnection(
        client.id,
        outPort.id,
        svc.id,
        inPort ? inPort.id : 'in',
        outPort.type,
      );
      sim.start([client, svc], [conn]);
      sim.pause(); // detach the interval; the harness drives ticks directly
      return { sim, svcId: svc.id, clientId: client.id };
    }

    function runTicks(sim: SimulationService, svcId: string, ticks: number): TickSample[] {
      const samples: TickSample[] = [];
      for (let i = 0; i < ticks; i++) {
        (sim as any).step('running');
        const node = (sim as any).nodes.find((n: ArchitectureNode) => n.id === svcId)!;
        samples.push({
          status: node.status,
          errorRate: node.metrics.errorRate,
          avgLatency: node.metrics.avgLatency,
          queueSize: node.metrics.queueSize,
          received: node.metrics.received,
        });
      }
      return samples;
    }

    function probeCapacity(type: AwsServiceType): { capacity: number; baseLatency: number } {
      const { sim, svcId } = makeSim(type, 1);
      const node = (sim as any).nodes.find((n: ArchitectureNode) => n.id === svcId)!;
      const { capacity } = (sim as any).computeNodeCapacity(node, 1, false);
      const baseLatency = type === 'elb' ? 12 : node.config.latency || 100;
      sim.stop();
      return { capacity, baseLatency };
    }

    const last = (s: TickSample[]) => s[s.length - 1];
    const everOffline = (s: TickSample[]) => s.some((t) => t.status === 'offline');
    const maxLatency = (s: TickSample[]) => Math.max(...s.map((t) => t.avgLatency));

    const results: ServiceResult[] = [];
    const types = catalog.services
      .map((s) => s.type)
      .filter((t) => t !== 'client');

    for (const type of types) {
      const def = catalog.getByType(type);
      const spec = bn[type];
      const sat = saturationOf(type);
      const { capacity, baseLatency } = probeCapacity(type);
      const unbounded = capacity >= 1e8;
      const checks: Check[] = [];
      const notes: string[] = [];

      const capacitySource: ServiceResult['capacitySource'] = FORMULA_TYPES.has(type)
        ? 'formula'
        : unbounded
          ? 'unbounded'
          : spec?.capacityRps
            ? 'quota'
            : 'legacy-knob';

      // ── UNDER: ρ = 0.5 (or fixed 1M rps for unbounded services) ───────────
      {
        const rate = unbounded ? 1_000_000 : capacity * 0.5;
        const { sim, svcId } = makeSim(type, rate);
        const s = runTicks(sim, svcId, 25);
        const fin = last(s);
        checks.push({
          name: 'UNDER: healthy at 50% load',
          pass:
            fin.errorRate < 1 &&
            !everOffline(s) &&
            ['normal', 'busy'].includes(fin.status),
          detail: `status=${fin.status} err=${fin.errorRate}% lat=${fin.avgLatency}ms`,
        });
        sim.stop();
      }

      // ── NEAR: ρ = 0.92 ─────────────────────────────────────────────────────
      if (!unbounded) {
        const { sim, svcId } = makeSim(type, capacity * 0.92);
        const s = runTicks(sim, svcId, 25);
        const fin = last(s);
        checks.push({
          name: 'NEAR: stays up at 92% load',
          pass: !everOffline(s) && fin.errorRate <= 5,
          detail: `status=${fin.status} err=${fin.errorRate}%`,
        });
        if (sat === 'degrade') {
          checks.push({
            name: 'NEAR: queueing latency visible (hockey-stick)',
            pass: fin.avgLatency >= baseLatency * 1.8,
            detail: `lat=${fin.avgLatency}ms vs base=${baseLatency}ms (expect ≥1.8×)`,
          });
        } else if (sat === 'reject' || sat === 'queue') {
          checks.push({
            name: 'NEAR: latency stays flat below quota',
            pass: fin.avgLatency <= baseLatency * 1.6 + 35,
            detail: `lat=${fin.avgLatency}ms vs base=${baseLatency}ms (managed services do not slow before the quota)`,
          });
        }
        sim.stop();
      }

      // ── OVER + RECOVER ─────────────────────────────────────────────────────
      if (sat === 'none' || unbounded) {
        const { sim, svcId } = makeSim(type, 2_000_000);
        const s = runTicks(sim, svcId, 40);
        const fin = last(s);
        checks.push({
          name: 'OVER: unbounded service never stressed',
          pass: fin.status === 'normal' && fin.errorRate === 0,
          detail: `status=${fin.status} err=${fin.errorRate}% at 2M rps`,
        });
        sim.stop();
        notes.push('Not in the load path (control plane / storage / out-of-band) — correctly excluded from utilization.');
      } else if (sat === 'reject') {
        const over = 1.6;
        const { sim, svcId, clientId } = makeSim(type, capacity * over);
        const s = runTicks(sim, svcId, 40);
        const fin = last(s);
        const expectedErr = (1 - 1 / over) * 100; // 37.5%
        checks.push({
          name: 'OVER: rejects excess immediately (429 semantics)',
          pass: Math.abs(fin.errorRate - expectedErr) <= 10,
          detail: `err=${fin.errorRate}% (expected ≈${expectedErr.toFixed(1)}%)`,
        });
        checks.push({
          name: 'OVER: holds no backlog (fail fast)',
          pass: fin.queueSize === 0,
          detail: `queue=${fin.queueSize}`,
        });
        checks.push({
          name: 'OVER: stays up (throttles, never offline)',
          pass: !everOffline(s),
          detail: `worst status=${s.map((t) => t.status).includes('failing') ? 'failing' : fin.status}`,
        });
        checks.push({
          name: 'OVER: accepted requests stay fast',
          pass: maxLatency(s) <= baseLatency * 2 + 40,
          detail: `maxLat=${maxLatency(s)}ms vs base=${baseLatency}ms`,
        });
        // RECOVER
        const clientNode = (sim as any).nodes.find((n: ArchitectureNode) => n.id === clientId)!;
        clientNode.config.requestRate = capacity * 0.3;
        const r = runTicks(sim, svcId, 25);
        const rfin = last(r);
        checks.push({
          name: 'RECOVER: instant recovery once load drops',
          pass: rfin.errorRate < 1 && ['normal', 'busy'].includes(rfin.status),
          detail: `status=${rfin.status} err=${rfin.errorRate}%`,
        });
        sim.stop();
      } else if (sat === 'queue') {
        const { sim, svcId, clientId } = makeSim(type, capacity * 1.6);
        const s = runTicks(sim, svcId, 40);
        const fin = last(s);
        checks.push({
          name: 'OVER: buffers excess without erroring',
          pass: fin.errorRate < 2 && !everOffline(s),
          detail: `err=${fin.errorRate}% status=${fin.status}`,
        });
        checks.push({
          name: 'OVER: backlog forms and grows',
          pass: fin.queueSize > capacity * 0.5 && fin.queueSize > s[4].queueSize,
          detail: `queue=${Math.round(fin.queueSize)} (capacity=${Math.round(capacity)}/tick)`,
        });
        checks.push({
          name: 'OVER: latency reflects backlog age',
          pass: fin.avgLatency >= baseLatency + 900,
          detail: `lat=${fin.avgLatency}ms vs base=${baseLatency}ms (wait time = backlog age, capped at 60s)`,
        });
        // RECOVER: drain
        const clientNode = (sim as any).nodes.find((n: ArchitectureNode) => n.id === clientId)!;
        clientNode.config.requestRate = capacity * 0.3;
        const r = runTicks(sim, svcId, 30);
        const rfin = last(r);
        checks.push({
          name: 'RECOVER: backlog drains once load drops',
          pass: rfin.queueSize < fin.queueSize && rfin.errorRate < 1,
          detail: `queue ${Math.round(fin.queueSize)} → ${Math.round(rfin.queueSize)}`,
        });
        sim.stop();
      } else {
        // degrade
        const { sim, svcId, clientId } = makeSim(type, capacity * 2);
        const s = runTicks(sim, svcId, 40);
        const fin = last(s);
        const canGoOffline = spec?.failureMode === 'offline';
        if (canGoOffline) {
          checks.push({
            name: 'OVER: sustained overload collapses the node offline',
            pass: everOffline(s),
            detail: `offline at tick ${s.findIndex((t) => t.status === 'offline') + 1 || '—'} (sustain threshold ~6 ticks past ratio ${spec?.offlineAtRatio ?? 1.5})`,
          });
        } else {
          checks.push({
            name: 'OVER: degrades hard but stays up (burst-credit throttle)',
            pass: !everOffline(s),
            detail: `status=${fin.status}`,
          });
        }
        checks.push({
          name: 'OVER: latency escalates before collapse',
          pass: maxLatency(s) >= baseLatency * 3,
          detail: `maxLat=${Math.round(maxLatency(s))}ms vs base=${baseLatency}ms`,
        });
        // RECOVER (informational: engine models no auto-recovery for collapsed nodes)
        const clientNode = (sim as any).nodes.find((n: ArchitectureNode) => n.id === clientId)!;
        clientNode.config.requestRate = capacity * 0.3;
        const r = runTicks(sim, svcId, 25);
        const rfin = last(r);
        if (canGoOffline) {
          checks.push({
            name: 'RECOVER: restarts after sustained relief (scale-out / load drop)',
            pass: ['normal', 'busy'].includes(rfin.status),
            detail: `status=${rfin.status} after 25 ticks at ρ=0.3 (recovery needs ~10 relieved ticks)`,
          });
        } else {
          checks.push({
            name: 'RECOVER: recovers once load drops',
            pass: ['normal', 'busy'].includes(rfin.status),
            detail: `status=${rfin.status}`,
          });
        }
        sim.stop();
      }

      const scored = checks.filter((c) => !c.informational);
      const score = scored.length
        ? Math.round((scored.filter((c) => c.pass).length / scored.length) * 100)
        : 100;

      results.push({
        type,
        name: def.name,
        category: def.category,
        kind: spec?.kind ?? 'untagged',
        failureMode: spec?.failureMode ?? 'untagged',
        saturation: sat,
        capacitySource,
        capacity: Math.round(capacity * 100) / 100,
        baseLatencyMs: baseLatency,
        checks,
        score,
        notes,
      });
    }

    const scoredServices = results.filter((r) => r.checks.some((c) => !c.informational));
    const overall =
      Math.round(
        (scoredServices.reduce((sum, r) => sum + r.score, 0) / scoredServices.length) * 10,
      ) / 10;
    const output = {
      generatedAt: new Date().toISOString(),
      tickMs: 180,
      scenarioDefinition: {
        UNDER: 'ρ=0.5 · 25 ticks',
        NEAR: 'ρ=0.92 · 25 ticks',
        OVER: 'ρ=1.6 (reject/queue) or ρ=2.0 (degrade) · 40 ticks',
        RECOVER: 'ρ=0.3 after overload · 25–30 ticks',
      },
      overallScore: overall,
      serviceCount: results.length,
      perfectServices: results.filter((r) => r.score === 100).length,
      results,
    };
    writeFileSync(resolve(OUT!), JSON.stringify(output, null, 2));
    // eslint-disable-next-line no-console
    console.log(
      `[sim-benchmark] ${results.length} services · overall ${overall}% · ` +
        `${output.perfectServices} at 100% → ${OUT}`,
    );
    for (const r of results.filter((x) => x.score < 100)) {
      // eslint-disable-next-line no-console
      console.log(
        `  ✗ ${r.type} (${r.score}%): ` +
          r.checks.filter((c) => !c.pass).map((c) => `${c.name} [${c.detail}]`).join(' | '),
      );
    }
  });
});
