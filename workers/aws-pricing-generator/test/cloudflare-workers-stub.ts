export class WorkflowEntrypoint<E = unknown, P = unknown> {
  constructor(protected ctx: unknown, protected env: E) {}
}

export type WorkflowStep = unknown;
export type WorkflowEvent<P> = { payload: P; timestamp: Date };
