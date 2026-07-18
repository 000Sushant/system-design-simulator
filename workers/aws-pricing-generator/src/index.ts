import { Env } from './types';
import { REGIONS } from './regions';
import { PHASE_COUNT } from './schema-builder';
import { getProgress, saveProgress, getFailureQueue, KV_PRICING_PREFIX } from './progress';
import { json, requireAdmin, corsHeaders } from './security';

export { PricingWorkflow } from './workflow';

const WORKER_VERSION = '2.1.0';

const DAILY_REPAIR_CRON = '0 4 * * *';

const STALE_RUN_MS = 3 * 24 * 60 * 60 * 1000;

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
      return false;
    } catch {
    }
  }
  return Date.now() - progress.startedAt < STALE_RUN_MS;
}

async function terminateLiveInstance(env: Env): Promise<void> {
  const progress = await getProgress(env);
  if (!progress.instanceId) return;
  try {
    const instance = await env.PRICING_WORKFLOW.get(progress.instanceId);
    await instance.terminate();
  } catch {
  }
}

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

async function maybeStartRepairRun(env: Env): Promise<void> {
  const queue = await getFailureQueue(env);
  if (queue.length === 0) {
    console.log('[Worker] ✅ Failure queue empty — nothing to repair.');
    return;
  }
  console.log(`[Worker] 🔧 Failure queue: ${queue.join(', ')}. Starting repair run.`);
  await maybeStartRun(env, queue);
}


export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[Worker] ⏰ Cron "${event.cron}" triggered at`, new Date().toISOString());
    if (event.cron === DAILY_REPAIR_CRON) {
      ctx.waitUntil(maybeStartRepairRun(env));
    } else {
      ctx.waitUntil(maybeStartRun(env));
    }
  },

  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

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

    if (path === '/trigger' && request.method === 'POST') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      const result = await maybeStartRun(env);
      return result.started
        ? json({ message: 'Rebuild workflow started.', instanceId: result.instanceId }, 202)
        : json({ message: 'A rebuild is already in flight.' }, 409);
    }

    if (path === '/reset' && request.method === 'POST') {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      await terminateLiveInstance(env);
      await saveProgress(env, { status: 'idle', currentIndex: 0, startedAt: 0 });
      return json({ message: 'Progress reset to idle. A new run will start on the next weekly cron.' });
    }

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

    const pricingMatch = path.match(/^\/pricing\/([a-z0-9-]+)$/);
    if (pricingMatch && request.method === 'GET') {
      const regionCode = pricingMatch[1];
      const raw = await env.AWS_PRICING_KV.get(`${KV_PRICING_PREFIX}${regionCode}`);
      if (!raw) {
        return json({ unsupportedRegion: true, regionCode }, 404);
      }
      return new Response(raw, { headers: { 'Content-Type': 'application/json', 'X-Cache': 'KV' } });
    }

    return json({
      name:    'AWS Pricing Generator Worker',
      version: WORKER_VERSION,
      regions: REGIONS.length,
      routes: [
        'GET  /status',
        'GET  /pricing/{regionCode}',
      ],
    });
  },
};
