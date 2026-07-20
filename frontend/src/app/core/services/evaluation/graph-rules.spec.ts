import { describe, it, expect } from 'vitest';
import { evaluateRule, reachableFromClient } from './graph-rules';
import { GraphContext } from '../../models/challenge.model';
import { makeConn, makeNode } from '../../testing/fixtures';

function graph(
  nodes: GraphContext['nodes'],
  connections: GraphContext['connections'] = [],
): GraphContext {
  return { nodes, connections };
}

describe('reachableFromClient', () => {
  it('follows allowed edges forward from client nodes', () => {
    const ctx = graph(
      [
        makeNode('c', 'client'),
        makeNode('e', 'ec2'),
        makeNode('d', 'rds'),
        makeNode('orphan', 's3'),
      ],
      [makeConn('c', 'e'), makeConn('e', 'd')],
    );
    const reachable = reachableFromClient(ctx);
    expect([...reachable].sort()).toEqual(['c', 'd', 'e']);
    expect(reachable.has('orphan')).toBe(false);
  });

  it('ignores disallowed edges', () => {
    const ctx = graph(
      [makeNode('c', 'client'), makeNode('e', 'ec2')],
      [makeConn('c', 'e', { allowed: false })],
    );
    expect(reachableFromClient(ctx).has('e')).toBe(false);
  });

  it('returns empty when there is no client', () => {
    const ctx = graph([makeNode('e', 'ec2')], []);
    expect(reachableFromClient(ctx).size).toBe(0);
  });
});

describe('evaluateRule', () => {
  const ctx = graph(
    [
      makeNode('c', 'client'),
      makeNode('e', 'ec2'),
      makeNode('d', 'rds', { config: { replication: 2 } }),
      makeNode('orphan', 's3'),
    ],
    [makeConn('c', 'e'), makeConn('e', 'd')],
  );
  const reachable = reachableFromClient(ctx);

  it('hasService: matches by type and min count', () => {
    expect(evaluateRule({ kind: 'hasService', anyOf: ['ec2'] }, ctx, reachable)).toBe(true);
    expect(evaluateRule({ kind: 'hasService', anyOf: ['lambda'] }, ctx, reachable)).toBe(false);
    expect(evaluateRule({ kind: 'hasService', anyOf: ['ec2'], min: 2 }, ctx, reachable)).toBe(false);
  });

  it('hasService: mustBeConnected requires reachability from a client', () => {
    expect(
      evaluateRule({ kind: 'hasService', anyOf: ['s3'], mustBeConnected: true }, ctx, reachable),
    ).toBe(false);
    expect(
      evaluateRule({ kind: 'hasService', anyOf: ['rds'], mustBeConnected: true }, ctx, reachable),
    ).toBe(true);
  });

  it('hasEdge: requires a real allowed edge between the given types', () => {
    expect(evaluateRule({ kind: 'hasEdge', fromAnyOf: ['ec2'], toAnyOf: ['rds'] }, ctx, reachable)).toBe(true);
    expect(evaluateRule({ kind: 'hasEdge', fromAnyOf: ['rds'], toAnyOf: ['ec2'] }, ctx, reachable)).toBe(false);
  });

  it('configAtLeast: checks a numeric config threshold', () => {
    expect(evaluateRule({ kind: 'configAtLeast', anyOf: ['rds'], key: 'replication', value: 2 }, ctx, reachable)).toBe(true);
    expect(evaluateRule({ kind: 'configAtLeast', anyOf: ['rds'], key: 'replication', value: 3 }, ctx, reachable)).toBe(false);
  });

  it('countAtLeast: counts nodes across the listed types', () => {
    expect(evaluateRule({ kind: 'countAtLeast', anyOf: ['ec2', 'rds'], min: 2 }, ctx, reachable)).toBe(true);
    expect(evaluateRule({ kind: 'countAtLeast', anyOf: ['ec2', 'rds'], min: 3 }, ctx, reachable)).toBe(false);
  });

  it('noOverload: false on empty canvas, true when all healthy, false on any unhealthy', () => {
    expect(evaluateRule({ kind: 'noOverload' }, graph([]), new Set())).toBe(false);
    expect(evaluateRule({ kind: 'noOverload' }, ctx, reachable)).toBe(true);
    const stressed = graph([makeNode('e', 'ec2', { status: 'overloaded' })]);
    expect(evaluateRule({ kind: 'noOverload' }, stressed, new Set())).toBe(false);
  });

  it('allOf: requires every sub-rule to pass', () => {
    const pass = evaluateRule(
      { kind: 'allOf', rules: [
        { kind: 'hasService', anyOf: ['ec2'] },
        { kind: 'hasService', anyOf: ['rds'] },
      ] },
      ctx,
      reachable,
    );
    const fail = evaluateRule(
      { kind: 'allOf', rules: [
        { kind: 'hasService', anyOf: ['ec2'] },
        { kind: 'hasService', anyOf: ['lambda'] },
      ] },
      ctx,
      reachable,
    );
    expect(pass).toBe(true);
    expect(fail).toBe(false);
  });
});
