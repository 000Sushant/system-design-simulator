export interface Env {
  AWS_PRICING_KV: KVNamespace;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  /** D1 database holding per-challenge thumbs up/down tallies. */
  DB: D1Database;
  // ── Live stats (optional; /stats serves zeros until these are set) ──────────
  /** GitHub PAT with repo (push) access — required for the traffic/clones API. */
  GITHUB_TOKEN?: string;
  /** Cloudflare API token with Analytics:Read on the zone. */
  CF_API_TOKEN?: string;
  /** Cloudflare zone tag (zone ID) for the deployed domain. */
  CF_ZONE_TAG?: string;
}

/** Persisted in KV under key: "worker:progress" */
export interface WorkerProgress {
  /** 'idle' = no run in progress; 'running' = actively processing regions; 'failed' = error occurred */
  status: 'idle' | 'running' | 'failed';
  /** Index into REGIONS array for the NEXT region to process */
  currentIndex: number;
  /** Unix ms when the current (or last) weekly run started */
  startedAt: number;
  /** Region that most recently succeeded */
  lastCompletedRegion?: string;
  /** Error message from the last failure */
  lastError?: string;
  /** Do not restart until this timestamp (ms) has passed after a failure */
  cooldownUntil?: number;
  /** Total regions processed in the current weekly run */
  completedCount?: number;
}

export interface RawPriceResult {
  PriceList?: string[];
}
