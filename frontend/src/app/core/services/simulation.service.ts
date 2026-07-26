import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import {
  ArchitectureConnection,
  ArchitectureNode,
  DataPacket,
  HealthStatus,
  SimulationMode,
} from '../models/architecture.model';
import { ArchitectureFactoryService } from './architecture-factory.service';
import bottleneckData from '../data/service-bottleneck.json';

interface BottleneckSpec {
  kind: string;
  failureMode: 'throttle' | 'offline' | 'none';
  offlineAtRatio?: number;
  capacityRps?: number;
  saturation?: 'reject' | 'queue' | 'degrade';
}

export interface SimulationSnapshot {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  packets: DataPacket[];
  tick: number;
  mode: SimulationMode;
  totals: {
    processed: number;
    dropped: number;
    avgLatency: number;
  };
}

@Injectable({ providedIn: 'root' })
export class SimulationService {
  constructor(private readonly factory: ArchitectureFactoryService) {}

  readonly snapshot$ = new BehaviorSubject<SimulationSnapshot>({
    nodes: [],
    connections: [],
    packets: [],
    tick: 0,
    mode: 'idle',
    totals: { processed: 0, dropped: 0, avgLatency: 0 },
  });

  private loop?: Subscription;
  private nodes: ArchitectureNode[] = [];
  private connections: ArchitectureConnection[] = [];
  private packets: DataPacket[] = [];
  public tick = 0;
  private runStats = new Map<
    string,
    {
      throughput: number;
      latency: number;
      cpu: number;
      memory: number;
      received: number;
      count: number;
    }
  >();

  private static readonly bottleneckByType = bottleneckData as unknown as Record<
    string,
    BottleneckSpec
  >;
  private overloadStreak = new Map<string, number>();
  private overloadLatency = new Map<string, number>();
  private warmPool = new Map<string, number>();
  private lambdaColdStart = new Map<string, number>();
  private static readonly OFFLINE_SUSTAIN_TICKS = 6;
  private static readonly RECOVERY_TICKS = 10;
  private static readonly RECOVERY_HEADROOM = 0.9;
  private recoveryStreak = new Map<string, number>();
  private static readonly CONC_PER_VCPU = 10;
  private static readonly CACHE_OPS_PER_NODE = 40000;
  private static readonly SEARCH_CONC_PER_NODE = 6;
  private static readonly DB_PARALLEL_QUERIES = 64;
  private static readonly OVERLOAD_LATENCY_GROWTH = 12;
  private static readonly OVERLOAD_LATENCY_ACCEL = 1.12;
  private static readonly OVERLOAD_LATENCY_DECAY = 0.6;
  private static readonly DEFAULT_TIMEOUT_MS = 60000;
  private static readonly MAX_QUEUE_TICKS = 8;
  private static readonly QUEUE_BUFFER_TICKS = 60;
  private static readonly VCPU_BY_SIZE: Record<string, number> = {
    nano: 2,
    micro: 2,
    small: 2,
    medium: 2,
    large: 2,
    xlarge: 4,
    '2xlarge': 8,
    '4xlarge': 16,
  };
  private static readonly REDSHIFT_SLOTS_PER_NODE = 15;
  private timeoutStreak = new Map<string, number>();
  private lastCapacity = new Map<string, number>();
  private downstreamWait = new Map<string, number>();
  private depOfflineShare = new Map<string, number>();
  private static readonly ASYNC_TARGET_TYPES = new Set<string>([
    'cloudWatch',
    'xray',
    'cloudTrail',
    'backup',
    'sns',
    'eventBridge',
  ]);

  private static isAsyncTarget(type: string): boolean {
    if (SimulationService.ASYNC_TARGET_TYPES.has(type)) return true;
    const spec = SimulationService.bottleneckByType[type];
    if (!spec) return false;
    return SimulationService.saturationOf(spec) === 'queue' || spec.kind === 'control-plane';
  }

  private static inheritsBackpressure(node: ArchitectureNode): boolean {
    if (node.type === 'client') return false;
    const spec = SimulationService.bottleneckByType[node.type];
    if (!spec) return true;
    if (spec.failureMode === 'none' || spec.kind === 'control-plane') return false;
    return SimulationService.saturationOf(spec) !== 'queue';
  }

  private static readonly FORK_JOIN_SOURCES = new Set<string>(['stepFunctions']);

  private static harmonic(k: number): number {
    let h = 0;
    for (let i = 1; i <= k; i++) h += 1 / i;
    return h;
  }

  private computeBackpressure(outgoingByNode: Map<string, ArchitectureConnection[]>): void {
    this.downstreamWait.clear();
    this.depOfflineShare.clear();
    const nodeById = new Map(this.nodes.map((n) => [n.id, n] as const));
    for (const node of this.nodes) {
      if (!SimulationService.inheritsBackpressure(node)) continue;
      let offlineShare = 0;
      let weightedWait = 0;
      let shareTotal = 0;
      let maxWait = 0;
      let branches = 0;
      for (const conn of outgoingByNode.get(node.id) ?? []) {
        const target = nodeById.get(conn.targetNodeId);
        if (!target || target.id === node.id) continue;
        if (SimulationService.isAsyncTarget(target.type)) continue;
        const share = Math.max(0, (conn.trafficWeight ?? 100) / 100);
        if (target.status === 'offline') {
          offlineShare += share;
          continue;
        }
        const branchWait = Math.min(
          target.metrics.avgLatency,
          SimulationService.DEFAULT_TIMEOUT_MS,
        );
        weightedWait += branchWait * share;
        shareTotal += share;
        maxWait = Math.max(maxWait, branchWait);
        branches += 1;
      }

      let wait: number;
      if (SimulationService.FORK_JOIN_SOURCES.has(node.type) && branches > 0) {
        const meanBranch = weightedWait / shareTotal;
        wait = Math.max(maxWait, meanBranch * SimulationService.harmonic(branches));
      } else {
        wait = shareTotal > 0 ? weightedWait / shareTotal : 0;
      }

      if (wait > 0) this.downstreamWait.set(node.id, Math.round(wait * 100) / 100);
      if (offlineShare > 0) this.depOfflineShare.set(node.id, Math.min(1, offlineShare));
    }
  }

  private effectiveLatencyMs(node: ArchitectureNode, fallback: number): number {
    const own = (node.config.latency || fallback) * this.memorySpeedFactor(node);
    return own + (this.downstreamWait.get(node.id) ?? 0);
  }

