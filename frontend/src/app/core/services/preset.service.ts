import { Injectable } from '@angular/core';
import { ArchitectureProject, AwsServiceType } from '../models/architecture.model';
import { ReferenceNode } from '../models/challenge.model';
import { GraphBuilderService } from './graph-builder.service';

@Injectable({ providedIn: 'root' })
export class PresetService {
  constructor(private readonly graphBuilder: GraphBuilderService) {}

  private toLayout(rows: Array<[string, AwsServiceType, string, number, number]>): ReferenceNode[] {
    return rows.map(([key, type, name, x, y]) => ({ key, type, name, x, y }));
  }

  messagingPreset(): ArchitectureProject {
    const layout = this.toLayout([
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
      ['monitoring', 'cloudWatch', 'Monitoring', 800, 720],
    ]);
    const edges: Array<[string, string]> = [
      // Edge & authentication
      ['users', 'dns'], ['users', 'auth'], ['dns', 'cdn'], ['dns', 'wsApi'], ['cdn', 'storage'],
      // WebSocket connection lifecycle ($connect / $disconnect, presence)
      ['auth', 'connFn'], ['wsApi', 'connFn'], ['connFn', 'presence'], ['connFn', 'messages'], ['connFn', 'monitoring'],
      // Message send path (persist, look up presence, fan-out, stream)
      ['wsApi', 'msgFn'], ['msgFn', 'messages'], ['msgFn', 'presence'], ['msgFn', 'storage'],
      ['msgFn', 'push'], ['msgFn', 'stream'], ['msgFn', 'monitoring'],
      // Asynchronous fan-out & delivery workers
      ['push', 'deliveryQueue'], ['deliveryQueue', 'workers'], ['workers', 'messages'], ['workers', 'monitoring'],
      // Message stream → archive & search
      ['stream', 'archive'], ['archive', 'storage'], ['stream', 'search'],
    ];
    const { nodes, connections } = this.graphBuilder.build(layout, edges);

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

  ecommercePreset(): ArchitectureProject {
    const layout: ReferenceNode[] = [
      { key: 'client', type: 'client', x: 80, y: 160 },
      { key: 'route53', type: 'route53', x: 280, y: 110 },
      { key: 'cloudfront', type: 'cloudfront', x: 480, y: 150 },
      { key: 'apiGateway', type: 'apiGateway', x: 700, y: 150 },
      { key: 'lambda', type: 'lambda', x: 910, y: 95 },
      { key: 'dynamoDb', type: 'dynamoDb', x: 1130, y: 95 },
      { key: 's3', type: 's3', x: 1130, y: 250 },
      { key: 'cloudWatch', type: 'cloudWatch', x: 1130, y: -50 },
    ];
    const edges: Array<[string, string]> = [
      ['client', 'route53'],
      ['route53', 'cloudfront'],
      ['cloudfront', 'apiGateway'],
      ['apiGateway', 'lambda'],
      ['lambda', 'dynamoDb'],
      ['lambda', 's3'],
      ['lambda', 'cloudWatch'],
    ];
    const { nodes, connections } = this.graphBuilder.build(layout, edges);

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
