import { PricingFetcher } from './fetcher';
import { Region } from './regions';

/**
 * Baseline pricing values (us-east-1).
 * All regions START from this template. Live prices fetched by the Worker
 * then override specific fields. Services with no regional price variation
 * use these baseline values unchanged.
 *
 * NOTE: Keep this in sync with frontend/src/app/core/data/regions/us-east-1.json
 */
const BASELINE_SERVICES: Record<string, any> = {
  client: {},
  route53: { zoneMonthly: 0.50, standardM: 0.40 },
  cloudfront: { dtOut: { 'us-eu': 0.085, 'ap': 0.14, 'sa': 0.18, 'au': 0.114, 'me-af': 0.11 }, requestsM: { 'us-eu': 1.0, 'ap': 1.20, 'sa': 1.60, 'au': 1.20, 'me-af': 1.20 }, wafBase: 5.0, wafRequestM: 0.60 },
  apiGateway: { requestsM: { rest: 3.50, http: 1.00, websocket: 1.00 }, cacheRates: { '0.5': 14.40, '1.6': 28.40, '6.1': 56.00, '13.5': 113.40, '28.4': 226.00, '58.2': 408.00, '118.0': 765.00, '237.0': 1278.00 } },
  alb: { hourly: 0.0225, lcuHour: 0.008 },
  vpc: { endpointHourly: 0.01, endpointGB: 0.01 },
  ec2: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, 'metal': 96.0 },
    purchaseDiscounts: { 'on-demand': 0, 'spot': 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09
  },
  ecs: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, albHourly: 0.0225, logsGB: 0.50 },
  autoScalingGroup: {},
  lambda: { requestM: 0.20, gbSec_x86: 0.0000166667, gbSec_arm: 0.0000133334, ephemeralGB_Sec: 0.0000000309, provConcurrency_x86: 0.015, provConcurrency_arm: 0.012 },
  sqs: { standard: 0.40, fifo: 0.50 },
  sns: { publish: 0.50, http: 0.60, email: 2.00 },
  s3: { storage: { standard: 0.023, intelligent: 0.023, sia: 0.0125, glacier: 0.004 }, puts: { standard: 5.0, intelligent: 5.0, sia: 10.0, glacier: 30.0 }, gets: { standard: 0.40, intelligent: 0.40, sia: 1.00, glacier: 10.0 }, dataTransferGB: 0.09 },
  rds: { engines: { mysql: 1.0, postgresql: 1.0, mariadb: 1.0, oracle: 1.0, sqlserver: 1.0 }, instances: { 'db.t3.medium': 0.068, 'db.m5.large': 0.171, 'db.r5.large': 0.240, 'db.r6g.large': 0.209 }, multiAzMultiplier: 2.0, storage: { gp2: 0.115, gp3: 0.115, io1: 0.125 }, backupGB: 0.095 },
  elastiCache: { instances: { 'cache.t3.micro': 0.017, 'cache.t3.medium': 0.068, 'cache.m5.large': 0.156, 'cache.r6g.large': 0.166 }, tieringPremium: 1.15 },
  dynamoDb: { std: { readM: 0.25, writeM: 1.25, storageGB: 0.25, wcuHr: 0.000649, rcuHr: 0.000130 }, ia: { readM: 0.3125, writeM: 1.5625, storageGB: 0.10, wcuHr: 0.0008125, rcuHr: 0.0001625 }, globalMultiplier: 1.5 },
  iam: {},
  cloudWatch: { metricRate: 0.30, logsGB: 0.50, dashboard: 3.00 },
  stepFunctions: { standardM: 25.00, expressReq: 1.00, expressGBsec: 16.67 },
  natGateway: { hourly: 0.045, dataGB: 0.045 },
  securityGroup: {},
  batch: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, albHourly: 0.0225, logsGB: 0.50 },
  eks: { clusterHourlyStandard: 0.10, cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, albHourly: 0.0225, natHourly: 0.045, natDataGB: 0.045, logsGB: 0.50, instances: { 't3.medium': 0.0416, 't3.large': 0.0832, 'm5.large': 0.096, 'm5.xlarge': 0.192 }, ebsGBMonth: 0.10 },
  aurora: { serverlessAcuHour: 0.12, instances: { 'db.t3.medium': 0.082, 'db.r5.large': 0.290, 'db.r6g.large': 0.260 }, storageGB: 0.10, ioRequestPerM: 0.20 },
  eventBridge: { eventM: 1.00 },
  kinesis: { shardHour: 0.015, putM: 0.014, retentionGB: 0.023 },
  msk: { instances: { 'kafka.t3.small': 0.024, 'kafka.m5.large': 0.24 }, storageGB: 0.10 },
  cognito: { freeTier: 50000, ratePerUser: 0.0055 },
  waf: { aclMonth: 5.0, ruleMonth: 1.0, reqM: 0.60 },
  efs: { storage: { standard: 0.30, 'infrequentAccess': 0.025 }, throughputMBps: 6.0 },
  athena: { perTB: 5.00 },
  secretsManager: { secretMonth: 0.40, callM: 0.05 },
  transitGateway: { attachmentHourly: 0.05, dataGB: 0.02 },
  directConnect: { portRates: { '1g': 0.30, '10g': 1.63, '100g': 8.14 }, dataTransferGB: 0.02 },
  globalAccelerator: { hourly: 0.025, dataGB: 0.015 },
  xray: { recordM: 5.00, scanM: 0.50 },
  openSearch: { instances: { 't3.medium': 0.073, 'm6g.large': 0.154, 'r6g.large': 0.167 }, storageGB: 0.122 },
  redshift: { instances: { 'ra3.xlplus': 1.086, 'ra3.4xlarge': 3.486 }, rpuHour: 0.36, storageTB: 24.576 },
  glue: { dpuHour: 0.44 },
  emr: { instances: { 'm5.large': 0.048, 'm5.xlarge': 0.096, 'r5.xlarge': 0.160 } },
  kinesisFirehose: { ingestGB: 0.029, convertGB: 0.018 },
  mq: { instances: { 'mq.t3.micro': 0.032, 'mq.m5.large': 0.340 } },
  kms: { keyMonth: 1.00, reqM: 0.03 },
  shield: { advancedMonth: 3000 },
  organizations: {},
  codePipeline: { pipelineMonth: 1.00 },
  codeBuild: { rates: { 'general1.small': 0.005, 'general1.medium': 0.010, 'general1.large': 0.020, 'gpu1.large': 0.950 } },
  codeDeploy: { updateRate: 0.02 },
  bedrock: { inM: { 'claude-haiku': 0.25, 'claude-sonnet': 3.00, 'claude-opus': 15.00, 'llama-70b': 0.99, 'titan-lite': 0.15 }, outM: { 'claude-haiku': 1.25, 'claude-sonnet': 15.00, 'claude-opus': 75.00, 'llama-70b': 1.20, 'titan-lite': 0.20 } },
  sageMaker: { instances: { 'ml.t3.medium': 0.0464, 'ml.m5.large': 0.134, 'ml.m5.xlarge': 0.269, 'ml.p3.2xlarge': 4.234 }, trainingHourly: 1.50, serverlessGBsec: 0.000020, serverlessReqM: 0.20 },
  appSync: { reqM: 4.00, dtGB: 0.09 },
  iotCore: { msgM: 1.00, ruleM: 0.15 },
  rekognition: { imageM: 1000 },
  textract: { pageM: 1500 },
  mediaConvert: { minHD: 0.017 },
  cloudTrail: { eventM: 1.00 },
  backup: { warmGB: 0.05, coldGB: 0.01 },
  appRunner: { cpuHour: 0.064, memHour: 0.007 },
  elasticBeanstalk: {},
  fsx: { windowsSingle: 0.13, windowsMulti: 0.26, lustrePersistent: 0.14, opensfsingle: 0.10, throughputRate: 1.18 },
  certificateManager: {},
  systemsManager: { instHour: 0.00695, callM: 0.05 },
  ecr: { storageGB: 0.10 },
  privateLink: { endpointHourly: 0.01, dataGB: 0.01 },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function round(n: number | null, decimals = 10): number | null {
  if (n === null) return null;
  return parseFloat(n.toFixed(decimals));
}

