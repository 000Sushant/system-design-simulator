import {
  ArchitectureConnection,
  ArchitectureNode,
  DataPacket,
  PortDirection,
} from '../models/architecture.model';

export interface Point {
  x: number;
  y: number;
}

// Node-box geometry the canvas renders against.
const OUTPUT_PORT_X_OFFSET = 184; // node width — output ports sit on the right edge
const PORT_Y_OFFSET = 62; // vertical center of the port row
const MIN_EDGE_CURVE = 80; // minimum bezier control distance
const EDGE_CURVE_RATIO = 0.45; // control distance as a fraction of the horizontal span

const ORIGIN: Point = { x: 0, y: 0 };

/** Screen position of a node's input (left) or output (right) port. */
export function portPoint(node: ArchitectureNode, direction: PortDirection): Point {
  return {
    x: node.x + (direction === 'input' ? 0 : OUTPUT_PORT_X_OFFSET),
    y: node.y + PORT_Y_OFFSET,
  };
}

/** SVG path for a connection's curved edge; empty when an endpoint is missing. */
export function edgePath(connection: ArchitectureConnection, nodes: ArchitectureNode[]): string {
  const ends = endpoints(connection, nodes);
  if (!ends) return '';
  const { start, end } = ends;
  const curve = Math.max(MIN_EDGE_CURVE, Math.abs(end.x - start.x) * EDGE_CURVE_RATIO);
  return `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
}

/** Midpoint of a connection's straight axis (used to anchor labels). */
export function connectionMidpoint(
  connection: ArchitectureConnection,
  nodes: ArchitectureNode[],
): Point {
  return pointAlong(connection, nodes, 0.5);
}

/** Position of an in-flight packet along its connection (progress 0..1). */
export function packetPoint(
  packet: DataPacket,
  connections: ArchitectureConnection[],
  nodes: ArchitectureNode[],
): Point {
  const connection = connections.find((c) => c.id === packet.connectionId);
  if (!connection) return { ...ORIGIN };
  return pointAlong(connection, nodes, packet.progress);
}

function endpoints(
  connection: ArchitectureConnection,
  nodes: ArchitectureNode[],
): { start: Point; end: Point } | null {
  const source = nodes.find((n) => n.id === connection.sourceNodeId);
  const target = nodes.find((n) => n.id === connection.targetNodeId);
  if (!source || !target) return null;
  return { start: portPoint(source, 'output'), end: portPoint(target, 'input') };
}

/** Linear interpolation between a connection's endpoints at fraction `t`. */
function pointAlong(connection: ArchitectureConnection, nodes: ArchitectureNode[], t: number): Point {
  const ends = endpoints(connection, nodes);
  if (!ends) return { ...ORIGIN };
  const { start, end } = ends;
  return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
}
