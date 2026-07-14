/**
 * Generates regional pricing files LOCALLY using the worker's own build
 * pipeline (all 9 phases in one pass — no Cloudflare subrequest/CPU limits),
 * then writes per-region JSON plus a wrangler-compatible bulk-upload file.
 *
 * Usage (from worker/):
 *   node --env-file=.dev.vars --import tsx scripts/generate-local.ts [regionCodes...]
 *
 * With no arguments every region is built (~45–60s each, ~25 min total).
 * Pass region codes (e.g. "eu-central-1 ap-south-1") to build a subset.
 *
 * Upload the result to Cloudflare KV (from worker/):
 *   npx wrangler kv bulk put kv-local/bulk.json --binding AWS_PRICING_KV --remote
 *
 * Keys are written WITHOUT the worker's 8-day TTL so the data survives until
 * the cron pipeline overwrites it with a fresh weekly run.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGIONS } from '../src/regions';
import { PricingFetcher } from '../src/fetcher';
import { buildPricingFile } from '../src/schema-builder';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!accessKeyId || !secretAccessKey) {
  console.error('AWS credentials not set — run with: node --env-file=.dev.vars --import tsx scripts/generate-local.ts');
  process.exit(1);
}

const only = new Set(process.argv.slice(2));
const regions = only.size ? REGIONS.filter(r => only.has(r.code)) : REGIONS;
if (only.size && regions.length !== only.size) {
  const known = new Set(regions.map(r => r.code));
  console.error(`Unknown region code(s): ${[...only].filter(c => !known.has(c)).join(', ')}`);
  process.exit(1);
}

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../kv-local');
mkdirSync(outDir, { recursive: true });

async function main(): Promise<void> {
  const bulk: Array<{ key: string; value: string }> = [];
  for (const [i, region] of regions.entries()) {
    console.log(`\n=== [${i + 1}/${regions.length}] ${region.code} (${region.name}) ===`);
    const started = Date.now();
    const fetcher = new PricingFetcher(accessKeyId!, secretAccessKey!);
    const services = await buildPricingFile(region, fetcher);
    const pricingFile = {
      regionCode: region.code,
      regionName: region.name,
      generatedAt: new Date().toISOString(),
      services,
    };
    const value = JSON.stringify(pricingFile);
    writeFileSync(resolve(outDir, `${region.code}.json`), value);
    bulk.push({ key: `pricing:${region.code}`, value });
    console.log(`Done in ${((Date.now() - started) / 1000).toFixed(0)}s — ${fetcher.calls} API calls.`);
  }

  writeFileSync(resolve(outDir, 'bulk.json'), JSON.stringify(bulk));
  console.log(`\nWrote ${bulk.length} region file(s) + bulk.json to ${outDir}`);
  console.log('Upload with: npx wrangler kv bulk put kv-local/bulk.json --binding AWS_PRICING_KV --remote');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
