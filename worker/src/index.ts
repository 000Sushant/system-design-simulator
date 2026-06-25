import { Env, WorkerProgress } from './types';
import { REGIONS, WEEKLY_INTERVAL_MS, FAILURE_COOLDOWN_MS } from './regions';
import { PricingFetcher } from './fetcher';
import { buildPricingFile } from './schema-builder';
import { maybeRefreshStats, getPublicStats } from './stats';

// KV keys
const KV_PROGRESS_KEY = 'worker:progress';
const KV_PRICING_PREFIX = 'pricing:';

// ─── KV helpers ──────────────────────────────────────────────────────────────

async function getProgress(env: Env): Promise<WorkerProgress> {
  const raw = await env.AWS_PRICING_KV.get(KV_PROGRESS_KEY);
  if (!raw) {
    return { status: 'idle', currentIndex: 0, startedAt: 0 };
  }
  return JSON.parse(raw) as WorkerProgress;
}

async function saveProgress(env: Env, progress: WorkerProgress): Promise<void> {
  await env.AWS_PRICING_KV.put(KV_PROGRESS_KEY, JSON.stringify(progress));
}

// ─── Core: process one region ─────────────────────────────────────────────────

async function processOneRegion(env: Env): Promise<void> {
  const progress = await getProgress(env);

  // ── Guard: in cooldown after failure ────────────────────────────────────
  if (progress.status === 'failed' && progress.cooldownUntil && Date.now() < progress.cooldownUntil) {
    const waitMin = Math.round((progress.cooldownUntil - Date.now()) / 60000);
    console.log(`[Worker] ⏳ In failure cooldown for ~${waitMin} more minute(s). Skipping.`);
    return;
  }

  // ── Guard: idle and not yet time for a weekly run ────────────────────────
  if (progress.status === 'idle') {
    const timeSinceLast = Date.now() - (progress.startedAt || 0);
    if (timeSinceLast < WEEKLY_INTERVAL_MS) {
      const hoursLeft = Math.round((WEEKLY_INTERVAL_MS - timeSinceLast) / 3_600_000);
      console.log(`[Worker] ✅ Weekly run not due yet (~${hoursLeft}h remaining). Skipping.`);
      return;
    }
    // Start a new weekly run
    console.log(`[Worker] 🚀 Starting new weekly pricing generation run for ${REGIONS.length} regions...`);
    await saveProgress(env, { status: 'running', currentIndex: 0, startedAt: Date.now(), completedCount: 0 });
    // Re-read after save
    return processOneRegion(env);
  }

  // ── Guard: all regions done ──────────────────────────────────────────────
  if (progress.currentIndex >= REGIONS.length) {
    console.log(`[Worker] 🎉 Weekly run complete! Processed all ${REGIONS.length} regions.`);
    await saveProgress(env, { ...progress, status: 'idle' });
    return;
  }

  // ── Process the next region ──────────────────────────────────────────────
  const region = REGIONS[progress.currentIndex];
  console.log(`[Worker] 🌍 Processing region ${progress.currentIndex + 1}/${REGIONS.length}: ${region.code} (${region.name})`);

  try {
    const fetcher = new PricingFetcher(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);
    const services = await buildPricingFile(region, fetcher);

    const pricingFile = {
      regionCode:   region.code,
      regionName:   region.name,
      generatedAt:  new Date().toISOString(),
      services,
    };

    // Save to KV
    await env.AWS_PRICING_KV.put(
      `${KV_PRICING_PREFIX}${region.code}`,
      JSON.stringify(pricingFile),
      { expirationTtl: 8 * 24 * 60 * 60 } // 8 days TTL (auto-expire stale data)
    );

    console.log(`[Worker] ✅ Saved pricing for ${region.code} to KV.`);

    // Advance to next region
    await saveProgress(env, {
      ...progress,
      status:              'running',
      currentIndex:        progress.currentIndex + 1,
      lastCompletedRegion: region.code,
      completedCount:      (progress.completedCount ?? 0) + 1,
      lastError:           undefined,
      cooldownUntil:       undefined,
    });

  } catch (err: any) {
    const errorMsg = err?.message ?? String(err);
    console.error(`[Worker] ❌ Failed to process ${region.code}:`, errorMsg);

    // Enter cooldown; DO NOT increment index so we retry this region next time
    await saveProgress(env, {
      ...progress,
      status:        'failed',
      lastError:     errorMsg,
      cooldownUntil: Date.now() + FAILURE_COOLDOWN_MS,
    });
  }
}

