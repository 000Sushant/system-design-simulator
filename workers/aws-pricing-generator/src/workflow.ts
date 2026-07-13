import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers';
import { Env } from './types';
import { REGIONS, Region } from './regions';
import { PricingFetcher } from './fetcher';
import { buildPricingPhase, PHASE_COUNT } from './schema-builder';
import { getProgress, saveProgress, updateFailureQueue, KV_PRICING_PREFIX, KV_PARTIAL_PREFIX } from './progress';

/**
 * Pricing rebuild as a Cloudflare Workflow.
 *
 * Each region×phase build is one workflow step, because a step invocation gets
 * the same free-plan budget as a cron invocation did (10ms CPU, 50 subrequests)
 * — the proven-safe unit of work is unchanged, only the orchestration moved
 * from a minute-cron + KV state machine to the Workflows engine. 27 regions ×
 * 9 phases ≈ 243 steps, well under the 1,024-step limit; wall-clock duration
 * is unlimited.
 *
 * Retries: the engine re-runs a failed step automatically — including steps
 * killed by the CPU limit, which the old design could only detect via a
 * write-ahead attempt counter. After 5 attempts the step's error surfaces
 * here, the phase is skipped, and the region is queued for the daily repair
 * run (see the failure queue in progress.ts).
 *
 * Progress is still mirrored to KV after every step so GET /status keeps
 * working unchanged.
 */

/**
 * Optional event payload: restrict a run to specific region codes. Used by the
 * daily repair cron to rebuild only the failure queue; omitted (or empty) for
 * a full run over all regions.
 */
export interface PricingWorkflowParams {
  regions?: string[];
}

/** 5 total attempts per phase — mirrors the old MAX_PHASE_ATTEMPTS. */
const STEP_RETRIES = {
  retries: { limit: 4, delay: '1 minute', backoff: 'exponential' },
  timeout: '5 minutes',
} as const;

/**
 * Builds one phase of one region and persists the result to KV.
 * Idempotent: re-running a phase overwrites the same partial/final keys.
 */
async function runPricingPhase(env: Env, region: Region, phase: number): Promise<void> {
  const fetcher = new PricingFetcher(env.AWS_ACCESS_KEY_ID, env.AWS_SECRET_ACCESS_KEY);

  // Resume from the partial build unless this is the first phase
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
      { expirationTtl: 24 * 60 * 60 } // partials are short-lived
    );
    return;
  }

  // Final phase — write the complete regional pricing file.
  // No TTL: last-known-good prices must keep serving even if later rebuilds
  // fail for weeks. Every successful run overwrites the key anyway; staleness
  // is repaired by the daily failure-queue cron, never by data vanishing.
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

    // Resolve the region list: a repair run names its regions; a full run
    // covers all. Unknown codes in the payload are ignored.
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
      let abandoned = false;   // final phase failed — no pricing file written
      let degraded = false;    // any phase skipped — file written but partly baseline

      for (let phase = 0; phase < PHASE_COUNT; phase++) {
        try {
          await step.do(`${region.code} phase ${phase + 1}/${PHASE_COUNT}`, STEP_RETRIES, async () => {
            await runPricingPhase(env, region, phase);
          });
        } catch (err: any) {
          // Retries exhausted (thrown errors and CPU-killed attempts alike).
          const note = phase < PHASE_COUNT - 1
            ? `Skipped ${region.code} phase ${phase + 1}/${PHASE_COUNT} after repeated failures: ${err?.message ?? err}`
            : `Abandoned ${region.code} on final phase after repeated failures: ${err?.message ?? err}`;
          console.warn(`[Workflow] ⚠ ${note}`);
          lastError = note;
          degraded = true;
          // Final phase failed → the region's pricing file was not written;
          // previous KV pricing (if any) stays in place. A skipped mid-run
          // phase keeps baseline values for its services and the run continues.
          if (phase === PHASE_COUNT - 1) abandoned = true;
        }
      }

      const clean = !abandoned && !degraded;
      if (clean) completedCount++;

      // Mirror progress to KV (GET /status) and keep the failure queue exact:
      // a fully clean rebuild removes the region; an abandoned or degraded one
      // enqueues it for the daily repair cron (the queue is a set — a region
      // already pending is not duplicated).
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
