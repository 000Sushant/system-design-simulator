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

const OUTPUT_PORT_X_OFFSET = 184;
const PORT_Y_OFFSET = 62;
const MIN_EDGE_CURVE = 80;
const EDGE_CURVE_RATIO = 0.45;

const ORIGIN: Point = { x: 0, y: 0 };

export function portPoint(node: ArchitectureNode, direction: PortDirection): Point {
  return {
    x: node.x + (direction === 'input' ? 0 : OUTPUT_PORT_X_OFFSET),
    y: node.y + PORT_Y_OFFSET,
  };
}

export function edgePath(connection: ArchitectureConnection, nodes: ArchitectureNode[]): string {
  const ends = endpoints(connection, nodes);
  if (!ends) return '';
  const { start, end } = ends;
  const curve = Math.max(MIN_EDGE_CURVE, Math.abs(end.x - start.x) * EDGE_CURVE_RATIO);
  return `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
}

export function connectionMidpoint(
  connection: ArchitectureConnection,
  nodes: ArchitectureNode[],
): Point {
  return pointAlong(connection, nodes, 0.5);
}

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

function pointAlong(connection: ArchitectureConnection, nodes: ArchitectureNode[], t: number): Point {
  const ends = endpoints(connection, nodes);
  if (!ends) return { ...ORIGIN };
  const { start, end } = ends;
  return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
}
