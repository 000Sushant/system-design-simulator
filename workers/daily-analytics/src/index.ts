import { Env } from './types';
import { maybeRefreshStats, getPublicStats } from './stats';
import { maybeRefreshFxRates, getFxRates } from './fx';
import { json, corsHeaders } from './security';

// Advertised on the health-check route.
const WORKER_VERSION = '1.0.0';

export default {
  /**
   * Cron handler — fires once a day.
   * Refreshes the FX rates and project analytics caches in KV. Both refreshers
   * are self-gated (~20h) so manual triggers or overlapping runs stay cheap.
   */
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('[Daily] ⏰ Cron triggered at', new Date().toISOString());
    ctx.waitUntil(maybeRefreshFxRates(env));
    ctx.waitUntil(maybeRefreshStats(env));
  },

  /**
   * HTTP handler.
   *
   *   GET /fx     — cached USD exchange rates (EUR, GBP, INR, JPY)
   *   GET /stats  — cached project stats for the landing page
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = corsHeaders(request, env);

    // CORS preflight (both endpoints are called cross-origin by the frontend).
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // ── GET /fx ──────────────────────────────────────────────────────────
    if (path === '/fx' && request.method === 'GET') {
      const fx = await getFxRates(env);
      if (!fx) {
        return json({ error: 'FX rates unavailable.' }, 503, cors);
      }
      return json(fx, 200, { ...cors, 'Cache-Control': 'public, max-age=3600' });
    }

    // ── GET /stats ───────────────────────────────────────────────────────
    if (path === '/stats' && request.method === 'GET') {
      const stats = await getPublicStats(env);
      return json(stats, 200, { ...cors, 'Cache-Control': 'public, max-age=3600' });
    }

    // ── Health check ─────────────────────────────────────────────────────
    return json({
      name:    'Daily Analytics Worker',
      version: WORKER_VERSION,
      routes: [
        'GET  /fx',
        'GET  /stats',
      ],
    });
  },
};
