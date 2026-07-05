import { describe, it, expect } from 'vitest';
import { connectionMidpoint, edgePath, packetPoint, portPoint } from './graph-geometry';
import { makeConn, makeNode } from '../testing/fixtures';
import { DataPacket } from '../models/architecture.model';

const nodeAt = (id: string, x: number, y: number) => ({ ...makeNode(id, 'ec2'), x, y });

describe('portPoint', () => {
  it('places the output port on the right edge and the input on the left', () => {
    const node = nodeAt('a', 100, 200);
    expect(portPoint(node, 'input')).toEqual({ x: 100, y: 262 });
    expect(portPoint(node, 'output')).toEqual({ x: 284, y: 262 });
  });
});

describe('edgePath', () => {
  it('returns a cubic bezier between the two ports', () => {
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 400, 0)];
    const path = edgePath(makeConn('a', 'b'), nodes);
    expect(path.startsWith('M 184 62 C')).toBe(true);
  });

  it('returns empty string when an endpoint node is missing', () => {
    expect(edgePath(makeConn('a', 'ghost'), [nodeAt('a', 0, 0)])).toBe('');
  });
});

describe('connectionMidpoint', () => {
  it('is the average of the two port points', () => {
    const nodes = [nodeAt('a', 0, 0), nodeAt('b', 400, 100)];
    // start = (184, 62), end = (400, 162) → midpoint (292, 112)
    expect(connectionMidpoint(makeConn('a', 'b'), nodes)).toEqual({ x: 292, y: 112 });
  });

  it('falls back to the origin when nodes are missing', () => {
    expect(connectionMidpoint(makeConn('a', 'b'), [])).toEqual({ x: 0, y: 0 });
  });
});

describe('packetPoint', () => {
  const nodes = [nodeAt('a', 0, 0), nodeAt('b', 400, 0)];
  const conn = makeConn('a', 'b');
  const packet = (progress: number): DataPacket => ({
    id: 'p',
    connectionId: conn.id,
    progress,
    status: 'normal',
  });

  it('interpolates along the connection by progress', () => {
    // start (184, 62) → end (400, 62); halfway x = 292
    expect(packetPoint(packet(0), [conn], nodes)).toEqual({ x: 184, y: 62 });
    expect(packetPoint(packet(0.5), [conn], nodes)).toEqual({ x: 292, y: 62 });
    expect(packetPoint(packet(1), [conn], nodes)).toEqual({ x: 400, y: 62 });
  });

  it('returns the origin when the connection is unknown', () => {
    expect(packetPoint(packet(0.5), [], nodes)).toEqual({ x: 0, y: 0 });
  });
});