// ─── Worker export ───────────────────────────────────────────────────────────

export default {
  /**
   * Cron handler — fires every 5 minutes.
   * Each invocation processes ONE region and updates KV state.
   * Resume is automatic: the next invocation picks up from where the last left off.
   */
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('[Worker] ⏰ Cron triggered at', new Date().toISOString());
    ctx.waitUntil(processOneRegion(env));
    // Refresh live project stats (self-gated to ~once every 12h).
    ctx.waitUntil(maybeRefreshStats(env));
  },

  /**
   * HTTP handler for manual control and monitoring.
   *
   *   GET  /status           — current progress state
   *   POST /trigger          — force-start processing the next region immediately
   *   POST /reset            — reset to idle (useful for testing or forcing a re-run)
   *   GET  /pricing/{region} — fetch a generated pricing file from KV
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight (votes are called cross-origin by the frontend).
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── GET /status ──────────────────────────────────────────────────────
    if (path === '/status' && request.method === 'GET') {
      const progress = await getProgress(env);
      const remaining = REGIONS.length - progress.currentIndex;
      return json({
        ...progress,
        totalRegions:    REGIONS.length,
        remainingRegions: remaining,
        nextRegion:      REGIONS[progress.currentIndex]?.code ?? 'none',
      });
    }

    // ── POST /trigger ────────────────────────────────────────────────────
    if (path === '/trigger' && request.method === 'POST') {
      ctx.waitUntil(processOneRegion(env));
      const progress = await getProgress(env);
      return json({ message: 'Processing triggered', nextRegion: REGIONS[progress.currentIndex]?.code }, 202);
    }

    // ── POST /reset ──────────────────────────────────────────────────────
    if (path === '/reset' && request.method === 'POST') {
      await saveProgress(env, { status: 'idle', currentIndex: 0, startedAt: 0 });
      return json({ message: 'Progress reset to idle. Weekly run will start on next cron trigger.' });
    }

    // ── POST /start ──────────────────────────────────────────────────────
    // Force-start a new weekly run right now (ignoring the 7-day check)
    if (path === '/start' && request.method === 'POST') {
      await saveProgress(env, { status: 'running', currentIndex: 0, startedAt: Date.now(), completedCount: 0 });
      ctx.waitUntil(processOneRegion(env));
      return json({ message: `Weekly run force-started. Processing ${REGIONS[0]?.code}...` }, 202);
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

    // ── GET /stats — live project stats for the landing page ─────────────
    if (path === '/stats' && request.method === 'GET') {
      const stats = await getPublicStats(env);
      return json(stats, 200, { ...CORS, 'Cache-Control': 'public, max-age=3600' });
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
      return json(tally, 200, CORS);
    }

    // ── POST /votes — apply an up/down delta ─────────────────────────────
    if (path === '/votes' && request.method === 'POST') {
      let body: { challengeId?: string; upDelta?: number; downDelta?: number };
      try {
        body = (await request.json()) as typeof body;
      } catch {
        return json({ error: 'Invalid JSON body.' }, 400, CORS);
      }
      const id = (body.challengeId ?? '').trim();
      const up = clampDelta(body.upDelta);
      const down = clampDelta(body.downDelta);
      if (!/^[a-z0-9-]{1,64}$/.test(id)) {
        return json({ error: 'Invalid challengeId.' }, 400, CORS);
      }
      if (up === 0 && down === 0) {
        return json({ error: 'Empty vote.' }, 400, CORS);
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
      return json({ challengeId: id, up: row?.up ?? 0, down: row?.down ?? 0 }, 200, CORS);
    }

    // ── Health check ─────────────────────────────────────────────────────
    return json({
      name:    'AWS Pricing Generator Worker',
      version: '1.0.0',
      regions: REGIONS.length,
      routes: [
        'GET  /status',
        'POST /trigger',
        'POST /reset',
        'POST /start',
        'GET  /pricing/{regionCode}',
        'GET  /stats',
        'GET  /votes',
        'POST /votes',
      ],
    });
  },
};

// ─── Votes helpers ─────────────────────────────────────────────────────────────

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Coerces an incoming vote delta to exactly -1, 0, or 1. */
function clampDelta(value: unknown): number {
  if (value === 1 || value === -1) return value;
  return 0;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}
