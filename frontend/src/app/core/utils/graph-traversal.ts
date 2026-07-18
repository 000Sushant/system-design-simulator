import { ArchitectureConnection } from '../models/architecture.model';

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
