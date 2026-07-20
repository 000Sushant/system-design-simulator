import { describe, it, expect } from 'vitest';
import { evaluateNodeHealth } from './node-health';
import { makeConn, makeDefinition, makeNode } from '../testing/fixtures';

describe('evaluateNodeHealth', () => {
  it('flags an ELB configured with fewer than 1 instance as a blocking error', () => {
    const node = makeNode('lb', 'elb', { config: { count: 0 } });
    const health = evaluateNodeHealth(node, [makeConn('x', 'lb')], makeDefinition('elb'));
    expect(health.tone).toBe('error');
    expect(health.blocksRun).toBe(true);
  });

  it('requires a mandatory input connection', () => {
    const node = makeNode('n', 'rds');
    const def = makeDefinition('rds', { mandatoryInput: true });
    const health = evaluateNodeHealth(node, [makeConn('n', 'other')], def);
    expect(health.tone).toBe('error');
    expect(health.blocksRun).toBe(true);
    expect(health.short).toBe('Integration required');
  });

  it('requires a mandatory output connection', () => {
    const node = makeNode('n', 'apiGateway');
    const def = makeDefinition('apiGateway', { mandatoryOutput: true });
    const health = evaluateNodeHealth(node, [makeConn('client', 'n')], def);
    expect(health.tone).toBe('error');
    expect(health.blocksRun).toBe(true);
  });

  it('warns when a node is on the canvas but unconnected', () => {
    const node = makeNode('n', 'iam');
    const health = evaluateNodeHealth(node, [], makeDefinition('iam'));
    expect(health.tone).toBe('warning');
    expect(health.short).toBe('Not connected');
  });

  it('rejects fan-in / fan-out when the service forbids it', () => {
    const node = makeNode('n', 'ec2');
    const fanIn = evaluateNodeHealth(
      node,
      [makeConn('a', 'n'), makeConn('b', 'n'), makeConn('n', 'out')],
      makeDefinition('ec2', { allowFanIn: false }),
    );
    expect(fanIn.tone).toBe('error');
    expect(fanIn.blocksRun).toBe(true);

    const fanOut = evaluateNodeHealth(
      node,
      [makeConn('in', 'n'), makeConn('n', 'a'), makeConn('n', 'b')],
      makeDefinition('ec2', { allowFanOut: false }),
    );
    expect(fanOut.tone).toBe('error');
  });

  it('maps runtime statuses to non-blocking errors/warnings', () => {
    const conns = [makeConn('in', 'n'), makeConn('n', 'out')];
    const def = makeDefinition('ec2');
    for (const status of ['offline', 'failing', 'overloaded'] as const) {
      const health = evaluateNodeHealth(makeNode('n', 'ec2', { status }), conns, def);
      expect(health.tone).toBe('error');
      expect(health.blocksRun).toBeUndefined();
    }
    const busy = evaluateNodeHealth(makeNode('n', 'ec2', { status: 'busy' }), conns, def);
    expect(busy.tone).toBe('warning');
  });

  it('reports success for a correctly connected, healthy node', () => {
    const node = makeNode('n', 'ec2');
    const health = evaluateNodeHealth(node, [makeConn('in', 'n'), makeConn('n', 'out')], makeDefinition('ec2'));
    expect(health.tone).toBe('success');
    expect(health.blocksRun).toBeUndefined();
  });
});
