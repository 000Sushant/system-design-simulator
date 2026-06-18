import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, Subscription } from "rxjs";
import {
  ArchitectureConnection,
  ArchitectureNode,
  DataPacket,
  HealthStatus,
  SimulationMode,
} from "../models/architecture.model";
import { ArchitectureFactoryService } from "./architecture-factory.service";
import bottleneckData from "../data/service-bottleneck.json";

/** Per-service bottleneck descriptor loaded from service-bottleneck.json. */
interface BottleneckSpec {
  kind: string;
  failureMode: "throttle" | "offline" | "none";
  offlineAtRatio?: number;
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

@Injectable({ providedIn: "root" })
export class SimulationService {
  readonly snapshot$ = new BehaviorSubject<SimulationSnapshot>({
    nodes: [],
    connections: [],
    packets: [],
    tick: 0,
    mode: "idle",
    totals: { processed: 0, dropped: 0, avgLatency: 0 },
  });

  private loop?: Subscription;
  private nodes: ArchitectureNode[] = [];
  private connections: ArchitectureConnection[] = [];
  private packets: DataPacket[] = [];
  public tick = 0;
  /** Per-node running totals across the whole run, used to show averages on stop */
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

  // ─── Per-class bottleneck model ───────────────────────────────────────────
  /** Bottleneck spec per service type (failure mode + capacity class). */
  private static readonly bottleneckByType =
    bottleneckData as unknown as Record<string, BottleneckSpec>;
  /** Consecutive ticks each node has spent past its offline threshold. */
  private overloadStreak = new Map<string, number>();
  /** Accumulated sustained-overload latency penalty (ms) per node — climbs while a node
   *  stays past capacity, decays once load is relieved. Keeps latency rising under
   *  prolonged overload (a worsening signal) without an unbounded queue. */
  private overloadLatency = new Map<string, number>();
  /** An "offline"-class service must stay overloaded this many ticks (~1.1s) before it actually fails — models sustained pressure, not a momentary spike. */
  private static readonly OFFLINE_SUSTAIN_TICKS = 6;
  /** Compute (ECS/EC2-style): concurrent requests one vCPU can carry. */
  private static readonly CONC_PER_VCPU = 10;
  /** Cache (ElastiCache): sustained ops/s a single node absorbs before saturating. */
  private static readonly CACHE_OPS_PER_NODE = 40000;
  /** Search (OpenSearch): concurrent queries a single data node can run. */
  private static readonly SEARCH_CONC_PER_NODE = 6;
  /** Database (RDS): true parallel queries are bounded by cores, not max_connections. */
  private static readonly DB_PARALLEL_QUERIES = 64;
  /** Seed ms added to the overload-latency penalty each tick, scaled by how far past
   *  capacity the node is. */
  private static readonly OVERLOAD_LATENCY_GROWTH = 12;
  /** Compounding factor applied to the overload-latency penalty each tick while past
   *  capacity, so latency escalates ms -> s -> minutes the longer overload persists. */
  private static readonly OVERLOAD_LATENCY_ACCEL = 1.12;
  /** Fraction the overload-latency penalty retains each tick once a node is no longer past
   *  capacity (0.6 => ~40%/tick decay, so latency visibly recovers within ~1s). */
  private static readonly OVERLOAD_LATENCY_DECAY = 0.6;
  /** Request timeout (ms) used when a node doesn't set its own `timeoutMs`. Latency climbs
   *  up to this; at it, requests time out (shed, clearing the backlog) and a resource-bound
   *  node collapses offline after OFFLINE_SUSTAIN_TICKS of sustained timeouts. */
  private static readonly DEFAULT_TIMEOUT_MS = 60000;
  /** Max backlog a node retains, in ticks-worth of capacity. Bounds queue growth so an
   *  overloaded node recovers promptly once upstream load drops; excess is shed. */
  private static readonly MAX_QUEUE_TICKS = 8;
  /** Consecutive ticks a node has spent timing out (latency >= timeout). */
  private timeoutStreak = new Map<string, number>();

  constructor(private readonly factory: ArchitectureFactoryService) {}

