import { Injectable } from '@angular/core';
import { ArchitectureConnection, ArchitectureNode } from '../models/architecture.model';
import { ReferenceNode } from '../models/challenge.model';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ValidationRuleService } from './validation-rule.service';

export interface BuiltGraph {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  nodeByKey: Map<string, ArchitectureNode>;
}

/**
 * Builds a connected architecture from a declarative layout + logical edges.
 *
 * Shared by presets, challenge reference solutions, and scaffolds so they all
 * create connections the same way: every edge is resolved to a concrete,
 * rule-valid port pair via ValidationRuleService (no hardcoded port ids).
 */
@Injectable({ providedIn: 'root' })
export class GraphBuilderService {
  constructor(
    private readonly factory: ArchitectureFactoryService,
    private readonly validation: ValidationRuleService,
  ) {}

  build(layout: ReferenceNode[], edges: Array<[string, string]>): BuiltGraph {
    const nodeByKey = new Map<string, ArchitectureNode>(
      layout.map((item) => {
        const node = this.factory.createNode(item.type, item.x, item.y);
        if (item.name) {
          node.name = item.name;
        }
        if (item.config) {
          node.config = { ...node.config, ...item.config };
        }
        return [item.key, node] as const;
      }),
    );
    const nodes = layout.map((item) => nodeByKey.get(item.key)!);
    const connections: ArchitectureConnection[] = [];

    for (const [sourceKey, targetKey] of edges) {
      const sourceNode = nodeByKey.get(sourceKey);
      const targetNode = nodeByKey.get(targetKey);
      if (!sourceNode || !targetNode) {
        throw new Error(`Graph edge ${sourceKey} -> ${targetKey} references an unknown node key.`);
      }
      const sourcePorts = sourceNode.ports.filter((port) => port.direction === 'output');
      const targetPorts = targetNode.ports.filter((port) => port.direction === 'input');
      const match = sourcePorts
        .flatMap((sourcePort) =>
          targetPorts.map((targetPort) => ({
            sourcePort,
            targetPort,
            result: this.validation.validate(sourceNode, sourcePort, targetNode, targetPort, connections),
          })),
        )
        .find((candidate) => candidate.result.allowed);
      if (!match) {
        throw new Error(`Graph edge ${sourceKey} -> ${targetKey} has no valid connection rule.`);
      }
      connections.push(
        this.factory.createConnection(
          sourceNode.id,
          match.sourcePort.id,
          targetNode.id,
          match.targetPort.id,
          this.validation.connectionTypeFor(match.result.ruleId, match.sourcePort.type),
          match.result.message,
        ),
      );
    }

    return { nodes, connections, nodeByKey };
  }
}
