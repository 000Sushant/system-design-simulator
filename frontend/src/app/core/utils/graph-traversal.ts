import { ArchitectureConnection } from '../models/architecture.model';

/**
 * Node ids reachable by following connection direction forward from `sourceId`
 * (breadth-first over the connection set). The source itself is included only
 * when a cycle leads back to it.
 *
 * Does not filter on `connection.allowed`; callers that need only valid edges
 * should pre-filter. Kept separate from {@link reachableFromClient} (evaluation),
 * which is multi-source from clients, self-inclusive, and allowed-filtered.
 */
export function downstreamNodeIds(
  sourceId: string,
  connections: ArchitectureConnection[],
): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [sourceId];
  while (queue.length) {
    const id = queue.shift()!;
    for (const conn of connections) {
      if (conn.sourceNodeId === id && !visited.has(conn.targetNodeId)) {
        visited.add(conn.targetNodeId);
        queue.push(conn.targetNodeId);
      }
    }
  }
  return visited;
}
