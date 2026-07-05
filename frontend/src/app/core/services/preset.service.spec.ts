import { describe, it, expect, beforeEach } from 'vitest';
import { PresetService } from './preset.service';
import { GraphBuilderService } from './graph-builder.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ValidationRuleService } from './validation-rule.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureProject } from '../models/architecture.model';

/**
 * The presets are shipped sample architectures assembled by GraphBuilderService
 * against the real connection rules. Building them here is a live guarantee that
 * every preset edge stays rule-valid — a rules/config change that breaks a
 * preset fails this suite instead of erroring in the user's browser.
 */
describe('PresetService', () => {
  let service: PresetService;

  beforeEach(() => {
    const factory = new ArchitectureFactoryService(new AwsCatalogService());
    const builder = new GraphBuilderService(factory, new ValidationRuleService());
    service = new PresetService(builder);
  });

  /** No connection may reference a node id that isn't in the graph. */
  function expectNoDanglingConnections(project: ArchitectureProject): void {
    const nodeIds = new Set(project.nodes.map((n) => n.id));
    for (const conn of project.connections) {
      expect(nodeIds.has(conn.sourceNodeId)).toBe(true);
      expect(nodeIds.has(conn.targetNodeId)).toBe(true);
    }
  }

  describe('messagingPreset', () => {
    it('builds every edge without throwing (all edges are rule-valid)', () => {
      expect(() => service.messagingPreset()).not.toThrow();
    });

    it('produces the expected identity, node/connection counts and annotations', () => {
      const project = service.messagingPreset();
      expect(project.id).toBe('preset-messaging-realtime');
      expect(project.name).toBe('Real-Time Messaging App');
      expect(project.nodes).toHaveLength(17);
      expect(project.connections).toHaveLength(24);
      expect(project.annotations?.length).toBe(2);
      expectNoDanglingConnections(project);
    });
  });

  describe('ecommercePreset', () => {
    it('builds every edge without throwing (all edges are rule-valid)', () => {
      expect(() => service.ecommercePreset()).not.toThrow();
    });

    it('produces the expected identity, node/connection counts and annotations', () => {
      const project = service.ecommercePreset();
      expect(project.id).toBe('preset-ecommerce-serverless');
      expect(project.name).toBe('Serverless Ecommerce');
      expect(project.nodes).toHaveLength(8);
      expect(project.connections).toHaveLength(7);
      expect(project.annotations?.length).toBe(1);
      expectNoDanglingConnections(project);
    });
  });
});
