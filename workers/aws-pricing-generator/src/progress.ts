import { Env, WorkerProgress } from './types';

// KV keys
export const KV_PROGRESS_KEY = 'worker:progress';
export const KV_PRICING_PREFIX = 'pricing:';
/** Partial (mid-phase) build for the region currently in progress. */
export const KV_PARTIAL_PREFIX = 'pricing-partial:';

export async function getProgress(env: Env): Promise<WorkerProgress> {
  const raw = await env.AWS_PRICING_KV.get(KV_PROGRESS_KEY);
  if (!raw) {
    return { status: 'idle', currentIndex: 0, startedAt: 0 };
  }
  return JSON.parse(raw) as WorkerProgress;
}

export async function saveProgress(env: Env, progress: WorkerProgress): Promise<void> {
  await env.AWS_PRICING_KV.put(KV_PROGRESS_KEY, JSON.stringify(progress));
}

// ─── Failure queue ────────────────────────────────────────────────────────────
// Region codes whose last rebuild exhausted all retries. The daily repair cron
// re-runs exactly these regions; a successful rebuild removes the region. The
// queue is a set, so a region already pending is never queued twice.

export const KV_FAILURE_QUEUE_KEY = 'pricing:failure-queue';

export async function getFailureQueue(env: Env): Promise<string[]> {
  const raw = await env.AWS_PRICING_KV.get(KV_FAILURE_QUEUE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

/** Adds and/or removes a region code; persists only when the set changed. */
export async function updateFailureQueue(
  env: Env,
  change: { add?: string; remove?: string },
): Promise<string[]> {
  const current = await getFailureQueue(env);
  const queue = new Set(current);
  if (change.remove) queue.delete(change.remove);
  if (change.add) queue.add(change.add);
  const next = [...queue];
  if (next.join(',') !== current.join(',')) {
    await env.AWS_PRICING_KV.put(KV_FAILURE_QUEUE_KEY, JSON.stringify(next));
  }
  return next;
}
