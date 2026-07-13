/**
 * Vitest stand-in for the `cloudflare:workers` runtime module, which only
 * exists inside workerd. The specs run in Node and never instantiate the
 * workflow, so an empty base class is enough to make `index.ts` importable.
 */
export class WorkflowEntrypoint<E = unknown, P = unknown> {
  constructor(protected ctx: unknown, protected env: E) {}
}

export type WorkflowStep = unknown;
export type WorkflowEvent<P> = { payload: P; timestamp: Date };
