import { describe, it, expect } from 'vitest';
import { cloneGraph, selectSubgraph } from './graph-clone';
import { makeConn, makeNode } from '../testing/fixtures';
import { ServiceMetrics } from '../models/architecture.model';

const emptyMetrics = (): ServiceMetrics => ({
  processed: 0,
  received: 0,
  dropped: 0,
  retried: 0,
  queueSize: 0,
  avgLatency: 0,
  cpuPressure: 0,
  memoryPressure: 0,
  errorRate: 0,
  throughput: 0,
});

/** Deterministic id generator for assertions. */
function sequentialIds(): () => string {
  let n = 0;
  return () => `new-${++n}`;
}

describe('cloneGraph', () => {
  it('assigns fresh ids and shifts positions by (dx, dy)', () => {
    const a = { ...makeNode('a', 'ec2'), x: 10, y: 20 };
    const { nodes } = cloneGraph([a], [], 5, 7, {
      emptyMetrics,
      generateId: sequentialIds(),
    });
    expect(nodes[0].id).toBe('new-1');
    expect(nodes[0].id).not.toBe('a');
    expect(nodes[0].x).toBe(15);
    expect(nodes[0].y).toBe(27);
  });

  it('remaps internal connections and drops ones pointing outside the set', () => {
    const a = makeNode('a', 'client');
    const b = makeNode('b', 'ec2');
    const internal = makeConn('a', 'b');
    const external = makeConn('a', 'outsider');

    const { nodes, connections } = cloneGraph([a, b], [internal, external], 0, 0, {
      emptyMetrics,
      generateId: sequentialIds(),
    });

    expect(connections).toHaveLength(1);
    expect(connections[0].sourceNodeId).toBe(nodes[0].id);
    expect(connections[0].targetNodeId).toBe(nodes[1].id);
  });

  it('resets runtime state on clones (status, metrics, selection, traffic)', () => {
    const node = makeNode('a', 'ec2', { status: 'overloaded' });
    node.selected = true;
    const conn = { ...makeConn('a', 'a'), traffic: { requestsPerSecond: 99, latency: 5, errorRate: 2, intensity: 1 } };

    const { nodes, connections } = cloneGraph([node], [conn], 0, 0, { emptyMetrics });

    expect(nodes[0].status).toBe('normal');
    expect(nodes[0].selected).toBe(false);
    expect(nodes[0].metrics).toEqual(emptyMetrics());
    expect(connections[0].traffic).toEqual({ requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 });
  });

  it('deep-clones config so mutating a clone does not affect the source', () => {
    const source = makeNode('a', 'ec2', { config: { cpu: 50 } });
    const { nodes } = cloneGraph([source], [], 0, 0, { emptyMetrics });
    nodes[0].config['cpu'] = 999;
    expect(source.config['cpu']).toBe(50);
  });
});

describe('selectSubgraph', () => {
  it('keeps only selected nodes, preserving source order', () => {
    const a = makeNode('a', 'client');
    const b = makeNode('b', 'ec2');
    const c = makeNode('c', 'rds');
    const { nodes } = selectSubgraph([a, b, c], [], ['c', 'a']);
    expect(nodes.map((n) => n.id)).toEqual(['a', 'c']);
  });

  it('keeps only connections whose both endpoints are selected', () => {
    const a = makeNode('a', 'client');
    const b = makeNode('b', 'ec2');
    const c = makeNode('c', 'rds');
    const internal = makeConn('a', 'b');
    const dangling = makeConn('b', 'c');
    const { connections } = selectSubgraph([a, b, c], [internal, dangling], ['a', 'b']);
    expect(connections).toHaveLength(1);
    expect(connections[0]).toBe(internal);
  });

  it('returns original references (no cloning)', () => {
    const a = makeNode('a', 'ec2');
    const { nodes } = selectSubgraph([a], [], ['a']);
    expect(nodes[0]).toBe(a);
  });

  it('returns empty subgraph when nothing is selected', () => {
    const a = makeNode('a', 'ec2');
    const { nodes, connections } = selectSubgraph([a], [makeConn('a', 'a')], []);
    expect(nodes).toHaveLength(0);
    expect(connections).toHaveLength(0);
  });

  it('ignores selected ids that match no node', () => {
    const a = makeNode('a', 'ec2');
    const { nodes } = selectSubgraph([a], [], ['a', 'ghost']);
    expect(nodes.map((n) => n.id)).toEqual(['a']);
  });
});
