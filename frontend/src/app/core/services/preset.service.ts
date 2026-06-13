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

  messagingPreset(): ArchitectureProject {
    // key, service type, display name, x, y
    const layout: Array<[string, AwsServiceType, string, number, number]> = [
      ['users', 'client', 'Chat Users', 60, 360],
      ['dns', 'route53', 'App Domain (DNS)', 300, 220],
      ['auth', 'cognito', 'User Authentication', 300, 520],
      ['cdn', 'cloudfront', 'Media CDN', 540, 80],
      ['wsApi', 'apiGateway', 'WebSocket API', 540, 360],
      ['connFn', 'lambda', 'Connection Manager', 800, 240],
      ['msgFn', 'lambda', 'Message Router', 800, 480],
      ['presence', 'elastiCache', 'Presence Cache', 1060, 140],
      ['messages', 'dynamoDb', 'Message Store', 1060, 340],
      ['push', 'sns', 'Push Notifications', 1060, 520],
      ['stream', 'kinesis', 'Message Stream', 1060, 700],
      ['storage', 's3', 'Media & Archive Storage', 1320, 80],
      ['deliveryQueue', 'sqs', 'Delivery Queue', 1320, 520],
      ['archive', 'kinesisFirehose', 'Archive Pipeline', 1320, 700],
      ['workers', 'ecs', 'Delivery Workers', 1580, 520],
      ['search', 'openSearch', 'Message Search', 1580, 700],
      ['monitoring', 'cloudWatch', 'Monitoring', 800, 720]
    ];
    const nodeByKey = new Map(
      layout.map(([key, type, name, x, y]) => {
        const node = this.factory.createNode(type, x, y);
        node.name = name;
        return [key, node] as const;
      })
    );
    const nodes = layout.map(([key]) => nodeByKey.get(key)!);
    const connections: ArchitectureConnection[] = [];
    const connect = (source: string, target: string): void => {
      const sourceNode = nodeByKey.get(source)!;
      const targetNode = nodeByKey.get(target)!;
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
    // Edge & authentication
    connect('users', 'dns');
    connect('users', 'auth');
    connect('dns', 'cdn');
    connect('dns', 'wsApi');
    connect('cdn', 'storage');

    // WebSocket connection lifecycle ($connect / $disconnect, presence)
    connect('auth', 'connFn');
    connect('wsApi', 'connFn');
    connect('connFn', 'presence');
    connect('connFn', 'messages');
    connect('connFn', 'monitoring');

    // Message send path (persist, look up presence, fan-out, stream)
    connect('wsApi', 'msgFn');
    connect('msgFn', 'messages');
    connect('msgFn', 'presence');
    connect('msgFn', 'storage');
    connect('msgFn', 'push');
    connect('msgFn', 'stream');
    connect('msgFn', 'monitoring');

    // Asynchronous fan-out & delivery workers
    connect('push', 'deliveryQueue');
    connect('deliveryQueue', 'workers');
    connect('workers', 'messages');
    connect('workers', 'monitoring');

    // Message stream → archive & search
    connect('stream', 'archive');
    connect('archive', 'storage');
    connect('stream', 'search');

    return {
      id: 'preset-messaging-realtime',
      name: 'Real-Time Messaging App',
      nodes,
      connections,
      annotations: [
        {
          id: 'anno-title',
          text: 'Real-Time Messaging Application',
          x: 520,
          y: -110,
          width: 640,
          height: 60,
          fontSize: 26,
          fontWeight: 'bold',
          selected: false
        },
        {
          id: 'anno-subtitle',
          text: 'WebSocket chat backend with presence, push notifications, async delivery, and message search',
          x: 520,
          y: -52,
          width: 760,
          height: 40,
          fontSize: 14,
          fontWeight: 'normal',
          selected: false
        }
      ],
      currency: 'USD',
      updatedAt: new Date().toISOString()
    };
  }
}
