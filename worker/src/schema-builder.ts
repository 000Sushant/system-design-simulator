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
  dynamoDb: { std: { readM: 0.125, writeM: 0.625, storageGB: 0.25, wcuHr: 0.00065, rcuHr: 0.000130 }, ia: { readM: 0.15625, writeM: 0.78125, storageGB: 0.10, wcuHr: 0.0008125, rcuHr: 0.0001625 }, pitrStorageGB: 0.20, backupStorageGB: 0.10, restoreGB: 0.15, streamsRequestsM: 0.20, exportGB: 0.10, globalMultiplier: 1.5 },
  iam: {},
  cloudWatch: { metricRate: 0.30, logsGB: 0.50, dashboard: 3.00, alarmMonth: 0.10, logsStorageGB: 0.03 },
  stepFunctions: { standardM: 25.00, expressReq: 1.00, expressGBsec: 16.67 },
  natGateway: { hourly: 0.045, dataGB: 0.045 },
  securityGroup: {},
  batch: { cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, logsGB: 0.50 },
  eks: { clusterHourlyStandard: 0.10, clusterHourlyExtended: 0.60, cpuHour: 0.04048, memHour: 0.004445, armCpuHour: 0.03238, armMemHour: 0.00356, ephemeralGBHour: 0.000111, spotDiscount: 0.70, dataTransferGB: 0.09, crossAzGB: 0.01, elbHourly: 0.0225, natHourly: 0.045, natDataGB: 0.045, logsGB: 0.50, instances: { 't3.medium': 0.0416, 't3.large': 0.0832, 'm5.large': 0.096, 'm5.xlarge': 0.192, 'm6g.large': 0.077, 'm7g.large': 0.096, 'g5.xlarge': 1.408 }, ebsGBMonth: 0.08, reservedDiscount: 0.40, containerInsightsPerNode: 2.5 },
  aurora: { serverlessAcuHour: 0.12, instances: { 'db.t3.medium': 0.082, 'db.r5.large': 0.290, 'db.r6g.large': 0.260, 'db.t4g.medium': 0.041, 'db.m7g.large': 0.13, 'db.r7g.large': 0.175 }, ioOptimizedComputeMultiplier: 1.30, ioOptimizedStorageRate: 0.225, storageGB: 0.10, ioRequestPerM: 0.20 },
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
export const PHASE_COUNT = 6;

