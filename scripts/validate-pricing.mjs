/**
 * validate-pricing.mjs
 *
 * Validates all worker pricing params against the live AWS Pricing API for ANY region,
 * then cross-checks the result against frontend/src/app/core/data/regions/us-east-1.json
 * as the fallback baseline.
 *
 * Per-param report:
 *   LIVE     — AWS API returned a value for this region
 *   FALLBACK — API returned null; baseline (us-east-1.json) value will be used
 *   STATIC   — param is never queried (hardcoded in baseline only)
 *
 * Usage (Node 18+):
 *   # Default: ap-south-1 (Mumbai)
 *   AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs
 *
 *   # Specific region
 *   AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs eu-west-1 "EU (Ireland)"
 *
 *   # With .env file (Node 20+)
 *   node --env-file=.env.pricing scripts/validate-pricing.mjs ap-south-1
 *
 * Supported regions: ap-south-1, eu-west-1, us-west-2, us-east-1, eu-central-1, ap-southeast-1
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

// ── Help ─────────────────────────────────────────────────────────────────────

if (process.argv[2] === '--help' || process.argv[2] === '-h') {
  console.log(`
  validate-pricing.mjs — Validate AWS pricing params for any region

  Usage:
    AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs [region] [region_name]

  Examples:
    # Mumbai (default)
    AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs

    # Other regions
    AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs eu-west-1 "EU (Ireland)"
    AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs us-west-2 "US West (Oregon)"

  Arguments:
    region          AWS region code (default: ap-south-1)
    region_name     Full region name for API queries (auto-detected if omitted)

  Supported regions: ap-south-1, eu-west-1, us-west-2, us-east-1, eu-central-1, ap-southeast-1

  Output:
    - Section 1: Per-param LIVE vs FALLBACK status
    - Section 2: Static baseline params
    - Section 3: Keys in us-east-1.json not in worker
    - Section 4: Keys in worker not in us-east-1.json
    - Section 5: Potential key-name mismatches

  All values compared against us-east-1.json as the fallback baseline.
`);
  process.exit(0);
}

// ── Check AWS credentials ────────────────────────────────────────────────────

const accessKeyId     = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const sessionToken    = process.env.AWS_SESSION_TOKEN;

if (!accessKeyId || !secretAccessKey) {
  console.error('\n  Error: AWS credentials not set.');
  console.error('  Usage: AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx node scripts/validate-pricing.mjs [region]\n');
  console.error('  Run with --help for more info.\n');
  process.exit(1);
}

// ── Import AWS SDK ───────────────────────────────────────────────────────────

let PricingClient, GetProductsCommand;
try {
  const mod = await import('@aws-sdk/client-pricing');
  PricingClient = mod.PricingClient;
  GetProductsCommand = mod.GetProductsCommand;
} catch {
  console.error('\n  Missing dependency. Run:\n    npm install @aws-sdk/client-pricing\n');
  process.exit(1);
}

// ── Config ───────────────────────────────────────────────────────────────────

const REGION_CODE = process.argv[2] || 'ap-south-1';
let REGION_NAME = process.argv[3] || 'Asia Pacific (Mumbai)';

// AWS region name → full name mapping
const REGION_MAP = {
  'ap-south-1': 'Asia Pacific (Mumbai)',
  'eu-west-1': 'EU (Ireland)',
  'us-west-2': 'US West (Oregon)',
  'us-east-1': 'US East (N. Virginia)',
  'eu-central-1': 'EU (Frankfurt)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
};

if (!process.argv[3] && REGION_MAP[REGION_CODE]) {
  // Auto-map if not provided
  REGION_NAME = REGION_MAP[REGION_CODE];
}
const RATE_LIMIT_MS = 230;   // 200ms min + buffer
const THROTTLE_WAIT = 4500;
const TOLERANCE = 1e-8;  // floating-point equality tolerance

// ── ANSI colours ─────────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  grey: '\x1b[90m',
};
const fmt = {
  live: s => `${C.green}${s}${C.reset}`,
  fallback: s => `${C.yellow}${s}${C.reset}`,
  static: s => `${C.grey}${s}${C.reset}`,
  mismatch: s => `${C.red}${s}${C.reset}`,
  ok: s => `${C.green}${s}${C.reset}`,
  dim: s => `${C.dim}${s}${C.reset}`,
  header: s => `${C.bold}${C.cyan}${s}${C.reset}`,
  warn: s => `${C.yellow}⚠  ${s}${C.reset}`,
  err: s => `${C.red}✖  ${s}${C.reset}`,
};

// ── AWS Pricing client ───────────────────────────────────────────────────────

const client = new PricingClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function round(n, d = 10) { return n === null ? null : parseFloat(n.toFixed(d)); }

function extractMaxPrice(raw) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const onDemand = parsed.terms?.OnDemand;
    if (!onDemand) return null;
    const offer = Object.values(onDemand)[0];
    const dims = Object.values(offer?.priceDimensions ?? {});
    let max = -1;
    for (const d of dims) {
      const v = parseFloat(d?.pricePerUnit?.USD ?? '-1');
      if (v > max) max = v;
    }
    return max >= 0 ? max : null;
  } catch { return null; }
}

let callCount = 0;

async function query(serviceCode, filters, predicate = null, maxResults = 25) {
  await sleep(RATE_LIMIT_MS);
  callCount++;

  const attempt = async () => {
    try {
      const resp = await client.send(new GetProductsCommand({
        ServiceCode: serviceCode,
        Filters: filters.map(f => ({ Type: 'TERM_MATCH', Field: f.Field, Value: f.Value })),
        MaxResults: maxResults,
      }));
      if (!resp.PriceList?.length) return null;
      if (predicate) {
        const match = resp.PriceList.find(raw => {
          try { return predicate(JSON.parse(raw)); } catch { return false; }
        }) ?? resp.PriceList[0];
        return extractMaxPrice(match);
      }
      return extractMaxPrice(resp.PriceList[0]);
    } catch (e) {
      const name = e.name ?? '';
      if (name.includes('Throttl') || name.includes('RateExceeded')) {
        process.stdout.write(` [throttle — waiting ${THROTTLE_WAIT}ms]`);
        await sleep(THROTTLE_WAIT);
        return attempt();
      }
      process.stdout.write(` [SDK error: ${e.message?.slice(0, 60)}]`);
      return null;
    }
  };
  return attempt();
}

// ── Deep object helpers ──────────────────────────────────────────────────────

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function deepGet(obj, path) {
  const parts = path.split('.');
  if (parts.length > 2 && parts[1] === 'instances') {
    const service = parts[0];
    const key = parts.slice(2).join('.');
    return obj?.[service]?.instances?.[key];
  }
  return parts.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function flatKeys(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatKeys(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
}

function approxEq(a, b) {
  if (a === b) return true;
  if (typeof a !== 'number' || typeof b !== 'number') return false;
  if (a === 0 && b === 0) return true;
  return Math.abs(a - b) / (Math.max(Math.abs(a), Math.abs(b))) < TOLERANCE;
}

// ── Load us-east-1.json ──────────────────────────────────────────────────────

const jsonPath = resolve(ROOT, 'frontend/src/app/core/data/regions/us-east-1.json');
let usEast1Json;
try {
  usEast1Json = JSON.parse(readFileSync(jsonPath, 'utf8')).services;
} catch (e) {
  console.error(`\n  Cannot read ${jsonPath}: ${e.message}\n`);
  process.exit(1);
}

// ── Baseline (must stay in sync with worker/src/schema-builder.ts) ───────────
// Exact copy of BASELINE_SERVICES from schema-builder.ts

const BASELINE = {
  client: { dataTransferGB: 0.09 },
  route53: { zoneMonthly: 0.50, standardM: 0.40 },
  cloudfront: { dtOut: { 'us-eu': 0.085, 'ap': 0.12, 'sa': 0.16, 'au': 0.114, 'me-af': 0.11 }, requestsM: { 'us-eu': 1.0, 'ap': 1.20, 'sa': 1.60, 'au': 1.20, 'me-af': 1.20 }, wafBase: 5.0, wafRequestM: 0.60 },
  apiGateway: {
    requestsM: {
      http: {
        tier1: 1.00,
        tier2: 0.90
      },
      rest: {
        tier1: 3.50,
        tier2: 2.80,
        tier3: 2.38,
        tier4: 1.51
      },
      websocket: {
        tier1: 1.00,
        tier2: 0.80
      }
    },
    cacheRates: {
      '0': 0.0,
      '0.5': 14.60,
      '1.6': 27.74,
      '6.1': 146.00,
      '13.5': 182.50,
      '28.4': 365.00,
      '58.2': 730.00,
      '118.0': 1343.20,
      '237.0': 2555.00
    },
    wsConnectionMinuteM: 0.25
  },
  elb: {
    types: {
      alb: { hourly: 0.0225, lcuHour: 0.008 },
      nlb: { hourly: 0.0225, lcuHour: 0.006 },
      clb: { hourly: 0.0250, dataGB: 0.008 },
      gwlb: { hourly: 0.0125, lcuHour: 0.004 }
    }
  },
  vpc: { endpointHourly: 0.01, endpointGB: 0.01, publicIpv4Hourly: 0.005 },
  ec2: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, 'metal': 96.0 },
    purchaseDiscounts: { 'on-demand': 0, 'spot': 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45
  },
  ecs: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.50, windowsCpuPremium: 0.046, windowsMemPremium: 0.004, publicIpHour: 0.005, instances: { 't3.medium': 0.0416, 'm5.large': 0.096, 'm6g.large': 0.077 }, ebsGBMonth: 0.08, reservedDiscount: 0.40 },
  autoScalingGroup: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, metal: 96.0 },
    purchaseDiscounts: { 'on-demand': 0, spot: 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45,
  },
  lambda: { requestM: 0.20, gbSec_x86: 0.0000166667, gbSec_arm: 0.0000133334, ephemeralGB_Sec: 0.0000000309, provConcurrency_x86: 0.015, provConcurrency_arm: 0.012 },
  sqs: { standard: 0.40, fifo: 0.50 },
  sns: { publish: 0.50, http: 0.60, email: 20.00 },
  s3: { storage: { standard: 0.023, intelligent: 0.023, sia: 0.0125, glacier: 0.0036 }, puts: { standard: 5.0, intelligent: 5.0, sia: 10.0, glacier: 30.0 }, gets: { standard: 0.40, intelligent: 0.40, sia: 1.00, glacier: 10.0 }, dataTransferGB: 0.09 },
  rds: { engines: { mysql: 1.0, postgresql: 1.05, mariadb: 1.0, 'sqlserver-ex': 1.2, 'oracle-se2': 1.8 }, instances: { 'db.t3.medium': 0.068, 'db.m5.large': 0.171, 'db.r5.large': 0.240, 'db.r6g.large': 0.216 }, multiAzMultiplier: 2.0, storage: { gp2: 0.115, gp3: 0.115, io1: 0.125 }, backupGB: 0.095 },
  elastiCache: { instances: { 'cache.t3.micro': 0.016, 'cache.t3.medium': 0.068, 'cache.m5.large': 0.156, 'cache.r6g.large': 0.211 }, tieringPremium: 1.15 },
  dynamoDb: { std: { readM: 0.25, writeM: 1.25, storageGB: 0.25, wcuHr: 0.00065, rcuHr: 0.000130 }, ia: { readM: 0.3125, writeM: 1.5625, storageGB: 0.10, wcuHr: 0.0008125, rcuHr: 0.0001625 }, globalMultiplier: 1.5 },
  iam: {},
  cloudWatch: { metricRate: 0.30, logsGB: 0.50, dashboard: 3.00, alarmMonth: 0.10, logsStorageGB: 0.03 },
  stepFunctions: { standardM: 25.00, expressReq: 1.00, expressGBsec: 16.67 },
  natGateway: { hourly: 0.045, dataGB: 0.045 },
  securityGroup: {},
  batch: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.50 },
  eks: { clusterHourlyStandard: 0.10, clusterHourlyExtended: 0.60, cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, natHourly: 0.045, natDataGB: 0.045, logsGB: 0.50, instances: { 't3.medium': 0.0416, 't3.large': 0.0832, 'm5.large': 0.096, 'm5.xlarge': 0.192, 'm6g.large': 0.077 }, ebsGBMonth: 0.08, reservedDiscount: 0.40, containerInsightsPerNode: 2.5 },
  aurora: { serverlessAcuHour: 0.12, instances: { 'db.t3.medium': 0.082, 'db.r5.large': 0.290, 'db.r6g.large': 0.260 }, storageGB: 0.10, ioRequestPerM: 0.20 },
  eventBridge: { eventM: 1.00 },
  kinesis: { shardHour: 0.015, putM: 0.014, retentionGB: 0.023 },
  msk: { instances: { 'kafka.t3.small': 0.0466, 'kafka.m5.large': 0.21 }, storageGB: 0.10 },
  cognito: { freeTier: 50000, ratePerUser: 0.0055 },
  waf: { aclMonth: 5.0, ruleMonth: 1.0, reqM: 0.60 },
  efs: { storage: { standard: 0.30, ia: 0.016 }, throughputMBps: 6.0 },
  athena: { perTB: 5.00 },
  secretsManager: { secretMonth: 0.40, callM: 5.00 },
  transitGateway: { attachmentHourly: 0.05, dataGB: 0.02 },
  directConnect: { portRates: { '1g': 0.30, '10g': 2.25, '100g': 22.5 }, dataTransferGB: 0.02 },
  globalAccelerator: { hourly: 0.025, dataGB: 0.015 },
  xray: { recordM: 5.00, scanM: 0.50 },
  openSearch: { instances: { 't3.medium': 0.073, 'm6g.large': 0.129, 'r6g.large': 0.167 }, storageGB: 0.122 },
  redshift: { instances: { 'ra3.xlplus': 1.086, 'ra3.4xlarge': 3.26 }, rpuHour: 0.375, storageTB: 24.576 },
  glue: { dpuHour: 0.44 },
  emr: { instances: { 'm5.large': 0.12, 'm5.xlarge': 0.24, 'r5.xlarge': 0.31 } },
  kinesisFirehose: { ingestGB: 0.029, convertGB: 0.018 },
  mq: { instances: { 'mq.t3.micro': 0.034, 'mq.m5.large': 0.288 }, storageGB: 0.30 },
  kms: { keyMonth: 1.00, reqM: 3.00 },
  shield: { advancedMonth: 3000 },
  organizations: {},
  codePipeline: { pipelineMonth: 1.00 },
  codeBuild: { rates: { 'general1.small': 0.005, 'general1.medium': 0.010, 'general1.large': 0.020, 'gpu1.large': 0.950 } },
  codeDeploy: { updateRate: 0.02 },
  bedrock: { inM: { 'claude-haiku': 0.25, 'claude-sonnet': 3.00, 'claude-opus': 15.00, 'llama-70b': 0.99, 'titan': 0.15 }, outM: { 'claude-haiku': 1.25, 'claude-sonnet': 15.00, 'claude-opus': 75.00, 'llama-70b': 1.20, 'titan': 0.20 } },
  sageMaker: { instances: { 'ml.t3.medium': 0.056, 'ml.m5.large': 0.134, 'ml.m5.xlarge': 0.269, 'ml.p3.2xlarge': 4.284 }, trainingHourly: 1.50, serverlessGBsec: 0.000020, serverlessReqM: 0.20 },
  appSync: { reqM: 4.00, dtGB: 0.09 },
  iotCore: { msgM: 1.00, ruleM: 0.15 },
  rekognition: { imageM: 1000 },
  textract: { pageM: 1500, pageRates: { detect: 1500, tables: 15000, forms: 50000, formsTables: 65000 } },
  mediaConvert: { minHD: 0.017 },
  cloudTrail: { eventM: 1.00 },
  backup: { warmGB: 0.05, coldGB: 0.01 },
  appRunner: { cpuHour: 0.064, memHour: 0.007 },
  elasticBeanstalk: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, metal: 96.0 },
    purchaseDiscounts: { 'on-demand': 0, spot: 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45,
  },
  fsx: { windowsSingle: 0.13, windowsMulti: 0.23, lustreSingle: 0.14, lustreMulti: 0.14, ontapSingle: 0.13, ontapMulti: 0.26, throughputRate: 1.18 },
  certificateManager: {},
  systemsManager: { instHour: 0.00695, callM: 5.00 },
  ecr: { storageGB: 0.10, dataTransferGB: 0.09 },
  privateLink: { endpointHourly: 0.01, dataGB: 0.01 },
};

// ── Build pricing (same logic as buildPricingFile in schema-builder.ts) ───────
// Each record: { path, status: 'live'|'fallback', apiValue, finalValue }

const svc = deepClone(BASELINE);
const records = [];  // { path, status, apiValue, finalValue }
const livePaths = new Set();

function track(path, apiValue, finalValue) {
  const status = apiValue !== null ? 'live' : 'fallback';
  if (apiValue !== null) livePaths.add(path);
  records.push({ path, status, apiValue, finalValue });
}

console.log(fmt.header('\n══════════════════════════════════════════════════════'));
console.log(fmt.header(` AWS Pricing Validator — ${REGION_CODE}`));
console.log(fmt.header('══════════════════════════════════════════════════════'));
console.log(`  Region code      : ${REGION_CODE}`);
console.log(`  Region name      : ${REGION_NAME}`);
console.log(`  Fallback source  : us-east-1.json`);
console.log(`  Date             : ${new Date().toISOString()}\n`);
console.log('  Running API queries (this takes ~3–4 minutes due to rate limiting)...\n');

const loc = REGION_NAME;

// ── Route 53 ─────────────────────────────────────────────────────────────────
process.stdout.write('  [Route53]      zone, queries...');
const r53Zone = await query('AmazonRoute53', [{ Field: 'productFamily', Value: 'DNS Zone' }, { Field: 'usagetype', Value: 'HostedZone' }]);
const r53Qry = await query('AmazonRoute53', [{ Field: 'productFamily', Value: 'DNS Query' }, { Field: 'routingType', Value: 'Standard' }, { Field: 'routingTarget', Value: 'External' }]);
if (r53Zone !== null) svc.route53.zoneMonthly = round(r53Zone, 2);
if (r53Qry !== null) svc.route53.standardM = round(r53Qry * 1_000_000, 2);
track('route53.zoneMonthly', r53Zone !== null ? round(r53Zone, 2) : null, svc.route53.zoneMonthly);
track('route53.standardM', r53Qry !== null ? round(r53Qry * 1_000_000, 2) : null, svc.route53.standardM);
console.log(' done');

// ── ELB ───────────────────────────────────────────────────────────────────────
process.stdout.write('  [ELB]          alb, nlb, clb, gwlb...');
const albHr = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Application' }, { Field: 'operation', Value: 'LoadBalancing:Application' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Application Load Balancer' }]);
const albLcu = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Application' }, { Field: 'operation', Value: 'LoadBalancing:Application' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'Used Application Load Balancer capacity units-hr' }]);
const nlbHr = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Network' }, { Field: 'operation', Value: 'LoadBalancing:Network' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Network Load Balancer' }]);
const nlbLcu = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Network' }, { Field: 'operation', Value: 'LoadBalancing:Network' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'Used Network Load Balancer capacity units-hr' }]);
const clbHr = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer' }, { Field: 'operation', Value: 'LoadBalancing' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'LoadBalancer hourly usage' }]);
const clbData = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer' }, { Field: 'operation', Value: 'LoadBalancing' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'Data processed by Classic Load Balancer' }]);
const gwlbHr = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Gateway' }, { Field: 'operation', Value: 'LoadBalancing:Gateway' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Gateway Load Balancer' }]);
const gwlbLcu = await query('AWSELB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Load Balancer-Gateway' }, { Field: 'operation', Value: 'LoadBalancing:Gateway' }, { Field: 'locationType', Value: 'AWS Region' }, { Field: 'groupDescription', Value: 'Used Gateway Load Balancer capacity units-hr' }]);
if (albHr !== null) { svc.elb.types.alb.hourly = round(albHr, 4); svc.ecs.elbHourly = svc.elb.types.alb.hourly; svc.eks.elbHourly = svc.elb.types.alb.hourly; }
if (albLcu !== null) svc.elb.types.alb.lcuHour = round(albLcu, 4);
if (nlbHr !== null) svc.elb.types.nlb.hourly = round(nlbHr, 4);
if (nlbLcu !== null) svc.elb.types.nlb.lcuHour = round(nlbLcu, 4);
if (clbHr !== null) svc.elb.types.clb.hourly = round(clbHr, 4);
if (clbData !== null) svc.elb.types.clb.dataGB = round(clbData, 4);
if (gwlbHr !== null) svc.elb.types.gwlb.hourly = round(gwlbHr, 4);
if (gwlbLcu !== null) svc.elb.types.gwlb.lcuHour = round(gwlbLcu, 4);
track('elb.types.alb.hourly', albHr !== null ? round(albHr, 4) : null, svc.elb.types.alb.hourly);
track('elb.types.alb.lcuHour', albLcu !== null ? round(albLcu, 4) : null, svc.elb.types.alb.lcuHour);
track('elb.types.nlb.hourly', nlbHr !== null ? round(nlbHr, 4) : null, svc.elb.types.nlb.hourly);
track('elb.types.nlb.lcuHour', nlbLcu !== null ? round(nlbLcu, 4) : null, svc.elb.types.nlb.lcuHour);
track('elb.types.clb.hourly', clbHr !== null ? round(clbHr, 4) : null, svc.elb.types.clb.hourly);
track('elb.types.clb.dataGB', clbData !== null ? round(clbData, 4) : null, svc.elb.types.clb.dataGB);
track('elb.types.gwlb.hourly', gwlbHr !== null ? round(gwlbHr, 4) : null, svc.elb.types.gwlb.hourly);
track('elb.types.gwlb.lcuHour', gwlbLcu !== null ? round(gwlbLcu, 4) : null, svc.elb.types.gwlb.lcuHour);
console.log(' done');

// ── NAT Gateway ───────────────────────────────────────────────────────────────
process.stdout.write('  [NAT Gateway]  hourly, data...');
const natHr = await query('AmazonEC2', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'NAT Gateway' }, { Field: 'operation', Value: 'NatGateway' }, { Field: 'groupDescription', Value: 'Hourly charge for NAT Gateways' }]);
const natData = await query('AmazonEC2', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'NAT Gateway' }, { Field: 'operation', Value: 'NatGateway' }, { Field: 'groupDescription', Value: 'Charge for per GB data processed by NatGateways' }]);
if (natHr !== null) { svc.natGateway.hourly = round(natHr, 4); svc.eks.natHourly = svc.natGateway.hourly; }
if (natData !== null) { svc.natGateway.dataGB = round(natData, 4); svc.eks.natDataGB = svc.natGateway.dataGB; }
track('natGateway.hourly', natHr !== null ? round(natHr, 4) : null, svc.natGateway.hourly);
track('natGateway.dataGB', natData !== null ? round(natData, 4) : null, svc.natGateway.dataGB);
console.log(' done');

// ── Data Transfer Out ─────────────────────────────────────────────────────────
process.stdout.write('  [DataTransfer] egress...');
const dtRaw = await query('AWSDataTransfer', [{ Field: 'fromLocation', Value: loc }, { Field: 'toLocation', Value: 'External' }, { Field: 'transferType', Value: 'AWS Outbound' }], p => {
  const dim = Object.values(p.terms?.OnDemand ?? {});
  if (!dim.length) return false;
  return Object.values(dim[0]?.priceDimensions ?? {}).some(d => parseFloat(d.pricePerUnit?.USD) > 0);
});
const egressRate = dtRaw ?? 0.09;
svc.client.dataTransferGB = round(egressRate, 4);
svc.ec2.dataTransferGB = round(egressRate, 4);
svc.s3.dataTransferGB = round(egressRate, 4);
svc.ecs.dataTransferGB = round(egressRate, 4);
svc.eks.dataTransferGB = round(egressRate, 4);
svc.batch.dataTransferGB = round(egressRate, 4);
svc.autoScalingGroup.dataTransferGB = round(egressRate, 4);
svc.elasticBeanstalk.dataTransferGB = round(egressRate, 4);
track('client.dataTransferGB', dtRaw !== null ? round(egressRate, 4) : null, svc.client.dataTransferGB);
console.log(' done');

// ── EC2 Instances ─────────────────────────────────────────────────────────────
process.stdout.write('  [EC2]          instance families (t3,m5,m6g,c5,c6g,r5,r6g)...');
const ec2Families = { t3: 't3.large', m5: 'm5.large', m6g: 'm6g.large', c5: 'c5.large', c6g: 'c6g.large', r5: 'r5.large', r6g: 'r6g.large' };
for (const [fam, inst] of Object.entries(ec2Families)) {
  const p = await query('AmazonEC2', [
    { Field: 'location', Value: loc }, { Field: 'instanceType', Value: inst },
    { Field: 'operatingSystem', Value: 'Linux' }, { Field: 'tenancy', Value: 'Shared' },
    { Field: 'preInstalledSw', Value: 'NA' }, { Field: 'capacitystatus', Value: 'Used' },
  ]);
  if (p !== null) {
    const pr = round(p, 6);
    svc.ec2.familyRatesLarge[fam] = pr;
    svc.autoScalingGroup.familyRatesLarge[fam] = pr;
    svc.elasticBeanstalk.familyRatesLarge[fam] = pr;
    if (fam === 't3') {
      svc.eks.instances['t3.large'] = pr;
      svc.ecs.instances['t3.medium'] = round(p * 0.5, 6);
    }
    if (fam === 'm5') {
      svc.eks.instances['m5.large'] = pr;
      svc.eks.instances['m5.xlarge'] = round(p * 2, 6);
      svc.ecs.instances['m5.large'] = pr;
    }
    if (fam === 'm6g') {
      svc.eks.instances['m6g.large'] = pr;
      svc.ecs.instances['m6g.large'] = pr;
    }
  }
  track(`ec2.familyRatesLarge.${fam}`, p !== null ? round(p, 6) : null, svc.ec2.familyRatesLarge[fam]);
}
console.log(' done');

// ── EBS ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [EC2-EBS]      gp2, gp3, io2...');
const ebsGp2 = await query('AmazonEC2', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeType', Value: 'General Purpose' }, { Field: 'storageMedia', Value: 'SSD-backed' }]);
const ebsGp3 = await query('AmazonEC2', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeApiName', Value: 'gp3' }]);
const ebsIo2 = await query('AmazonEC2', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeApiName', Value: 'io2' }]);
if (ebsGp2 !== null) svc.ec2.ebsRates.gp2 = round(ebsGp2, 4);
if (ebsGp3 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp3, 4);
else if (ebsGp2 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp2 * 0.8, 4);
if (ebsIo2 !== null) svc.ec2.ebsRates.io2 = round(ebsIo2, 4);
svc.autoScalingGroup.ebsRates = { ...svc.ec2.ebsRates };
svc.elasticBeanstalk.ebsRates = { ...svc.ec2.ebsRates };
svc.ecs.ebsGBMonth = svc.ec2.ebsRates.gp3;
svc.eks.ebsGBMonth = svc.ec2.ebsRates.gp3;
track('ec2.ebsRates.gp2', ebsGp2 !== null ? round(ebsGp2, 4) : null, svc.ec2.ebsRates.gp2);
track('ec2.ebsRates.gp3', ebsGp3 !== null ? round(ebsGp3, 4) : null, svc.ec2.ebsRates.gp3);
track('ec2.ebsRates.io2', ebsIo2 !== null ? round(ebsIo2, 4) : null, svc.ec2.ebsRates.io2);
console.log(' done');

// ── ECS Fargate ───────────────────────────────────────────────────────────────
process.stdout.write('  [ECS Fargate]  cpu, mem, arm-cpu, arm-mem, ephemeral...');
const cpuX86 = await query('AmazonECS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Compute' }, { Field: 'cputype', Value: 'perCPU' }], p => { const a = p.product?.attributes ?? {}; return a.cpuArchitecture !== 'ARM' && a.operatingSystem !== 'Windows'; });
const memX86 = await query('AmazonECS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Compute' }, { Field: 'memorytype', Value: 'perGB' }], p => { const a = p.product?.attributes ?? {}; return a.cpuArchitecture !== 'ARM' && a.operatingSystem !== 'Windows'; });
const cpuArm = await query('AmazonECS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Compute' }, { Field: 'cputype', Value: 'perCPU' }], p => { const a = p.product?.attributes ?? {}; return a.cpuArchitecture === 'ARM' && a.operatingSystem !== 'Windows'; });
const memArm = await query('AmazonECS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Compute' }, { Field: 'memorytype', Value: 'perGB' }], p => { const a = p.product?.attributes ?? {}; return a.cpuArchitecture === 'ARM' && a.operatingSystem !== 'Windows'; });
const eph = await query('AmazonECS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Compute' }, { Field: 'storagetype', Value: 'default' }]);
if (cpuX86 !== null) { svc.ecs.cpuHour = round(cpuX86, 6); svc.eks.cpuHour = svc.ecs.cpuHour; svc.batch.cpuHour = svc.ecs.cpuHour; }
if (memX86 !== null) { svc.ecs.memHour = round(memX86, 6); svc.eks.memHour = svc.ecs.memHour; svc.batch.memHour = svc.ecs.memHour; }
if (cpuArm !== null) { svc.ecs.armCpuHour = round(cpuArm, 6); svc.eks.armCpuHour = svc.ecs.armCpuHour; svc.batch.armCpuHour = svc.ecs.armCpuHour; }
if (memArm !== null) { svc.ecs.armMemHour = round(memArm, 6); svc.eks.armMemHour = svc.ecs.armMemHour; svc.batch.armMemHour = svc.ecs.armMemHour; }
if (eph !== null) { svc.ecs.ephemeralGBHour = round(eph, 8); svc.eks.ephemeralGBHour = svc.ecs.ephemeralGBHour; }
track('ecs.cpuHour', cpuX86 !== null ? round(cpuX86, 6) : null, svc.ecs.cpuHour);
track('ecs.memHour', memX86 !== null ? round(memX86, 6) : null, svc.ecs.memHour);
track('ecs.armCpuHour', cpuArm !== null ? round(cpuArm, 6) : null, svc.ecs.armCpuHour);
track('ecs.armMemHour', memArm !== null ? round(memArm, 6) : null, svc.ecs.armMemHour);
track('ecs.ephemeralGBHour', eph !== null ? round(eph, 8) : null, svc.ecs.ephemeralGBHour);
console.log(' done');

// ── Lambda ────────────────────────────────────────────────────────────────────
process.stdout.write('  [Lambda]       requests, duration...');
const lambdaReq = await query('AWSLambda', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Serverless' }, { Field: 'group', Value: 'AWS-Lambda-Requests' }]);
const lambdaDur = await query('AWSLambda', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Serverless' }, { Field: 'group', Value: 'AWS-Lambda-Duration' }], p => (p.product?.attributes?.cpuArchitecture ?? '') !== 'ARM64');
if (lambdaReq !== null) svc.lambda.requestM = round(lambdaReq * 1_000_000, 4);
if (lambdaDur !== null) { svc.lambda.gbSec_x86 = round(lambdaDur, 10); svc.lambda.gbSec_arm = round(lambdaDur * 0.8, 10); }
track('lambda.requestM', lambdaReq !== null ? round(lambdaReq * 1_000_000, 4) : null, svc.lambda.requestM);
track('lambda.gbSec_x86', lambdaDur !== null ? round(lambdaDur, 10) : null, svc.lambda.gbSec_x86);
track('lambda.gbSec_arm', lambdaDur !== null ? round(lambdaDur * 0.8, 10) : null, svc.lambda.gbSec_arm);
console.log(' done');

// ── S3 ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [S3]           standard, IA, glacier...');
const s3Std = await query('AmazonS3', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeType', Value: 'Standard' }]);
const s3Ia = await query('AmazonS3', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeType', Value: 'Standard - Infrequent Access' }]);
const s3Glac = await query('AmazonS3', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Storage' }, { Field: 'volumeType', Value: 'Amazon Glacier' }]);
if (s3Std !== null) { svc.s3.storage.standard = round(s3Std, 4); svc.s3.storage.intelligent = svc.s3.storage.standard; }
if (s3Ia !== null) svc.s3.storage.sia = round(s3Ia, 4);
if (s3Glac !== null) svc.s3.storage.glacier = round(s3Glac, 4);
track('s3.storage.standard', s3Std !== null ? round(s3Std, 4) : null, svc.s3.storage.standard);
track('s3.storage.sia', s3Ia !== null ? round(s3Ia, 4) : null, svc.s3.storage.sia);
track('s3.storage.glacier', s3Glac !== null ? round(s3Glac, 4) : null, svc.s3.storage.glacier);
console.log(' done');

// ── RDS ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [RDS]          instances, storage...');
const rdsT3 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.t3.medium' }, { Field: 'databaseEngine', Value: 'MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'licenseModel', Value: 'No license required' }]);
const rdsM5 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.m5.large' }, { Field: 'databaseEngine', Value: 'MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'licenseModel', Value: 'No license required' }]);
const rdsR5 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.r5.large' }, { Field: 'databaseEngine', Value: 'MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'licenseModel', Value: 'No license required' }]);
const rdsR6g = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.r6g.large' }, { Field: 'databaseEngine', Value: 'MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'licenseModel', Value: 'No license required' }]);
const rdsGp2 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Database Storage' }, { Field: 'volumeType', Value: 'General Purpose (SSD)' }]);
if (rdsT3 !== null) svc.rds.instances['db.t3.medium'] = round(rdsT3, 4);
if (rdsM5 !== null) svc.rds.instances['db.m5.large'] = round(rdsM5, 4);
if (rdsR5 !== null) svc.rds.instances['db.r5.large'] = round(rdsR5, 4);
if (rdsR6g !== null) svc.rds.instances['db.r6g.large'] = round(rdsR6g, 4);
if (rdsGp2 !== null) { svc.rds.storage.gp2 = round(rdsGp2, 4); svc.rds.storage.gp3 = svc.rds.storage.gp2; }
track('rds.instances.db.t3.medium', rdsT3 !== null ? round(rdsT3, 4) : null, svc.rds.instances['db.t3.medium']);
track('rds.instances.db.m5.large', rdsM5 !== null ? round(rdsM5, 4) : null, svc.rds.instances['db.m5.large']);
track('rds.instances.db.r5.large', rdsR5 !== null ? round(rdsR5, 4) : null, svc.rds.instances['db.r5.large']);
track('rds.instances.db.r6g.large', rdsR6g !== null ? round(rdsR6g, 4) : null, svc.rds.instances['db.r6g.large']);
track('rds.storage.gp2', rdsGp2 !== null ? round(rdsGp2, 4) : null, svc.rds.storage.gp2);
console.log(' done');

// ── Aurora ────────────────────────────────────────────────────────────────────
process.stdout.write('  [Aurora]       serverless ACU, instances...');
const aurAcu = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Serverless' }, { Field: 'databaseEngine', Value: 'Aurora MySQL' }]);
const aurT3 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.t3.medium' }, { Field: 'databaseEngine', Value: 'Aurora MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }]);
const aurR5 = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.r5.large' }, { Field: 'databaseEngine', Value: 'Aurora MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }]);
const aurR6g = await query('AmazonRDS', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'db.r6g.large' }, { Field: 'databaseEngine', Value: 'Aurora MySQL' }, { Field: 'deploymentOption', Value: 'Single-AZ' }]);
if (aurAcu !== null) svc.aurora.serverlessAcuHour = round(aurAcu, 4);
if (aurT3 !== null) svc.aurora.instances['db.t3.medium'] = round(aurT3, 4);
if (aurR5 !== null) svc.aurora.instances['db.r5.large'] = round(aurR5, 4);
if (aurR6g !== null) svc.aurora.instances['db.r6g.large'] = round(aurR6g, 4);
track('aurora.serverlessAcuHour', aurAcu !== null ? round(aurAcu, 4) : null, svc.aurora.serverlessAcuHour);
track('aurora.instances.db.t3.medium', aurT3 !== null ? round(aurT3, 4) : null, svc.aurora.instances['db.t3.medium']);
track('aurora.instances.db.r5.large', aurR5 !== null ? round(aurR5, 4) : null, svc.aurora.instances['db.r5.large']);
track('aurora.instances.db.r6g.large', aurR6g !== null ? round(aurR6g, 4) : null, svc.aurora.instances['db.r6g.large']);
console.log(' done');

// ── ElastiCache ───────────────────────────────────────────────────────────────
process.stdout.write('  [ElastiCache]  t3.micro, t3.medium, m5.large, r6g.large...');
const ecT3mi = await query('AmazonElastiCache', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'cache.t3.micro' }, { Field: 'cacheEngine', Value: 'Redis' }]);
const ecT3me = await query('AmazonElastiCache', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'cache.t3.medium' }, { Field: 'cacheEngine', Value: 'Redis' }]);
const ecM5 = await query('AmazonElastiCache', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'cache.m5.large' }, { Field: 'cacheEngine', Value: 'Redis' }]);
const ecR6g = await query('AmazonElastiCache', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'cache.r6g.large' }, { Field: 'cacheEngine', Value: 'Redis' }]);
if (ecT3mi !== null) svc.elastiCache.instances['cache.t3.micro'] = round(ecT3mi, 4);
if (ecT3me !== null) svc.elastiCache.instances['cache.t3.medium'] = round(ecT3me, 4);
if (ecM5 !== null) svc.elastiCache.instances['cache.m5.large'] = round(ecM5, 4);
if (ecR6g !== null) svc.elastiCache.instances['cache.r6g.large'] = round(ecR6g, 4);
track('elastiCache.instances.cache.t3.micro', ecT3mi !== null ? round(ecT3mi, 4) : null, svc.elastiCache.instances['cache.t3.micro']);
track('elastiCache.instances.cache.t3.medium', ecT3me !== null ? round(ecT3me, 4) : null, svc.elastiCache.instances['cache.t3.medium']);
track('elastiCache.instances.cache.m5.large', ecM5 !== null ? round(ecM5, 4) : null, svc.elastiCache.instances['cache.m5.large']);
track('elastiCache.instances.cache.r6g.large', ecR6g !== null ? round(ecR6g, 4) : null, svc.elastiCache.instances['cache.r6g.large']);
console.log(' done');

// ── DynamoDB ──────────────────────────────────────────────────────────────────
process.stdout.write('  [DynamoDB]     read, write, storage...');
const ddbR = await query('AmazonDynamoDB', [{ Field: 'location', Value: loc }, { Field: 'group', Value: 'DDB-ReadUnits' }]);
const ddbW = await query('AmazonDynamoDB', [{ Field: 'location', Value: loc }, { Field: 'group', Value: 'DDB-WriteUnits' }]);
const ddbS = await query('AmazonDynamoDB', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Database Storage' }, { Field: 'volumeType', Value: 'Amazon DynamoDB - Indexed DataStore' }]);
if (ddbR !== null) { const rm = round(ddbR * 1_000_000, 4); svc.dynamoDb.std.readM = rm; svc.dynamoDb.ia.readM = round(rm * 1.25, 4); }
if (ddbW !== null) { const wm = round(ddbW * 1_000_000, 4); svc.dynamoDb.std.writeM = wm; svc.dynamoDb.ia.writeM = round(wm * 1.25, 4); }
if (ddbS !== null) { svc.dynamoDb.std.storageGB = round(ddbS, 4); svc.dynamoDb.ia.storageGB = round(ddbS * 0.4, 4); }
track('dynamoDb.std.readM', ddbR !== null ? round(ddbR * 1_000_000, 4) : null, svc.dynamoDb.std.readM);
track('dynamoDb.std.writeM', ddbW !== null ? round(ddbW * 1_000_000, 4) : null, svc.dynamoDb.std.writeM);
track('dynamoDb.std.storageGB', ddbS !== null ? round(ddbS, 4) : null, svc.dynamoDb.std.storageGB);
console.log(' done');

// ── OpenSearch ────────────────────────────────────────────────────────────────
process.stdout.write('  [OpenSearch]   t3.medium, m6g.large, r6g.large, storage...');
const osT3 = await query('AmazonES', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 't3.medium.search' }]);
const osM6g = await query('AmazonES', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'm6g.large.search' }]);
const osR6g = await query('AmazonES', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'r6g.large.search' }]);
const osSto = await query('AmazonES', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Amazon OpenSearch Service Volume' }, { Field: 'storageMedia', Value: 'GP2' }]);
if (osT3 !== null) svc.openSearch.instances['t3.medium'] = round(osT3, 4);
if (osM6g !== null) svc.openSearch.instances['m6g.large'] = round(osM6g, 4);
if (osR6g !== null) svc.openSearch.instances['r6g.large'] = round(osR6g, 4);
if (osSto !== null) svc.openSearch.storageGB = round(osSto, 4);
track('openSearch.instances.t3.medium', osT3 !== null ? round(osT3, 4) : null, svc.openSearch.instances['t3.medium']);
track('openSearch.instances.m6g.large', osM6g !== null ? round(osM6g, 4) : null, svc.openSearch.instances['m6g.large']);
track('openSearch.instances.r6g.large', osR6g !== null ? round(osR6g, 4) : null, svc.openSearch.instances['r6g.large']);
track('openSearch.storageGB', osSto !== null ? round(osSto, 4) : null, svc.openSearch.storageGB);
console.log(' done');

// ── Redshift ──────────────────────────────────────────────────────────────────
process.stdout.write('  [Redshift]     ra3.xlplus, ra3.4xlarge, serverless...');
const rsXl = await query('AmazonRedshift', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'ra3.xlplus' }, { Field: 'productFamily', Value: 'Compute Instance' }]);
const rs4xl = await query('AmazonRedshift', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'ra3.4xlarge' }, { Field: 'productFamily', Value: 'Compute Instance' }]);
const rsRpu = await query('AmazonRedshift', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'Serverless' }, { Field: 'operation', Value: 'RunServerlessCompute:001' }]);
if (rsXl !== null) svc.redshift.instances['ra3.xlplus'] = round(rsXl, 4);
if (rs4xl !== null) svc.redshift.instances['ra3.4xlarge'] = round(rs4xl, 4);
if (rsRpu !== null) svc.redshift.rpuHour = round(rsRpu, 4);
track('redshift.instances.ra3.xlplus', rsXl !== null ? round(rsXl, 4) : null, svc.redshift.instances['ra3.xlplus']);
track('redshift.instances.ra3.4xlarge', rs4xl !== null ? round(rs4xl, 4) : null, svc.redshift.instances['ra3.4xlarge']);
track('redshift.rpuHour', rsRpu !== null ? round(rsRpu, 4) : null, svc.redshift.rpuHour);
console.log(' done');

// ── EMR ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [EMR]          m5.large, m5.xlarge, r5.xlarge...');
const emrM5x = await query('ElasticMapReduce', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'm5.xlarge' }]);
const emrR5x = await query('ElasticMapReduce', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'r5.xlarge' }]);
const emrM5l = emrM5x !== null ? emrM5x * 0.5 : null; // m5.large = 50% of m5.xlarge (same as fetcher fallback)
if (emrM5l !== null) svc.emr.instances['m5.large'] = round(emrM5l, 4);
if (emrM5x !== null) svc.emr.instances['m5.xlarge'] = round(emrM5x, 4);
if (emrR5x !== null) svc.emr.instances['r5.xlarge'] = round(emrR5x, 4);
track('emr.instances.m5.large', emrM5l !== null ? round(emrM5l, 4) : null, svc.emr.instances['m5.large']);
track('emr.instances.m5.xlarge', emrM5x !== null ? round(emrM5x, 4) : null, svc.emr.instances['m5.xlarge']);
track('emr.instances.r5.xlarge', emrR5x !== null ? round(emrR5x, 4) : null, svc.emr.instances['r5.xlarge']);
console.log(' done');

// ── MSK ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [MSK]          t3.small, m5.large...');
const mskT3 = await query('AmazonMSK', [{ Field: 'location', Value: loc }, { Field: 'computeFamily', Value: 't3.small' }, { Field: 'group', Value: 'Broker' }]);
const mskM5 = await query('AmazonMSK', [{ Field: 'location', Value: loc }, { Field: 'computeFamily', Value: 'm5.large' }, { Field: 'group', Value: 'Broker' }]);
if (mskT3 !== null) svc.msk.instances['kafka.t3.small'] = round(mskT3, 4);
if (mskM5 !== null) svc.msk.instances['kafka.m5.large'] = round(mskM5, 4);
track('msk.instances.kafka.t3.small', mskT3 !== null ? round(mskT3, 4) : null, svc.msk.instances['kafka.t3.small']);
track('msk.instances.kafka.m5.large', mskM5 !== null ? round(mskM5, 4) : null, svc.msk.instances['kafka.m5.large']);
console.log(' done');

// ── Amazon MQ ─────────────────────────────────────────────────────────────────
process.stdout.write('  [AmazonMQ]     t3.micro, m5.large...');
const mqT3 = await query('AmazonMQ', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 't3.micro' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'brokerEngine', Value: 'ActiveMQ' }]);
const mqM5 = await query('AmazonMQ', [{ Field: 'location', Value: loc }, { Field: 'instanceType', Value: 'm5.large' }, { Field: 'deploymentOption', Value: 'Single-AZ' }, { Field: 'brokerEngine', Value: 'ActiveMQ' }]);
if (mqT3 !== null) svc.mq.instances['mq.t3.micro'] = round(mqT3, 4);
if (mqM5 !== null) svc.mq.instances['mq.m5.large'] = round(mqM5, 4);
track('mq.instances.mq.t3.micro', mqT3 !== null ? round(mqT3, 4) : null, svc.mq.instances['mq.t3.micro']);
track('mq.instances.mq.m5.large', mqM5 !== null ? round(mqM5, 4) : null, svc.mq.instances['mq.m5.large']);
console.log(' done');

// ── Glue ──────────────────────────────────────────────────────────────────────
process.stdout.write('  [Glue]         DPU...');
const glueDpu = await query('AWSGlue', [{ Field: 'location', Value: loc }, { Field: 'group', Value: 'ETL Job run' }]);
if (glueDpu !== null) svc.glue.dpuHour = round(glueDpu, 4);
track('glue.dpuHour', glueDpu !== null ? round(glueDpu, 4) : null, svc.glue.dpuHour);
console.log(' done');

// ── Kinesis ───────────────────────────────────────────────────────────────────
process.stdout.write('  [Kinesis]      shard-hour, put-units...');
const kinSh = await query('AmazonKinesis', [{ Field: 'location', Value: loc }, { Field: 'group', Value: 'Provisioned shard hour' }]);
const kinPt = await query('AmazonKinesis', [{ Field: 'location', Value: loc }, { Field: 'group', Value: 'Payload Units' }]);
if (kinSh !== null) svc.kinesis.shardHour = round(kinSh, 4);
if (kinPt !== null) svc.kinesis.putM = round(kinPt * 1_000_000, 4);
track('kinesis.shardHour', kinSh !== null ? round(kinSh, 4) : null, svc.kinesis.shardHour);
track('kinesis.putM', kinPt !== null ? round(kinPt * 1_000_000, 4) : null, svc.kinesis.putM);
console.log(' done');

// ── EFS ────────────────────────────────────────────────────────────────────────
process.stdout.write('  [EFS]          standard, IA...');
const efsStd = await query('AmazonEFS', [{ Field: 'location', Value: loc }, { Field: 'storageClass', Value: 'General Purpose' }], p => (p.product?.attributes?.usagetype ?? '').includes('TimedStorage'));
const efsIa = await query('AmazonEFS', [{ Field: 'location', Value: loc }, { Field: 'storageClass', Value: 'Infrequent Access' }], p => (p.product?.attributes?.usagetype ?? '').includes('TimedStorage'));
if (efsStd !== null) svc.efs.storage.standard = round(efsStd, 4);
if (efsIa !== null) svc.efs.storage.ia = round(efsIa, 4);
track('efs.storage.standard', efsStd !== null ? round(efsStd, 4) : null, svc.efs.storage.standard);
track('efs.storage.ia', efsIa !== null ? round(efsIa, 4) : null, svc.efs.storage.ia);
console.log(' done');

// ── API Gateway ───────────────────────────────────────────────────────────────
process.stdout.write('  [API Gateway]  REST (scales tiers + cache)...');
const apiGw = await query('AmazonApiGateway', [{ Field: 'location', Value: loc }, { Field: 'productFamily', Value: 'API Calls' }]);
if (apiGw !== null) {
  const ratio = apiGw / 3.50;
  svc.apiGateway.requestsM.rest.tier1 = round(3.50 * ratio, 4);
  svc.apiGateway.requestsM.rest.tier2 = round(2.80 * ratio, 4);
  svc.apiGateway.requestsM.rest.tier3 = round(2.38 * ratio, 4);
  svc.apiGateway.requestsM.rest.tier4 = round(1.51 * ratio, 4);
  svc.apiGateway.requestsM.http.tier1 = round(1.00 * ratio, 4);
  svc.apiGateway.requestsM.http.tier2 = round(0.90 * ratio, 4);
  svc.apiGateway.requestsM.websocket.tier1 = round(1.00 * ratio, 4);
  svc.apiGateway.requestsM.websocket.tier2 = round(0.80 * ratio, 4);
  for (const sz of Object.keys(svc.apiGateway.cacheRates)) {
    svc.apiGateway.cacheRates[sz] = round(BASELINE.apiGateway.cacheRates[sz] * ratio, 2);
  }
  svc.apiGateway.wsConnectionMinuteM = round(BASELINE.apiGateway.wsConnectionMinuteM * ratio, 4);
}
track('apiGateway.requestsM.rest.tier1', apiGw !== null ? round(3.50 * (apiGw / 3.50), 4) : null, svc.apiGateway.requestsM.rest.tier1);
track('apiGateway.requestsM.http.tier1', apiGw !== null ? round(1.00 * (apiGw / 3.50), 4) : null, svc.apiGateway.requestsM.http.tier1);
track('apiGateway.wsConnectionMinuteM', apiGw !== null ? round(BASELINE.apiGateway.wsConnectionMinuteM * (apiGw / 3.50), 4) : null, svc.apiGateway.wsConnectionMinuteM);
console.log(' done');

console.log('\n  All queries complete. Total API calls: ' + callCount + '\n');

// ── Build final flat maps ─────────────────────────────────────────────────────

const workerKeys = flatKeys(svc);
const jsonKeys = flatKeys(usEast1Json);

const workerSet = new Set(workerKeys);
const jsonSet = new Set(jsonKeys);

// ── Section 1: Param-by-param report ─────────────────────────────────────────

console.log(fmt.header('══ SECTION 1 — Queried Params (LIVE vs FALLBACK) ══════════════════════'));
console.log(fmt.dim(`  ${'Path'.padEnd(55)} ${'Status'.padEnd(10)} ${'API Value'.padEnd(18)} ${'Baseline Value'.padEnd(18)} JSON Value`));
console.log(fmt.dim('  ' + '─'.repeat(115)));

let liveCount = 0, fallbackCount = 0, mismatchWithJson = 0;

for (const rec of records) {
  const jsonVal = deepGet(usEast1Json, rec.path);
  const isLive = rec.status === 'live';
  const statusStr = isLive ? fmt.live('LIVE    ') : fmt.fallback('FALLBACK');
  const apiStr = rec.apiValue !== null ? String(rec.apiValue).padEnd(18) : fmt.dim('(null)'.padEnd(18));
  const baseVal = deepGet(BASELINE, rec.path);
  const baseStr = baseVal !== undefined ? String(baseVal).padEnd(18) : fmt.dim('(missing)'.padEnd(18));

  let jsonStr;
  if (jsonVal === undefined) {
    jsonStr = fmt.mismatch('NOT IN JSON');
    mismatchWithJson++;
  } else if (!approxEq(rec.finalValue, jsonVal)) {
    jsonStr = fmt.mismatch(`${jsonVal}  ← MISMATCH`);
    mismatchWithJson++;
  } else {
    jsonStr = fmt.ok(String(jsonVal));
  }

  if (isLive) liveCount++; else fallbackCount++;

  console.log(`  ${rec.path.padEnd(55)} ${statusStr} ${apiStr}${baseStr}${jsonStr}`);
}

// ── Section 2: Static params (never queried) ──────────────────────────────────

console.log('\n' + fmt.header('══ SECTION 2 — Static Params (baseline only, never queried) ═══════════'));
console.log(fmt.dim(`  ${'Path'.padEnd(55)} ${'Baseline Value'.padEnd(20)} JSON Value`));
console.log(fmt.dim('  ' + '─'.repeat(95)));

const queriedPaths = new Set(records.map(r => r.path));
let staticMismatch = 0;

for (const key of workerKeys) {
  if (queriedPaths.has(key)) continue;
  const baseVal = deepGet(BASELINE, key);
  if (typeof baseVal !== 'number') continue; // skip non-numeric (empty objects, etc.)

  const jsonVal = deepGet(usEast1Json, key);
  let jsonStr;
  if (jsonVal === undefined) {
    jsonStr = fmt.mismatch('NOT IN JSON');
    staticMismatch++;
  } else if (!approxEq(baseVal, jsonVal)) {
    jsonStr = fmt.mismatch(`${jsonVal}  ← MISMATCH`);
    staticMismatch++;
  } else {
    jsonStr = fmt.ok(String(jsonVal));
  }
  console.log(`  ${key.padEnd(55)} ${String(baseVal).padEnd(20)}${jsonStr}`);
}

// ── Section 3: Keys in JSON not produced by worker ────────────────────────────

console.log('\n' + fmt.header('══ SECTION 3 — Keys in JSON not present in worker output ══════════════'));

const missingFromWorker = jsonKeys.filter(k => !workerSet.has(k));
if (missingFromWorker.length === 0) {
  console.log(fmt.ok('  None — all JSON keys are covered by the worker baseline.'));
} else {
  console.log(fmt.dim(`  ${'JSON Path'.padEnd(55)} JSON Value`));
  console.log(fmt.dim('  ' + '─'.repeat(75)));
  for (const k of missingFromWorker) {
    const v = deepGet(usEast1Json, k);
    console.log(fmt.mismatch(`  ${k.padEnd(55)} ${v}`));
  }
}

// ── Section 4: Keys in worker not in JSON ─────────────────────────────────────

console.log('\n' + fmt.header('══ SECTION 4 — Keys in worker baseline not present in JSON ════════════'));

const missingFromJson = workerKeys.filter(k => {
  const v = deepGet(BASELINE, k);
  return typeof v === 'number' && !jsonSet.has(k);
});
if (missingFromJson.length === 0) {
  console.log(fmt.ok('  None — all worker baseline keys exist in JSON.'));
} else {
  console.log(fmt.dim(`  ${'Worker Path'.padEnd(55)} Baseline Value`));
  console.log(fmt.dim('  ' + '─'.repeat(75)));
  for (const k of missingFromJson) {
    const v = deepGet(BASELINE, k);
    console.log(fmt.warn(`${k.padEnd(55)} ${v}`));
  }
}

// ── Section 5: Key name mismatches (same service, similar name) ───────────────

console.log('\n' + fmt.header('══ SECTION 5 — Potential key-rename mismatches ════════════════════════'));
console.log(fmt.dim('  (keys that exist in one source but not the other at the same service level)'));
console.log();

// Find pairs where a key exists in worker but not JSON, and a "similar" key exists in JSON
const workerOnly = new Set(missingFromJson);
const jsonOnly = new Set(missingFromWorker);

let foundPairs = 0;
for (const wk of workerOnly) {
  const parts = wk.split('.');
  const leaf = parts[parts.length - 1];
  for (const jk of jsonOnly) {
    if (jk.startsWith(parts.slice(0, -1).join('.'))) {
      console.log(fmt.mismatch(`  Worker: ${wk}`));
      console.log(fmt.warn(`  JSON:   ${jk}`));
      console.log();
      foundPairs++;
    }
  }
}
if (foundPairs === 0) console.log(fmt.ok('  No rename pairs detected.'));

// ── Summary ────────────────────────────────────────────────────────────────────

const totalMismatches = mismatchWithJson + staticMismatch + missingFromWorker.length + missingFromJson.length;

console.log(fmt.header('\n══ SUMMARY ════════════════════════════════════════════════════════════════'));
console.log(`  Target region               : ${REGION_CODE} (${REGION_NAME})`);
console.log(`  Total API calls made        : ${callCount}`);
console.log(`  Queried params              : ${records.length}`);
console.log(`    ${fmt.live('LIVE (fetched from API)')} : ${liveCount}`);
console.log(`    ${fmt.fallback('FALLBACK (API null, use us-east-1)')}: ${fallbackCount}`);
console.log(`  Queried params ↔ JSON mismatches : ${fmt[mismatchWithJson > 0 ? 'mismatch' : 'ok'](String(mismatchWithJson))}`);
console.log(`  Static params ↔ JSON mismatches  : ${fmt[staticMismatch > 0 ? 'mismatch' : 'ok'](String(staticMismatch))}`);
console.log(`  JSON keys missing from worker    : ${fmt[missingFromWorker.length > 0 ? 'mismatch' : 'ok'](String(missingFromWorker.length))}`);
console.log(`  Worker keys missing from JSON    : ${fmt[missingFromJson.length > 0 ? 'warn' : 'ok'](String(missingFromJson.length))}`);
console.log();
if (totalMismatches === 0) {
  console.log(fmt.ok('  ✔  Worker and us-east-1.json are fully in sync.\n'));
} else {
  console.log(fmt.mismatch(`  ✖  ${totalMismatches} issue(s) found. Review sections above.\n`));
}
