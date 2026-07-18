import { describe, it, expect, beforeEach } from 'vitest';
import { GraphBuilderService } from './graph-builder.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ValidationRuleService } from './validation-rule.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ReferenceNode } from '../models/challenge.model';

describe('GraphBuilderService', () => {
  let builder: GraphBuilderService;

  beforeEach(() => {
    const factory = new ArchitectureFactoryService(new AwsCatalogService());
    builder = new GraphBuilderService(factory, new ValidationRuleService());
  });

  const layout: ReferenceNode[] = [
    { key: 'user', type: 'client', x: 0, y: 0, name: 'End Users' },
    { key: 'api', type: 'apiGateway', x: 200, y: 0, config: { requestRate: 999 } },
  ];

  it('creates one node per layout entry, in order, keyed by its layout key', () => {
    const { nodes, nodeByKey } = builder.build(layout, []);
    expect(nodes).toHaveLength(2);
    expect(nodes[0].type).toBe('client');
    expect(nodes[1].type).toBe('apiGateway');
    expect(nodeByKey.get('user')).toBe(nodes[0]);
    expect(nodeByKey.get('api')).toBe(nodes[1]);
  });

  it('applies name and config overrides from the layout', () => {
    const { nodeByKey } = builder.build(layout, []);
    expect(nodeByKey.get('user')!.name).toBe('End Users');
    expect(nodeByKey.get('api')!.config['requestRate']).toBe(999);
  });

  it('resolves a rule-valid edge into a connection between the two nodes', () => {
    const { nodes, connections } = builder.build(layout, [['user', 'api']]);
    expect(connections).toHaveLength(1);
    expect(connections[0].sourceNodeId).toBe(nodes[0].id);
    expect(connections[0].targetNodeId).toBe(nodes[1].id);
  });

  it('throws when an edge references an unknown node key', () => {
    expect(() => builder.build(layout, [['user', 'ghost']])).toThrow(/unknown node key/i);
  });

  it('throws when an edge has no valid connection rule', () => {
    expect(() => builder.build(layout, [['api', 'user']])).toThrow(/no valid connection rule/i);
  });
});