/**
 * Runs ONE phase of the regional pricing build. `partial` carries the
 * accumulated result between phases (pass null on phase 0 to start from a
 * fresh baseline clone). A null result from any query leaves the
 * corresponding baseline value untouched.
 *
 * Phases: 0 = Route53/ELB/NAT/egress/EC2/EBS · 1 = Fargate/Lambda/S3/
 * RDS-MySQL · 2 = RDS-PostgreSQL/Aurora/ElastiCache · 3 = DynamoDB/
 * OpenSearch/Redshift/EMR/MSK/MQ · 4 = Glue/Kinesis/EFS/API Gateway ·
 * 5 = Bedrock · 4 = Bedrock model token rates
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
  // ── Route53 (global) ────────────────────────────────────────────────────
  const r53Zone = await fetcher.route53Zone();
  const r53QueriesRaw = await fetcher.route53Queries();
  if (r53Zone !== null) svc.route53.zoneMonthly = round(r53Zone, 2)!;
  // API returns per-query price; we store per-million
  if (r53QueriesRaw !== null) svc.route53.standardM = round(r53QueriesRaw * 1_000_000, 2)!;

  // ── ELB ─────────────────────────────────────────────────────────────────
  const albHr = await fetcher.elbHourly(loc);
  const albLcu = await fetcher.elbLcu(loc);
  if (albHr !== null) svc.elb.types.alb.hourly = round(albHr, 4)!;
  if (albLcu !== null) svc.elb.types.alb.lcuHour = round(albLcu, 4)!;

  const nlbHr = await fetcher.nlbHourly(loc);
  const nlbLcu = await fetcher.nlbLcu(loc);
  if (nlbHr !== null) svc.elb.types.nlb.hourly = round(nlbHr, 4)!;
  if (nlbLcu !== null) svc.elb.types.nlb.lcuHour = round(nlbLcu, 4)!;

  const clbHr = await fetcher.clbHourly(loc);
  const clbData = await fetcher.clbDataGB(loc);
  if (clbHr !== null) svc.elb.types.clb.hourly = round(clbHr, 4)!;
  if (clbData !== null) svc.elb.types.clb.dataGB = round(clbData, 4)!;

  const gwlbHr = await fetcher.gwlbHourly(loc);
  const gwlbLcu = await fetcher.gwlbLcu(loc);
  if (gwlbHr !== null) svc.elb.types.gwlb.hourly = round(gwlbHr, 4)!;
  if (gwlbLcu !== null) svc.elb.types.gwlb.lcuHour = round(gwlbLcu, 4)!;

  // Propagate ALB hourly to ecs/eks configurations as well
  if (albHr !== null) {
    svc.ecs.elbHourly = round(albHr, 4)!;
    svc.eks.elbHourly = round(albHr, 4)!;
  }

  // ── NAT Gateway ─────────────────────────────────────────────────────────
  const natHr = await fetcher.natGatewayHourly(loc);
  const natData = await fetcher.natGatewayData(loc);
  if (natHr !== null) { svc.natGateway.hourly = round(natHr, 4)!; svc.eks.natHourly = svc.natGateway.hourly; }
  if (natData !== null) { svc.natGateway.dataGB = round(natData, 4)!; svc.eks.natDataGB = svc.natGateway.dataGB; }

  // ── Data Transfer Out (Internet Egress) ──────────────────────────────────
  // Fetch region-specific egress rate and propagate to all services that use it
  const egressRate = await fetcher.dataTransferOut(loc);
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
  for (const fam of families) {
    const price = await fetcher.ec2Instance(loc, instanceMap[fam]);
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
  const ebsGp2 = await fetcher.ec2EbsGp2(loc);
  const ebsGp3 = await fetcher.ec2EbsGp3(loc);
  const ebsIo2 = await fetcher.ec2EbsIo2(loc);
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

  // ── RDS — MySQL (instanceRates is keyed by engine) ───────────────────────
  // MySQL and MariaDB share on-demand list prices, so MariaDB aliases the
  // fetched MySQL rate. PostgreSQL is queried in the next phase; commercial
  // engines (SQL Server, Oracle) keep their baseline rates.
  const RDS_MYSQL_INSTANCES = Object.keys(svc.rds.instanceRates?.mysql ?? {});
  for (const inst of RDS_MYSQL_INSTANCES) {
    const p = await fetcher.rdsInstance(loc, inst, 'MySQL');
    if (p !== null) {
      const r = round(p, 4)!;
      svc.rds.instanceRates.mysql[inst] = r;
      if (svc.rds.instanceRates.mariadb?.[inst] !== undefined) svc.rds.instanceRates.mariadb[inst] = r;
    }
  }
  const rdsGp2 = await fetcher.rdsStorageGp2(loc);
  if (rdsGp2 !== null) { svc.rds.storage.gp2 = round(rdsGp2, 4)!; svc.rds.storage.gp3 = svc.rds.storage.gp2; }

  return svc;
  }

  if (phase === 2) {
  // ── RDS — PostgreSQL ─────────────────────────────────────────────────────
  const RDS_PG_INSTANCES = Object.keys(svc.rds.instanceRates?.postgresql ?? {});
  for (const inst of RDS_PG_INSTANCES) {
    const p = await fetcher.rdsInstance(loc, inst, 'PostgreSQL');
    if (p !== null) svc.rds.instanceRates.postgresql[inst] = round(p, 4)!;
  }

  // ── Aurora ───────────────────────────────────────────────────────────────
  const aurAcu = await fetcher.auroraServerlessAcu(loc);
  if (aurAcu !== null) svc.aurora.serverlessAcuHour = round(aurAcu, 4)!;
  for (const inst of Object.keys(svc.aurora.instances ?? {})) {
    const p = await fetcher.auroraInstance(loc, inst);
    if (p !== null) svc.aurora.instances[inst] = round(p, 4)!;
  }

  // ── ElastiCache ──────────────────────────────────────────────────────────
  for (const inst of Object.keys(svc.elastiCache.instances ?? {})) {
    const p = await fetcher.elastiCacheInstance(loc, inst);
    if (p !== null) svc.elastiCache.instances[inst] = round(p, 4)!;
  }

  return svc;
  }

  if (phase === 3) {
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

  // ── EMR (all-in node cost: EC2 + EMR fee) ────────────────────────────────
  // m5.large has no EMR fee SKU; derived as 50% of m5.xlarge.
  const emrM5Xl = await fetcher.emrInstance(loc, 'm5.xlarge');
  const emrR5Xl = await fetcher.emrInstance(loc, 'r5.xlarge');
  if (emrM5Xl !== null) {
    svc.emr.instances['m5.xlarge'] = round(emrM5Xl, 4)!;
    svc.emr.instances['m5.large'] = round(emrM5Xl * 0.5, 4)!;
  }
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

  return svc;
  }

  if (phase === 4) {
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
  if (efsIa !== null) svc.efs.storage.ia = round(efsIa, 4)!;

  // ── API Gateway (tiered pricing scale) ───────────────────────────────────
  const apiGwPrice = await fetcher.apiGatewayRest(loc);
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

  return svc;
  }

  // ── Phase 5: Bedrock model token rates ─────────────────────────────────
  // Two bulk (paginated) queries return every on-demand SKU for the region;
  // each catalog model is then matched by model name / marketplace
  // servicename. Models not offered in a region keep the us-east-1 baseline
  // rate, consistent with how other services fall back.
  const odRates = (await fetcher.bedrockOnDemand(loc)) ?? {};
  const mpRates = (await fetcher.bedrockMarketplace(loc)) ?? {};
  for (const [key, source] of Object.entries(BEDROCK_MODEL_SOURCES)) {
    const rates = source.od ? odRates[source.od] : mpRates[source.mp!];
    if (!rates) continue;
    // AmazonBedrock offer prices are $/1K tokens; the simulator stores $/1M.
    const scale = source.od ? 1000 : 1;
    if (rates.in !== undefined) svc.bedrock.inM[key] = round(rates.in * scale, 6)!;
    if (rates.out !== undefined) svc.bedrock.outM[key] = round(rates.out * scale, 6)!;
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
