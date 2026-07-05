import {
  ArchitectureConnection,
  ArchitectureNode,
  ServiceMetrics,
} from '../models/architecture.model';

/** Collision-resistant id: native UUID when available, timestamp+random otherwise. */
export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 11);
}

/**
 * Selects the sub-graph formed by `selectedIds`: the matching nodes plus only
 * the connections whose *both* endpoints are in the selection. Returns the
 * original node/connection references (no cloning) in their source order — used
 * to build copy/duplicate payloads that never dangle onto un-selected nodes.
 */
export function selectSubgraph(
  nodes: ArchitectureNode[],
  connections: ArchitectureConnection[],
  selectedIds: string[],
): { nodes: ArchitectureNode[]; connections: ArchitectureConnection[] } {
  const selection = new Set(selectedIds);
  const selectedNodes = nodes.filter((node) => selection.has(node.id));
  const ids = new Set(selectedNodes.map((node) => node.id));
  const internal = connections.filter(
    (conn) => ids.has(conn.sourceNodeId) && ids.has(conn.targetNodeId),
  );
  return { nodes: selectedNodes, connections: internal };
}

export interface CloneGraphOptions {
  /** Produces fresh, zeroed metrics for each cloned node. */
  emptyMetrics: () => ServiceMetrics;
  /** Id generator; override for deterministic tests. Defaults to {@link newId}. */
  generateId?: () => string;
}

/**
 * Deep-clones a set of nodes plus the connections wholly contained within that
 * set, assigning fresh ids and shifting positions by (dx, dy). Port ids are
 * preserved so remapped connections still resolve to the right ports. Clones
 * start in a clean runtime state: fresh metrics, `normal` status, zero traffic.
 *
 * Connections referencing a node outside `srcNodes` are dropped — a copied
 * subgraph never dangles onto nodes that weren't copied with it.
 */
export function cloneGraph(
  srcNodes: ArchitectureNode[],
  srcConnections: ArchitectureConnection[],
  dx: number,
  dy: number,
  options: CloneGraphOptions,
): { nodes: ArchitectureNode[]; connections: ArchitectureConnection[] } {
  const generateId = options.generateId ?? newId;
  const idMap = new Map<string, string>();

  const nodes = srcNodes.map((node): ArchitectureNode => {
    const id = generateId();
    idMap.set(node.id, id);
    return {
      ...node,
      id,
      x: node.x + dx,
      y: node.y + dy,
      selected: false,
      status: 'normal',
      config: { ...node.config },
      ports: node.ports.map((port) => ({ ...port })),
      metrics: options.emptyMetrics(),
    };
  });

  const connections = srcConnections
    .filter((conn) => idMap.has(conn.sourceNodeId) && idMap.has(conn.targetNodeId))
    .map((conn): ArchitectureConnection => ({
      ...conn,
      id: generateId(),
      sourceNodeId: idMap.get(conn.sourceNodeId)!,
      targetNodeId: idMap.get(conn.targetNodeId)!,
      traffic: { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 },
      animationOffset: Math.random(),
    }));

  return { nodes, connections };
}
