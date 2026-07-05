import { describe, it, expect, beforeEach } from 'vitest';
import { ValidationRuleService } from './validation-rule.service';
import { ConnectionRule, PortType, ServicePort } from '../models/architecture.model';
import { makeConn, makeNode } from '../testing/fixtures';

function port(id: string, direction: 'input' | 'output', type: PortType): ServicePort {
  return { id, label: id, direction, type };
}

/** Overrides the config-derived rules with a controlled set for deterministic branch coverage. */
function setRules(service: ValidationRuleService, rules: ConnectionRule[]): void {
  (service as unknown as { rules: ConnectionRule[] }).rules = rules;
}

const EC2_TO_RDS: ConnectionRule = {
  id: 'ec2-rds-0',
  source: 'ec2',
  target: 'rds',
  sourcePortTypes: ['database'],
  targetPortTypes: ['database'],
  connectionType: 'database',
  description: 'App server reads and writes the database.',
};

describe('ValidationRuleService', () => {
  let service: ValidationRuleService;
  const out = port('out', 'output', 'database');
  const inp = port('in', 'input', 'database');

  beforeEach(() => {
    service = new ValidationRuleService();
  });

  describe('rule loading', () => {
    it('derives a non-empty rule set from the services config', () => {
      expect(service.rules.length).toBeGreaterThan(0);
    });

    it('gives each derived rule an id that encodes source, target and index', () => {
      for (const rule of service.rules) {
        expect(rule.id).toBe(`${rule.source}-${rule.target}-${rule.id.split('-').pop()}`);
        expect(Array.isArray(rule.sourcePortTypes)).toBe(true);
        expect(Array.isArray(rule.targetPortTypes)).toBe(true);
      }
    });
  });

  describe('validate', () => {
    it('rejects everything while rules are still empty (loading)', () => {
      setRules(service, []);
      const result = service.validate(makeNode('a', 'ec2'), out, makeNode('b', 'rds'), inp, []);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/loading/i);
    });

    it('rejects a service connecting to itself (same node id)', () => {
      setRules(service, [EC2_TO_RDS]);
      const node = makeNode('same', 'ec2');
      const result = service.validate(node, out, makeNode('same', 'ec2'), inp, []);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/itself/i);
    });

    it('rejects connections not going output → input', () => {
      setRules(service, [EC2_TO_RDS]);
      const badSource = port('out', 'input', 'database');
      const result = service.validate(makeNode('a', 'ec2'), badSource, makeNode('b', 'rds'), inp, []);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/output port/i);
    });

    it('rejects a VPC connecting to a non network-aware target', () => {
      setRules(service, [EC2_TO_RDS]);
      const result = service.validate(makeNode('v', 'vpc'), out, makeNode('s', 's3'), inp, []);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/network boundary/i);
    });

    it('rejects a duplicate of an existing connection', () => {
      setRules(service, [EC2_TO_RDS]);
      const existing = makeConn('a', 'b'); // sourcePortId 'out', targetPortId 'in'
      const result = service.validate(makeNode('a', 'ec2'), out, makeNode('b', 'rds'), inp, [existing]);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/already exists/i);
    });

    it('rejects a pairing that matches no rule', () => {
      setRules(service, [EC2_TO_RDS]);
      // reverse direction: no rds → ec2 rule exists
      const result = service.validate(makeNode('a', 'rds'), out, makeNode('b', 'ec2'), inp, []);
      expect(result.allowed).toBe(false);
      expect(result.message).toMatch(/cannot connect/i);
    });

    it('rejects when node types match but the port types do not', () => {
      setRules(service, [EC2_TO_RDS]);
      const httpOut = port('out', 'output', 'http');
      const result = service.validate(makeNode('a', 'ec2'), httpOut, makeNode('b', 'rds'), inp, []);
      expect(result.allowed).toBe(false);
    });

    it('allows a pairing that matches a rule and returns its id and description', () => {
      setRules(service, [EC2_TO_RDS]);
      const result = service.validate(makeNode('a', 'ec2'), out, makeNode('b', 'rds'), inp, []);
      expect(result.allowed).toBe(true);
      expect(result.ruleId).toBe('ec2-rds-0');
      expect(result.message).toBe(EC2_TO_RDS.description);
    });

    it('matches wildcard source/target rules', () => {
      setRules(service, [{ ...EC2_TO_RDS, id: 'wild', source: '*', target: '*' }]);
      const result = service.validate(makeNode('a', 'lambda'), out, makeNode('b', 's3'), inp, []);
      expect(result.allowed).toBe(true);
      expect(result.ruleId).toBe('wild');
    });
  });

  describe('connectionTypeFor', () => {
    it('returns the matched rule connection type', () => {
      setRules(service, [EC2_TO_RDS]);
      expect(service.connectionTypeFor('ec2-rds-0', 'http')).toBe('database');
    });

    it('falls back when the rule id is unknown or undefined', () => {
      setRules(service, [EC2_TO_RDS]);
      expect(service.connectionTypeFor('missing', 'http')).toBe('http');
      expect(service.connectionTypeFor(undefined, 'network')).toBe('network');
    });
  });
});
