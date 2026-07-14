import { Env } from './types';
import { REGIONS } from './regions';
import { PHASE_COUNT } from './schema-builder';
import { getProgress, saveProgress, getFailureQueue, KV_PRICING_PREFIX } from './progress';
import { json, requireAdmin, corsHeaders, clampDelta } from './security';

export { PricingWorkflow } from './workflow';

// Advertised on the health-check route.
const WORKER_VERSION = '2.1.0';

// Must match the repair schedule in wrangler.toml [triggers]; the other
// schedule there (weekly full run) falls through to the default branch.
const DAILY_REPAIR_CRON = '0 4 * * *';

/**
 * A run older than this with no live workflow instance is considered dead
 * (e.g. instance history expired) and may be superseded by a new run.
 */
const STALE_RUN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/** True when the progress KV points at a workflow instance that is still alive. */
async function hasLiveInstance(env: Env): Promise<boolean> {
  const progress = await getProgress(env);
  if (progress.status !== 'running') return false;
  if (progress.instanceId) {
    try {
      const instance = await env.PRICING_WORKFLOW.get(progress.instanceId);
      const { status } = await instance.status();
      if (status === 'queued' || status === 'running' || status === 'paused' || status === 'waiting' || status === 'waitingForPause') {
        return true;
      }
      return false; // errored / terminated / complete — safe to start anew
    } catch {
      // Unknown/expired instance — fall through to the staleness check.
    }
  }
  // No verifiable instance: trust the KV state only while the run looks fresh.
  return Date.now() - progress.startedAt < STALE_RUN_MS;
}

/** Terminates the live instance recorded in progress KV, if any. */
async function terminateLiveInstance(env: Env): Promise<void> {
  const progress = await getProgress(env);
  if (!progress.instanceId) return;
  try {
    const instance = await env.PRICING_WORKFLOW.get(progress.instanceId);
    await instance.terminate();
  } catch {
    // Already gone — nothing to do.
  }
}

/**
 * Starts a rebuild unless one is already in flight. With `regions` it is a
 * repair run over just those codes; without, a full run over all regions.
 */
async function maybeStartRun(env: Env, regions?: string[]): Promise<{ started: boolean; instanceId?: string }> {
  if (await hasLiveInstance(env)) {
    console.log('[Worker] ✅ A rebuild instance is already in flight. Skipping.');
    return { started: false };
  }
  const count = regions?.length || REGIONS.length;
  const instance = await env.PRICING_WORKFLOW.create({ params: { regions } });
  await saveProgress(env, {
    status:         'running',
    currentIndex:   0,
    startedAt:      Date.now(),
    completedCount: 0,
    runTotal:       count,
    instanceId:     instance.id,
  });
  console.log(`[Worker] 🚀 Started pricing rebuild workflow ${instance.id} (${count} regions × ${PHASE_COUNT} phases).`);
  return { started: true, instanceId: instance.id };
}

/**
 * Daily repair: rebuild only the regions whose last run failed (or was
 * degraded by a skipped phase). A no-op (one KV read) when the queue is
 * empty; never races the weekly full run — the hasLiveInstance() guard in
 * maybeStartRun() skips if an instance is in flight.
 */
async function maybeStartRepairRun(env: Env): Promise<void> {
  const queue = await getFailureQueue(env);
  if (queue.length === 0) {
    console.log('[Worker] ✅ Failure queue empty — nothing to repair.');
    return;
  }
  console.log(`[Worker] 🔧 Failure queue: ${queue.join(', ')}. Starting repair run.`);
  await maybeStartRun(env, queue);
}

// ─── Worker export ───────────────────────────────────────────────────────────

