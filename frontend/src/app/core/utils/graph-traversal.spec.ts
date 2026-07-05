import { describe, it, expect } from 'vitest';
import { downstreamNodeIds } from './graph-traversal';
import { makeConn } from '../testing/fixtures';

describe('downstreamNodeIds', () => {
  it('follows a linear chain forward', () => {
    const conns = [makeConn('a', 'b'), makeConn('b', 'c')];
    expect([...downstreamNodeIds('a', conns)]).toEqual(['b', 'c']);
    expect([...downstreamNodeIds('b', conns)]).toEqual(['c']);
  });

  it('returns an empty set for a leaf node with no outgoing edges', () => {
    const conns = [makeConn('a', 'b')];
    expect(downstreamNodeIds('b', conns).size).toBe(0);
  });

  it('collects all reachable nodes across branches', () => {
    const conns = [makeConn('a', 'b'), makeConn('a', 'c'), makeConn('b', 'd'), makeConn('c', 'd')];
    expect(downstreamNodeIds('a', conns)).toEqual(new Set(['b', 'c', 'd']));
  });

  it('follows direction only (does not walk edges backward)', () => {
    const conns = [makeConn('a', 'b'), makeConn('c', 'b')];
    // From b there are no outgoing edges, so nothing is downstream.
    expect(downstreamNodeIds('b', conns).size).toBe(0);
  });

  it('terminates on cycles and includes the source when a cycle returns to it', () => {
    const conns = [makeConn('a', 'b'), makeConn('b', 'a')];
    expect(downstreamNodeIds('a', conns)).toEqual(new Set(['a', 'b']));
  });

  it('ignores unrelated/disconnected connections', () => {
    const conns = [makeConn('a', 'b'), makeConn('x', 'y')];
    expect(downstreamNodeIds('a', conns)).toEqual(new Set(['b']));
  });
});
