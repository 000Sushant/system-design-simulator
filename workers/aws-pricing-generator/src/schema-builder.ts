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
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008, m7g: 0.096, m7i: 0.10, c7g: 0.072, r7g: 0.136, m8g: 0.10, i4i: 0.17 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, 'metal': 96.0 },
    purchaseDiscounts: { 'on-demand': 0, 'spot': 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45,
    gpuInstances: {
      'g4dn.xlarge': 0.736,
      'g4dn.2xlarge': 0.752,
      'g4dn.12xlarge': 4.352,
      'g5.xlarge': 1.408,
      'g5.2xlarge': 1.624,
      'g5.12xlarge': 7.09,
      'g5.48xlarge': 28.00,
      'g6.xlarge': 1.127,
      'g6.2xlarge': 1.334,
      'g6.12xlarge': 5.922,
      'g6.48xlarge': 23.00
    }
  },
  ecs: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.50, windowsCpuPremium: 0.046, windowsMemPremium: 0.004, publicIpHour: 0.005, instances: { 't3.medium': 0.0416, 'm5.large': 0.096, 'm6g.large': 0.077, 'm7g.large': 0.096, 'g5.xlarge': 1.408 }, ebsGBMonth: 0.08, reservedDiscount: 0.40 },
  autoScalingGroup: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008, m7g: 0.096, m7i: 0.10, c7g: 0.072, r7g: 0.136, m8g: 0.10, i4i: 0.17 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, metal: 96.0 },
    purchaseDiscounts: { 'on-demand': 0, spot: 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45,
    gpuInstances: {
      'g4dn.xlarge': 0.736,
      'g4dn.2xlarge': 0.752,
      'g4dn.12xlarge': 4.352,
      'g5.xlarge': 1.408,
      'g5.2xlarge': 1.624,
      'g5.12xlarge': 7.09,
      'g5.48xlarge': 28.00,
      'g6.xlarge': 1.127,
      'g6.2xlarge': 1.334,
      'g6.12xlarge': 5.922,
      'g6.48xlarge': 23.00
    }
  },
  lambda: { requestM: 0.20, gbSec_x86: 0.0000166667, gbSec_arm: 0.0000133334, ephemeralGB_Sec: 0.0000000309, provConcurrency_x86: 0.015, provConcurrency_arm: 0.012, streamingGB: 0.008, snapStartCacheGBsec: 0.0000015, snapStartRestoreGBM: 0.00014 },
  sqs: { standard: 0.40, fifo: 0.50 },
  sns: { publish: 0.50, http: 0.60, email: 20.00 },
  s3: { storage: { standard: 0.023, intelligent: 0.023, sia: 0.0125, glacier: 0.0036, 'onezone-ia': 0.01, 'glacier-instant': 0.004, 'deep-archive': 0.00099, 'express-onezone': 0.11 }, puts: { standard: 5.0, intelligent: 5.0, sia: 10.0, glacier: 30.0, 'onezone-ia': 10.0, 'glacier-instant': 20.0, 'deep-archive': 50.0, 'express-onezone': 2.5 }, gets: { standard: 0.40, intelligent: 0.40, sia: 1.00, glacier: 10.0, 'onezone-ia': 1.0, 'glacier-instant': 10.0, 'deep-archive': 50.0, 'express-onezone': 0.25 }, dataTransferGB: 0.09 },
  rds: { instanceRates: { mysql: { 'db.t3.medium': 0.068, 'db.t4g.medium': 0.05, 'db.m5.large': 0.171, 'db.m7g.large': 0.165, 'db.r5.large': 0.240, 'db.r7g.large': 0.216, 'db.r6g.large': 0.216, 'db.m6i.large': 0.171 }, postgresql: { 'db.t3.medium': 0.071, 'db.t4g.medium': 0.052, 'db.m5.large': 0.180, 'db.m7g.large': 0.173, 'db.r5.large': 0.252, 'db.r7g.large': 0.227, 'db.r6g.large': 0.227, 'db.m6i.large': 0.180 }, mariadb: { 'db.t3.medium': 0.068, 'db.t4g.medium': 0.05, 'db.m5.large': 0.171, 'db.m7g.large': 0.165, 'db.r5.large': 0.240, 'db.r7g.large': 0.216, 'db.r6g.large': 0.216, 'db.m6i.large': 0.171 }, 'sqlserver-web': { 'db.m6i.large': 0.26, 'db.r6g.large': 0.32 }, 'sqlserver-se': { 'db.m6i.large': 0.85, 'db.r6g.large': 1.05 }, 'sqlserver-ee': { 'db.m6i.large': 3.50, 'db.r6g.large': 4.20 }, 'oracle-se2': { 'db.r7g.large': 0.40 }, 'oracle-ee': { 'db.r7g.large': 3.20 } }, multiAzMultiplier: 2.0, storage: { gp2: 0.115, gp3: 0.115, io1: 0.125 }, backupGB: 0.095 },
  elastiCache: { instances: { 'cache.t3.micro': 0.016, 'cache.t3.medium': 0.068, 'cache.m5.large': 0.156, 'cache.r6g.large': 0.211, 'cache.t4g.medium': 0.034, 'cache.m7g.large': 0.126, 'cache.r7g.large': 0.175 }, valkeyNodeMultiplier: 0.8, serverless: { redis: { storageGBHour: 0.125, ecpuM: 0.0034 }, valkey: { storageGBHour: 0.084, ecpuM: 0.0023 } }, tieringPremium: 1.15 },
  dynamoDb: { std: { readM: 0.125, writeM: 0.625, replicatedWriteM: 0.625, storageGB: 0.25, wcuHr: 0.00065, rcuHr: 0.000130 }, ia: { readM: 0.15625, writeM: 0.78125, replicatedWriteM: 0.78, storageGB: 0.10, wcuHr: 0.0008125, rcuHr: 0.0001625 }, pitrStorageGB: 0.20, backupStorageGB: 0.10, restoreGB: 0.15, streamsRequestsM: 0.20, exportGB: 0.10, globalMultiplier: 1.5 },
  iam: {},
  cloudWatch: { metricRate: 0.30, logsGB: 0.50, dashboard: 3.00, alarmMonth: 0.10, logsStorageGB: 0.03 },
  stepFunctions: { standardM: 25.00, expressReq: 1.00, expressGBsec: 16.67 },
  natGateway: { hourly: 0.045, dataGB: 0.045 },
  securityGroup: {},
  batch: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.50 },
  eks: { clusterHourlyStandard: 0.10, clusterHourlyExtended: 0.60, cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, natHourly: 0.045, natDataGB: 0.045, logsGB: 0.50, instances: { 't3.medium': 0.0416, 't3.large': 0.0832, 'm5.large': 0.096, 'm5.xlarge': 0.192, 'm6g.large': 0.077, 'm7g.large': 0.096, 'g5.xlarge': 1.408 }, ebsGBMonth: 0.08, reservedDiscount: 0.40, containerInsightsPerNode: 2.5 },
  // Aurora instance baselines = live us-east-1 offer prices (2026-07-10).
  // NOTE: Aurora sells r-family (memory-optimized) and t-family (burstable)
  // only — never db.m7g.* (a phantom entry removed 2026-07-10).
  aurora: { serverlessAcuHour: 0.12, instances: { 'db.t3.medium': 0.082, 'db.t4g.medium': 0.041, 'db.r5.large': 0.29, 'db.r6g.large': 0.26, 'db.r6g.xlarge': 0.519, 'db.r6g.2xlarge': 1.038, 'db.r7g.large': 0.276, 'db.r7g.xlarge': 0.553, 'db.r7g.2xlarge': 1.106, 'db.r8g.large': 0.276, 'db.r8g.xlarge': 0.552 }, ioOptimizedComputeMultiplier: 1.30, ioOptimizedStorageRate: 0.225, storageGB: 0.10, ioRequestPerM: 0.20 },
  eventBridge: { eventM: 1.00 },
  kinesis: { shardHour: 0.015, putM: 0.014, retentionGB: 0.023, onDemandStreamHour: 0.04, onDemandIngestGB: 0.08, onDemandEgressGB: 0.04, efoEgressGB: 0.05, consumerShardHour: 0.015, extendedRetentionGB: 0.10, longTermRetentionGB: 0.023 },
  msk: { instances: { 'kafka.t3.small': 0.0456, 'kafka.m5.large': 0.21, 'kafka.m7g.large': 0.204 }, expressInstances: { 'express.m7g.large': 0.408 }, expressStorageGB: 0.10, serverless: { clusterHour: 0.75, partitionHour: 0.0015, ingestGB: 0.10, egressGB: 0.05 }, tieredStorageGB: 0.06, storageGB: 0.10 },
  cognito: { freeTier: 50000, ratePerUser: 0.0055 },
  waf: { aclMonth: 5.0, ruleMonth: 1.0, reqM: 0.60 },
  efs: { storage: { standard: 0.30, ia: 0.016 }, throughputMBps: 6.0 },
  athena: { perTB: 5.00 },
  secretsManager: { secretMonth: 0.40, callM: 5.00 },
  transitGateway: { attachmentHourly: 0.05, dataGB: 0.02 },
  directConnect: { portRates: { '1g': 0.30, '10g': 2.25, '100g': 22.5 }, dataTransferGB: 0.02 },
  globalAccelerator: { hourly: 0.025, dataGB: 0.015 },
  xray: { recordM: 5.00, scanM: 0.50 },
  openSearch: { instances: { 't3.medium': 0.073, 'm6g.large': 0.128, 'r6g.large': 0.167 }, serverlessOcuHour: 0.24, serverlessStorageGB: 0.024, ultraWarmHour: 0.238, ultraWarmStorageGB: 0.024, storageGB: 0.122 },
  redshift: { instances: { 'ra3.xlplus': 1.086, 'ra3.4xlarge': 3.26, 'ra3.large': 0.543, 'ra3.16xlarge': 13.04 }, rpuHour: 0.375, storageTB: 24.576 },
  glue: { dpuHour: 0.44 },
  emr: { instances: { 'm5.large': 0.12, 'm5.xlarge': 0.24, 'r5.xlarge': 0.315, 'm7g.xlarge': 0.1912 }, serverless: { cpuHour: 0.052624, memHour: 0.0057785, storageHour: 0.000111 } },
  kinesisFirehose: { ingestGB: 0.029, convertGB: 0.018 },
  mq: { instances: { 'mq.t3.micro': 0.027, 'mq.m5.large': 0.288, 'mq.m7g.large': 0.2734 }, multiAzActiveMqMultiplier: 2.0, multiAzRabbitMqMultiplier: 3.0, storageRates: { activemq: 0.30, rabbitmq: 0.10 }, storageGB: 0.30 },
  kms: { keyMonth: 1.00, reqM: 3.00 },
  shield: { advancedMonth: 3000 },
  organizations: {},
  codePipeline: { pipelineMonth: 1.00 },
  codeBuild: { rates: { 'general1.small': 0.005, 'general1.medium': 0.010, 'general1.large': 0.020, 'gpu1.large': 0.950 } },
  codeDeploy: { updateRate: 0.02 },
  // Bedrock token rates are $ per 1M tokens (standard-tier on-demand, text
  // generation). Keys match the model options in service-cost-model.json;
  // the trailing legacy keys keep architectures saved before the
  // provider/model split priced correctly.
  bedrock: {
    inM: {
      // anthropic
      'claude-sonnet-5': 2.2,
      'claude-fable-5': 11,
      'claude-mythos-5': 11,
      'claude-opus-4-8': 5.5,
      'claude-haiku-4-5': 1.1,
      'claude-sonnet-4-6': 3.3,
      'claude-3-7-sonnet': 3,
      'claude-3-5-haiku': 0.8,
      'claude-3-haiku': 0.25,
      // amazon
      'nova-2-pro': 1.375,
      'nova-2-omni': 0.3,
      'nova-2-lite': 0.33,
      'nova-premier': 2.5,
      'nova-pro': 0.8,
      'nova-lite': 0.06,
      'nova-micro': 0.035,
      'titan-text-premier': 0.5,
      'titan-text-express': 0.2,
      'titan-text-lite': 0.15,
      // openai
      'gpt-oss-120b': 0.15,
      'gpt-oss-20b': 0.07,
      // meta
      'llama-4-maverick': 0.24,
      'llama-4-scout': 0.17,
      'llama-3-3-70b': 0.72,
      'llama-3-2-11b': 0.16,
      'llama-3-2-3b': 0.15,
      'llama-3-1-8b': 0.22,
      // deepseek
      'deepseek-v3-2': 0.62,
      'deepseek-r1': 1.35,
      // mistral
      'mistral-large-3': 0.5,
      'pixtral-large': 2,
      'mistral-small': 1,
      'magistral-small': 0.5,
      'devstral': 0.4,
      'ministral-8b': 0.15,
      // qwen
      'qwen3-coder-next': 0.5,
      'qwen3-vl-235b': 0.53,
      'qwen3-coder-30b': 0.15,
      'qwen3-32b': 0.15,
      // google
      'gemma-3-27b': 0.23,
      'gemma-3-12b': 0.09,
      'gemma-3-4b': 0.04,
      // cohere
      'command-r-plus': 3,
      'command-r': 0.5,
      // ai21
      'jamba-1-5-large': 2,
      'jamba-1-5-mini': 0.2,
      // writer
      'palmyra-x5': 0.6,
      'palmyra-x4': 2.5,
      // moonshot
      'kimi-k2-5': 0.6,
      'kimi-k2-thinking': 0.6,
      // minimax
      'minimax-m2-5': 0.3,
      'minimax-m2': 0.3,
      // zai
      'glm-5': 1,
      'glm-4-7': 0.6,
      'glm-4-7-flash': 0.07,
      // nvidia
      'nemotron-3-super': 0.15,
      'nemotron-nano-3': 0.06,
      'nemotron-nano-2-vl': 0.2,
      // legacy
      'claude-haiku': 0.25,
      'claude-sonnet': 3,
      'claude-opus': 15,
      'llama-70b': 0.72,
      'titan': 0.15,
    },
    outM: {
      // anthropic
      'claude-sonnet-5': 11,
      'claude-fable-5': 55,
      'claude-mythos-5': 55,
      'claude-opus-4-8': 27.5,
      'claude-haiku-4-5': 5.5,
      'claude-sonnet-4-6': 16.5,
      'claude-3-7-sonnet': 15,
      'claude-3-5-haiku': 4,
      'claude-3-haiku': 1.25,
      // amazon
      'nova-2-pro': 11,
      'nova-2-omni': 2.8,
      'nova-2-lite': 2.75,
      'nova-premier': 12.5,
      'nova-pro': 3.2,
      'nova-lite': 0.24,
      'nova-micro': 0.14,
      'titan-text-premier': 1.5,
      'titan-text-express': 0.6,
      'titan-text-lite': 0.2,
      // openai
      'gpt-oss-120b': 0.6,
      'gpt-oss-20b': 0.3,
      // meta
      'llama-4-maverick': 0.97,
      'llama-4-scout': 0.66,
      'llama-3-3-70b': 0.72,
      'llama-3-2-11b': 0.16,
      'llama-3-2-3b': 0.15,
      'llama-3-1-8b': 0.22,
      // deepseek
      'deepseek-v3-2': 1.85,
      'deepseek-r1': 5.4,
      // mistral
      'mistral-large-3': 1.5,
      'pixtral-large': 6,
      'mistral-small': 3,
      'magistral-small': 1.5,
      'devstral': 2,
      'ministral-8b': 0.15,
      // qwen
      'qwen3-coder-next': 1.2,
      'qwen3-vl-235b': 2.66,
      'qwen3-coder-30b': 0.6,
      'qwen3-32b': 0.6,
      // google
      'gemma-3-27b': 0.38,
      'gemma-3-12b': 0.29,
      'gemma-3-4b': 0.08,
      // cohere
      'command-r-plus': 15,
      'command-r': 1.5,
      // ai21
      'jamba-1-5-large': 8,
      'jamba-1-5-mini': 0.4,
      // writer
      'palmyra-x5': 6,
      'palmyra-x4': 10,
      // moonshot
      'kimi-k2-5': 3,
      'kimi-k2-thinking': 2.5,
      // minimax
      'minimax-m2-5': 1.2,
      'minimax-m2': 1.2,
      // zai
      'glm-5': 3.2,
      'glm-4-7': 2.2,
      'glm-4-7-flash': 0.4,
      // nvidia
      'nemotron-3-super': 0.65,
      'nemotron-nano-3': 0.24,
      'nemotron-nano-2-vl': 0.6,
      // legacy
      'claude-haiku': 1.25,
      'claude-sonnet': 15,
      'claude-opus': 75,
      'llama-70b': 0.72,
      'titan': 0.2,
    },
  },
  sageMaker: {
    instances: {
      'ml.m5.large': 0.115, 'ml.m5.xlarge': 0.23, 'ml.m5.2xlarge': 0.46, 'ml.m5.4xlarge': 0.92,
      'ml.m6g.large': 0.101, 'ml.m6g.xlarge': 0.202, 'ml.m6g.2xlarge': 0.404, 'ml.m6g.4xlarge': 0.808,
      'ml.g4dn.xlarge': 0.736, 'ml.g4dn.2xlarge': 0.752, 'ml.g4dn.12xlarge': 4.352,
      'ml.g5.xlarge': 1.408, 'ml.g5.2xlarge': 1.624, 'ml.g5.12xlarge': 7.09, 'ml.g5.48xlarge': 28.00,
      'ml.g6.xlarge': 1.127, 'ml.g6.2xlarge': 1.334, 'ml.g6.12xlarge': 5.922, 'ml.g6.48xlarge': 23.00,
      'ml.g6e.xlarge': 2.605, 'ml.g6e.2xlarge': 3.00, 'ml.g6e.12xlarge': 13.00, 'ml.g6e.48xlarge': 52.00,
      'ml.inf2.xlarge': 0.99, 'ml.inf2.8xlarge': 3.96, 'ml.inf2.24xlarge': 11.88,
      'ml.trn1.2xlarge': 1.55, 'ml.trn1.32xlarge': 24.80,
      'ml.p4d.24xlarge': 25.25,
      'ml.p5.48xlarge': 63.30
    },
    trainingHourly: 1.50, serverlessGBsec: 0.000020, serverlessReqM: 0.20
  },
  appSync: { reqM: 4.00, dtGB: 0.09 },
  iotCore: { msgM: 1.00, ruleM: 0.15 },
  rekognition: { imageM: 1000, videoArchivedMin: 0.10, videoLiveMin: 0.12, faceVectorM: 10.0 },
  textract: { pageM: 1500, pageRates: { detect: 1500, tables: 15000, forms: 50000, formsTables: 65000, queries: 15000, layout: 4000, expense: 10000, identity: 25000, lending: 70000, signatures: 3500, customQueries: 25000 } },
  mediaConvert: {
    rates: {
      basic: {
        avc: { sd: 0.0075, hd: 0.015 }
      },
      professional: {
        avc: { sd: 0.012, hd: 0.024, '4k': 0.048 },
        hevc: { sd: 0.0225, hd: 0.045, '4k': 0.09 },
        av1: { sd: 0.0375, hd: 0.075, '4k': 0.15 },
        prores: { sd: 0.025, hd: 0.05, '4k': 0.10 }
      }
    }
  },
  cloudTrail: { eventM: 1.00 },
  backup: { warmGB: 0.05, coldGB: 0.01 },
  appRunner: { cpuHour: 0.064, memHour: 0.007 },
  elasticBeanstalk: {
    familyRatesLarge: { t3: 0.0832, m5: 0.096, m6g: 0.077, c5: 0.085, c6g: 0.068, r5: 0.126, r6g: 0.1008, m7g: 0.096, m7i: 0.10, c7g: 0.072, r7g: 0.136, m8g: 0.10, i4i: 0.17 },
    sizeMultipliers: { nano: 0.0625, micro: 0.125, small: 0.25, medium: 0.5, large: 1.0, xlarge: 2.0, '2xlarge': 4.0, '4xlarge': 8.0, '8xlarge': 16.0, '12xlarge': 24.0, '16xlarge': 32.0, '24xlarge': 48.0, metal: 96.0 },
    purchaseDiscounts: { 'on-demand': 0, spot: 0.70, 'reserved-1yr': 0.40, 'reserved-3yr': 0.60 },
    ebsRates: { gp2: 0.10, gp3: 0.08, io2: 0.125 },
    dataTransferGB: 0.09,
    windowsMultiplier: 1.45,
    gpuInstances: {
      'g4dn.xlarge': 0.736,
      'g4dn.2xlarge': 0.752,
      'g4dn.12xlarge': 4.352,
      'g5.xlarge': 1.408,
      'g5.2xlarge': 1.624,
      'g5.12xlarge': 7.09,
      'g5.48xlarge': 28.00,
      'g6.xlarge': 1.127,
      'g6.2xlarge': 1.334,
      'g6.12xlarge': 5.922,
      'g6.48xlarge': 23.00
    }
  },
  fsx: { windowsSingle: 0.13, windowsMulti: 0.23, lustreSingle: 0.14, lustreMulti: 0.14, ontapSingle: 0.13, ontapMulti: 0.26, throughputRate: 1.18 },
  certificateManager: {},
  systemsManager: { instHour: 0.00695, callM: 5.00 },
  ecr: { storageGB: 0.10, dataTransferGB: 0.09 },
  privateLink: { endpointHourly: 0.01, dataGB: 0.01 },
  amplify: { buildMinute: 0.01, buildMinuteLarge: 0.025, buildMinuteXLarge: 0.10, dataServedGB: 0.15, storageGB: 0.023 },
  ses: { email: 0.0001, inboundEmail: 0.0001, attachmentGB: 0.12, dedicatedIP: 24.95, vdmEmail: 0.00007 },
  documentDb: {
    instances: { 'db.t3.medium': 0.078, 'db.r6g.large': 0.2631, 'db.r6g.xlarge': 0.5263 },
    instancesIO: { 'db.t3.medium': 0.0858, 'db.r6g.large': 0.2895, 'db.r6g.xlarge': 0.5789 },
    storageGB: 0.10, storageIOGB: 0.30, ioMillion: 0.20,
  },
  neptune: {
    instances: { 'db.t3.medium': 0.098, 'db.r6g.large': 0.3287, 'db.r6g.2xlarge': 1.3149 },
    storageGB: 0.10, ioMillion: 0.20,
  },
  timestream: { ingestGB: 0.50, memoryGBHr: 0.036, magneticGB: 0.03, scannedGB: 0.01 },
  appConfig: { requestM: 0.20, deployment: 0.0008 },
  appMesh: {},
  cloudMap: { resourceMonth: 0.10, queryM: 1.00 },
  quickSight: { authorPro: 40.0, reader: 3.0, spiceGB: 0.38 },
  lightsail: {
    bundles: { '0.5GB': 0.00672, '1GB': 0.0094, '2GB': 0.01612, '4GB': 0.03225, '8GB': 0.05913, '16GB': 0.1129, '32GB': 0.22043 },
    overageGB: 0.09,
  },
};

