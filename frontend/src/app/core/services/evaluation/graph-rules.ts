import { GraphContext, GraphRule } from '../../models/challenge.model';
import { AwsServiceType } from '../../models/architecture.model';

/** Node statuses that mean a node is not coping with its load. */
const UNHEALTHY_STATUSES = new Set(['overloaded', 'failing', 'offline']);

/**
 * Node ids reachable forward from any client node, following connection
 * direction. Used so a required service only "counts" when it is actually
 * wired into the request path — not just dropped on the canvas.
 */
export function reachableFromClient(ctx: GraphContext): Set<string> {
  const adjacency = new Map<string, string[]>();
  for (const conn of ctx.connections) {
    if (!conn.allowed) continue;
    const list = adjacency.get(conn.sourceNodeId) ?? [];
    list.push(conn.targetNodeId);
    adjacency.set(conn.sourceNodeId, list);
  }

  const reachable = new Set<string>();
  const queue = ctx.nodes.filter((n) => n.type === 'client').map((n) => n.id);
  for (const id of queue) reachable.add(id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (!reachable.has(next)) {
        reachable.add(next);
        queue.push(next);
      }
    }
  }
  return reachable;
}

function nodesOfTypes(ctx: GraphContext, types: AwsServiceType[]) {
  const set = new Set(types);
  return ctx.nodes.filter((n) => set.has(n.type));
}

/**
 * Evaluates a single declarative rule against the architecture. Pure and
 * deterministic. `reachable` is precomputed once per evaluation pass.
 */
export function evaluateRule(rule: GraphRule, ctx: GraphContext, reachable: Set<string>): boolean {
  switch (rule.kind) {
    case 'hasService': {
      let matches = nodesOfTypes(ctx, rule.anyOf);
      if (rule.mustBeConnected) {
        matches = matches.filter((n) => reachable.has(n.id));
      }
      return matches.length >= (rule.min ?? 1);
    }
    case 'hasEdge': {
      const from = new Set(rule.fromAnyOf);
      const to = new Set(rule.toAnyOf);
      const byId = new Map(ctx.nodes.map((n) => [n.id, n] as const));
      return ctx.connections.some((conn) => {
        if (!conn.allowed) return false;
        const source = byId.get(conn.sourceNodeId);
        const target = byId.get(conn.targetNodeId);
        return !!source && !!target && from.has(source.type) && to.has(target.type);
      });
    }
    case 'configAtLeast': {
      return nodesOfTypes(ctx, rule.anyOf).some((n) => {
        const value = (n.config as Record<string, unknown>)[rule.key];
        return typeof value === 'number' && value >= rule.value;
      });
    }
    case 'countAtLeast': {
      return nodesOfTypes(ctx, rule.anyOf).length >= rule.min;
    }
    case 'noOverload': {
      // Only meaningful once at least one node exists; an empty canvas is not "healthy".
      return ctx.nodes.length > 0 && !ctx.nodes.some((n) => UNHEALTHY_STATUSES.has(n.status));
    }
    case 'allOf': {
      return rule.rules.every((sub) => evaluateRule(sub, ctx, reachable));
    }
    default: {
      // Exhaustiveness guard — a new rule kind must be handled above.
      const _never: never = rule;
      return _never;
    }
  }
}
