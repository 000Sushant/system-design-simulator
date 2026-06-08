import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { ArchitectureConnection, ArchitectureNode, DataPacket, HealthStatus, SimulationMode } from '../models/architecture.model';
import { ArchitectureFactoryService } from './architecture-factory.service';

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
  readonly snapshot$ = new BehaviorSubject<SimulationSnapshot>({
    nodes: [],
    connections: [],
    packets: [],
    tick: 0,
    mode: 'idle',
    totals: { processed: 0, dropped: 0, avgLatency: 0 }
  });

  private loop?: Subscription;
  private nodes: ArchitectureNode[] = [];
  private connections: ArchitectureConnection[] = [];
  private packets: DataPacket[] = [];
  public tick = 0;

  constructor(private readonly factory: ArchitectureFactoryService) {}

  start(nodes: ArchitectureNode[], connections: ArchitectureConnection[]): void {
    this.nodes = nodes.map((node) => ({
      ...node,
      metrics: this.factory.emptyMetrics(),
      status: 'normal' as HealthStatus
    }));
    this.connections = connections.map((connection) => ({
      ...connection,
      traffic: { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 }
    }));
    this.packets = [];
    this.tick = 0;
    this.loop?.unsubscribe();
    this.loop = interval(180).subscribe(() => this.step('running'));
    this.emit('running');
  }

  pause(): void {
    this.loop?.unsubscribe();
    this.loop = undefined;
    this.emit('paused');
  }

  resume(): void {
    if (!this.loop) {
      this.loop = interval(180).subscribe(() => this.step('running'));
    }
    this.emit('running');
  }

  updateNodes(nodes: ArchitectureNode[], connections?: ArchitectureConnection[]): void {
    // Update internal nodes with new configurations while preserving current simulation metrics
    this.nodes = nodes.map(newNode => {
      const existing = this.nodes.find(n => n.id === newNode.id);
      return {
        ...newNode,
        metrics: existing ? existing.metrics : newNode.metrics,
        status: existing ? existing.status : newNode.status
      };
    });
    if (connections) {
      this.connections = connections.map(newConn => {
        const existing = this.connections.find(c => c.id === newConn.id);
        return {
          ...newConn,
          traffic: existing ? existing.traffic : { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 }
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
    mode: SimulationMode
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
    this.packets = [];
    this.tick = 0;
    this.emit('idle');
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

    for (const node of this.nodes) {
      const isOffline = node.status === 'offline';
      let baseRate = (node.type === 'client' && !isOffline) ? (node.config.requestRate || 0) : (incoming.get(node.id) ?? node.metrics.queueSize * 0.35);
      if (node.type === 'client' && !isOffline && baseRate === 0) baseRate = 100;

      const isApiGatewayCache = node.type === 'apiGateway' && node.config['type'] === 'rest' && node.config['cacheGB'] && node.config['cacheGB'] !== '0';
      if (isApiGatewayCache) {
        const cacheGB = parseFloat(node.config['cacheGB']) || 0;
        const clientNode = this.nodes.find(n => n.type === 'client');
        const packageSize = clientNode ? (clientNode.config['packageSize'] || 50) : 50;
        const workingSetGB = Math.max(0.1, baseRate * packageSize * 0.0002);
        const ratio = cacheGB / workingSetGB;
        node.config.cacheHitRate = Math.min(95, Math.round(95 * (1 - Math.exp(-ratio))));
      } else if (node.type === 'apiGateway') {
        node.config.cacheHitRate = 0;
      }

      const replication = node.config.replication || 1;
      const cacheHitRate = node.config.cacheHitRate || 0;
      const scaleBonus = replication > 1 ? 1 + (replication - 1) * 0.55 : 1;
      const cacheBonus = ['cloudfront', 'elastiCache', 'apiGateway'].includes(node.type) ? 1 + cacheHitRate / 150 : 1;
      const routingBonus = node.type === 'elb'
        ? ({ 'round-robin': 1, 'least-connection': 1.12, 'consistent-hash': 1.06 }[node.config.routingAlgorithm || 'round-robin'] ?? 1)
        : 1;
      const batchBonus = ['sqs', 'cloudWatch'].includes(node.type) ? 1 + Math.min(node.config.batchSize || 1, 100) / 220 : 1;

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

      const baseCapacity = node.type === 'client'
        ? (node.config.requestRate || 1000)
        : (node.config.throughput || 100) * scaleBonus * cacheBonus * routingBonus * batchBonus;
      const capacity = isOffline ? 0 : Math.max(1, node.type === 'elb' ? baseCapacity * lbCapacityMult : baseCapacity);

      const totalDemand = Math.max(0, baseRate + node.metrics.queueSize);
      const processed = isOffline ? 0 : Math.min(totalDemand, capacity);
      const queued = isOffline ? node.metrics.queueSize : Math.max(0, totalDemand - processed);
      const failureThreshold = node.config.failureThreshold || 100;
      const overloadRatio = isOffline ? 2 : totalDemand / Math.max(1, capacity);
      const cacheLatencyReduction = ['cloudfront', 'elastiCache', 'apiGateway'].includes(node.type) ? cacheHitRate * 0.28 : 0;
      const timeoutMs = node.config.timeoutMs || 0;
      const latency = node.type === 'elb' ? lbBaseLatency : (node.config.latency || 100);
      const timeoutPressure = timeoutMs > 0 && timeoutMs < latency * 3 ? 6 : 0;
      const failures = isOffline ? Math.round(totalDemand) : (overloadRatio > failureThreshold / 100 ? Math.round((overloadRatio - 1) * processed * 0.08) : 0);
      const dropped = isOffline ? 0 : (overloadRatio > 1.35 ? Math.round(queued * 0.16) : 0);

      const retryPolicy = node.config.retryPolicy || 0;
      const cpu = node.config.cpu || 10;
      const memory = node.config.memory || 10;

      node.metrics = {
        received: Math.round(totalDemand),
        processed: node.metrics.processed + Math.ceil(processed),
        dropped: node.metrics.dropped + dropped + failures,
        retried: node.metrics.retried + Math.min(failures * retryPolicy, queued),
        queueSize: Math.max(0, Math.round(queued - dropped + (isOffline ? 0 : failures * retryPolicy))),
        avgLatency: isOffline ? 0 : Math.max(1, Math.round(latency - cacheLatencyReduction + timeoutPressure + Math.min(500, queued * 0.5) + overloadRatio * 18)),
        cpuPressure: isOffline ? 100 : Math.min(100, Math.round(cpu * 0.45 + overloadRatio * 58)),
        memoryPressure: isOffline ? 100 : Math.min(100, Math.round(memory * 0.5 + node.metrics.queueSize * 0.04)),
        errorRate: isOffline ? 100 : Math.min(100, Math.round((failures + dropped) / Math.max(1, totalDemand) * 100)),
        throughput: Math.ceil(processed)
      };

      if (!isOffline) {
        node.status = this.statusFor(node.metrics.cpuPressure, node.metrics.errorRate, overloadRatio);
      }

      const outputs = outgoingByNode.get(node.id) ?? [];
      if (outputs.length > 0 && processed > 0 && node.status !== 'offline') {
        const fanoutMultiplier = ['sns', 'stepFunctions', 'apiGateway', 'eventBridge', 'kinesis', 'msk', 'mq', 'appSync', 'transitGateway'].includes(node.type) ? 1 : outputs.length;
        
        let processedForOutput = processed;
        if (node.type === 'apiGateway' && node.config['type'] === 'rest' && node.config['cacheGB'] && node.config['cacheGB'] !== '0') {
          const hitRate = node.config.cacheHitRate || 0;
          processedForOutput = processed * (1 - hitRate / 100);
        }

        const perConnection = processedForOutput / Math.max(1, fanoutMultiplier);
        for (const connection of outputs) {
          const target = this.nodes.find((candidate) => candidate.id === connection.targetNodeId);
          if (!target) {
            continue;
          }
          const load = Math.round(perConnection * (connection.type === 'cdn' ? 0.72 : 1));
          incoming.set(target.id, (incoming.get(target.id) ?? 0) + load);
          connection.traffic = {
            requestsPerSecond: load,
            latency: node.metrics.avgLatency,
            errorRate: node.metrics.errorRate,
            intensity: Math.min(1, load / Math.max(1, target.config.throughput))
          };
          connection.animationOffset = (connection.animationOffset + 0.055 + connection.traffic.intensity * 0.08) % 1;
          if (this.tick % 4 === 0 || connection.traffic.intensity > 0.72) {
            const packetId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
              ? crypto.randomUUID() 
              : `pkt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            this.packets.push({
              id: packetId,
              connectionId: connection.id,
              progress: 0,
              status: node.status
            });
          }
        }
      }
    }

    this.packets = this.packets
      .map((packet) => ({ ...packet, progress: packet.progress + 0.075 }))
      .filter((packet) => packet.progress < 1.05)
      .slice(-90);

    this.emit(mode);
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
    const avgLatency = Math.round(this.nodes.reduce((sum, node) => sum + node.metrics.avgLatency, 0) / Math.max(1, this.nodes.length));
    this.snapshot$.next({
      nodes: this.nodes.map((node) => ({ ...node, metrics: { ...node.metrics } })),
      connections: this.connections.map((connection) => ({ ...connection, traffic: { ...connection.traffic } })),
      packets: this.packets.map((packet) => ({ ...packet })),
      tick: this.tick,
      mode,
      totals: { processed, dropped, avgLatency }
    });
  }
}