  start(
    nodes: ArchitectureNode[],
    connections: ArchitectureConnection[],
  ): void {
    this.nodes = nodes.map((node) => ({
      ...node,
      metrics: this.factory.emptyMetrics(),
      status: "normal" as HealthStatus,
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
    // Reset variable-traffic running stats on each client
    for (const n of this.nodes) {
      if (n.type === "client" && n.config["variableTraffic"]) {
        n.config["_varSum"] = 0;
        n.config["_varCount"] = 0;
      }
    }
    this.loop?.unsubscribe();
    this.loop = interval(180).subscribe(() => this.step("running"));
    this.emit("running");
  }

  pause(): void {
    this.loop?.unsubscribe();
    this.loop = undefined;
    this.writeVariableTrafficMean();
    this.emit("paused");
  }

  resume(): void {
    if (!this.loop) {
      this.loop = interval(180).subscribe(() => this.step("running"));
    }
    this.emit("running");
  }

  updateNodes(
    nodes: ArchitectureNode[],
    connections?: ArchitectureConnection[],
  ): void {
    // Update internal nodes with new configurations while preserving current simulation metrics
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
    // If not running, emit the new state immediately so UI reflects the changes
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

    if (mode === "running") {
      this.loop = interval(180).subscribe(() => this.step("running"));
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
    // Preserve run state: write the per-node averages of the whole execution
    // into the metrics so the tiles show what the run looked like on average.
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
    this.emit("idle");
  }

  /**
   * On pause/stop: for each client with Variable Traffic enabled, compute the
   * running mean of all sampled RPS values and write it back to the client's
   * requestRate. If RPS Sync is also on, propagate the mean to every downstream
   * service's throughput so the cost panel shows the realized average.
   */
  private writeVariableTrafficMean(): void {
    for (const node of this.nodes) {
      if (node.type !== "client") continue;
      if (!node.config["variableTraffic"]) continue;
      const sum = Number(node.config["_varSum"]) || 0;
      const count = Number(node.config["_varCount"]) || 0;
      if (count === 0) continue;
      const mean = Math.round((sum / count) * 100) / 100;
      node.config.requestRate = mean;
      if (node.config["syncRpsToServices"]) {
        const downstream = this.collectDownstream(node.id);
        for (const target of this.nodes) {
          if (downstream.has(target.id)) {
            target.config.throughput = mean;
          }
        }
      }
    }
  }

  private propagationOrder(
    outgoingByNode: Map<string, ArchitectureConnection[]>,
  ): ArchitectureNode[] {
    const nodeById = new Map(this.nodes.map((n) => [n.id, n] as const));
    const indegree = new Map<string, number>(
      this.nodes.map((n) => [n.id, 0] as const),
    );
    for (const conn of this.connections) {
      // Only edges between two live nodes count, and ignore self-loops for ordering.
      if (conn.sourceNodeId === conn.targetNodeId) continue;
      if (!nodeById.has(conn.sourceNodeId) || !nodeById.has(conn.targetNodeId))
        continue;
      indegree.set(
        conn.targetNodeId,
        (indegree.get(conn.targetNodeId) ?? 0) + 1,
      );
    }

    // Seed with sources (in-degree 0), keeping creation order for determinism.
    const queue = this.nodes
      .filter((n) => (indegree.get(n.id) ?? 0) === 0)
      .map((n) => n.id);
    const ordered: ArchitectureNode[] = [];
    const visited = new Set<string>();
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      ordered.push(nodeById.get(id)!);
      for (const conn of outgoingByNode.get(id) ?? []) {
        if (conn.targetNodeId === id || !nodeById.has(conn.targetNodeId))
          continue;
        const left = (indegree.get(conn.targetNodeId) ?? 0) - 1;
        indegree.set(conn.targetNodeId, left);
        if (left === 0 && !visited.has(conn.targetNodeId))
          queue.push(conn.targetNodeId);
      }
    }
    // Cycle fallback: append any node we couldn't order, in creation order.
    for (const n of this.nodes) if (!visited.has(n.id)) ordered.push(n);
    return ordered;
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

    // Variable traffic: every ~1 second (6 ticks @ 180ms), pick a new RPS sample
    // for each client that has variableTraffic enabled, and propagate to downstream
    // services when syncRpsToServices is also on.
    if (this.tick % 6 === 0) {
      this.sampleVariableTraffic();
    }

    // Walk producers before consumers so each node sees its full upstream demand
    // (creation order is wrong for fan-out / fan-in graphs — see propagationOrder).
    const orderedNodes = this.propagationOrder(outgoingByNode);
    for (const node of orderedNodes) {
      const isOffline = node.status === "offline";
      let baseRate =
        node.type === "client" && !isOffline
          ? node.config.requestRate || 0
          : (incoming.get(node.id) ?? node.metrics.queueSize * 0.35);
      if (node.type === "client" && !isOffline && baseRate === 0)
        baseRate = 100;

      const isApiGatewayCache =
        node.type === "apiGateway" &&
        node.config["type"] === "rest" &&
        node.config["cacheGB"] &&
        node.config["cacheGB"] !== "0";
      if (isApiGatewayCache) {
        const cacheGB = parseFloat(node.config["cacheGB"]) || 0;
        const clientNode = this.nodes.find((n) => n.type === "client");
        const packageSize = clientNode
          ? clientNode.config["packageSize"] || 50
          : 50;
        const workingSetGB = Math.max(0.1, baseRate * packageSize * 0.0002);
        const ratio = cacheGB / workingSetGB;
        node.config.cacheHitRate = Math.min(
          95,
          Math.round(95 * (1 - Math.exp(-ratio))),
        );
      } else if (node.type === "apiGateway") {
        node.config.cacheHitRate = 0;
      }

      const replication = node.config.replication || 1;
      const cacheHitRate = node.config.cacheHitRate || 0;
      const scaleBonus = replication > 1 ? 1 + (replication - 1) * 0.55 : 1;
      const cacheBonus = ["cloudfront", "elastiCache", "apiGateway"].includes(
        node.type,
      )
        ? 1 + cacheHitRate / 150
        : 1;
      const routingBonus =
        node.type === "elb"
          ? ({
              "round-robin": 1,
              "least-connection": 1.12,
              "consistent-hash": 1.06,
            }[node.config.routingAlgorithm || "round-robin"] ?? 1)
          : 1;
      const batchBonus = ["sqs", "cloudWatch"].includes(node.type)
        ? 1 + Math.min(node.config.batchSize || 1, 100) / 220
        : 1;

      let lbCapacityMult = 1.0;
      let lbBaseLatency = 12;
      if (node.type === "elb") {
        const lbType = node.config["lbType"] || "alb";
        if (lbType === "nlb") {
          lbCapacityMult = 5.0;
          lbBaseLatency = 2;
        } else if (lbType === "clb") {
          lbCapacityMult = 0.6;
          lbBaseLatency = 20;
        } else if (lbType === "gwlb") {
          lbCapacityMult = 2.0;
          lbBaseLatency = 15;
        } else {
          lbCapacityMult = 1.0;
          lbBaseLatency = 12;
        }
      }

      // Capacity reference:
      // - Client with Variable Traffic on → peak of the range (max RPS) so the
      //   current sampled requestRate produces a meaningful 0–100% load swing
      // - Downstream synced services → _designThroughput (the synced RPS pushed at
      //   sync-on time) so utilization is measured against the pushed capacity and
      //   isn't pinned to the live cost throughput updated each sample
      const clientPeak =
        node.type === "client" && node.config["variableTraffic"]
          ? Number(node.config["variableMaxRps"]) ||
            node.config.requestRate ||
            1000
          : node.config.requestRate || 1000;
      const refThroughput =
        Number(node.config["_designThroughput"]) ||
        node.config.throughput ||
        100;
      let baseCapacity =
        node.type === "client"
          ? clientPeak
          : refThroughput * scaleBonus * cacheBonus * routingBonus * batchBonus;

      // Lambda: reserved concurrency caps actual throughput. max RPS = concurrency / avgDurationSec
      if (node.type === "lambda") {
        const concurrencyLimit = node.config.concurrency || 100;
        const durationSec = Math.max(
          0.001,
          (node.config.latency || 200) / 1000,
        );
        const concurrencyCap = concurrencyLimit / durationSec;
        baseCapacity = Math.min(baseCapacity, concurrencyCap);
      }

      // Provisioned-capacity ceilings — under-provisioning shows up as throttling/queueing
      if (
        node.type === "dynamoDb" &&
        node.config["capacityMode"] === "provisioned"
      ) {
        // A read consumes ceil(item/4KB) RCUs, a write ceil(item/1KB) WCUs
        const itemKB = Math.max(1, Number(node.config["itemSizeKB"]) || 1);
        const maxReads =
          (Number(node.config["rcu"]) || 100) / Math.ceil(itemKB / 4);
        const maxWrites =
          (Number(node.config["wcu"]) || 100) / Math.ceil(itemKB);
        baseCapacity = Math.min(baseCapacity, maxReads + maxWrites);
      }
      if (node.type === "kinesis") {
        // Hard per-shard ingest limit: 1,000 records/s (or 1 MB/s) per shard
        baseCapacity = Math.min(
          baseCapacity,
          (Number(node.config["shards"]) || 2) * 1000,
        );
      }
      if (node.type === "sqs" && node.config["type"] === "fifo") {
        // FIFO queues: 300 msg/s, or 3,000 msg/s with batching
        baseCapacity = Math.min(
          baseCapacity,
          (node.config.batchSize || 10) > 1 ? 3000 : 300,
        );
      }
      if (node.type === "appRunner") {
        // Effective RPS = instances × concurrent requests per instance ÷ request duration
        const instances = Number(node.config["instances"]) || 2;
        const conc = Number(node.config["concurrencyPerInstance"]) || 100;
        const durationSec = Math.max(0.001, (node.config.latency || 30) / 1000);
        baseCapacity = Math.min(baseCapacity, (instances * conc) / durationSec);
      }
      if (node.type === "rds") {
        // Connection-pool + per-query CPU ceiling. True parallelism is bounded by
        // CPU cores, not raw max_connections — a DB can't actually run 1,000
        // queries at once — so cap effective parallel queries. Read replicas add
        // read capacity. Sustained overload here exhausts the pool → 503 → offline.
        const replicaBoost =
          1 + (Number(node.config["readReplicas"]) || 0) * 0.9;
        const maxConn = Number(node.config["maxConnections"]) || 1000;
        const parallel = Math.min(
          maxConn,
          SimulationService.DB_PARALLEL_QUERIES * replicaBoost,
        );
        const durationSec = Math.max(0.001, (node.config.latency || 10) / 1000);
        // Capacity is the connection/CPU ceiling itself (RDS has no request-rate knob).
        baseCapacity = parallel / durationSec;
      }
      // Compute-bound containers: capacity = tasks × vCPU concurrency ÷ request time.
      if (node.type === "ecs") {
        const tasks = Number(node.config["tasks"]) || 2;
        const vcpu = Number(node.config["vCPU"]) || 0.5;
        const durationSec = Math.max(0.001, (node.config.latency || 30) / 1000);
        baseCapacity =
          (tasks * vcpu * SimulationService.CONC_PER_VCPU) / durationSec;
      }
      // In-memory cache: very high per-node op rate; fails on node saturation, not RPS.
      if (node.type === "elastiCache") {
        const cacheNodes = Number(node.config["count"]) || 2;
        baseCapacity = cacheNodes * SimulationService.CACHE_OPS_PER_NODE;
      }
      // Search cluster: bound by per-data-node query concurrency ÷ query time.
      if (node.type === "openSearch") {
        const dataNodes = Number(node.config["nodes"]) || 2;
        const durationSec = Math.max(0.001, (node.config.latency || 50) / 1000);
        baseCapacity =
          (dataNodes * SimulationService.SEARCH_CONC_PER_NODE) / durationSec;
      }
      // Object storage: effectively unbounded request capacity — never the bottleneck.
      if (node.type === "s3") {
        baseCapacity = Math.max(baseCapacity, 1e9);
      }

      const capacity = isOffline
        ? 0
        : Math.max(
            1,
            node.type === "elb" ? baseCapacity * lbCapacityMult : baseCapacity,
          );

      const totalDemand = Math.max(0, baseRate + node.metrics.queueSize);
      const processed = isOffline ? 0 : Math.min(totalDemand, capacity);
      const queued = isOffline
        ? node.metrics.queueSize
        : Math.max(0, totalDemand - processed);
      const failureThreshold = node.config.failureThreshold || 100;
      const overloadRatio = isOffline ? 2 : totalDemand / Math.max(1, capacity);
      const cacheLatencyReduction = [
        "cloudfront",
        "elastiCache",
        "apiGateway",
      ].includes(node.type)
        ? cacheHitRate * 0.28
        : 0;
      const timeoutMs = node.config.timeoutMs || 0;
      const latency =
        node.type === "elb" ? lbBaseLatency : node.config.latency || 100;
      const timeoutPressure = timeoutMs > 0 && timeoutMs < latency * 3 ? 6 : 0;
      const failures = isOffline
        ? Math.round(totalDemand)
        : overloadRatio > failureThreshold / 100
          ? Math.round((overloadRatio - 1) * processed * 0.08)
          : 0;
      const dropped = isOffline
        ? 0
        : overloadRatio > 1.35
          ? Math.round(queued * 0.16)
          : 0;

      const retryPolicy = node.config.retryPolicy || 0;
      const cpu = node.config.cpu || 10;
      const memory = node.config.memory || 10;

      // Lambda: memory pressure = concurrency utilization (active executions / concurrency limit)
      // Other services: standard memory pressure formula
      let memoryPressure: number;
      if (isOffline) {
        memoryPressure = 100;
      } else if (node.type === "lambda") {
        const durationSec = Math.max(
          0.001,
          (node.config.latency || 200) / 1000,
        );
        const concurrencyLimit = node.config.concurrency || 100;
        const activeConcurrency = processed * durationSec;
        memoryPressure = Math.min(
          100,
          Math.round((activeConcurrency / concurrencyLimit) * 10000) / 100,
        );
      } else {
        memoryPressure = Math.min(
          100,
          Math.round((memory * 0.5 + node.metrics.queueSize * 0.04) * 100) /
            100,
        );
      }

      const round2 = (n: number) => Math.round(n * 100) / 100;

      // Sustained-overload latency: climbs (compounding) the longer a node stays past
      // capacity — ms -> s -> minutes — and decays once load is relieved. Capped at the
      // request timeout, beyond which requests are considered timed out.
      const requestTimeoutMs =
        node.config.timeoutMs && node.config.timeoutMs > 0
          ? node.config.timeoutMs
          : SimulationService.DEFAULT_TIMEOUT_MS;
      let overloadLatency = this.overloadLatency.get(node.id) ?? 0;
      if (isOffline) {
        overloadLatency = 0;
      } else if (overloadRatio > 1) {
        overloadLatency = Math.min(
          requestTimeoutMs,
          (overloadLatency +
            (overloadRatio - 1) * SimulationService.OVERLOAD_LATENCY_GROWTH) *
            SimulationService.OVERLOAD_LATENCY_ACCEL,
        );
      } else {
        overloadLatency *= SimulationService.OVERLOAD_LATENCY_DECAY;
        if (overloadLatency < 1) overloadLatency = 0;
      }
      this.overloadLatency.set(node.id, overloadLatency);

      // Once latency reaches the timeout, in-flight requests time out: they fail and the
      // backlog is shed. This is what lets a node pinned at ~100% utilisation recover
      // instead of holding a queue that can never drain (drain rate = capacity - demand = 0).
      const timedOut = !isOffline && overloadLatency >= requestTimeoutMs - 1;

      const rawQueue = Math.max(
        0,
        queued - dropped + (isOffline ? 0 : failures * retryPolicy),
      );
      const queueCap = capacity * SimulationService.MAX_QUEUE_TICKS;
      const queueOverflow = isOffline ? 0 : Math.max(0, rawQueue - queueCap);
      let nextQueue = isOffline ? rawQueue : Math.min(rawQueue, queueCap);
      let timeoutDrops = 0;
      if (timedOut) {
        timeoutDrops = nextQueue;
        nextQueue = 0;
      }
      const totalDropped = dropped + queueOverflow + timeoutDrops;

      node.metrics = {
        received: round2(totalDemand),
        processed: node.metrics.processed + round2(processed),
        dropped: node.metrics.dropped + totalDropped + failures,
        retried:
          node.metrics.retried + Math.min(failures * retryPolicy, queued),
        queueSize: round2(nextQueue),
        avgLatency: isOffline
          ? 0
          : Math.max(
              1,
              round2(
                latency -
                  cacheLatencyReduction +
                  timeoutPressure +
                  Math.min(500, queued * 0.5) +
                  overloadRatio * 18 +
                  overloadLatency,
              ),
            ),
        cpuPressure: isOffline
          ? 100
          : Math.min(100, round2(cpu * 0.45 + overloadRatio * 58)),
        memoryPressure,
        errorRate: isOffline
          ? 100
          : Math.min(
              100,
              round2(
                ((failures + totalDropped) / Math.max(1, totalDemand)) * 100,
              ),
            ),
        throughput: round2(processed),
      };

      // Sustained request-timeouts collapse a resource-bound node (offline-class / untagged)
      // to offline; managed (throttle / none) services keep shedding and stay up.
      const spec = SimulationService.bottleneckByType[node.type];
      const canTimeoutCollapse = !spec || spec.failureMode === "offline";
      let timeoutStreak = this.timeoutStreak.get(node.id) ?? 0;
      timeoutStreak = timedOut && canTimeoutCollapse ? timeoutStreak + 1 : 0;
      this.timeoutStreak.set(node.id, timeoutStreak);

      if (node.type === "client") {
        // The Users node is a pure traffic source — it only emits load and never
        // bottlenecks, so it carries no health state (always normal).
        node.status = "normal";
      } else if (!isOffline) {
        node.status =
          timeoutStreak >= SimulationService.OFFLINE_SUSTAIN_TICKS
            ? "offline"
            : this.resolveStatus(node, overloadRatio);
      }

      const outputs = outgoingByNode.get(node.id) ?? [];
      // If this node is offline, zero out its outgoing connection traffic and
      // drop any in-flight packets so the canvas stops showing flow through it.
      if (node.status === "offline" && outputs.length > 0) {
        for (const connection of outputs) {
          connection.traffic = {
            requestsPerSecond: 0,
            latency: 0,
            errorRate: 100,
            intensity: 0,
          };
        }
        const offlineConnIds = new Set(outputs.map((c) => c.id));
        this.packets = this.packets.filter(
          (p) => !offlineConnIds.has(p.connectionId),
        );
      }
      if (outputs.length > 0 && processed > 0 && node.status !== "offline") {
        let processedForOutput = processed;
        if (
          node.type === "apiGateway" &&
          node.config["type"] === "rest" &&
          node.config["cacheGB"] &&
          node.config["cacheGB"] !== "0"
        ) {
          const hitRate = node.config.cacheHitRate || 0;
          processedForOutput = processed * (1 - hitRate / 100);
        } else if (node.type === "elastiCache" || node.type === "cloudfront") {
          // Cache hits are answered here — only misses continue to the origin/database
          const hitRate = node.config.cacheHitRate || 0;
          processedForOutput = processed * (1 - hitRate / 100);
        }

        // Each outgoing edge carries an independent share of this node's output,
        // controlled by the connection's trafficWeight (% , default 100). This lets a
        // fan-out node send, say, 100% to logging, 80% to a DB and 20% to storage —
        // instead of the old behaviour of splitting output equally across all edges.
        for (const connection of outputs) {
          const target = this.nodes.find(
            (candidate) => candidate.id === connection.targetNodeId,
          );
          if (!target) {
            continue;
          }
          const weight = connection.trafficWeight ?? 100;
          const load =
            Math.round(
              processedForOutput *
                (weight / 100) *
                (connection.type === "cdn" ? 0.72 : 1) *
                100,
            ) / 100;
          incoming.set(target.id, (incoming.get(target.id) ?? 0) + load);
          connection.traffic = {
            requestsPerSecond: load,
            latency: node.metrics.avgLatency,
            errorRate: node.metrics.errorRate,
            intensity: Math.min(
              1,
              load / Math.max(1, target.config.throughput),
            ),
          };
          connection.animationOffset =
            (connection.animationOffset +
              0.055 +
              connection.traffic.intensity * 0.08) %
            1;
          if (this.tick % 4 === 0 || connection.traffic.intensity > 0.72) {
            const packetId =
              typeof crypto !== "undefined" && crypto.randomUUID
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

    // Propagate offline state to every node downstream of any offline node.
    // Conceptually: if an upstream service has died, every dependent service
    // downstream of it has no input either, so the whole sub-graph halts.
    this.cascadeOfflineDownstream();

    // Accumulate running totals AFTER the cascade so starved nodes record
    // zeros (not their pre-cascade values) — stop() shows accurate averages.
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
    const offlineSet = new Set(
      this.nodes.filter((n) => n.status === "offline").map((n) => n.id),
    );
    if (offlineSet.size === 0) return;

    // Forward-BFS from every traffic source (client), skipping offline nodes.
    // A node is "alive" only if some live path still connects it to a source —
    // so if A→B is offline but A→C→D is intact, D stays alive on the C path.
    const reachable = new Set<string>();
    const sources = this.nodes
      .filter((n) => n.type === "client" && !offlineSet.has(n.id))
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

    // Anything not reachable and not itself offline is starved.
    const starved = new Set<string>();
    for (const n of this.nodes) {
      if (offlineSet.has(n.id)) continue;
      if (reachable.has(n.id)) continue;
      starved.add(n.id);
    }
    if (starved.size === 0) {
      // Even when nothing is fully starved, dead-end edges into offline
      // nodes should not show traffic — zero them out.
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
      node.status = "normal";
      node.metrics = { ...emptyMetrics };
    }
    const blockedConnIds = new Set<string>();
    for (const c of this.connections) {
      // A connection has zero flow if either endpoint is starved, or the
      // target is offline (offline node can't accept), or the source is
      // offline (offline node can't emit).
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
      this.packets = this.packets.filter(
        (p) => !blockedConnIds.has(p.connectionId),
      );
    }
  }

  private sampleVariableTraffic(): void {
    const downstreamCache = new Map<string, Set<string>>();
    for (const node of this.nodes) {
      if (node.type !== "client") continue;
      if (!node.config["variableTraffic"]) continue;
      const min = Number(node.config["variableMinRps"]) || 1;
      const max = Number(node.config["variableMaxRps"]) || min;
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      const sampled = Math.round((lo + Math.random() * (hi - lo)) * 100) / 100;
      node.config.requestRate = sampled;
      // Accumulate running stats so pause/stop can write back the realized mean
      node.config["_varSum"] = (Number(node.config["_varSum"]) || 0) + sampled;
      node.config["_varCount"] = (Number(node.config["_varCount"]) || 0) + 1;

      if (node.config["syncRpsToServices"]) {
        let downstream = downstreamCache.get(node.id);
        if (!downstream) {
          downstream = this.collectDownstream(node.id);
          downstreamCache.set(node.id, downstream);
        }
        for (const target of this.nodes) {
          if (downstream.has(target.id)) {
            target.config.throughput = sampled;
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

  /**
   * Resolve a node's health from its raw metrics AND its bottleneck class.
   *
   * - Untagged services keep the legacy behaviour (can go offline via cpu/error).
   * - `throttle` / `none` services NEVER go offline: past capacity they shed load
   *   (429/503 that recovers) and are clamped to a stressed-but-alive status.
   * - `offline` services (compute / connections) only fail after sustained overload
   *   beyond their offlineAtRatio — modelling CPU / connection-pool exhaustion.
   */
  private resolveStatus(
    node: ArchitectureNode,
    overloadRatio: number,
  ): HealthStatus {
    const base = this.statusFor(
      node.metrics.cpuPressure,
      node.metrics.errorRate,
      overloadRatio,
    );
    const spec = SimulationService.bottleneckByType[node.type];
    if (!spec) {
      return base;
    }

    if (spec.failureMode === "offline") {
      const ratio = spec.offlineAtRatio ?? 1.5;
      const streak =
        overloadRatio > ratio ? (this.overloadStreak.get(node.id) ?? 0) + 1 : 0;
      this.overloadStreak.set(node.id, streak);
      if (streak >= SimulationService.OFFLINE_SUSTAIN_TICKS) {
        return "offline";
      }
      // Overloaded but not yet collapsed: surface stress without going dark.
      return base === "offline" ? "failing" : base;
    }

    // throttle / none: reject excess but stay up. Clamp away from terminal states.
    if (spec.failureMode === "none") {
      return base === "offline" || base === "failing" ? "busy" : base;
    }
    return base === "offline" || base === "failing" ? "overloaded" : base;
  }

  private statusFor(
    cpuPressure: number,
    errorRate: number,
    overloadRatio: number,
  ): HealthStatus {
    if (errorRate > 30 || cpuPressure > 98) {
      return "offline";
    }
    if (errorRate > 14 || overloadRatio > 1.4) {
      return "failing";
    }
    if (overloadRatio > 1.12 || cpuPressure > 84) {
      return "overloaded";
    }
    if (overloadRatio > 0.78 || cpuPressure > 66) {
      return "busy";
    }
    return "normal";
  }

  private emit(mode: SimulationMode): void {
    const processed = this.nodes.reduce(
      (sum, node) => sum + node.metrics.processed,
      0,
    );
    const dropped = this.nodes.reduce(
      (sum, node) => sum + node.metrics.dropped,
      0,
    );
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
