export interface Env {
  AWS_PRICING_KV: KVNamespace;
  /** Weekly pricing-rebuild workflow (see workflow.ts). */
  PRICING_WORKFLOW: Workflow;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  /**
   * Shared secret guarding the state-changing admin endpoints
   * (POST /trigger, /reset, /start). When unset, those endpoints are disabled.
   * Set via: wrangler secret put ADMIN_TOKEN
   */
  ADMIN_TOKEN?: string;
  /**
   * Comma-separated list of browser origins allowed to call the CORS endpoints
   * (/votes). Defaults to the production site + localhost when unset.
   */
  ALLOWED_ORIGINS?: string;
  /** D1 database holding per-challenge thumbs up/down tallies. */
  DB: D1Database;
}

/** Persisted in KV under key: "worker:progress" */
export interface WorkerProgress {
  /** 'idle' = no run in progress; 'running' = actively processing regions; 'failed' = error occurred */
  status: 'idle' | 'running' | 'failed';
  /** Index of the NEXT region to process within the current run's list */
  currentIndex: number;
  /** Unix ms when the current (or last) run started */
  startedAt: number;
  /** Region that most recently rebuilt cleanly */
  lastCompletedRegion?: string;
  /** Error message from the last failure */
  lastError?: string;
  /** Regions rebuilt cleanly in the current run */
  completedCount?: number;
  /** Regions in the current run (27 for a full run, fewer for a repair run) */
  runTotal?: number;
  /** Build phase (0-based) within the current region; see PHASE_COUNT */
  phase?: number;
  /** Workflow instance driving the current (or last) run. */
  instanceId?: string;
}

export interface RawPriceResult {
  PriceList?: string[];
  NextToken?: string;
}

/**
 * Standard-tier on-demand token rates for Bedrock models, keyed by the
 * identifier used in the source offer (model attribute name, or marketplace
 * servicename). Unit ($/1K or $/1M tokens) depends on the source offer.
 */
export type BedrockTokenRates = Record<string, { in?: number; out?: number }>;