export default {
  /**
   * Cron handler. Two schedules share it (branch on event.cron):
   *   weekly `0 3 * * 7` — full rebuild of all regions
   *   daily  `0 4 * * *` — repair run over the failure queue (no-op if empty)
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[Worker] ⏰ Cron "${event.cron}" triggered at`, new Date().toISOString());
    if (event.cron === DAILY_REPAIR_CRON) {
      ctx.waitUntil(maybeStartRepairRun(env));
    } else {
      // Weekly schedule (and any unrecognized one) → full run.
      ctx.waitUntil(maybeStartRun(env));
    }
  },

  /**
   * HTTP handler for manual control and monitoring.
   *
   *   GET  /status           — current progress state
   *   POST /trigger          — start a rebuild now unless one is in flight
   *   POST /reset            — terminate any run and reset to idle
   *   POST /start            — force a fresh rebuild (terminates any live run)
   *   GET  /pricing/{region} — fetch a generated pricing file from KV
   */
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = corsHeaders(request, env);

    // CORS preflight (votes are called cross-origin by the frontend).
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── GET /status ──────────────────────────────────────────────────────
    if (path === '/status' && request.method === 'GET') {
      const progress = await getProgress(env);
      const runTotal = progress.runTotal ?? REGIONS.length;
      return json({
        ...progress,
        totalRegions:     runTotal,
        remainingRegions: Math.max(0, runTotal - progress.currentIndex),
        failureQueue:     await getFailureQueue(env),
      });
    }

    // ── POST /trigger ── (admin) ─────────────────────────────────────────
    if (path === '/trigger' && request.method === 'POST') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      const result = await maybeStartRun(env);
      return result.started
        ? json({ message: 'Rebuild workflow started.', instanceId: result.instanceId }, 202)
        : json({ message: 'A rebuild is already in flight.' }, 409);
    }

    // ── POST /reset ── (admin) ───────────────────────────────────────────
    if (path === '/reset' && request.method === 'POST') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      await terminateLiveInstance(env);
      await saveProgress(env, { status: 'idle', currentIndex: 0, startedAt: 0 });
      return json({ message: 'Progress reset to idle. A new run will start on the next weekly cron.' });
    }

    // ── POST /start ── (admin) ───────────────────────────────────────────
    // Force-start a fresh rebuild right now, replacing any live run.
    if (path === '/start' && request.method === 'POST') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      await terminateLiveInstance(env);
      const instance = await env.PRICING_WORKFLOW.create();
      await saveProgress(env, {
        status:         'running',
        currentIndex:   0,
        startedAt:      Date.now(),
        completedCount: 0,
        instanceId:     instance.id,
      });
      return json({ message: 'Rebuild workflow force-started.', instanceId: instance.id }, 202);
    }

    // ── GET /pricing/{regionCode} ────────────────────────────────────────
    const pricingMatch = path.match(/^\/pricing\/([a-z0-9-]+)$/);
    if (pricingMatch && request.method === 'GET') {
      const regionCode = pricingMatch[1];
      const raw = await env.AWS_PRICING_KV.get(`${KV_PRICING_PREFIX}${regionCode}`);
      if (!raw) {
        return json({ unsupportedRegion: true, regionCode }, 404);
      }
      return new Response(raw, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'KV' } });
    }

    // ── GET /votes — all challenge tallies ───────────────────────────────
    if (path === '/votes' && request.method === 'GET') {
      const rows = await env.DB.prepare(
        'SELECT challenge_id, up, down FROM challenge_votes',
      ).all<{ challenge_id: string; up: number; down: number }>();
      const tally: Record<string, { up: number; down: number }> = {};
      for (const r of rows.results) {
        tally[r.challenge_id] = { up: r.up, down: r.down };
      }
      return json(tally, 200, cors);
    }

    // ── POST /votes — apply an up/down delta ─────────────────────────────
    // CORS blocks cross-site browser voting; deltas are clamped to ±1. The
    // remaining abuse vector (scripted/server-side stuffing) is best mitigated
    // with a Cloudflare Rate Limiting rule or Turnstile in front of this route.
    if (path === '/votes' && request.method === 'POST') {
      let body: { challengeId?: string; upDelta?: number; downDelta?: number };
      try {
        body = (await request.json()) as typeof body;
      } catch {
        return json({ error: 'Invalid JSON body.' }, 400, cors);
      }
      const id = (body.challengeId ?? '').trim();
      const up = clampDelta(body.upDelta);
      const down = clampDelta(body.downDelta);
      if (!/^[a-z0-9-]{1,64}$/.test(id)) {
        return json({ error: 'Invalid challengeId.' }, 400, cors);
      }
      if (up === 0 && down === 0) {
        return json({ error: 'Empty vote.' }, 400, cors);
      }
      await env.DB.prepare(
        `INSERT INTO challenge_votes (challenge_id, up, down)
         VALUES (?, MAX(0, ?), MAX(0, ?))
         ON CONFLICT(challenge_id) DO UPDATE SET
           up = MAX(0, up + ?), down = MAX(0, down + ?)`,
      )
        .bind(id, up, down, up, down)
        .run();
      const row = await env.DB.prepare(
        'SELECT up, down FROM challenge_votes WHERE challenge_id = ?',
      )
        .bind(id)
        .first<{ up: number; down: number }>();
      return json({ challengeId: id, up: row?.up ?? 0, down: row?.down ?? 0 }, 200, cors);
    }

    // ── Health check ─────────────────────────────────────────────────────
    // Only public routes are advertised. The state-changing admin endpoints
    // (POST /trigger, /reset, /start) are intentionally omitted and require
    // a Bearer ADMIN_TOKEN.
    return json({
      name:    'AWS Pricing Generator Worker',
      version: WORKER_VERSION,
      regions: REGIONS.length,
      routes: [
        'GET  /status',
        'GET  /pricing/{regionCode}',
        'GET  /votes',
        'POST /votes',
      ],
    });
  },
};
