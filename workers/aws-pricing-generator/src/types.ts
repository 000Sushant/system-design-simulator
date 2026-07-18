export interface Env {
  AWS_PRICING_KV: KVNamespace;
  PRICING_WORKFLOW: Workflow;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  ADMIN_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
  DB: D1Database;
}

export interface WorkerProgress {
  status: 'idle' | 'running' | 'failed';
  currentIndex: number;
  startedAt: number;
  lastCompletedRegion?: string;
  lastError?: string;
  completedCount?: number;
  runTotal?: number;
  phase?: number;
  instanceId?: string;
}

export interface RawPriceResult {
  PriceList?: string[];
  NextToken?: string;
}

export type BedrockTokenRates = Record<string, { in?: number; out?: number }>;