  private static readonly LAMBDA_VCPU_FULL_MB = 1769; // AWS: one full vCPU at 1,769 MB
  private static readonly LAMBDA_REF_MEMORY_MB = 512; // app default; anchor for configured time
  private static readonly BASE_COLD_START_MS = 200;

  previewLatencyMs(node: ArchitectureNode): number {
    const base = Number(node.config.latency) || 0;
    return Math.round(base * this.memorySpeedFactor(node) * 100) / 100;
  }

  private memorySpeedFactor(node: ArchitectureNode): number {
    if (node.type !== 'lambda') return 1;
    const full = SimulationService.LAMBDA_VCPU_FULL_MB;
    const mem = Number(node.config['memoryMB']) || SimulationService.LAMBDA_REF_MEMORY_MB;
    const vcpu = Math.min(mem, full) / full;
    const vcpuRef = Math.min(SimulationService.LAMBDA_REF_MEMORY_MB, full) / full;
    return vcpuRef / vcpu;
  }

  private coldStartMs(node: ArchitectureNode): number {
    return SimulationService.BASE_COLD_START_MS * this.memorySpeedFactor(node);
  }

  private static vcpuOf(sizeOrType: unknown, fallback = 2): number {
    if (typeof sizeOrType !== 'string' || !sizeOrType) return fallback;
    const size = sizeOrType.includes('.') ? sizeOrType.split('.').pop()! : sizeOrType;
    return SimulationService.VCPU_BY_SIZE[size] ?? fallback;
  }

  private static saturationOf(spec: BottleneckSpec | undefined): 'reject' | 'queue' | 'degrade' {
    if (!spec) return 'degrade';
    if (spec.saturation) return spec.saturation;
    return spec.failureMode === 'offline' ? 'degrade' : 'reject';
  }

  private static readonly FORMULA_TYPES = new Set<string>([
    'lambda',
    'appRunner',
    'rds',
    'ecs',
    'elastiCache',
    'openSearch',
    'kinesis',
    'ec2',
    'elasticBeanstalk',
    'autoScalingGroup',
    'eks',
    'emr',
    'sageMaker',
    'redshift',
    'aurora',
    'documentDb',
    'neptune',
  ]);

  private static readonly SIM_KEYS_GLOBAL = new Set<string>([
    'latency',
    'timeoutMs',
    'cpu',
    'memory',
  ]);

  private static readonly SIM_KEYS_BY_TYPE: Record<string, readonly string[]> = {
    client: [
      'requestRate',
      'packageSize',
      'variableTraffic',
      'variableMinRps',
      'variableMaxRps',
      'syncRpsToServices',
    ],
    cloudfront: ['cacheHitRate'],
    elastiCache: ['cacheHitRate', 'count'],
    apiGateway: ['cacheGB', 'type'],
    elb: ['routingAlgorithm', 'lbType'],
    sqs: ['batchSize', 'type'],
    cloudWatch: ['batchSize'],
    lambda: ['concurrency', 'memoryMB', 'provConcurrency'],
    dynamoDb: ['capacityMode', 'rcu', 'wcu', 'itemSizeKB'],
    kinesis: ['shards'],
    appRunner: ['instances', 'concurrencyPerInstance'],
    rds: ['readReplicas', 'maxConnections'],
    ecs: ['tasks', 'vCPU'],
    openSearch: ['nodes'],
    ec2: ['count', 'instanceSize'],
    elasticBeanstalk: ['count', 'instanceSize'],
    autoScalingGroup: ['count', 'instanceSize', 'maxSize'],
    eks: ['nodeCount', 'nodeInstanceType'],
    emr: ['nodes', 'instance'],
    sageMaker: ['count', 'instance'],
    redshift: ['nodes'],
    aurora: ['count', 'maxConnections'],
    documentDb: ['instanceCount', 'maxConnections'],
    neptune: ['instanceCount', 'maxConnections'],
  };

  isSimulationParam(node: ArchitectureNode, key: string): boolean {
    if (SimulationService.SIM_KEYS_BY_TYPE[node.type]?.includes(key)) return true;
    const spec = SimulationService.bottleneckByType[node.type];
    if (key === 'failureThreshold' || key === 'retryPolicy') {
      return SimulationService.saturationOf(spec) === 'degrade';
    }
    if (key === 'replication') {
      return !SimulationService.FORMULA_TYPES.has(node.type);
    }
    return SimulationService.SIM_KEYS_GLOBAL.has(key);
  }

  capacityInfo(node: ArchitectureNode): {
    capacity: number;
    source: 'formula' | 'quota' | 'unbounded' | 'knob';
    sourceLabel: string;
    saturation: 'reject' | 'queue' | 'degrade' | 'none';
    saturationHint: string;
  } {
    const spec = SimulationService.bottleneckByType[node.type];
    const { capacity } = this.computeNodeCapacity(
      node,
      Number(node.config.requestRate) || 100,
      false,
    );
    const usesFormula =
      SimulationService.FORMULA_TYPES.has(node.type) ||
      (node.type === 'dynamoDb' && node.config['capacityMode'] === 'provisioned') ||
      (node.type === 'sqs' && node.config['type'] === 'fifo');
    const saturation = SimulationService.saturationOf(spec);
    const saturationHint =
      spec?.failureMode === 'none'
        ? 'Never a load bottleneck.'
        : saturation === 'reject'
          ? 'Past capacity: excess requests are rejected instantly (429 throttling), no queue, instant recovery when load drops.'
          : saturation === 'queue'
            ? 'Past capacity: excess work queues up; the backlog (and its age) grows until consumers catch up.'
            : 'Past capacity: latency climbs, requests time out, and sustained overload takes this service OFFLINE.';
    if (spec && spec.failureMode === 'none') {
      return {
        capacity,
        source: 'unbounded',
        sourceLabel: 'not load-bound (control plane / storage / out-of-band)',
        saturation: 'none',
        saturationHint,
      };
    }
    if (usesFormula) {
      return {
        capacity,
        source: 'formula',
        sourceLabel: 'derived from sizing parameters',
        saturation,
        saturationHint,
      };
    }
    if (spec?.capacityRps) {
      return {
        capacity,
        source: 'quota',
        sourceLabel: 'AWS default service quota',
        saturation,
        saturationHint,
      };
    }
    return {
      capacity,
      source: 'knob',
      sourceLabel: 'capacity setting',
      saturation,
      saturationHint,
    };
  }

  private static readonly AUTOSIZE_TARGET_UTILIZATION = 0.65;

