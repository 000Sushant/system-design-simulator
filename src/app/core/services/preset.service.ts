import { Injectable } from '@angular/core';
import { ArchitectureConnection, ArchitectureProject, AwsServiceType } from '../models/architecture.model';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ValidationRuleService } from './validation-rule.service';

@Injectable({ providedIn: 'root' })
export class PresetService {
  constructor(
    private readonly factory: ArchitectureFactoryService,
    private readonly validation: ValidationRuleService
  ) { }

  ecommercePreset(): ArchitectureProject {
    const layout: Array<[AwsServiceType, number, number]> = [
      ['client', 80, 160],
      ['route53', 280, 110],
      ['cloudfront', 480, 150],
      ['apiGateway', 700, 150],
      ['lambda', 910, 95],
      ['dynamoDb', 1130, 95],
      ['s3', 1130, 250],
      ['cloudWatch', 1130, -50]
    ];
    const nodes = layout.map(([type, x, y]) => this.factory.createNode(type, x, y));
    const byType = (type: AwsServiceType) => nodes.find((node) => node.type === type)!;
    const connections: ArchitectureConnection[] = [];
    const connect = (source: AwsServiceType, target: AwsServiceType): void => {
      const sourceNode = byType(source);
      const targetNode = byType(target);
      const sourcePorts = sourceNode.ports.filter((port) => port.direction === 'output');
      const targetPorts = targetNode.ports.filter((port) => port.direction === 'input');
      const match = sourcePorts
        .flatMap((sourcePort) => targetPorts.map((targetPort) => ({
          sourcePort,
          targetPort,
          result: this.validation.validate(sourceNode, sourcePort, targetNode, targetPort, connections)
        })))
        .find((candidate) => candidate.result.allowed);
      if (!match) {
        throw new Error(`Preset connection ${source} -> ${target} has no valid rule.`);
      }
      connections.push(this.factory.createConnection(
        sourceNode.id,
        match.sourcePort.id,
        targetNode.id,
        match.targetPort.id,
        this.validation.connectionTypeFor(match.result.ruleId, match.sourcePort.type),
        match.result.message
      ));
    };
    connect('client', 'route53');
    connect('route53', 'cloudfront');
    connect('cloudfront', 'apiGateway');
    connect('apiGateway', 'lambda');
    connect('lambda', 'dynamoDb');
    connect('lambda', 's3');
    connect('lambda', 'cloudWatch');
    return {
      id: 'preset-ecommerce-serverless',
      name: 'Serverless Ecommerce',
      nodes,
      connections,
      annotations: [
        {
          id: 'anno-title',
          text: 'Simple Ecommerce website',
          x: 500,
          y: -150,
          width: 500,
          height: 60,
          fontSize: 24,
          fontWeight: 'bold',
          selected: false
        }
      ],
      currency: 'USD',
      updatedAt: new Date().toISOString()
    };
  }
}