/**
 * Maps each Bedrock model key (as used in BASELINE_SERVICES.bedrock and the
 * frontend cost model) to its live-pricing source:
 *  - od: `model`/`titanModel` attribute in the AmazonBedrock offer ($/1K tokens)
 *  - mp: `servicename` in the AmazonBedrockFoundationModels offer ($/1M tokens)
 */
export const BEDROCK_MODEL_SOURCES: Record<string, { od?: string; mp?: string }> = {
  // anthropic
  'claude-sonnet-5': { mp: 'Claude Sonnet 5 (Amazon Bedrock Edition)' },
  'claude-fable-5': { mp: 'Claude Fable 5 (Amazon Bedrock Edition)' },
  'claude-mythos-5': { mp: 'Claude Mythos 5 (Amazon Bedrock Edition)' },
  'claude-opus-4-8': { mp: 'Claude Opus 4.8 (Amazon Bedrock Edition)' },
  'claude-haiku-4-5': { mp: 'Claude Haiku 4.5 (Amazon Bedrock Edition)' },
  'claude-sonnet-4-6': { mp: 'Claude Sonnet 4.6 (Amazon Bedrock Edition)' },
  'claude-3-7-sonnet': { mp: 'Claude 3.7 Sonnet (Amazon Bedrock Edition)' },
  'claude-3-5-haiku': { mp: 'Claude 3.5 Haiku (Amazon Bedrock Edition)' },
  'claude-3-haiku': { mp: 'Claude 3 Haiku (Amazon Bedrock Edition)' },
  // amazon
  'nova-2-pro': { od: 'Nova 2.0 Pro' },
  'nova-2-omni': { od: 'Nova 2.0 Omni' },
  'nova-2-lite': { od: 'Nova 2.0 Lite' },
  'nova-premier': { od: 'Nova Premier' },
  'nova-pro': { od: 'Nova Pro' },
  'nova-lite': { od: 'Nova Lite' },
  'nova-micro': { od: 'Nova Micro' },
  'titan-text-premier': { od: 'Titan Text G1 Premier' },
  'titan-text-express': { od: 'Titan Text G1 Express' },
  'titan-text-lite': { od: 'Titan Text G1 Lite' },
  // openai
  'gpt-oss-120b': { od: 'gpt-oss-120b' },
  'gpt-oss-20b': { od: 'gpt-oss-20b' },
  // meta
  'llama-4-maverick': { od: 'Llama 4 Maverick 17B' },
  'llama-4-scout': { od: 'Llama 4 Scout 17B' },
  'llama-3-3-70b': { od: 'Llama 3.3 70B' },
  'llama-3-2-11b': { od: 'Llama 3.2 11B' },
  'llama-3-2-3b': { od: 'Llama 3.2 3B' },
  'llama-3-1-8b': { od: 'Llama 3.1 8B' },
  // deepseek
  'deepseek-v3-2': { od: 'DeepSeek v3.2' },
  'deepseek-r1': { od: 'R1' },
  // mistral
  'mistral-large-3': { od: 'Mistral Large 3' },
  'pixtral-large': { od: 'Pixtral Large 25.02' },
  'mistral-small': { od: 'Mistral Small' },
  'magistral-small': { od: 'Magistral Small 1.2' },
  'devstral': { od: 'Devstral' },
  'ministral-8b': { od: 'Ministral 8B 3.0' },
  // qwen
  'qwen3-coder-next': { od: 'Qwen3 Coder Next' },
  'qwen3-vl-235b': { od: 'Qwen3 VL 235B A22B' },
  'qwen3-coder-30b': { od: 'Qwen3 Coder 30B A3B' },
  'qwen3-32b': { od: 'Qwen3 32B' },
  // google
  'gemma-3-27b': { od: 'Gemma 3 27B' },
  'gemma-3-12b': { od: 'Gemma 3 12B' },
  'gemma-3-4b': { od: 'Gemma 3 4B' },
  // cohere
  'command-r-plus': { mp: 'Cohere Command R+ (Amazon Bedrock Edition)' },
  'command-r': { mp: 'Cohere Command R (Amazon Bedrock Edition)' },
  // ai21
  'jamba-1-5-large': { mp: 'Jamba 1.5 Large (Amazon Bedrock Edition)' },
  'jamba-1-5-mini': { mp: 'Jamba 1.5 Mini (Amazon Bedrock Edition)' },
  // writer
  'palmyra-x5': { mp: 'Palmyra X5 (Amazon Bedrock Edition)' },
  'palmyra-x4': { mp: 'Palmyra X4 (Amazon Bedrock Edition)' },
  // moonshot
  'kimi-k2-5': { od: 'Kimi K2.5' },
  'kimi-k2-thinking': { od: 'Kimi K2 Thinking' },
  // minimax
  'minimax-m2-5': { od: 'MiniMax M2.5' },
  'minimax-m2': { od: 'Minimax M2' },
  // zai
  'glm-5': { od: 'GLM 5' },
  'glm-4-7': { od: 'GLM 4.7' },
  'glm-4-7-flash': { od: 'GLM 4.7 Flash' },
  // nvidia
  'nemotron-3-super': { od: 'NVIDIA Nemotron 3 Super 120B A12B' },
  'nemotron-nano-3': { od: 'Nemotron Nano 3 30B' },
  'nemotron-nano-2-vl': { od: 'NVIDIA Nemotron Nano 2 VL' },
  // legacy keys (pre provider/model split)
  'claude-haiku': { mp: 'Claude 3 Haiku (Amazon Bedrock Edition)' },
  'claude-sonnet': { mp: 'Claude 3 Sonnet (Amazon Bedrock Edition)' },
  'claude-opus': { mp: 'Claude 3 Opus (Amazon Bedrock Edition)' },
  'llama-70b': { od: 'Llama 3.1 70B' },
  'titan': { od: 'Titan Text G1 Lite' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

export function round(n: number | null, decimals = 10): number | null {
  if (n === null) return null;
  return parseFloat(n.toFixed(decimals));
}

// ─── Main builder ────────────────────────────────────────────────────────────

/** Number of build phases per region. Each phase stays well under Cloudflare's
 *  free-plan limit of 50 subrequests per invocation (~25 Pricing calls max). */
export const PHASE_COUNT = 9;

/**
 * Worst-case Pricing API subrequests per phase (bulk fetchers counted at their
 * maxPages cap of 8; emrInstance counts 2 per call). The cron handler uses
 * these to chain as many phases as fit in one invocation's subrequest budget.
 *   0: r53(2)+ELB(8)+NAT(2)+egress(1)+EC2 families(7)+EBS(3)            = 23
 *   1: Fargate(5)+Lambda(2)+S3(3)+RDS MySQL(8)+RDS gp2(1)               = 19
 *   2: RDS PG(8)+Aurora ACU(1)+Aurora instances(11)                     = 20
 *   3: DDB(8)+OpenSearch(4)+Redshift(4+1)+EMR(4)+MSK(8)+MQ(8)           = 37
 *   4: Glue(1)+Kinesis(8)+EFS(2)+APIGW(1)+Amplify(5)+SES(5)             = 22
 *   5: DocDB(6+3)+Neptune(3+2)+Timestream(4)                            = 18
 *   6: AppConfig(2)+CloudMap(2)+QS(3)+Lightsail(8+1)+ElastiCache(8+8)   = 32
 *   7: Bedrock on-demand(8)+marketplace(8)                              = 16
 *   8: SageMaker(8)+Rekognition(8)+EC2 extra(6)+GPU anchors(3)          = 25
 */
export const PHASE_MAX_CALLS: readonly number[] = [23, 19, 20, 37, 22, 18, 32, 16, 25];

/**
 * Runs ONE phase of the regional pricing build. `partial` carries the
 * accumulated result between phases (pass null on phase 0 to start from a
 * fresh baseline clone). A null result from any query leaves the
 * corresponding baseline value untouched.
 *
 * Phases: 0 = Route53/ELB/NAT/egress/EC2/EBS · 1 = Fargate/Lambda/S3/
 * RDS-MySQL · 2 = RDS-PostgreSQL/Aurora · 3 = DynamoDB(bulk)/OpenSearch/
 * Redshift/EMR/MSK(bulk)/MQ(bulk) · 4 = Glue/Kinesis(bulk)/EFS/API Gateway/
 * Amplify/SES · 5 = DocumentDB/Neptune/Timestream · 6 = AppConfig/CloudMap/
 * QuickSight/Lightsail/ElastiCache(nodes+serverless) · 7 = Bedrock ·
 * 8 = SageMaker(bulk)/Rekognition(bulk)/EC2 current-gen + GPU families
 */
export async function buildPricingPhase(
  region: Region,
  fetcher: PricingFetcher,
  partial: Record<string, any> | null,
  phase: number
): Promise<Record<string, any>> {
  const svc: Record<string, any> = partial ?? JSON.parse(JSON.stringify(BASELINE_SERVICES));
  const loc = region.name;
  console.log(`[Builder] ${region.code}: phase ${phase + 1}/${PHASE_COUNT}...`);

  if (phase === 0) {
  // All queries in this phase are independent — launch them together; the
  // fetcher's slot scheduler keeps the API launch rate at 5/s.
  // ── Route53 (global) ────────────────────────────────────────────────────
  const [r53Zone, r53QueriesRaw,
         albHr, albLcu, nlbHr, nlbLcu, clbHr, clbData, gwlbHr, gwlbLcu,
         natHr, natData, egressRate] = await Promise.all([
    fetcher.route53Zone(), fetcher.route53Queries(),
    fetcher.elbHourly(loc), fetcher.elbLcu(loc),
    fetcher.nlbHourly(loc), fetcher.nlbLcu(loc),
    fetcher.clbHourly(loc), fetcher.clbDataGB(loc),
    fetcher.gwlbHourly(loc), fetcher.gwlbLcu(loc),
    fetcher.natGatewayHourly(loc), fetcher.natGatewayData(loc),
    fetcher.dataTransferOut(loc),
  ]);
  if (r53Zone !== null) svc.route53.zoneMonthly = round(r53Zone, 2)!;
  // API returns per-query price; we store per-million
  if (r53QueriesRaw !== null) svc.route53.standardM = round(r53QueriesRaw * 1_000_000, 2)!;

  // ── ELB ─────────────────────────────────────────────────────────────────
  if (albHr !== null) svc.elb.types.alb.hourly = round(albHr, 4)!;
  if (albLcu !== null) svc.elb.types.alb.lcuHour = round(albLcu, 4)!;
  if (nlbHr !== null) svc.elb.types.nlb.hourly = round(nlbHr, 4)!;
  if (nlbLcu !== null) svc.elb.types.nlb.lcuHour = round(nlbLcu, 4)!;
  if (clbHr !== null) svc.elb.types.clb.hourly = round(clbHr, 4)!;
  if (clbData !== null) svc.elb.types.clb.dataGB = round(clbData, 4)!;
  if (gwlbHr !== null) svc.elb.types.gwlb.hourly = round(gwlbHr, 4)!;
  if (gwlbLcu !== null) svc.elb.types.gwlb.lcuHour = round(gwlbLcu, 4)!;

  // Propagate ALB hourly to ecs/eks configurations as well
  if (albHr !== null) {
    svc.ecs.elbHourly = round(albHr, 4)!;
    svc.eks.elbHourly = round(albHr, 4)!;
  }

  // ── NAT Gateway ─────────────────────────────────────────────────────────
  if (natHr !== null) { svc.natGateway.hourly = round(natHr, 4)!; svc.eks.natHourly = svc.natGateway.hourly; }
  if (natData !== null) { svc.natGateway.dataGB = round(natData, 4)!; svc.eks.natDataGB = svc.natGateway.dataGB; }

  // ── Data Transfer Out (Internet Egress) ──────────────────────────────────
  // Region-specific egress rate propagates to all services that use it
  if (egressRate !== null) {
    const r = round(egressRate, 4)!;
    svc.client.dataTransferGB            = r;
    svc.ec2.dataTransferGB               = r;
    svc.s3.dataTransferGB                = r;
    svc.ecs.dataTransferGB               = r;
    svc.eks.dataTransferGB               = r;
    svc.batch.dataTransferGB             = r;
    svc.autoScalingGroup.dataTransferGB  = r;
    svc.elasticBeanstalk.dataTransferGB  = r;
  }

  // ── EC2 instances ────────────────────────────────────────────────────────
  const families = ['t3', 'm5', 'm6g', 'c5', 'c6g', 'r5', 'r6g'] as const;
  const instanceMap: Record<string, string> = {
    t3: 't3.large', m5: 'm5.large', m6g: 'm6g.large',
    c5: 'c5.large', c6g: 'c6g.large', r5: 'r5.large', r6g: 'r6g.large'
  };
  const familyPrices = await Promise.all(families.map(fam => fetcher.ec2Instance(loc, instanceMap[fam])));
  for (let i = 0; i < families.length; i++) {
    const fam = families[i];
    const price = familyPrices[i];
    if (price !== null) {
      svc.ec2.familyRatesLarge[fam] = round(price, 6)!;
      // Propagate to autoScalingGroup and elasticBeanstalk (same EC2 pricing)
      svc.autoScalingGroup.familyRatesLarge[fam] = round(price, 6)!;
      svc.elasticBeanstalk.familyRatesLarge[fam] = round(price, 6)!;
      // EKS / ECS ec2 instances list uses the same base rate
      if (fam === 't3') {
        svc.eks.instances['t3.large'] = round(price, 6)!;
        svc.ecs.instances['t3.medium'] = round(price * 0.5, 6)!; // medium = large * 0.5
      }
      if (fam === 'm5') {
        svc.eks.instances['m5.large'] = round(price, 6)!;
        svc.eks.instances['m5.xlarge'] = round(price * 2, 6)!;
        svc.ecs.instances['m5.large'] = round(price, 6)!;
      }
      if (fam === 'm6g') {
        svc.eks.instances['m6g.large'] = round(price, 6)!;
        svc.ecs.instances['m6g.large'] = round(price, 6)!;
      }
    }
  }

  // EBS storage rates (gp2, gp3 approximation from gp2 - 20%, io2)
  const [ebsGp2, ebsGp3, ebsIo2] = await Promise.all([
    fetcher.ec2EbsGp2(loc), fetcher.ec2EbsGp3(loc), fetcher.ec2EbsIo2(loc),
  ]);
  if (ebsGp2 !== null) svc.ec2.ebsRates.gp2 = round(ebsGp2, 4)!;
  if (ebsGp3 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp3, 4)!;
  else if (ebsGp2 !== null) svc.ec2.ebsRates.gp3 = round(ebsGp2 * 0.8, 4)!; // fallback: gp3 ≈ 80% of gp2
  if (ebsIo2 !== null) svc.ec2.ebsRates.io2 = round(ebsIo2, 4)!;

  // Propagate EBS rates to autoScalingGroup and elasticBeanstalk
  svc.autoScalingGroup.ebsRates = { ...svc.ec2.ebsRates };
  svc.elasticBeanstalk.ebsRates = { ...svc.ec2.ebsRates };
  svc.ecs.ebsGBMonth = svc.ec2.ebsRates.gp3;
  // Propagate EKS EBS rate
  svc.eks.ebsGBMonth = svc.ec2.ebsRates.gp3;

  return svc;
  }

  if (phase === 1) {
  // ── ECS Fargate ──────────────────────────────────────────────────────────
  const RDS_MYSQL_INSTANCES = Object.keys(svc.rds.instanceRates?.mysql ?? {});
  const [cpuX86, memX86, cpuArm, memArm, eph,
         lambdaReqRaw, lambdaDurX86,
         s3Std, s3Ia, s3Glacier,
         rdsMysqlPrices, rdsGp2] = await Promise.all([
    fetcher.ecsFargateCpu(loc), fetcher.ecsFargateMemory(loc),
    fetcher.ecsFargateArmCpu(loc), fetcher.ecsFargateArmMemory(loc),
    fetcher.ecsFargateEphemeral(loc),
    fetcher.lambdaRequests(loc), fetcher.lambdaDurationX86(loc),
    fetcher.s3Storage(loc, 'Standard'),
    fetcher.s3Storage(loc, 'Standard - Infrequent Access'),
    fetcher.s3Storage(loc, 'Amazon Glacier'),
    Promise.all(RDS_MYSQL_INSTANCES.map(inst => fetcher.rdsInstance(loc, inst, 'MySQL'))),
    fetcher.rdsStorageGp2(loc),
  ]);

  if (cpuX86 !== null) { svc.ecs.cpuHour = round(cpuX86, 6)!; svc.eks.cpuHour = svc.ecs.cpuHour; svc.batch.cpuHour = svc.ecs.cpuHour; }
  if (memX86 !== null) { svc.ecs.memHour = round(memX86, 6)!; svc.eks.memHour = svc.ecs.memHour; svc.batch.memHour = svc.ecs.memHour; }
  if (cpuArm !== null) { svc.ecs.armCpuHour = round(cpuArm, 6)!; svc.eks.armCpuHour = svc.ecs.armCpuHour; svc.batch.armCpuHour = svc.ecs.armCpuHour; }
  if (memArm !== null) { svc.ecs.armMemHour = round(memArm, 6)!; svc.eks.armMemHour = svc.ecs.armMemHour; svc.batch.armMemHour = svc.ecs.armMemHour; }
  if (eph !== null) { svc.ecs.ephemeralGBHour = round(eph, 8)!; svc.eks.ephemeralGBHour = svc.ecs.ephemeralGBHour; }

  // ── Lambda ───────────────────────────────────────────────────────────────
  // ARM duration = x86 × 0.8 (consistent ratio across all regions)
  if (lambdaReqRaw !== null) svc.lambda.requestM = round(lambdaReqRaw * 1_000_000, 4)!;
  if (lambdaDurX86 !== null) {
    svc.lambda.gbSec_x86 = round(lambdaDurX86, 10)!;
    svc.lambda.gbSec_arm = round(lambdaDurX86 * 0.8, 10)!;
  }

  // ── S3 ───────────────────────────────────────────────────────────────────
  if (s3Std !== null) { svc.s3.storage.standard = round(s3Std, 4)!; svc.s3.storage.intelligent = svc.s3.storage.standard; }
  if (s3Ia !== null) svc.s3.storage.sia = round(s3Ia, 4)!;
  if (s3Glacier !== null) svc.s3.storage.glacier = round(s3Glacier, 4)!;

  // ── RDS — MySQL (instanceRates is keyed by engine) ───────────────────────
  // MySQL and MariaDB share on-demand list prices, so MariaDB aliases the
  // fetched MySQL rate. PostgreSQL is queried in the next phase; commercial
  // engines (SQL Server, Oracle) keep their baseline rates.
  for (let i = 0; i < RDS_MYSQL_INSTANCES.length; i++) {
    const inst = RDS_MYSQL_INSTANCES[i];
    const p = rdsMysqlPrices[i];
    if (p !== null) {
      const r = round(p, 4)!;
      svc.rds.instanceRates.mysql[inst] = r;
      if (svc.rds.instanceRates.mariadb?.[inst] !== undefined) svc.rds.instanceRates.mariadb[inst] = r;
    }
  }
  if (rdsGp2 !== null) { svc.rds.storage.gp2 = round(rdsGp2, 4)!; svc.rds.storage.gp3 = svc.rds.storage.gp2; }

  return svc;
  }

  if (phase === 2) {
  // ── RDS — PostgreSQL ─────────────────────────────────────────────────────
  const RDS_PG_INSTANCES = Object.keys(svc.rds.instanceRates?.postgresql ?? {});
  const AURORA_INSTANCES = Object.keys(svc.aurora.instances ?? {});
  const [pgPrices, aurAcu, aurPrices] = await Promise.all([
    Promise.all(RDS_PG_INSTANCES.map(inst => fetcher.rdsInstance(loc, inst, 'PostgreSQL'))),
    fetcher.auroraServerlessAcu(loc),
    Promise.all(AURORA_INSTANCES.map(inst => fetcher.auroraInstance(loc, inst))),
  ]);
  RDS_PG_INSTANCES.forEach((inst, i) => {
    if (pgPrices[i] !== null) svc.rds.instanceRates.postgresql[inst] = round(pgPrices[i], 4)!;
  });

  // ── Aurora ───────────────────────────────────────────────────────────────
  if (aurAcu !== null) svc.aurora.serverlessAcuHour = round(aurAcu, 4)!;
  AURORA_INSTANCES.forEach((inst, i) => {
    if (aurPrices[i] !== null) svc.aurora.instances[inst] = round(aurPrices[i], 4)!;
  });

  return svc;
  }

  if (phase === 3) {
  // ── DynamoDB (one bulk fetch covers on-demand, IA, provisioned, global-
  //    tables replicated writes, PITR/backup/restore/export and streams) ─────
  const REDSHIFT_INSTANCES = Object.keys(svc.redshift.instances ?? {});
  const [ddb, osT3Med, osM6gLg, osR6gLg, osStorage,
         redshiftPrices, rsRpu, emrM5Xl, emrR5Xl, msk, mq] = await Promise.all([
    fetcher.dynamoDbBulk(loc),
    fetcher.openSearchInstance(loc, 't3.medium.search'),
    fetcher.openSearchInstance(loc, 'm6g.large.search'),
    fetcher.openSearchInstance(loc, 'r6g.large.search'),
    fetcher.openSearchStorage(loc),
    Promise.all(REDSHIFT_INSTANCES.map(inst => fetcher.redshiftInstance(loc, inst))),
    fetcher.redshiftServerless(loc),
    fetcher.emrInstance(loc, 'm5.xlarge'),
    fetcher.emrInstance(loc, 'r5.xlarge'),
    fetcher.mskBulk(loc),
    fetcher.mqBulk(loc),
  ]);
  const applyDdb = (dst: any, src: any, key: string, digits: number) => {
    if (src?.[key] !== undefined && src[key] !== null) dst[key] = round(src[key], digits)!;
  };
  if (ddb) {
    for (const tier of ['std', 'ia'] as const) {
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'readM', 4);
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'writeM', 4);
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'replicatedWriteM', 4);
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'storageGB', 4);
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'wcuHr', 6);
      applyDdb(svc.dynamoDb[tier], ddb[tier], 'rcuHr', 6);
    }
    applyDdb(svc.dynamoDb, ddb, 'pitrStorageGB', 4);
    applyDdb(svc.dynamoDb, ddb, 'backupStorageGB', 4);
    applyDdb(svc.dynamoDb, ddb, 'restoreGB', 4);
    applyDdb(svc.dynamoDb, ddb, 'streamsRequestsM', 4);
    applyDdb(svc.dynamoDb, ddb, 'exportGB', 4);
  }

  // ── OpenSearch ───────────────────────────────────────────────────────────
  if (osT3Med !== null) svc.openSearch.instances['t3.medium'] = round(osT3Med, 4)!;
  if (osM6gLg !== null) svc.openSearch.instances['m6g.large'] = round(osM6gLg, 4)!;
  if (osR6gLg !== null) svc.openSearch.instances['r6g.large'] = round(osR6gLg, 4)!;
  if (osStorage !== null) svc.openSearch.storageGB = round(osStorage, 4)!;

  // ── Redshift ─────────────────────────────────────────────────────────────
  REDSHIFT_INSTANCES.forEach((inst, i) => {
    if (redshiftPrices[i] !== null) svc.redshift.instances[inst] = round(redshiftPrices[i], 4)!;
  });
  if (rsRpu !== null) svc.redshift.rpuHour = round(rsRpu, 4)!;

  // ── EMR (all-in node cost: EC2 + EMR fee) ────────────────────────────────
  // m5.large has no EMR fee SKU; derived as 50% of m5.xlarge.
  if (emrM5Xl !== null) {
    svc.emr.instances['m5.xlarge'] = round(emrM5Xl, 4)!;
    svc.emr.instances['m5.large'] = round(emrM5Xl * 0.5, 4)!;
  }
  if (emrR5Xl !== null) svc.emr.instances['r5.xlarge'] = round(emrR5Xl, 4)!;

  // ── MSK (one bulk fetch: brokers, Express, serverless, storage tiers) ────
  if (msk) {
    for (const k of Object.keys(svc.msk.instances)) {
      if (msk.instances?.[k] !== undefined) svc.msk.instances[k] = round(msk.instances[k], 4)!;
    }
    for (const k of Object.keys(svc.msk.expressInstances)) {
      if (msk.expressInstances?.[k] !== undefined) svc.msk.expressInstances[k] = round(msk.expressInstances[k], 4)!;
    }
    for (const k of Object.keys(svc.msk.serverless)) {
      if (msk.serverless?.[k] !== undefined) svc.msk.serverless[k] = round(msk.serverless[k], 4)!;
    }
    if (msk.storageGB !== undefined) svc.msk.storageGB = round(msk.storageGB, 4)!;
    if (msk.tieredStorageGB !== undefined) svc.msk.tieredStorageGB = round(msk.tieredStorageGB, 4)!;
    if (msk.expressStorageGB !== undefined) svc.msk.expressStorageGB = round(msk.expressStorageGB, 4)!;
  }

  // ── Amazon MQ (bulk covers every ActiveMQ Single-AZ broker size; Multi-AZ
  //    and RabbitMQ are billed via the baseline multipliers) ────────────────
  if (mq) {
    for (const k of Object.keys(svc.mq.instances)) {
      if (mq.instances?.[k] !== undefined) svc.mq.instances[k] = round(mq.instances[k], 4)!;
    }
  }

  return svc;
  }

  if (phase === 4) {
  const [glueDpu, kin, efsStd, efsIa, apiGwPrice,
         ampB, ampBL, ampBXL, ampS, ampD,
         sesOut, sesIn, sesAtt, sesDip, sesVdm] = await Promise.all([
    fetcher.glueDpu(loc),
    fetcher.kinesisBulk(loc),
    fetcher.efsStorage(loc, 'Standard'),
    fetcher.efsStorage(loc, 'Standard - Infrequent Access'),
    fetcher.apiGatewayRest(loc),
    fetcher.amplifyBuild(loc), fetcher.amplifyBuild(loc, 'Large16GB'), fetcher.amplifyBuild(loc, 'Xlarge72GB'),
    fetcher.amplifyStorage(loc), fetcher.amplifyDataTransfer(loc),
    fetcher.sesOutboundEmail(loc), fetcher.sesInboundEmail(loc), fetcher.sesAttachment(loc),
    fetcher.sesDedicatedIp(loc), fetcher.sesVdm(loc),
  ]);

  // ── Glue ─────────────────────────────────────────────────────────────────
  if (glueDpu !== null) svc.glue.dpuHour = round(glueDpu, 4)!;

  // ── Kinesis Data Streams (one bulk fetch: provisioned, on-demand, EFO,
  //    extended/long-term retention) ─────────────────────────────────────────
  if (kin) {
    const KIN_KEYS: Array<[string, number]> = [
      ['shardHour', 4], ['putM', 4], ['onDemandStreamHour', 4], ['onDemandIngestGB', 4],
      ['onDemandEgressGB', 4], ['efoEgressGB', 4], ['consumerShardHour', 4],
      ['extendedRetentionGB', 4], ['longTermRetentionGB', 4],
    ];
    for (const [k, digits] of KIN_KEYS) {
      if (kin[k] !== undefined) svc.kinesis[k] = round(kin[k], digits)!;
    }
  }

  // ── EFS ──────────────────────────────────────────────────────────────────
  if (efsStd !== null) svc.efs.storage.standard = round(efsStd, 4)!;
  if (efsIa !== null) svc.efs.storage.ia = round(efsIa, 4)!;

  // ── API Gateway (tiered pricing scale) ───────────────────────────────────
  if (apiGwPrice !== null) {
    // apiGatewayRest returns the PER-REQUEST price; scale to per-million
    // before computing the regional ratio against the $3.50/M baseline.
    const ratio = (apiGwPrice * 1_000_000) / 3.50;
    svc.apiGateway.requestsM.rest.tier1 = round(3.50 * ratio, 4)!;
    svc.apiGateway.requestsM.rest.tier2 = round(2.80 * ratio, 4)!;
    svc.apiGateway.requestsM.rest.tier3 = round(2.38 * ratio, 4)!;
    svc.apiGateway.requestsM.rest.tier4 = round(1.51 * ratio, 4)!;

    svc.apiGateway.requestsM.http.tier1 = round(1.00 * ratio, 4)!;
    svc.apiGateway.requestsM.http.tier2 = round(0.90 * ratio, 4)!;

    svc.apiGateway.requestsM.websocket.tier1 = round(1.00 * ratio, 4)!;
    svc.apiGateway.requestsM.websocket.tier2 = round(0.80 * ratio, 4)!;

    for (const size of Object.keys(svc.apiGateway.cacheRates)) {
      svc.apiGateway.cacheRates[size] = round(BASELINE_SERVICES.apiGateway.cacheRates[size] * ratio, 2)!;
    }

    svc.apiGateway.wsConnectionMinuteM = round(BASELINE_SERVICES.apiGateway.wsConnectionMinuteM * ratio, 4)!;
  }

  // ── AWS Amplify ──────────────────────────────────────────────────────────
  if (ampB !== null) svc.amplify.buildMinute = round(ampB, 4)!;
  if (ampBL !== null) svc.amplify.buildMinuteLarge = round(ampBL, 4)!;
  if (ampBXL !== null) svc.amplify.buildMinuteXLarge = round(ampBXL, 4)!;
  if (ampS !== null) svc.amplify.storageGB = round(ampS, 4)!;
  if (ampD !== null) svc.amplify.dataServedGB = round(ampD, 4)!;

  // ── Amazon SES ────────────────────────────────────────────────────────────
  if (sesOut !== null) svc.ses.email = round(sesOut, 6)!;
  if (sesIn !== null) svc.ses.inboundEmail = round(sesIn, 6)!;
  if (sesAtt !== null) svc.ses.attachmentGB = round(sesAtt, 4)!;
  if (sesDip !== null) svc.ses.dedicatedIP = round(sesDip, 2)!;
  if (sesVdm !== null) svc.ses.vdmEmail = round(sesVdm, 6)!;

  return svc;
  }

  if (phase === 5) {
  // ── Amazon DocumentDB ─────────────────────────────────────────────────────
  const DOCDB_CLASSES = Object.keys(svc.documentDb.instances);
  const NEPTUNE_CLASSES = Object.keys(svc.neptune.instances);
  const [docStdPrices, docIoPrices, docStor, docStorIO, docIo,
         nepPrices, nepStor, nepIo,
         tsIngest, tsMem, tsMag, tsScan] = await Promise.all([
    Promise.all(DOCDB_CLASSES.map(cls => fetcher.docDbInstance(loc, cls, false))),
    Promise.all(DOCDB_CLASSES.map(cls => fetcher.docDbInstance(loc, cls, true))),
    fetcher.docDbStorage(loc, false), fetcher.docDbStorage(loc, true), fetcher.docDbIo(loc),
    Promise.all(NEPTUNE_CLASSES.map(cls => fetcher.neptuneInstance(loc, cls))),
    fetcher.neptuneStorage(loc), fetcher.neptuneIo(loc),
    fetcher.timestreamIngest(loc), fetcher.timestreamMemoryStore(loc),
    fetcher.timestreamMagneticStore(loc), fetcher.timestreamScanned(loc),
  ]);
  DOCDB_CLASSES.forEach((cls, i) => {
    if (docStdPrices[i] !== null) svc.documentDb.instances[cls] = round(docStdPrices[i], 4)!;
    if (docIoPrices[i] !== null) svc.documentDb.instancesIO[cls] = round(docIoPrices[i], 4)!;
  });
  if (docStor !== null) svc.documentDb.storageGB = round(docStor, 4)!;
  if (docStorIO !== null) svc.documentDb.storageIOGB = round(docStorIO, 4)!;
  if (docIo !== null) svc.documentDb.ioMillion = round(docIo * 1_000_000, 4)!;

  // ── Amazon Neptune ────────────────────────────────────────────────────────
  NEPTUNE_CLASSES.forEach((cls, i) => {
    if (nepPrices[i] !== null) svc.neptune.instances[cls] = round(nepPrices[i], 4)!;
  });
  if (nepStor !== null) svc.neptune.storageGB = round(nepStor, 4)!;
  if (nepIo !== null) svc.neptune.ioMillion = round(nepIo * 1_000_000, 4)!;

  // ── Amazon Timestream (regional availability is limited — nulls keep baseline) ──
  if (tsIngest !== null) svc.timestream.ingestGB = round(tsIngest, 4)!;
  if (tsMem !== null) svc.timestream.memoryGBHr = round(tsMem, 4)!;
  if (tsMag !== null) svc.timestream.magneticGB = round(tsMag, 4)!;
  if (tsScan !== null) svc.timestream.scannedGB = round(tsScan, 4)!;

  return svc;
  }

  if (phase === 6) {
  const [acReq, acDep, cmRes, cmQry, qsAuthor, qsReader, qsSpice,
         lsBundlesRaw, lsOver, ecRatesRaw, ecServerless] = await Promise.all([
    fetcher.appConfigRequests(loc), fetcher.appConfigDeployment(loc),
    fetcher.cloudMapResource(loc), fetcher.cloudMapQuery(loc),
    fetcher.quickSightAuthorPro(loc), fetcher.quickSightReader(loc), fetcher.quickSightSpice(loc),
    fetcher.lightsailBundles(loc, Object.keys(svc.lightsail.bundles)), fetcher.lightsailOverage(loc),
    fetcher.elastiCacheBulk(loc), fetcher.elastiCacheServerless(loc),
  ]);

  // ── AWS AppConfig ─────────────────────────────────────────────────────────
  if (acReq !== null) svc.appConfig.requestM = round(acReq * 1_000_000, 4)!;
  if (acDep !== null) svc.appConfig.deployment = round(acDep, 6)!;

  // ── AWS Cloud Map ─────────────────────────────────────────────────────────
  if (cmRes !== null) svc.cloudMap.resourceMonth = round(cmRes, 4)!;
  if (cmQry !== null) svc.cloudMap.queryM = round(cmQry * 1_000_000, 4)!;

  // ── Amazon QuickSight ─────────────────────────────────────────────────────
  if (qsAuthor !== null) svc.quickSight.authorPro = round(qsAuthor, 2)!;
  if (qsReader !== null) svc.quickSight.reader = round(qsReader, 2)!;
  if (qsSpice !== null) svc.quickSight.spiceGB = round(qsSpice, 4)!;

  // ── Amazon Lightsail ──────────────────────────────────────────────────────
  const lsBundles = lsBundlesRaw || {};
  for (const [size, rate] of Object.entries(lsBundles)) {
    if (rate !== null) svc.lightsail.bundles[size] = round(rate, 5)!;
  }
  if (lsOver !== null) svc.lightsail.overageGB = round(lsOver, 4)!;

  // ── ElastiCache — node rates + serverless (Redis/Valkey) ─────────────────
  const ecRates = ecRatesRaw || {};
  for (const inst of Object.keys(svc.elastiCache.instances ?? {})) {
    const p = ecRates[inst];
    if (p !== undefined && p !== null) {
      svc.elastiCache.instances[inst] = round(p, 4)!;
    }
  }
  for (const engine of Object.keys(svc.elastiCache.serverless ?? {})) {
    const src = ecServerless?.[engine];
    if (!src) continue;
    if (src.storageGBHour !== undefined) svc.elastiCache.serverless[engine].storageGBHour = round(src.storageGBHour, 4)!;
    if (src.ecpuM !== undefined) svc.elastiCache.serverless[engine].ecpuM = round(src.ecpuM, 6)!;
  }

  return svc;
  }

  if (phase === 7) {
  // ── Bedrock model token rates ─────────────────────────────────────────────
  // Two bulk (paginated) queries return every on-demand SKU for the region;
  // each catalog model is then matched by model name / marketplace
  // servicename. Models not offered in a region keep the us-east-1 baseline
  // rate, consistent with how other services fall back.
  const [odRatesRaw, mpRatesRaw] = await Promise.all([
    fetcher.bedrockOnDemand(loc), fetcher.bedrockMarketplace(loc),
  ]);
  const odRates = odRatesRaw ?? {};
  const mpRates = mpRatesRaw ?? {};
  for (const [key, source] of Object.entries(BEDROCK_MODEL_SOURCES)) {
    const rates = source.od ? odRates[source.od] : mpRates[source.mp!];
    if (!rates) continue;
    // AmazonBedrock offer prices are $/1K tokens; the simulator stores $/1M.
    const scale = source.od ? 1000 : 1;
    if (rates.in !== undefined) svc.bedrock.inM[key] = round(rates.in * scale, 6)!;
    if (rates.out !== undefined) svc.bedrock.outM[key] = round(rates.out * scale, 6)!;
  }

  return svc;
  }

  // ── Phase 8: SageMaker hosting, Rekognition, EC2 current-gen + GPU ────────

  // SageMaker: one bulk fetch returns every Hosting instance rate; only the
  // curated catalog keys are updated (models absent regionally keep baseline).
  const extraFamilies: Record<string, string> = {
    m7g: 'm7g.large', m7i: 'm7i.large', c7g: 'c7g.large', r7g: 'r7g.large', m8g: 'm8g.large', i4i: 'i4i.large',
  };
  const gpuAnchors: Record<string, string> = { g4dn: 'g4dn.xlarge', g5: 'g5.xlarge', g6: 'g6.xlarge' };
  const [smRates, rek, extraPrices, gpuPrices] = await Promise.all([
    fetcher.sageMakerHosting(loc),
    fetcher.rekognitionBulk(loc),
    Promise.all(Object.values(extraFamilies).map(inst => fetcher.ec2Instance(loc, inst))),
    Promise.all(Object.values(gpuAnchors).map(anchor => fetcher.ec2Instance(loc, anchor))),
  ]);
  for (const inst of Object.keys(svc.sageMaker.instances ?? {})) {
    if (smRates?.[inst] !== undefined) svc.sageMaker.instances[inst] = round(smRates[inst], 4)!;
  }

  // Rekognition: image, archived/live video, face vector storage.
  if (rek) {
    if (rek.imageM !== undefined) svc.rekognition.imageM = round(rek.imageM, 4)!;
    if (rek.videoArchivedMin !== undefined) svc.rekognition.videoArchivedMin = round(rek.videoArchivedMin, 4)!;
    if (rek.videoLiveMin !== undefined) svc.rekognition.videoLiveMin = round(rek.videoLiveMin, 4)!;
    if (rek.faceVectorM !== undefined) svc.rekognition.faceVectorM = round(rek.faceVectorM, 4)!;
  }

  // EC2 current-gen family anchors (large size, same scheme as phase 0).
  Object.keys(extraFamilies).forEach((fam, i) => {
    const price = extraPrices[i];
    if (price !== null) {
      const r = round(price, 6)!;
      svc.ec2.familyRatesLarge[fam] = r;
      svc.autoScalingGroup.familyRatesLarge[fam] = r;
      svc.elasticBeanstalk.familyRatesLarge[fam] = r;
      if (fam === 'm7g') {
        svc.ecs.instances['m7g.large'] = r;
        svc.eks.instances['m7g.large'] = r;
      }
    }
  });

  // EC2 GPU families: GPU prices don't follow the size-multiplier ladder, so
  // fetch one anchor per family and scale the baseline size table by the
  // region's anchor ratio (regional = baseline_size × anchor_regional/anchor_baseline).
  for (const [i, [fam, anchor]] of Object.entries(gpuAnchors).entries()) {
    const price = gpuPrices[i];
    const baseAnchor = BASELINE_SERVICES.ec2.gpuInstances[anchor];
    if (price === null || !baseAnchor) continue;
    const ratio = price / baseAnchor;
    for (const size of Object.keys(svc.ec2.gpuInstances)) {
      if (!size.startsWith(`${fam}.`)) continue;
      const scaled = round(BASELINE_SERVICES.ec2.gpuInstances[size] * ratio, 4)!;
      svc.ec2.gpuInstances[size] = scaled;
      svc.autoScalingGroup.gpuInstances[size] = scaled;
      svc.elasticBeanstalk.gpuInstances[size] = scaled;
    }
    if (fam === 'g5') {
      const r = round(price, 4)!;
      svc.ecs.instances['g5.xlarge'] = r;
      svc.eks.instances['g5.xlarge'] = r;
    }
  }

  console.log(`[Builder] Completed pricing build for ${region.code}.`);
  return svc;
}

/**
 * Builds a complete regional pricing file in one call by running all phases
 * sequentially. Only safe where the 50-subrequest limit does not apply
 * (local dev / paid plan) — production cron uses buildPricingPhase instead.
 */
export async function buildPricingFile(
  region: Region,
  fetcher: PricingFetcher
): Promise<Record<string, any>> {
  let svc: Record<string, any> | null = null;
  for (let phase = 0; phase < PHASE_COUNT; phase++) {
    svc = await buildPricingPhase(region, fetcher, svc, phase);
  }
  return svc!;
}