function set<T>(obj: T, val: number | null): T {
  return val !== null ? val as any : obj;
}

// ─── Main builder ────────────────────────────────────────────────────────────

/**
 * Builds a complete regional pricing file for a single region.
 * All AWS Pricing API calls are sequential (enforced by PricingFetcher's
 * built-in 200ms rate-limiter). A null result from any query leaves the
 * corresponding baseline value untouched.
 */
export async function buildPricingFile(
  region: Region,
  fetcher: PricingFetcher
): Promise<Record<string, any>> {
  // Deep-clone the baseline so each region gets an independent copy
  const svc: Record<string, any> = JSON.parse(JSON.stringify(BASELINE_SERVICES));

  console.log(`[Builder] Starting pricing build for ${region.code} (${region.name})...`);
  const loc = region.name;

  // ── Route53 (global) ────────────────────────────────────────────────────
  const r53Zone = await fetcher.route53Zone();
  const r53QueriesRaw = await fetcher.route53Queries();
  if (r53Zone !== null) svc.route53.zoneMonthly = round(r53Zone, 2)!;
  // API returns per-query price; we store per-million
  if (r53QueriesRaw !== null) svc.route53.standardM = round(r53QueriesRaw * 1_000_000, 2)!;

  // ── ALB ─────────────────────────────────────────────────────────────────
  const albHr = await fetcher.albHourly(loc);
  const albLcu = await fetcher.albLcu(loc);
  if (albHr !== null) { svc.alb.hourly = round(albHr, 4)!; svc.ecs.albHourly = svc.alb.hourly; svc.eks.albHourly = svc.alb.hourly; }
  if (albLcu !== null) svc.alb.lcuHour = round(albLcu, 4)!;

  // ── NAT Gateway ─────────────────────────────────────────────────────────
  const natHr = await fetcher.natGatewayHourly(loc);
  const natData = await fetcher.natGatewayData(loc);
  if (natHr !== null) { svc.natGateway.hourly = round(natHr, 4)!; svc.eks.natHourly = svc.natGateway.hourly; }
  if (natData !== null) { svc.natGateway.dataGB = round(natData, 4)!; svc.eks.natDataGB = svc.natGateway.dataGB; }

  // ── EC2 instances ────────────────────────────────────────────────────────
  const families = ['t3', 'm5', 'm6g', 'c5', 'c6g', 'r5', 'r6g'] as const;
  const instanceMap: Record<string, string> = {
    t3: 't3.large', m5: 'm5.large', m6g: 'm6g.large',
    c5: 'c5.large', c6g: 'c6g.large', r5: 'r5.large', r6g: 'r6g.large'
  };
  for (const fam of families) {
    const price = await fetcher.ec2Instance(loc, instanceMap[fam]);
    if (price !== null) {
      svc.ec2.familyRatesLarge[fam] = round(price, 6)!;
      // EKS ec2 instances list uses the same base rate
      if (fam === 't3') svc.eks.instances['t3.large'] = round(price, 6)!;
      if (fam === 'm5') {
        svc.eks.instances['m5.large'] = round(price, 6)!;
        svc.eks.instances['m5.xlarge'] = round(price * 2, 6)!;
      }
    }
  }

  // EBS storage rates (gp2, gp3 approximation from gp2 - 20%, io2)
  const ebsGp2 = await fetcher.ec2EbsGp2(loc);
  const ebsGp3 = await fetcher.ec2EbsGp3(loc);
  const ebsIo2 = await fetcher.ec2EbsIo2(loc);
  if (ebsGp2 !== null) svc.ec2.ebsRates.gp2 = round(ebsGp2, 4)!;
  if (ebsGp3 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp3, 4)!;
  else if (ebsGp2 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp2 * 0.8, 4)!; // fallback: gp3 ≈ 80% of gp2
  if (ebsIo2 !== null) svc.ec2.ebsRates.io2 = round(ebsIo2, 4)!;

  // Propagate EKS EBS rate
  svc.eks.ebsGBMonth = svc.ec2.ebsRates.gp3;

  // ── ECS Fargate ──────────────────────────────────────────────────────────
  const cpuX86 = await fetcher.ecsFargateCpu(loc);
  const memX86 = await fetcher.ecsFargateMemory(loc);
  const cpuArm = await fetcher.ecsFargateArmCpu(loc);
  const memArm = await fetcher.ecsFargateArmMemory(loc);
  const eph = await fetcher.ecsFargateEphemeral(loc);

  if (cpuX86 !== null) { svc.ecs.cpuHour = round(cpuX86, 6)!; svc.eks.cpuHour = svc.ecs.cpuHour; svc.batch.cpuHour = svc.ecs.cpuHour; }
  if (memX86 !== null) { svc.ecs.memHour = round(memX86, 6)!; svc.eks.memHour = svc.ecs.memHour; svc.batch.memHour = svc.ecs.memHour; }
  if (cpuArm !== null) { svc.ecs.armCpuHour = round(cpuArm, 6)!; svc.eks.armCpuHour = svc.ecs.armCpuHour; svc.batch.armCpuHour = svc.ecs.armCpuHour; }
  if (memArm !== null) { svc.ecs.armMemHour = round(memArm, 6)!; svc.eks.armMemHour = svc.ecs.armMemHour; svc.batch.armMemHour = svc.ecs.armMemHour; }
  if (eph !== null) { svc.ecs.ephemeralGBHour = round(eph, 8)!; svc.eks.ephemeralGBHour = svc.ecs.ephemeralGBHour; }

  // ── Lambda ───────────────────────────────────────────────────────────────
  const lambdaReqRaw = await fetcher.lambdaRequests(loc);
  const lambdaDurX86 = await fetcher.lambdaDurationX86(loc);
  // ARM duration = x86 × 0.8 (consistent ratio across all regions)
  if (lambdaReqRaw !== null) svc.lambda.requestM = round(lambdaReqRaw * 1_000_000, 4)!;
  if (lambdaDurX86 !== null) {
    svc.lambda.gbSec_x86 = round(lambdaDurX86, 10)!;
    svc.lambda.gbSec_arm = round(lambdaDurX86 * 0.8, 10)!;
  }

  // ── S3 ───────────────────────────────────────────────────────────────────
  const s3Std = await fetcher.s3Storage(loc, 'Standard');
  const s3Ia = await fetcher.s3Storage(loc, 'Standard - Infrequent Access');
  const s3Glacier = await fetcher.s3Storage(loc, 'Amazon Glacier');
  if (s3Std !== null) { svc.s3.storage.standard = round(s3Std, 4)!; svc.s3.storage.intelligent = svc.s3.storage.standard; }
  if (s3Ia !== null) svc.s3.storage.sia = round(s3Ia, 4)!;
  if (s3Glacier !== null) svc.s3.storage.glacier = round(s3Glacier, 4)!;

  // ── RDS ──────────────────────────────────────────────────────────────────
  const rdsT3Med = await fetcher.rdsInstance(loc, 'db.t3.medium');
  const rdsM5Lg = await fetcher.rdsInstance(loc, 'db.m5.large');
  const rdsR5Lg = await fetcher.rdsInstance(loc, 'db.r5.large');
  const rdsR6gLg = await fetcher.rdsInstance(loc, 'db.r6g.large');
  const rdsGp2 = await fetcher.rdsStorageGp2(loc);
  if (rdsT3Med !== null) svc.rds.instances['db.t3.medium'] = round(rdsT3Med, 4)!;
  if (rdsM5Lg !== null) svc.rds.instances['db.m5.large'] = round(rdsM5Lg, 4)!;
  if (rdsR5Lg !== null) svc.rds.instances['db.r5.large'] = round(rdsR5Lg, 4)!;
  if (rdsR6gLg !== null) svc.rds.instances['db.r6g.large'] = round(rdsR6gLg, 4)!;
  if (rdsGp2 !== null) { svc.rds.storage.gp2 = round(rdsGp2, 4)!; svc.rds.storage.gp3 = svc.rds.storage.gp2; }

  // ── Aurora ───────────────────────────────────────────────────────────────
  const aurAcu = await fetcher.auroraServerlessAcu(loc);
  const aurT3Med = await fetcher.auroraInstance(loc, 'db.t3.medium');
  const aurR5Lg = await fetcher.auroraInstance(loc, 'db.r5.large');
  const aurR6gLg = await fetcher.auroraInstance(loc, 'db.r6g.large');
  if (aurAcu !== null) svc.aurora.serverlessAcuHour = round(aurAcu, 4)!;
  if (aurT3Med !== null) svc.aurora.instances['db.t3.medium'] = round(aurT3Med, 4)!;
  if (aurR5Lg !== null) svc.aurora.instances['db.r5.large'] = round(aurR5Lg, 4)!;
  if (aurR6gLg !== null) svc.aurora.instances['db.r6g.large'] = round(aurR6gLg, 4)!;

  // ── ElastiCache ──────────────────────────────────────────────────────────
  const ecT3Micro = await fetcher.elastiCacheInstance(loc, 'cache.t3.micro');
  const ecT3Med = await fetcher.elastiCacheInstance(loc, 'cache.t3.medium');
  const ecM5Lg = await fetcher.elastiCacheInstance(loc, 'cache.m5.large');
  const ecR6gLg = await fetcher.elastiCacheInstance(loc, 'cache.r6g.large');
  if (ecT3Micro !== null) svc.elastiCache.instances['cache.t3.micro'] = round(ecT3Micro, 4)!;
  if (ecT3Med !== null) svc.elastiCache.instances['cache.t3.medium'] = round(ecT3Med, 4)!;
  if (ecM5Lg !== null) svc.elastiCache.instances['cache.m5.large'] = round(ecM5Lg, 4)!;
  if (ecR6gLg !== null) svc.elastiCache.instances['cache.r6g.large'] = round(ecR6gLg, 4)!;

  // ── DynamoDB ─────────────────────────────────────────────────────────────
  const ddbReadRaw = await fetcher.dynamoDbRead(loc);
  const ddbWriteRaw = await fetcher.dynamoDbWrite(loc);
  const ddbStorage = await fetcher.dynamoDbStorage(loc);
  if (ddbReadRaw !== null) {
    const readM = round(ddbReadRaw * 1_000_000, 4)!;
    svc.dynamoDb.std.readM = readM;
    svc.dynamoDb.ia.readM = round(readM * 1.25, 4)!;
  }
  if (ddbWriteRaw !== null) {
    const writeM = round(ddbWriteRaw * 1_000_000, 4)!;
    svc.dynamoDb.std.writeM = writeM;
    svc.dynamoDb.ia.writeM = round(writeM * 1.25, 4)!;
  }
  if (ddbStorage !== null) {
    svc.dynamoDb.std.storageGB = round(ddbStorage, 4)!;
    svc.dynamoDb.ia.storageGB = round(ddbStorage * 0.4, 4)!; // IA storage = 40% of standard
  }

  // ── OpenSearch ───────────────────────────────────────────────────────────
  const osT3Med = await fetcher.openSearchInstance(loc, 't3.medium.search');
  const osM6gLg = await fetcher.openSearchInstance(loc, 'm6g.large.search');
  const osR6gLg = await fetcher.openSearchInstance(loc, 'r6g.large.search');
  const osStorage = await fetcher.openSearchStorage(loc);
  if (osT3Med !== null) svc.openSearch.instances['t3.medium'] = round(osT3Med, 4)!;
  if (osM6gLg !== null) svc.openSearch.instances['m6g.large'] = round(osM6gLg, 4)!;
  if (osR6gLg !== null) svc.openSearch.instances['r6g.large'] = round(osR6gLg, 4)!;
  if (osStorage !== null) svc.openSearch.storageGB = round(osStorage, 4)!;

  // ── Redshift ─────────────────────────────────────────────────────────────
  const rsXlplus = await fetcher.redshiftInstance(loc, 'ra3.xlplus');
  const rs4xlarge = await fetcher.redshiftInstance(loc, 'ra3.4xlarge');
  const rsRpu = await fetcher.redshiftServerless(loc);
  if (rsXlplus !== null) svc.redshift.instances['ra3.xlplus'] = round(rsXlplus, 4)!;
  if (rs4xlarge !== null) svc.redshift.instances['ra3.4xlarge'] = round(rs4xlarge, 4)!;
  if (rsRpu !== null) svc.redshift.rpuHour = round(rsRpu, 4)!;

  // ── EMR ──────────────────────────────────────────────────────────────────
  const emrM5Lg = await fetcher.emrInstance(loc, 'm5.large');
  const emrM5Xl = await fetcher.emrInstance(loc, 'm5.xlarge');
  const emrR5Xl = await fetcher.emrInstance(loc, 'r5.xlarge');
  if (emrM5Lg !== null) svc.emr.instances['m5.large'] = round(emrM5Lg, 4)!;
  if (emrM5Xl !== null) svc.emr.instances['m5.xlarge'] = round(emrM5Xl, 4)!;
  if (emrR5Xl !== null) svc.emr.instances['r5.xlarge'] = round(emrR5Xl, 4)!;

  // ── MSK ──────────────────────────────────────────────────────────────────
  const mskT3Sm = await fetcher.mskInstance(loc, 'kafka.t3.small');
  const mskM5Lg = await fetcher.mskInstance(loc, 'kafka.m5.large');
  if (mskT3Sm !== null) svc.msk.instances['kafka.t3.small'] = round(mskT3Sm, 4)!;
  if (mskM5Lg !== null) svc.msk.instances['kafka.m5.large'] = round(mskM5Lg, 4)!;

  // ── Amazon MQ ────────────────────────────────────────────────────────────
  const mqT3Micro = await fetcher.mqInstance(loc, 'mq.t3.micro');
  const mqM5Lg = await fetcher.mqInstance(loc, 'mq.m5.large');
  if (mqT3Micro !== null) svc.mq.instances['mq.t3.micro'] = round(mqT3Micro, 4)!;
  if (mqM5Lg !== null) svc.mq.instances['mq.m5.large'] = round(mqM5Lg, 4)!;

  // ── Glue ─────────────────────────────────────────────────────────────────
  const glueDpu = await fetcher.glueDpu(loc);
  if (glueDpu !== null) svc.glue.dpuHour = round(glueDpu, 4)!;

  // ── Kinesis Data Streams ──────────────────────────────────────────────────
  const kinShard = await fetcher.kinesisShardHour(loc);
  const kinPutRaw = await fetcher.kinesisPutUnits(loc);
  if (kinShard !== null) svc.kinesis.shardHour = round(kinShard, 4)!;
  if (kinPutRaw !== null) svc.kinesis.putM = round(kinPutRaw * 1_000_000, 4)!;

  // ── EFS ──────────────────────────────────────────────────────────────────
  const efsStd = await fetcher.efsStorage(loc, 'Standard');
  const efsIa = await fetcher.efsStorage(loc, 'Standard - Infrequent Access');
  if (efsStd !== null) svc.efs.storage.standard = round(efsStd, 4)!;
  if (efsIa !== null) svc.efs.storage.infrequentAccess = round(efsIa, 4)!;

  console.log(`[Builder] Completed pricing build for ${region.code}. Total API calls made: (see fetcher count).`);
  return svc;
}
