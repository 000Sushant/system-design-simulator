/**
 * cost-benchmark.harness.spec.ts
 *
 * NOT a unit test — a benchmark harness that drives the real CostService to
 * compute an organizational reference architecture's monthly bill per region,
 * twice:
 *   1. with the simulator's live Cloudflare KV pricing (what users see), and
 *   2. with that same pricing corrected to today's official AWS Price List API
 *      values (from scripts/benchmark-kv-accuracy.mjs results).
 *
 * The delta between the two is the architecture-level cost accuracy.
 *
 * Only runs when BM_KV_DIR / BM_RESULTS_DIR / BM_OUT env vars are set, so
 * `npm test` is unaffected. Delete this file after the benchmark if desired.
 */
import { describe, it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { CostService } from './cost.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureNode, AwsServiceType } from '../models/architecture.model';

const KV_DIR = process.env['BM_KV_DIR'];
const RESULTS_DIR = process.env['BM_RESULTS_DIR'];
const OUT = process.env['BM_OUT'];
const enabled = Boolean(KV_DIR && RESULTS_DIR && OUT);

/** Organizational reference architecture — node types with catalog-default
 *  configs (the simulator's own defaults; no invented numbers). Multi-tier
 *  web + data + messaging + ops, the shape of a mid-size org's production VPC. */
const ORG_ARCHITECTURE: AwsServiceType[] = [
  'client',
  'route53',
  'cloudfront',
  'waf',
  'apiGateway',
  'elb',
  'autoScalingGroup',
  'eks',
  'lambda',
  'rds',
  'aurora',
  'dynamoDb',
  'elastiCache',
  's3',
  'efs',
  'sqs',
  'sns',
  'kinesis',
  'natGateway',
  'vpc',
  'cloudWatch',
  'kms',
  'ecr',
  'secretsManager',
  'cloudTrail',
];

/** deep get/set that tolerate dots inside keys (instance types) by trying the
 *  longest key join first at every level. */
function deepGet(obj: any, path: string): any {
  const parts = path.split('.');
  let cur = obj;
  let i = 0;
  while (i < parts.length) {
    if (cur == null) return undefined;
    let found = false;
    for (let j = parts.length; j > i; j--) {
      const key = parts.slice(i, j).join('.');
      if (Object.prototype.hasOwnProperty.call(cur, key)) {
        cur = cur[key];
        i = j;
        found = true;
        break;
      }
    }
    if (!found) return undefined;
  }
  return cur;
}

function deepSet(obj: any, path: string, value: number): boolean {
  const parts = path.split('.');
  let cur = obj;
  let i = 0;
  while (i < parts.length) {
    if (cur == null || typeof cur !== 'object') return false;
    for (let j = parts.length; j > i; j--) {
      const key = parts.slice(i, j).join('.');
      if (Object.prototype.hasOwnProperty.call(cur, key)) {
        if (j === parts.length) {
          cur[key] = value;
          return true;
        }
        cur = cur[key];
        i = j;
        break;
      }
      if (j === i + 1) return false; // no key matched at this level
    }
  }
  return false;
}

describe.skipIf(!enabled)('cost-accuracy benchmark roll-up', () => {
  it('computes org-architecture monthly cost per region (KV vs official AWS)', () => {
    const catalog = new AwsCatalogService();
    const factory = new ArchitectureFactoryService(catalog);
    const nodes: ArchitectureNode[] = ORG_ARCHITECTURE.map((t) => factory.createNode(t, 0, 0));

    const regionFiles = readdirSync(RESULTS_DIR!).filter((f) => /^[a-z]{2}-[a-z]+-\d\.json$/.test(f));
    const out: any = { generatedAt: new Date().toISOString(), architecture: ORG_ARCHITECTURE, regions: {} };

    for (const file of regionFiles) {
      const results = JSON.parse(readFileSync(resolve(RESULTS_DIR!, file), 'utf8'));
      const regionCode: string = results.regionCode;
      const kvDoc = JSON.parse(readFileSync(resolve(KV_DIR!, `${regionCode}.json`), 'utf8'));

      // Corrected pricing: KV overlaid with today's official API values.
      const corrected = JSON.parse(JSON.stringify(kvDoc));
      let applied = 0;
      let applyFailures: string[] = [];
      for (const p of results.params) {
        if ((p.status === 'MATCH' || p.status === 'DRIFT') && p.awsValue !== null) {
          if (deepSet(corrected.services, p.path, p.awsValue)) applied++;
          else applyFailures.push(p.path);
        }
      }

      const cost = new CostService();
      const priceWith = (doc: any): { total: number; perNode: Record<string, number> } => {
        (cost as any).loadedPricing = doc;
        (cost as any).currentRegionCode = regionCode;
        const perNode: Record<string, number> = {};
        for (const n of nodes) {
          perNode[n.type] = cost.calculateNodeCostUsd(n, regionCode, nodes);
        }
        const total = cost.calculateTotalMonthlyCost(nodes, 'USD', regionCode);
        return { total, perNode };
      };

      const kv = priceWith(kvDoc);
      const aws = priceWith(corrected);

      const perNodeDelta: Record<string, { kv: number; aws: number; deltaPct: number | null }> = {};
      for (const t of Object.keys(kv.perNode)) {
        const a = aws.perNode[t];
        const k = kv.perNode[t];
        perNodeDelta[t] = { kv: k, aws: a, deltaPct: a === 0 ? (k === 0 ? 0 : null) : ((k - a) / a) * 100 };
      }

      out.regions[regionCode] = {
        kvGeneratedAt: kvDoc.generatedAt,
        totalMonthlyUsd_kv: kv.total,
        totalMonthlyUsd_aws: aws.total,
        deltaUsd: kv.total - aws.total,
        deltaPct: aws.total === 0 ? null : ((kv.total - aws.total) / aws.total) * 100,
        correctionsApplied: applied,
        applyFailures,
        perNode: perNodeDelta,
      };
    }

    writeFileSync(OUT!, JSON.stringify(out, null, 2));
    // eslint-disable-next-line no-console
    console.log(`[benchmark] wrote ${Object.keys(out.regions).length} regions to ${OUT}`);
  });
});
