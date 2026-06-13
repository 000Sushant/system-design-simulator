import { Injectable } from '@angular/core';
import { ArchitectureConnection, ArchitectureNode, AwsServiceType, ServiceMetrics } from '../models/architecture.model';
import { AwsCatalogService } from './aws-catalog.service';

const emptyMetrics: ServiceMetrics = {
  processed: 0,
  received: 0,
  dropped: 0,
  retried: 0,
  queueSize: 0,
  avgLatency: 0,
  cpuPressure: 0,
  memoryPressure: 0,
  errorRate: 0,
  throughput: 0
};

@Injectable({ providedIn: 'root' })
export class ArchitectureFactoryService {
  constructor(private readonly catalog: AwsCatalogService) {}

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 11);
  }

  createNode(type: AwsServiceType, x: number, y: number): ArchitectureNode {
    const definition = this.catalog.getByType(type);
    return {
      id: this.generateId(),
      type,
      name: definition.name,
      x,
      y,
      config: { ...definition.defaults },
      ports: definition.ports.map((port) => ({ ...port })),
      status: 'normal',
      metrics: { ...emptyMetrics }
    };
  }

  createConnection(
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
    type: ArchitectureConnection['type'],
    label = ''
  ): ArchitectureConnection {
    return {
      id: this.generateId(),
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId,
      type,
      allowed: true,
      label,
      traffic: {
        requestsPerSecond: 0,
        latency: 0,
        errorRate: 0,
        intensity: 0
      },
      animationOffset: Math.random()
    };
  }

  emptyMetrics(): ServiceMetrics {
    return { ...emptyMetrics };
  }
}