  estimateDemand(
    nodes: ArchitectureNode[],
    connections: ArchitectureConnection[],
  ): Map<string, number> {
    const demand = new Map<string, number>();
    const nodeById = new Map(nodes.map((n) => [n.id, n] as const));
    const outgoing = new Map<string, ArchitectureConnection[]>();
    const indegree = new Map<string, number>(nodes.map((n) => [n.id, 0] as const));
    for (const c of connections) {
      if (c.sourceNodeId === c.targetNodeId) continue;
      if (!nodeById.has(c.sourceNodeId) || !nodeById.has(c.targetNodeId)) continue;
      (outgoing.get(c.sourceNodeId) ?? outgoing.set(c.sourceNodeId, []).get(c.sourceNodeId)!).push(
        c,
      );
      indegree.set(c.targetNodeId, (indegree.get(c.targetNodeId) ?? 0) + 1);
    }
    const queue = nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id);
    const visited = new Set<string>();
    const order: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      order.push(id);
      for (const c of outgoing.get(id) ?? []) {
        const left = (indegree.get(c.targetNodeId) ?? 0) - 1;
        indegree.set(c.targetNodeId, left);
        if (left === 0 && !visited.has(c.targetNodeId)) queue.push(c.targetNodeId);
      }
    }
    for (const n of nodes) if (!visited.has(n.id)) order.push(n.id);

    for (const id of order) {
      const node = nodeById.get(id)!;
      const inbound =
        node.type === 'client' ? Number(node.config.requestRate) || 100 : (demand.get(id) ?? 0);
      demand.set(id, inbound);
      const hitRate = ['elastiCache', 'cloudfront'].includes(node.type)
        ? node.config.cacheHitRate || 0
        : node.type === 'apiGateway' && node.config['cacheGB'] && node.config['cacheGB'] !== '0'
          ? node.config.cacheHitRate || 0
          : 0;
      const outboundBase = inbound * (1 - hitRate / 100);
      for (const c of outgoing.get(id) ?? []) {
        const weight = (c.trafficWeight ?? 100) / 100;
        const load = outboundBase * weight * (c.type === 'cdn' ? 0.72 : 1);
        demand.set(c.targetNodeId, (demand.get(c.targetNodeId) ?? 0) + load);
      }
    }
    return demand;
  }

  autoSizeForDemand(node: ArchitectureNode, demandRps: number): Record<string, unknown> | null {
    const required = Math.max(1, demandRps) / SimulationService.AUTOSIZE_TARGET_UTILIZATION;
    const perVcpu = SimulationService.CONC_PER_VCPU;
    const durSec = (fallback: number) =>
      Math.max(0.001, (Number(node.config.latency) || fallback) / 1000);
    const count = (n: number, max = 10000) => Math.min(max, Math.max(1, Math.ceil(n)));

    switch (node.type) {
      case 'ecs': {
        const vcpu = Number(node.config['vCPU']) || 0.5;
        return { tasks: count((required * durSec(30)) / (vcpu * perVcpu), 1000) };
      }
      case 'ec2':
      case 'elasticBeanstalk': {
        const vcpu = SimulationService.vcpuOf(node.config['instanceSize']);
        return { count: count((required * durSec(20)) / (vcpu * perVcpu), 100) };
      }
      case 'autoScalingGroup': {
        const vcpu = SimulationService.vcpuOf(node.config['instanceSize']);
        const needed = count((required * durSec(20)) / (vcpu * perVcpu), 100);
        return { count: needed, maxSize: Math.max(Number(node.config['maxSize']) || 0, needed) };
      }
      case 'eks': {
        const vcpu = SimulationService.vcpuOf(node.config['nodeInstanceType']);
        return { nodeCount: count((required * durSec(30)) / (vcpu * perVcpu), 100) };
      }
      case 'emr': {
        const vcpu = SimulationService.vcpuOf(node.config['instance'], 4);
        return { nodes: count((required * durSec(40)) / (vcpu * perVcpu), 100) };
      }
      case 'sageMaker': {
        const vcpu = SimulationService.vcpuOf(node.config['instance'], 2);
        return { count: count((required * durSec(200)) / (vcpu * perVcpu), 100) };
      }
      case 'redshift':
        return {
          nodes: count((required * durSec(2000)) / SimulationService.REDSHIFT_SLOTS_PER_NODE, 100),
        };
      case 'openSearch':
        return {
          nodes: count((required * durSec(50)) / SimulationService.SEARCH_CONC_PER_NODE, 100),
        };
      case 'elastiCache':
        return { count: count(required / SimulationService.CACHE_OPS_PER_NODE, 100) };
      case 'lambda':
        return { concurrency: count(required * durSec(200), 20000) };
      case 'appRunner': {
        const conc = Number(node.config['concurrencyPerInstance']) || 100;
        return { instances: count((required * durSec(30)) / conc, 100) };
      }
      case 'rds': {
        const parallel = required * durSec(10);
        const boost = parallel / SimulationService.DB_PARALLEL_QUERIES;
        return {
          readReplicas: Math.min(15, Math.max(0, Math.ceil((boost - 1) / 0.9))),
          maxConnections: Math.max(
            Number(node.config['maxConnections']) || 0,
            count(parallel, 20000),
          ),
        };
      }
      case 'aurora':
      case 'documentDb':
      case 'neptune': {
        const parallel = required * durSec(10);
        const instances = count(
          1 + (parallel / SimulationService.DB_PARALLEL_QUERIES - 1) / 0.9,
          16,
        );
        const key = node.type === 'aurora' ? 'count' : 'instanceCount';
        return {
          [key]: instances,
          maxConnections: Math.max(
            Number(node.config['maxConnections']) || 0,
            count(parallel, 20000),
          ),
        };
      }
      case 'kinesis':
        return { shards: count(required / this.kinesisPerShardRps(), 500) };
      case 'dynamoDb': {
        if (node.config['capacityMode'] !== 'provisioned') return null;
        const itemKB = Math.max(1, Number(node.config['itemSizeKB']) || 1);
        return {
          rcu: count((required / 2) * Math.ceil(itemKB / 4), 40000),
          wcu: count((required / 2) * Math.ceil(itemKB), 40000),
        };
      }
      case 'sqs':
        return node.config['type'] === 'fifo' && required > 300
          ? { batchSize: Math.max(Number(node.config.batchSize) || 1, 10) }
          : null;
      default:
        return null;
    }
  }

  start(nodes: ArchitectureNode[], connections: ArchitectureConnection[]): void {
    this.nodes = nodes.map((node) => ({
      ...node,
      metrics: this.factory.emptyMetrics(),
      status: 'normal' as HealthStatus,
    }));
    this.connections = connections.map((connection) => ({
      ...connection,
      traffic: { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 },
    }));
    this.packets = [];
    this.tick = 0;
    this.runStats.clear();
    this.overloadStreak.clear();
    this.overloadLatency.clear();
    this.timeoutStreak.clear();
    this.warmPool.clear();
    this.lambdaColdStart.clear();
    this.lastCapacity.clear();
    this.downstreamWait.clear();
    this.depOfflineShare.clear();
    this.recoveryStreak.clear();
    for (const n of this.nodes) {
      if (n.type === 'client' && n.config['variableTraffic']) {
        n.config['_varSum'] = 0;
        n.config['_varCount'] = 0;
      }
    }
    this.loop?.unsubscribe();
    this.loop = interval(180).subscribe(() => this.step('running'));
    this.emit('running');
  }

  pause(): void {
    this.loop?.unsubscribe();
    this.loop = undefined;
    this.writeVariableTrafficMean();
    this.emit('paused');
  }

  resume(): void {
    if (!this.loop) {
      this.loop = interval(180).subscribe(() => this.step('running'));
    }
    this.emit('running');
  }

  updateNodes(nodes: ArchitectureNode[], connections?: ArchitectureConnection[]): void {
    this.nodes = nodes.map((newNode) => {
      const existing = this.nodes.find((n) => n.id === newNode.id);
      return {
        ...newNode,
        metrics: existing ? existing.metrics : newNode.metrics,
        status: existing ? existing.status : newNode.status,
      };
    });
    if (connections) {
      this.connections = connections.map((newConn) => {
        const existing = this.connections.find((c) => c.id === newConn.id);
        return {
          ...newConn,
          traffic: existing
            ? existing.traffic
            : { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 },
        };
      });
    }
    if (!this.loop) {
      this.emit(this.snapshot$.value.mode);
    }
  }

  switchTab(
    nodes: ArchitectureNode[],
    connections: ArchitectureConnection[],
    packets: DataPacket[],
    tick: number,
    mode: SimulationMode,
  ): void {
    this.loop?.unsubscribe();
    this.loop = undefined;
    this.nodes = nodes;
    this.connections = connections;
    this.packets = packets;
    this.tick = tick;

    if (mode === 'running') {
      this.loop = interval(180).subscribe(() => this.step('running'));
    }

    this.emit(mode);
  }

  stop(): void {
    this.loop?.unsubscribe();
    this.loop = undefined;
    this.writeVariableTrafficMean();
    this.packets = [];
    this.tick = 0;
    this.overloadStreak.clear();
    this.overloadLatency.clear();
    this.timeoutStreak.clear();
    this.warmPool.clear();
    this.lambdaColdStart.clear();
    this.lastCapacity.clear();
    this.downstreamWait.clear();
    this.depOfflineShare.clear();
    this.recoveryStreak.clear();
    const round2 = (n: number) => Math.round(n * 100) / 100;
    for (const n of this.nodes) {
      const stats = this.runStats.get(n.id);
      if (stats && stats.count > 0) {
        n.metrics = {
          ...n.metrics,
          throughput: round2(stats.throughput / stats.count),
          avgLatency: round2(stats.latency / stats.count),
          cpuPressure: round2(stats.cpu / stats.count),
          memoryPressure: round2(stats.memory / stats.count),
          received: round2(stats.received / stats.count),
        };
      }
    }
    for (const c of this.connections) {
      c.traffic = {
        requestsPerSecond: 0,
        latency: 0,
        errorRate: 0,
        intensity: 0,
      };
    }
    this.emit('idle');
  }

  private writeVariableTrafficMean(): void {
    for (const node of this.nodes) {
      if (node.type !== 'client') continue;
      if (!node.config['variableTraffic']) continue;
      const sum = Number(node.config['_varSum']) || 0;
      const count = Number(node.config['_varCount']) || 0;
      if (count === 0) continue;
      const mean = Math.round((sum / count) * 100) / 100;
      node.config.requestRate = mean;
      if (node.config['syncRpsToServices']) {
        const downstream = this.collectDownstream(node.id);
        for (const target of this.nodes) {
          if (downstream.has(target.id)) {
            const factor = Number(target.config['_dynFactor']) || 1;
            target.config.throughput = Math.round(mean * factor * 100) / 100;
          }
        }
      }
    }
  }

  private propagationOrder(
    outgoingByNode: Map<string, ArchitectureConnection[]>,
  ): ArchitectureNode[] {
    const nodeById = new Map(this.nodes.map((n) => [n.id, n] as const));
    const indegree = new Map<string, number>(this.nodes.map((n) => [n.id, 0] as const));
    for (const conn of this.connections) {
      if (conn.sourceNodeId === conn.targetNodeId) continue;
      if (!nodeById.has(conn.sourceNodeId) || !nodeById.has(conn.targetNodeId)) continue;
      indegree.set(conn.targetNodeId, (indegree.get(conn.targetNodeId) ?? 0) + 1);
    }

    const queue = this.nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id);
    const ordered: ArchitectureNode[] = [];
    const visited = new Set<string>();
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      ordered.push(nodeById.get(id)!);
      for (const conn of outgoingByNode.get(id) ?? []) {
        if (conn.targetNodeId === id || !nodeById.has(conn.targetNodeId)) continue;
        const left = (indegree.get(conn.targetNodeId) ?? 0) - 1;
        indegree.set(conn.targetNodeId, left);
        if (left === 0 && !visited.has(conn.targetNodeId)) queue.push(conn.targetNodeId);
      }
    }
    for (const n of this.nodes) if (!visited.has(n.id)) ordered.push(n);
    return ordered;
  }

  private kinesisPerShardRps(): number {
    const clientNode = this.nodes.find((n) => n.type === 'client');
    if (!clientNode) return 1000;
    const recordKB = Math.max(1, Number(clientNode.config['packageSize']) || 50);
    return Math.min(1000, 1024 / recordKB);
  }

  private computeNodeCapacity(
    node: ArchitectureNode,
    baseRate: number,
    isOffline: boolean,
  ): { capacity: number; lbBaseLatency: number } {
    const isApiGatewayCache =
      node.type === 'apiGateway' &&
      node.config['type'] === 'rest' &&
      node.config['cacheGB'] &&
      node.config['cacheGB'] !== '0';
    if (isApiGatewayCache) {
      const cacheGB = parseFloat(node.config['cacheGB']) || 0;
      const clientNode = this.nodes.find((n) => n.type === 'client');
      const packageSize = clientNode ? clientNode.config['packageSize'] || 50 : 50;
      const workingSetGB = Math.max(0.1, baseRate * packageSize * 0.0002);
      const ratio = cacheGB / workingSetGB;
      node.config.cacheHitRate = Math.min(95, Math.round(95 * (1 - Math.exp(-ratio))));
    } else if (node.type === 'apiGateway') {
      node.config.cacheHitRate = 0;
    }

    const replication = node.config.replication || 1;
    const cacheHitRate = node.config.cacheHitRate || 0;
    const scaleBonus = replication > 1 ? 1 + (replication - 1) * 0.55 : 1;
    const cacheBonus = ['cloudfront', 'elastiCache', 'apiGateway'].includes(node.type)
      ? 1 + cacheHitRate / 150
      : 1;
    const routingBonus =
      node.type === 'elb'
        ? ({
            'round-robin': 1,
            'least-connection': 1.12,
            'consistent-hash': 1.06,
          }[node.config.routingAlgorithm || 'round-robin'] ?? 1)
        : 1;
    const batchBonus = ['sqs', 'cloudWatch'].includes(node.type)
      ? 1 + Math.min(node.config.batchSize || 1, 100) / 220
      : 1;

    let lbCapacityMult = 1.0;
    let lbBaseLatency = 12;
    if (node.type === 'elb') {
      const lbType = node.config['lbType'] || 'alb';
      if (lbType === 'nlb') {
        lbCapacityMult = 5.0;
        lbBaseLatency = 2;
      } else if (lbType === 'clb') {
        lbCapacityMult = 0.6;
        lbBaseLatency = 20;
      } else if (lbType === 'gwlb') {
        lbCapacityMult = 2.0;
        lbBaseLatency = 15;
      } else {
        lbCapacityMult = 1.0;
        lbBaseLatency = 12;
      }
    }

    const spec = SimulationService.bottleneckByType[node.type];
    const clientPeak =
      node.type === 'client' && node.config['variableTraffic']
        ? Number(node.config['variableMaxRps']) || node.config.requestRate || 1000
        : node.config.requestRate || 1000;
    const refThroughput = Number(node.config['_designThroughput']) || node.config.throughput || 100;
    let baseCapacity: number;
    if (node.type === 'client') {
      baseCapacity = clientPeak;
    } else if (spec && spec.failureMode === 'none') {
      baseCapacity = 1e9;
    } else if (spec?.capacityRps) {
      baseCapacity = spec.capacityRps * scaleBonus * cacheBonus * routingBonus * batchBonus;
    } else {
      baseCapacity = refThroughput * scaleBonus * cacheBonus * routingBonus * batchBonus;
    }

    if (node.type === 'lambda') {
      const concurrencyLimit = node.config.concurrency || 100;
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 200) / 1000);
      baseCapacity = concurrencyLimit / durationSec;
    }

    if (node.type === 'dynamoDb' && node.config['capacityMode'] === 'provisioned') {
      const itemKB = Math.max(1, Number(node.config['itemSizeKB']) || 1);
      const maxReads = (Number(node.config['rcu']) || 100) / Math.ceil(itemKB / 4);
      const maxWrites = (Number(node.config['wcu']) || 100) / Math.ceil(itemKB);
      baseCapacity = maxReads + maxWrites;
    }
    if (node.type === 'kinesis') {
      baseCapacity = (Number(node.config['shards']) || 2) * this.kinesisPerShardRps();
    }
    if (node.type === 'sqs' && node.config['type'] === 'fifo') {
      baseCapacity = (node.config.batchSize || 10) > 1 ? 3000 : 300;
    }
    if (node.type === 'appRunner') {
      const instances = Number(node.config['instances']) || 2;
      const conc = Number(node.config['concurrencyPerInstance']) || 100;
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 30) / 1000);
      baseCapacity = (instances * conc) / durationSec;
    }
    if (['ec2', 'elasticBeanstalk', 'autoScalingGroup'].includes(node.type)) {
      const instances = Number(node.config['count']) || Number(node.config.replication) || 2;
      const maxSize =
        node.type === 'autoScalingGroup' ? Number(node.config['maxSize']) || instances : instances;
      const vcpu = SimulationService.vcpuOf(node.config['instanceSize']);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 20) / 1000);
      baseCapacity =
        (Math.min(instances, maxSize) * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
    }
    if (node.type === 'eks') {
      const nodeCount = Number(node.config['nodeCount']) || 3;
      const vcpu = SimulationService.vcpuOf(node.config['nodeInstanceType']);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 30) / 1000);
      baseCapacity = (nodeCount * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
    }
    if (node.type === 'emr') {
      const nodes = Number(node.config['nodes']) || 3;
      const vcpu = SimulationService.vcpuOf(node.config['instance'], 4);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 40) / 1000);
      baseCapacity = (nodes * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
    }
    if (node.type === 'sageMaker') {
      const instances = Number(node.config['count']) || 1;
      const vcpu = SimulationService.vcpuOf(node.config['instance'], 2);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 200) / 1000);
      baseCapacity = (instances * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
    }
    if (node.type === 'redshift') {
      const nodes = Number(node.config['nodes']) || 2;
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 2000) / 1000);
      baseCapacity = (nodes * SimulationService.REDSHIFT_SLOTS_PER_NODE) / durationSec;
    }
    if (['aurora', 'documentDb', 'neptune'].includes(node.type)) {
      const instances = Number(node.config['instanceCount']) || Number(node.config['count']) || 2;
      const replicaBoost = 1 + Math.max(0, instances - 1) * 0.9;
      const maxConn = Number(node.config['maxConnections']) || 2000;
      const parallel = Math.min(maxConn, SimulationService.DB_PARALLEL_QUERIES * replicaBoost);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 10) / 1000);
      baseCapacity = parallel / durationSec;
    }
    if (node.type === 'rds') {
      const replicaBoost = 1 + (Number(node.config['readReplicas']) || 0) * 0.9;
      const maxConn = Number(node.config['maxConnections']) || 1000;
      const parallel = Math.min(maxConn, SimulationService.DB_PARALLEL_QUERIES * replicaBoost);
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 10) / 1000);
      baseCapacity = parallel / durationSec;
    }
    if (node.type === 'ecs') {
      const tasks = Number(node.config['tasks']) || 2;
      const vcpu = Number(node.config['vCPU']) || 0.5;
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 30) / 1000);
      baseCapacity = (tasks * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
    }
    if (node.type === 'elastiCache') {
      const cacheNodes = Number(node.config['count']) || 2;
      baseCapacity = cacheNodes * SimulationService.CACHE_OPS_PER_NODE;
    }
    if (node.type === 'openSearch') {
      const dataNodes = Number(node.config['nodes']) || 2;
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 50) / 1000);
      baseCapacity = (dataNodes * SimulationService.SEARCH_CONC_PER_NODE) / durationSec;
    }
    if (node.type === 's3') {
      baseCapacity = Math.max(baseCapacity, 1e9);
    }

    const capacity = isOffline
      ? 0
      : Math.max(1, node.type === 'elb' ? baseCapacity * lbCapacityMult : baseCapacity);
    return { capacity, lbBaseLatency };
  }

  private propagateNodeOutput(
    node: ArchitectureNode,
    processed: number,
    outputs: ArchitectureConnection[],
    incoming: Map<string, number>,
  ): void {
    if (node.status === 'offline' && outputs.length > 0) {
      for (const connection of outputs) {
        connection.traffic = {
          requestsPerSecond: 0,
          latency: 0,
          errorRate: 100,
          intensity: 0,
        };
      }
      const offlineConnIds = new Set(outputs.map((c) => c.id));
      this.packets = this.packets.filter((p) => !offlineConnIds.has(p.connectionId));
    }
    if (outputs.length > 0 && processed > 0 && node.status !== 'offline') {
      let processedForOutput = processed;
      if (
        node.type === 'apiGateway' &&
        node.config['type'] === 'rest' &&
        node.config['cacheGB'] &&
        node.config['cacheGB'] !== '0'
      ) {
        const hitRate = node.config.cacheHitRate || 0;
        processedForOutput = processed * (1 - hitRate / 100);
      } else if (node.type === 'elastiCache' || node.type === 'cloudfront') {
        const hitRate = node.config.cacheHitRate || 0;
        processedForOutput = processed * (1 - hitRate / 100);
      }

      for (const connection of outputs) {
        const target = this.nodes.find((candidate) => candidate.id === connection.targetNodeId);
        if (!target) {
          continue;
        }
        const weight = connection.trafficWeight ?? 100;
        const load =
          Math.round(
            processedForOutput * (weight / 100) * (connection.type === 'cdn' ? 0.72 : 1) * 100,
          ) / 100;
        incoming.set(target.id, (incoming.get(target.id) ?? 0) + load);
        const targetCapacity = this.lastCapacity.get(target.id) ?? target.config.throughput ?? 100;
        connection.traffic = {
          requestsPerSecond: load,
          latency: node.metrics.avgLatency,
          errorRate: node.metrics.errorRate,
          intensity: Math.min(1, load / Math.max(1, targetCapacity)),
        };
        connection.animationOffset =
          (connection.animationOffset + 0.055 + connection.traffic.intensity * 0.08) % 1;
        if (this.tick % 4 === 0 || connection.traffic.intensity > 0.72) {
          const packetId =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `pkt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

          this.packets.push({
            id: packetId,
            connectionId: connection.id,
            progress: 0,
            status: node.status,
          });
        }
      }
    }
  }

  private computeNodeMetrics(
    node: ArchitectureNode,
    baseRate: number,
    isOffline: boolean,
    capacity: number,
    lbBaseLatency: number,
    cacheHitRate: number,
  ): number {
    const spec = SimulationService.bottleneckByType[node.type];
    const saturation = SimulationService.saturationOf(spec);
    const carriedQueue = saturation === 'reject' ? 0 : node.metrics.queueSize;
    const totalDemand = Math.max(0, baseRate + carriedQueue);
    const processed = isOffline ? 0 : Math.min(totalDemand, capacity);
    const queued = isOffline ? carriedQueue : Math.max(0, totalDemand - processed);
    const failureThreshold = node.config.failureThreshold || 100;
    const overloadRatio = isOffline ? 2 : totalDemand / Math.max(1, capacity);
    const rawCacheReduction = ['cloudfront', 'elastiCache', 'apiGateway'].includes(node.type)
      ? cacheHitRate * 0.28
      : 0;
    const timeoutMs = node.config.timeoutMs || 0;
    const latency =
      node.type === 'elb'
        ? lbBaseLatency
        : (node.config.latency || 100) * this.memorySpeedFactor(node);
    const cacheLatencyReduction = Math.min(rawCacheReduction, latency * 0.6);
    const timeoutPressure = timeoutMs > 0 && timeoutMs < latency * 3 ? 6 : 0;

    const retryPolicy = node.config.retryPolicy || 0;
    const cpu = Math.min(node.config.cpu || 10, 90);
    const memory = node.config.memory || 10;

    let memoryPressure: number;
    if (isOffline) {
      memoryPressure = 100;
    } else if (node.type === 'lambda') {
      const durationSec = Math.max(0.001, this.effectiveLatencyMs(node, 200) / 1000);
      const concurrencyLimit = node.config.concurrency || 100;
      const activeConcurrency = processed * durationSec;
      memoryPressure = Math.min(
        100,
        Math.round((activeConcurrency / concurrencyLimit) * 10000) / 100,
      );
      const warmFloor = Number(node.config['provConcurrency']) || 0;
      const currentWarm = Math.max(this.warmPool.get(node.id) ?? warmFloor, warmFloor);
      const newEnvs = Math.max(0, activeConcurrency - currentWarm);
      this.warmPool.set(node.id, Math.max(currentWarm, activeConcurrency));
      const coldFraction = processed > 0 ? Math.min(1, newEnvs / processed) : 0;
      this.lambdaColdStart.set(node.id, coldFraction * this.coldStartMs(node));
    } else {
      memoryPressure = Math.min(
        100,
        Math.round((memory * 0.5 + node.metrics.queueSize * 0.04) * 100) / 100,
      );
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;

    const requestTimeoutMs =
      node.config.timeoutMs && node.config.timeoutMs > 0
        ? node.config.timeoutMs
        : SimulationService.DEFAULT_TIMEOUT_MS;
    const depWait = this.downstreamWait.get(node.id) ?? 0;
    const depOffline = this.depOfflineShare.get(node.id) ?? 0;
    let overloadLatency = this.overloadLatency.get(node.id) ?? 0;
    let timedOut = false;
    let failures = 0;
    let retried = 0;
    let nextQueue = 0;
    let totalDropped = 0;
    let avgLatency = 0;
    let cpuPressure = 0;

    if (isOffline) {
      failures = Math.round(totalDemand);
      nextQueue = queued;
      overloadLatency = 0;
      avgLatency = 0;
      cpuPressure = 100;
    } else if (saturation === 'reject') {
      failures = Math.round(queued * 100) / 100;
      nextQueue = 0;
      overloadLatency = 0;
      avgLatency = Math.max(
        1,
        round2(
          latency -
            cacheLatencyReduction +
            timeoutPressure +
            depWait +
            Math.min(30, overloadRatio * 6),
        ),
      );
      cpuPressure = Math.min(100, round2(cpu * 0.45 + Math.min(overloadRatio, 1) * 40));
    } else if (saturation === 'queue') {
      const queueCap = capacity * SimulationService.QUEUE_BUFFER_TICKS;
      nextQueue = Math.min(queued, queueCap);
      totalDropped = Math.max(0, Math.round((queued - queueCap) * 100) / 100);
      overloadLatency = 0;
      const backlogAgeMs = (nextQueue / Math.max(1, capacity)) * 1000;
      avgLatency = Math.max(1, round2(latency + Math.min(60000, backlogAgeMs)));
      cpuPressure = Math.min(100, round2(cpu * 0.45 + Math.min(overloadRatio, 1) * 40));
    } else {
      failures =
        overloadRatio > Math.max(1, failureThreshold / 100)
          ? Math.round((overloadRatio - 1) * processed * 0.08)
          : 0;
      const dropped = overloadRatio > 1.35 ? Math.round(queued * 0.16) : 0;
      if (overloadRatio > 1) {
        overloadLatency = Math.min(
          requestTimeoutMs,
          (overloadLatency + (overloadRatio - 1) * SimulationService.OVERLOAD_LATENCY_GROWTH) *
            SimulationService.OVERLOAD_LATENCY_ACCEL,
        );
      } else {
        overloadLatency *= SimulationService.OVERLOAD_LATENCY_DECAY;
        if (overloadLatency < 1) overloadLatency = 0;
      }
      timedOut = overloadLatency >= requestTimeoutMs - 1;

      const rawQueue = Math.max(0, queued - dropped + failures * retryPolicy);
      const queueCap = capacity * SimulationService.MAX_QUEUE_TICKS;
      const queueOverflow = Math.max(0, rawQueue - queueCap);
      nextQueue = Math.min(rawQueue, queueCap);
      let timeoutDrops = 0;
      if (timedOut) {
        timeoutDrops = nextQueue;
        nextQueue = 0;
      }
      totalDropped = dropped + queueOverflow + timeoutDrops;
      retried = Math.min(failures * retryPolicy, queued);

      const rho = Math.min(overloadRatio, 1);
      const queueingDelay = latency * ((rho * rho) / (2 * Math.max(0.03, 1 - rho)));
      avgLatency = Math.max(
        1,
        round2(
          latency -
            cacheLatencyReduction +
            timeoutPressure +
            depWait +
            Math.min(500, queued * 0.5) +
            queueingDelay +
            overloadLatency,
        ),
      );
      cpuPressure = Math.min(100, round2(cpu * 0.45 + overloadRatio * 58));
    }
    this.overloadLatency.set(node.id, overloadLatency);

    if (!isOffline && node.type === 'lambda') {
      avgLatency = round2(avgLatency + (this.lambdaColdStart.get(node.id) ?? 0));
    }

    if (!isOffline && depOffline > 0 && processed > 0) {
      failures += Math.round(processed * depOffline * 100) / 100;
    }

    node.metrics = {
      received: round2(totalDemand),
      processed: node.metrics.processed + round2(processed),
      dropped: node.metrics.dropped + totalDropped + failures,
      retried: node.metrics.retried + retried,
      queueSize: round2(nextQueue),
      avgLatency,
      cpuPressure,
      memoryPressure,
      errorRate: isOffline
        ? 100
        : Math.min(100, round2(((failures + totalDropped) / Math.max(1, totalDemand)) * 100)),
      throughput: round2(processed),
    };

    const canTimeoutCollapse = !spec || spec.failureMode === 'offline';
    let timeoutStreak = this.timeoutStreak.get(node.id) ?? 0;
    timeoutStreak = timedOut && canTimeoutCollapse ? timeoutStreak + 1 : 0;
    this.timeoutStreak.set(node.id, timeoutStreak);

    if (node.type === 'client') {
      node.status = 'normal';
    } else if (!isOffline) {
      node.status =
        timeoutStreak >= SimulationService.OFFLINE_SUSTAIN_TICKS
          ? 'offline'
          : this.resolveStatus(node, overloadRatio);
    }

    return processed;
  }

  private step(mode: SimulationMode): void {
    this.tick += 1;
    const incoming = new Map<string, number>();
    const outgoingByNode = new Map<string, ArchitectureConnection[]>();

    for (const connection of this.connections) {
      const list = outgoingByNode.get(connection.sourceNodeId) ?? [];
      list.push(connection);
      outgoingByNode.set(connection.sourceNodeId, list);
    }

    this.computeBackpressure(outgoingByNode);

    if (this.tick % 6 === 0) {
      this.sampleVariableTraffic();
    }

    const orderedNodes = this.propagationOrder(outgoingByNode);
    for (const node of orderedNodes) {
      let isOffline = node.status === 'offline';
      let baseRate =
        node.type === 'client' && !isOffline
          ? node.config.requestRate || 0
          : (incoming.get(node.id) ?? 0);
      if (node.type === 'client' && !isOffline && baseRate === 0) baseRate = 100;

      if (isOffline && node.type !== 'client') {
        const wouldBe = this.computeNodeCapacity(node, baseRate, false).capacity;
        const relieved = baseRate <= wouldBe * SimulationService.RECOVERY_HEADROOM;
        const streak = relieved ? (this.recoveryStreak.get(node.id) ?? 0) + 1 : 0;
        this.recoveryStreak.set(node.id, streak);
        if (streak >= SimulationService.RECOVERY_TICKS) {
          isOffline = false;
          node.status = 'normal';
          node.metrics = { ...this.factory.emptyMetrics() };
          this.recoveryStreak.delete(node.id);
          this.overloadStreak.set(node.id, 0);
          this.timeoutStreak.set(node.id, 0);
          this.overloadLatency.set(node.id, 0);
        }
      } else {
        this.recoveryStreak.delete(node.id);
      }

      const { capacity, lbBaseLatency } = this.computeNodeCapacity(node, baseRate, isOffline);
      this.lastCapacity.set(node.id, capacity);
      const cacheHitRate = node.config.cacheHitRate || 0;

      const processed = this.computeNodeMetrics(
        node,
        baseRate,
        isOffline,
        capacity,
        lbBaseLatency,
        cacheHitRate,
      );

      const outputs = outgoingByNode.get(node.id) ?? [];
      this.propagateNodeOutput(node, processed, outputs, incoming);
    }

    this.cascadeOfflineDownstream();

    for (const node of this.nodes) {
      const stats = this.runStats.get(node.id) ?? {
        throughput: 0,
        latency: 0,
        cpu: 0,
        memory: 0,
        received: 0,
        count: 0,
      };
      stats.throughput += node.metrics.throughput;
      stats.latency += node.metrics.avgLatency;
      stats.cpu += node.metrics.cpuPressure;
      stats.memory += node.metrics.memoryPressure;
      stats.received += node.metrics.received;
      stats.count += 1;
      this.runStats.set(node.id, stats);
    }

    this.packets = this.packets
      .map((packet) => ({ ...packet, progress: packet.progress + 0.075 }))
      .filter((packet) => packet.progress < 1.05)
      .slice(-90);

    this.emit(mode);
  }

  private cascadeOfflineDownstream(): void {
    const offlineSet = new Set(this.nodes.filter((n) => n.status === 'offline').map((n) => n.id));
    if (offlineSet.size === 0) return;

    const reachable = new Set<string>();
    const sources = this.nodes
      .filter((n) => n.type === 'client' && !offlineSet.has(n.id))
      .map((n) => n.id);
    const queue: string[] = [];
    for (const s of sources) {
      reachable.add(s);
      queue.push(s);
    }
    while (queue.length) {
      const id = queue.shift()!;
      for (const c of this.connections) {
        if (c.sourceNodeId !== id) continue;
        const tgt = c.targetNodeId;
        if (offlineSet.has(tgt) || reachable.has(tgt)) continue;
        reachable.add(tgt);
        queue.push(tgt);
      }
    }

    const starved = new Set<string>();
    for (const n of this.nodes) {
      if (offlineSet.has(n.id)) continue;
      if (reachable.has(n.id)) continue;
      starved.add(n.id);
    }
    if (starved.size === 0) {
      for (const c of this.connections) {
        if (offlineSet.has(c.targetNodeId)) {
          c.traffic = {
            requestsPerSecond: 0,
            latency: 0,
            errorRate: 0,
            intensity: 0,
          };
        }
      }
      return;
    }

    const emptyMetrics = this.factory.emptyMetrics();
    for (const node of this.nodes) {
      if (!starved.has(node.id)) continue;
      node.status = 'normal';
      node.metrics = { ...emptyMetrics };
    }
    const blockedConnIds = new Set<string>();
    for (const c of this.connections) {
      const blocked =
        starved.has(c.sourceNodeId) ||
        starved.has(c.targetNodeId) ||
        offlineSet.has(c.targetNodeId);
      if (blocked) {
        c.traffic = {
          requestsPerSecond: 0,
          latency: 0,
          errorRate: 0,
          intensity: 0,
        };
        blockedConnIds.add(c.id);
      }
    }
    if (blockedConnIds.size > 0) {
      this.packets = this.packets.filter((p) => !blockedConnIds.has(p.connectionId));
    }
  }

  private sampleVariableTraffic(): void {
    const downstreamCache = new Map<string, Set<string>>();
    for (const node of this.nodes) {
      if (node.type !== 'client') continue;
      if (!node.config['variableTraffic']) continue;
      const min = Number(node.config['variableMinRps']) || 1;
      const max = Number(node.config['variableMaxRps']) || min;
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      const sampled = Math.round((lo + Math.random() * (hi - lo)) * 100) / 100;
      node.config.requestRate = sampled;
      node.config['_varSum'] = (Number(node.config['_varSum']) || 0) + sampled;
      node.config['_varCount'] = (Number(node.config['_varCount']) || 0) + 1;

      if (node.config['syncRpsToServices']) {
        let downstream = downstreamCache.get(node.id);
        if (!downstream) {
          downstream = this.collectDownstream(node.id);
          downstreamCache.set(node.id, downstream);
        }
        for (const target of this.nodes) {
          if (downstream.has(target.id)) {
            const factor = Number(target.config['_dynFactor']) || 1;
            target.config.throughput = Math.round(sampled * factor * 100) / 100;
          }
        }
      }
    }
  }

  private collectDownstream(sourceId: string): Set<string> {
    const visited = new Set<string>();
    const queue: string[] = [sourceId];
    while (queue.length) {
      const id = queue.shift()!;
      for (const c of this.connections) {
        if (c.sourceNodeId === id && !visited.has(c.targetNodeId)) {
          visited.add(c.targetNodeId);
          queue.push(c.targetNodeId);
        }
      }
    }
    return visited;
  }

  private resolveStatus(node: ArchitectureNode, overloadRatio: number): HealthStatus {
    const base = this.statusFor(node.metrics.cpuPressure, node.metrics.errorRate, overloadRatio);
    const spec = SimulationService.bottleneckByType[node.type];
    if (!spec) {
      return base;
    }

    if (spec.failureMode === 'offline') {
      const ratio = spec.offlineAtRatio ?? 1.5;
      const streak = overloadRatio > ratio ? (this.overloadStreak.get(node.id) ?? 0) + 1 : 0;
      this.overloadStreak.set(node.id, streak);
      if (streak >= SimulationService.OFFLINE_SUSTAIN_TICKS) {
        return 'offline';
      }
      return base === 'offline' ? 'failing' : base;
    }

    if (spec.failureMode === 'none') {
      return base === 'offline' || base === 'failing' ? 'busy' : base;
    }
    return base === 'offline' || base === 'failing' ? 'overloaded' : base;
  }

  private statusFor(cpuPressure: number, errorRate: number, overloadRatio: number): HealthStatus {
    if (errorRate > 30 || cpuPressure > 98) {
      return 'offline';
    }
    if (errorRate > 14 || overloadRatio > 1.4) {
      return 'failing';
    }
    if (overloadRatio > 1.12 || cpuPressure > 84) {
      return 'overloaded';
    }
    if (overloadRatio > 0.78 || cpuPressure > 66) {
      return 'busy';
    }
    return 'normal';
  }

  private emit(mode: SimulationMode): void {
    const processed = this.nodes.reduce((sum, node) => sum + node.metrics.processed, 0);
    const dropped = this.nodes.reduce((sum, node) => sum + node.metrics.dropped, 0);
    const avgLatency = Math.round(
      this.nodes.reduce((sum, node) => sum + node.metrics.avgLatency, 0) /
        Math.max(1, this.nodes.length),
    );
    this.snapshot$.next({
      nodes: this.nodes.map((node) => ({
        ...node,
        metrics: { ...node.metrics },
      })),
      connections: this.connections.map((connection) => ({
        ...connection,
        traffic: { ...connection.traffic },
      })),
      packets: this.packets.map((packet) => ({ ...packet })),
      tick: this.tick,
      mode,
      totals: { processed, dropped, avgLatency },
    });
  }
}
