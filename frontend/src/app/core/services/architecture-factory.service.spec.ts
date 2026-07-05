import { describe, it, expect, beforeEach } from 'vitest';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { AwsCatalogService } from './aws-catalog.service';

describe('ArchitectureFactoryService', () => {
  let factory: ArchitectureFactoryService;

  beforeEach(() => {
    factory = new ArchitectureFactoryService(new AwsCatalogService());
  });

  describe('createNode', () => {
    it('sets type, position, name and a normal/zeroed initial state', () => {
      const node = factory.createNode('ec2', 120, 80);
      expect(node.type).toBe('ec2');
      expect(node.x).toBe(120);
      expect(node.y).toBe(80);
      expect(node.name).toBeTruthy();
      expect(node.status).toBe('normal');
      expect(node.metrics.processed).toBe(0);
      expect(node.metrics.throughput).toBe(0);
    });

    it('assigns a fresh id to every node', () => {
      const a = factory.createNode('ec2', 0, 0);
      const b = factory.createNode('ec2', 0, 0);
      expect(a.id).not.toBe(b.id);
    });

    it('gives each node an independent config copy (no shared reference)', () => {
      const a = factory.createNode('ec2', 0, 0);
      a.config['cpu'] = 999;
      const b = factory.createNode('ec2', 0, 0);
      expect(b.config['cpu']).not.toBe(999);
    });

    it('gives each node an independent metrics copy', () => {
      const a = factory.createNode('ec2', 0, 0);
      a.metrics.processed = 500;
      const b = factory.createNode('ec2', 0, 0);
      expect(b.metrics.processed).toBe(0);
    });

    it('copies port definitions so mutating one node does not affect the catalog', () => {
      const a = factory.createNode('ec2', 0, 0);
      if (a.ports.length > 0) {
        a.ports[0].id = 'mutated';
        const b = factory.createNode('ec2', 0, 0);
        expect(b.ports[0].id).not.toBe('mutated');
      }
    });
  });

  describe('createConnection', () => {
    it('wires the given endpoints with zeroed traffic and allowed=true', () => {
      const conn = factory.createConnection('s', 'sp', 't', 'tp', 'http', 'my label');
      expect(conn.sourceNodeId).toBe('s');
      expect(conn.sourcePortId).toBe('sp');
      expect(conn.targetNodeId).toBe('t');
      expect(conn.targetPortId).toBe('tp');
      expect(conn.type).toBe('http');
      expect(conn.label).toBe('my label');
      expect(conn.allowed).toBe(true);
      expect(conn.traffic).toEqual({ requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 });
    });

    it('defaults the label to empty and assigns a fresh id', () => {
      const a = factory.createConnection('s', 'sp', 't', 'tp', 'http');
      const b = factory.createConnection('s', 'sp', 't', 'tp', 'http');
      expect(a.label).toBe('');
      expect(a.id).not.toBe(b.id);
      expect(a.animationOffset).toBeGreaterThanOrEqual(0);
      expect(a.animationOffset).toBeLessThan(1);
    });
  });

  describe('emptyMetrics', () => {
    it('returns an all-zero metrics object', () => {
      const m = factory.emptyMetrics();
      expect(Object.values(m).every((v) => v === 0)).toBe(true);
    });

    it('returns a fresh object each call (no shared reference)', () => {
      const a = factory.emptyMetrics();
      a.processed = 42;
      expect(factory.emptyMetrics().processed).toBe(0);
    });
  });
});
