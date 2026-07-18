import { Env } from './types';
import { maybeRefreshStats, getPublicStats } from './stats';
import { maybeRefreshFxRates, getFxRates } from './fx';
import { json, corsHeaders, clampDelta } from './security';

const WORKER_VERSION = '1.0.0';

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('[Daily] ⏰ Cron triggered at', new Date().toISOString());
    ctx.waitUntil(maybeRefreshFxRates(env));
    ctx.waitUntil(maybeRefreshStats(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (path === '/fx' && request.method === 'GET') {
      const fx = await getFxRates(env);
      if (!fx) {
        return json({ error: 'FX rates unavailable.' }, 503, cors);
      }
      return json(fx, 200, { ...cors, 'Cache-Control': 'public, max-age=3600' });
    }

    if (path === '/stats' && request.method === 'GET') {
      const stats = await getPublicStats(env);
      return json(stats, 200, { ...cors, 'Cache-Control': 'public, max-age=3600' });
    }

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

    return json({
      name:    'Daily Analytics Worker',
      version: WORKER_VERSION,
      routes: [
        'GET  /fx',
        'GET  /stats',
        'GET  /votes',
        'POST /votes',
      ],
    });
  },
};
