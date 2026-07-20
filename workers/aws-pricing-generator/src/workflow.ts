import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { Env } from './types';
import { REGIONS, Region } from './regions';
import { PricingFetcher } from './fetcher';
import { buildPricingPhase, PHASE_COUNT } from './schema-builder';
import { getProgress, saveProgress, updateFailureQueue, KV_PRICING_PREFIX, KV_PARTIAL_PREFIX } from './progress';


export interface PricingWorkflowParams {
  regions?: string[];
}

const STEP_RETRIES = {
  retries: { limit: 4, delay: '1 minute', backoff: 'exponential' },
  timeout: '5 minutes',
} as const;

async function runPricingPhase(env: Env, region: Region, phase: number): Promise<void> {
  const fetcher = new PricingFetcher(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);

  let partial: Record<string, any> | null = null;
  if (phase > 0) {
    const rawPartial = await env.AWS_PRICING_KV.get(`${KV_PARTIAL_PREFIX}${region.code}`);
    partial = rawPartial ? JSON.parse(rawPartial) : null;
    if (!partial) console.warn(`[Workflow] ⚠ Partial for ${region.code} missing; restarting from baseline.`);
  }

  const services = await buildPricingPhase(region, fetcher, partial, phase);
  console.log(`[Workflow] Built ${region.code} phase ${phase + 1}/${PHASE_COUNT} (${fetcher.calls} pricing calls).`);

  if (phase < PHASE_COUNT - 1) {
    await env.AWS_PRICING_KV.put(
      `${KV_PARTIAL_PREFIX}${region.code}`,
      JSON.stringify(services),
      { expirationTtl: 24 * 60 * 60 }
    );
    return;
  }

  const pricingFile = {
    regionCode:   region.code,
    regionName:   region.name,
    generatedAt:  new Date().toISOString(),
    services,
  };
  await env.AWS_PRICING_KV.put(
    `${KV_PRICING_PREFIX}${region.code}`,
    JSON.stringify(pricingFile)
  );
  console.log(`[Workflow] ✅ Saved pricing for ${region.code} to KV.`);
}

export class PricingWorkflow extends WorkflowEntrypoint<Env, PricingWorkflowParams> {
  async run(event: WorkflowEvent<PricingWorkflowParams>, step: WorkflowStep): Promise<void> {
    const env = this.env;

    const requested = event.payload?.regions ?? [];
    const regions: Region[] = requested.length > 0
      ? REGIONS.filter((r) => requested.includes(r.code))
      : REGIONS;
    const runLabel = requested.length > 0 ? `repair run (${regions.map((r) => r.code).join(', ')})` : 'full run';

    await step.do('start run', async () => {
      const prev = await getProgress(env);
      await saveProgress(env, {
        status:         'running',
        currentIndex:   0,
        startedAt:      Date.now(),
        completedCount: 0,
        runTotal:       regions.length,
        instanceId:     prev.instanceId,
      });
    });

    let completedCount = 0;
    let lastError: string | undefined;

    for (let i = 0; i < regions.length; i++) {
      const region = regions[i];
      let abandoned = false;
      let degraded = false;

      for (let phase = 0; phase < PHASE_COUNT; phase++) {
        try {
          await step.do(`${region.code} phase ${phase + 1}/${PHASE_COUNT}`, STEP_RETRIES, async () => {
            await runPricingPhase(env, region, phase);
          });
        } catch (err: any) {
          const note = phase < PHASE_COUNT - 1
            ? `Skipped ${region.code} phase ${phase + 1}/${PHASE_COUNT} after repeated failures: ${err?.message ?? err}`
            : `Abandoned ${region.code} on final phase after repeated failures: ${err?.message ?? err}`;
          console.warn(`[Workflow] ⚠ ${note}`);
          lastError = note;
          degraded = true;
          if (phase === PHASE_COUNT - 1) abandoned = true;
        }
      }

      const clean = !abandoned && !degraded;
      if (clean) completedCount++;

      const done = i === regions.length - 1;
      await step.do(`update progress after ${region.code}`, async () => {
        await updateFailureQueue(env, clean ? { remove: region.code } : { add: region.code });
        const prev = await getProgress(env);
        await saveProgress(env, {
          ...prev,
          status:              done ? 'idle' : 'running',
          currentIndex:        i + 1,
          phase:               0,
          lastCompletedRegion: clean ? region.code : prev.lastCompletedRegion,
          completedCount,
          runTotal:            regions.length,
          lastError,
        });
      });
    }

    console.log(`[Workflow] 🎉 ${runLabel} complete! ${completedCount}/${regions.length} regions rebuilt cleanly.`);
  }
}
