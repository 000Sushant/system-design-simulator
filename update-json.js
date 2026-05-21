const fs = require('fs');
const file = 'src/app/core/data/service-cost-model.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

Object.assign(data.serviceCostModel, {
  alb: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 1000, min: 1, max: 100000, costDriver: 'RPS impacts LCU calculation.' },
      { key: 'latency', label: 'Base Latency (ms)', type: 'number', unit: 'ms', default: 15, min: 1, max: 1000, costDriver: 'Processing delay.' }
    ],
    costParams: [
      { key: 'instanceCount', label: 'ALB Instances', type: 'number', unit: 'count', default: 1, min: 1, max: 50, costDriver: '$0.0225 per hour per ALB.' },
      { key: 'lcuCount', label: 'LCUs', type: 'number', unit: 'count', default: 1, min: 0, max: 1000, costDriver: '$0.008 per LCU per hour.' }
    ],
    costEvaluation: {
      formula: 'hourlyCost + lcuCost',
      components: [
        { id: 'hourly', name: 'Hourly Charge', formula: 'instances × 730 hrs × $0.0225', variables: ['instanceCount'] },
        { id: 'lcu', name: 'LCU Charge', formula: 'LCUs × 730 hrs × $0.008', variables: ['lcuCount'] }
      ]
    },
    pricingFactors: { hourly: 0.0225, lcu: 0.008 }
  },
  vpc: {
    primaryParams: [
      { key: 'throughput', label: 'Bandwidth (Mbps)', type: 'number', unit: 'Mbps', default: 100, min: 1, max: 100000, costDriver: 'Network throughput.' }
    ],
    costParams: [
      { key: 'endpoints', label: 'VPC Endpoints', type: 'number', unit: 'count', default: 0, min: 0, max: 50, costDriver: '$0.01 per hour per endpoint.' },
      { key: 'endpointGB', label: 'Endpoint Data (GB/mo)', type: 'number', unit: 'GB', default: 0, min: 0, max: 100000, costDriver: '$0.01 per GB processed.' },
      { key: 'peeringGB', label: 'Cross-AZ Peering (GB/mo)', type: 'number', unit: 'GB', default: 0, min: 0, max: 100000, costDriver: '$0.02 per GB round-trip.' }
    ],
    costEvaluation: {
      formula: 'endpointCost + endpointDataCost + peeringCost',
      components: [
        { id: 'ep', name: 'Endpoint Hourly', formula: 'endpoints × 730 hrs × $0.01', variables: ['endpoints'] },
        { id: 'epdata', name: 'Endpoint Data', formula: 'GB × $0.01', variables: ['endpointGB'] },
        { id: 'peering', name: 'Peering Data', formula: 'GB × $0.02', variables: ['peeringGB'] }
      ]
    },
    pricingFactors: { endpointHourly: 0.01, endpointGB: 0.01, peeringGB: 0.02 }
  },
  natGateway: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 100, min: 1, max: 10000, costDriver: 'Impacts data transfer.' }
    ],
    costParams: [
      { key: 'instances', label: 'NAT Gateways', type: 'number', unit: 'count', default: 1, min: 1, max: 10, costDriver: '$0.045 per hour per NAT.' },
      { key: 'dataGB', label: 'Data Processed (GB/mo)', type: 'number', unit: 'GB', default: 100, min: 0, max: 100000, costDriver: '$0.045 per GB.' }
    ],
    costEvaluation: {
      formula: 'hourlyCost + dataCost',
      components: [
        { id: 'hourly', name: 'Hourly Charge', formula: 'instances × 730 hrs × $0.045', variables: ['instances'] },
        { id: 'data', name: 'Data Processing', formula: 'GB × $0.045', variables: ['dataGB'] }
      ]
    },
    pricingFactors: { hourly: 0.045, perGB: 0.045 }
  },
  cloudWatch: {
    primaryParams: [],
    costParams: [
      { key: 'customMetrics', label: 'Custom Metrics', type: 'number', unit: 'count', default: 10, min: 0, max: 10000, costDriver: '$0.30 per metric.' },
      { key: 'logsGB', label: 'Logs Ingested (GB/mo)', type: 'number', unit: 'GB', default: 50, min: 0, max: 10000, costDriver: '$0.50 per GB.' },
      { key: 'alarms', label: 'Alarms', type: 'number', unit: 'count', default: 5, min: 0, max: 1000, costDriver: '$0.10 per alarm.' },
      { key: 'dashboards', label: 'Dashboards', type: 'number', unit: 'count', default: 1, min: 0, max: 100, costDriver: '$3.00 per dashboard.' }
    ],
    costEvaluation: {
      formula: 'metricsCost + logsCost + alarmsCost + dashboardsCost',
      components: [
        { id: 'metrics', name: 'Custom Metrics', formula: 'metrics × $0.30', variables: ['customMetrics'] },
        { id: 'logs', name: 'Log Ingestion', formula: 'GB × $0.50', variables: ['logsGB'] },
        { id: 'alarms', name: 'Alarms', formula: 'alarms × $0.10', variables: ['alarms'] },
        { id: 'dashboards', name: 'Dashboards', formula: 'max(0, dash - 3) × $3.00', variables: ['dashboards'], note: '3 dashboards free' }
      ],
      freeTier: { description: '3 Dashboards free per month.' }
    },
    pricingFactors: { metric: 0.30, logsGB: 0.50, alarm: 0.10, dashboard: 3.00, freeDashboards: 3 }
  },
  dynamoDb: {
    primaryParams: [
      { key: 'latency', label: 'Latency (ms)', type: 'number', unit: 'ms', default: 5, min: 1, max: 100, costDriver: 'DynamoDB provides single-digit ms latency.' }
    ],
    costParams: [
      { key: 'capacityMode', label: 'Capacity Mode', type: 'enum', default: 'provisioned', group: 'billing', options: [
        { value: 'provisioned', label: 'Provisioned', description: 'Pay for provisioned WCU/RCU.', wcuCost: 0.00065, rcuCost: 0.00013 },
        { value: 'ondemand', label: 'On-Demand', description: 'Pay per million requests.', wruCost: 1.25, rruCost: 0.25 }
      ] },
      { key: 'wcu', label: 'Provisioned WCU', type: 'number', unit: 'count', default: 100, min: 1, max: 100000, costDriver: '$0.00065 per WCU/hr.' },
      { key: 'rcu', label: 'Provisioned RCU', type: 'number', unit: 'count', default: 100, min: 1, max: 100000, costDriver: '$0.00013 per RCU/hr.' },
      { key: 'wruM', label: 'On-Demand Writes (M/mo)', type: 'number', unit: 'M', default: 1, min: 0, max: 10000, costDriver: '$1.25 per million writes.' },
      { key: 'rruM', label: 'On-Demand Reads (M/mo)', type: 'number', unit: 'M', default: 1, min: 0, max: 10000, costDriver: '$0.25 per million reads.' },
      { key: 'storageGB', label: 'Storage (GB)', type: 'number', unit: 'GB', default: 10, min: 0, max: 100000, costDriver: 'First 25 GB free, then $0.25/GB/mo.' }
    ],
    costEvaluation: {
      formula: 'capacityCost + storageCost',
      components: [
        { id: 'provWrite', name: 'Provisioned Writes', formula: 'WCU × 730 hrs × $0.00065', variables: ['wcu', 'capacityMode'] },
        { id: 'provRead', name: 'Provisioned Reads', formula: 'RCU × 730 hrs × $0.00013', variables: ['rcu', 'capacityMode'] },
        { id: 'odWrite', name: 'On-Demand Writes', formula: 'Millions × $1.25', variables: ['wruM', 'capacityMode'] },
        { id: 'odRead', name: 'On-Demand Reads', formula: 'Millions × $0.25', variables: ['rruM', 'capacityMode'] },
        { id: 'storage', name: 'Storage', formula: 'max(0, GB - 25) × $0.25', variables: ['storageGB'] }
      ],
      freeTier: { description: '25 GB of storage free per month.' }
    },
    pricingFactors: { wcuHour: 0.00065, rcuHour: 0.00013, wruMillion: 1.25, rruMillion: 0.25, storageGB: 0.25, freeStorageGB: 25 }
  },
  rds: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 1000, min: 1, max: 50000, costDriver: 'Database concurrency.' },
      { key: 'latency', label: 'Latency (ms)', type: 'number', unit: 'ms', default: 10, min: 1, max: 1000, costDriver: 'Query latency.' }
    ],
    costParams: [
      { key: 'instanceType', label: 'Instance Type', type: 'enum', default: 'db.t3.medium', group: 'compute', options: [
        { value: 'db.t3.micro', label: 'db.t3.micro', hourly: 0.017 },
        { value: 'db.t3.small', label: 'db.t3.small', hourly: 0.034 },
        { value: 'db.t3.medium', label: 'db.t3.medium', hourly: 0.068 },
        { value: 'db.m5.large', label: 'db.m5.large', hourly: 0.171 },
        { value: 'db.m5.xlarge', label: 'db.m5.xlarge', hourly: 0.342 },
        { value: 'db.m5.2xlarge', label: 'db.m5.2xlarge', hourly: 0.684 }
      ] },
      { key: 'multiAZ', label: 'Multi-AZ Deployment', type: 'boolean', default: false, costDriver: 'Doubles compute and storage cost.' },
      { key: 'storageGB', label: 'Storage (GB)', type: 'number', unit: 'GB', default: 100, min: 20, max: 65536, costDriver: '$0.115 per GB/mo (gp3).' }
    ],
    costEvaluation: {
      formula: 'computeCost + storageCost',
      components: [
        { id: 'compute', name: 'DB Compute', formula: 'hourlyRate × 730 hrs × (Multi-AZ ? 2 : 1)', variables: ['instanceType', 'multiAZ'] },
        { id: 'storage', name: 'DB Storage (gp3)', formula: 'GB × $0.115 × (Multi-AZ ? 2 : 1)', variables: ['storageGB', 'multiAZ'] }
      ]
    },
    pricingFactors: {
      instances: { 'db.t3.micro': 0.017, 'db.t3.small': 0.034, 'db.t3.medium': 0.068, 'db.m5.large': 0.171, 'db.m5.xlarge': 0.342, 'db.m5.2xlarge': 0.684 },
      storageGB: 0.115
    }
  },
  elastiCache: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 50000, min: 1, max: 1000000, costDriver: 'Cache hits per sec.' },
      { key: 'latency', label: 'Latency (ms)', type: 'number', unit: 'ms', default: 1, min: 1, max: 100, costDriver: 'Sub-millisecond latency.' }
    ],
    costParams: [
      { key: 'instanceType', label: 'Node Type', type: 'enum', default: 'cache.t3.medium', group: 'compute', options: [
        { value: 'cache.t3.micro', label: 'cache.t3.micro', hourly: 0.017 },
        { value: 'cache.t3.small', label: 'cache.t3.small', hourly: 0.034 },
        { value: 'cache.t3.medium', label: 'cache.t3.medium', hourly: 0.068 },
        { value: 'cache.m5.large', label: 'cache.m5.large', hourly: 0.156 },
        { value: 'cache.m5.xlarge', label: 'cache.m5.xlarge', hourly: 0.312 }
      ] },
      { key: 'nodes', label: 'Number of Nodes', type: 'number', unit: 'count', default: 2, min: 1, max: 500, costDriver: 'Nodes in cluster.' },
      { key: 'backupGB', label: 'Backup Storage (GB)', type: 'number', unit: 'GB', default: 0, min: 0, max: 10000, costDriver: '$0.085 per GB/mo.' }
    ],
    costEvaluation: {
      formula: 'computeCost + backupCost',
      components: [
        { id: 'compute', name: 'Node Compute', formula: 'nodes × hourlyRate × 730 hrs', variables: ['instanceType', 'nodes'] },
        { id: 'backup', name: 'Backup Storage', formula: 'GB × $0.085', variables: ['backupGB'] }
      ]
    },
    pricingFactors: {
      instances: { 'cache.t3.micro': 0.017, 'cache.t3.small': 0.034, 'cache.t3.medium': 0.068, 'cache.m5.large': 0.156, 'cache.m5.xlarge': 0.312 },
      backupGB: 0.085
    }
  },
  ecs: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 1000, min: 1, max: 50000, costDriver: 'Task capacity.' },
      { key: 'latency', label: 'Latency (ms)', type: 'number', unit: 'ms', default: 30, min: 1, max: 10000, costDriver: 'Task latency.' }
    ],
    costParams: [
      { key: 'tasks', label: 'Fargate Tasks', type: 'number', unit: 'count', default: 2, min: 1, max: 1000, costDriver: 'Number of running tasks.' },
      { key: 'vCPU', label: 'vCPU per Task', type: 'enum', default: '0.5', group: 'compute', options: [
        { value: '0.25', label: '0.25 vCPU' }, { value: '0.5', label: '0.5 vCPU' }, { value: '1', label: '1 vCPU' }, { value: '2', label: '2 vCPU' }, { value: '4', label: '4 vCPU' }
      ], costDriver: '$0.04048 per vCPU/hour.' },
      { key: 'memoryGB', label: 'Memory per Task (GB)', type: 'number', unit: 'GB', default: 1, min: 0.5, max: 30, costDriver: '$0.004445 per GB/hour.' }
    ],
    costEvaluation: {
      formula: 'vCPUCost + MemoryCost',
      components: [
        { id: 'cpu', name: 'vCPU Cost', formula: 'tasks × vCPU × 730 hrs × $0.04048', variables: ['tasks', 'vCPU'] },
        { id: 'mem', name: 'Memory Cost', formula: 'tasks × GB × 730 hrs × $0.004445', variables: ['tasks', 'memoryGB'] }
      ]
    },
    pricingFactors: { cpuHour: 0.04048, memHour: 0.004445 }
  },
  batch: {
    primaryParams: [
      { key: 'throughput', label: 'Capacity (RPS)', type: 'number', unit: 'rps', default: 100, min: 1, max: 50000, costDriver: 'Batch job processing.' }
    ],
    costParams: [
      { key: 'tasks', label: 'Avg Concurrent Jobs', type: 'number', unit: 'count', default: 1, min: 0, max: 10000, costDriver: 'Number of jobs.' },
      { key: 'vCPU', label: 'vCPU per Job', type: 'number', unit: 'vCPU', default: 2, min: 1, max: 16, costDriver: '$0.04048 per vCPU/hour (Fargate).' },
      { key: 'memoryGB', label: 'Memory per Job (GB)', type: 'number', unit: 'GB', default: 4, min: 1, max: 64, costDriver: '$0.004445 per GB/hour (Fargate).' },
      { key: 'hoursPerMonth', label: 'Job Hours/mo', type: 'number', unit: 'hrs', default: 100, min: 1, max: 730, costDriver: 'Total runtime per month.' }
    ],
    costEvaluation: {
      formula: 'vCPUCost + MemoryCost',
      components: [
        { id: 'cpu', name: 'vCPU Cost', formula: 'jobs × vCPU × hrs × $0.04048', variables: ['tasks', 'vCPU', 'hoursPerMonth'] },
        { id: 'mem', name: 'Memory Cost', formula: 'jobs × GB × hrs × $0.004445', variables: ['tasks', 'memoryGB', 'hoursPerMonth'] }
      ],
      freeTier: { description: 'AWS Batch orchestration is free. You only pay for underlying compute (Fargate modeled here).' }
    },
    pricingFactors: { cpuHour: 0.04048, memHour: 0.004445 }
  },
  sqs: {
    primaryParams: [
      { key: 'throughput', label: 'Throughput (RPS)', type: 'number', unit: 'rps', default: 1000, min: 1, max: 100000, costDriver: 'Message processing.' }
    ],
    costParams: [
      { key: 'queueType', label: 'Queue Type', type: 'enum', default: 'standard', group: 'queue', options: [
        { value: 'standard', label: 'Standard Queue', priceM: 0.40 },
        { value: 'fifo', label: 'FIFO Queue', priceM: 0.50 }
      ] },
      { key: 'requestsM', label: 'Requests (M/mo)', type: 'number', unit: 'M', default: 10, min: 0, max: 100000, costDriver: 'Billed per 64KB chunk.' }
    ],
    costEvaluation: {
      formula: 'requestsCost',
      components: [
        { id: 'req', name: 'Requests Cost', formula: 'Millions × Price/M', variables: ['queueType', 'requestsM'] }
      ]
    },
    pricingFactors: { standard: 0.40, fifo: 0.50 }
  },
  sns: {
    primaryParams: [
      { key: 'throughput', label: 'Throughput (RPS)', type: 'number', unit: 'rps', default: 1000, min: 1, max: 100000, costDriver: 'Publish rate.' }
    ],
    costParams: [
      { key: 'publishM', label: 'Publish Requests (M/mo)', type: 'number', unit: 'M', default: 10, min: 0, max: 100000, costDriver: '$0.50 per million.' },
      { key: 'httpDeliveriesM', label: 'HTTP Deliveries (M/mo)', type: 'number', unit: 'M', default: 10, min: 0, max: 100000, costDriver: '$0.60 per million.' },
      { key: 'emailDeliveriesM', label: 'Email Deliveries (M/mo)', type: 'number', unit: 'M', default: 0, min: 0, max: 10000, costDriver: '$20.00 per million.' }
    ],
    costEvaluation: {
      formula: 'publishCost + httpCost + emailCost',
      components: [
        { id: 'pub', name: 'Publish Cost', formula: 'Millions × $0.50', variables: ['publishM'] },
        { id: 'http', name: 'HTTP Delivery', formula: 'Millions × $0.60', variables: ['httpDeliveriesM'] },
        { id: 'email', name: 'Email Delivery', formula: 'Millions × $20.00', variables: ['emailDeliveriesM'] }
      ]
    },
    pricingFactors: { publish: 0.50, http: 0.60, email: 20.00 }
  },
  stepFunctions: {
    primaryParams: [
      { key: 'throughput', label: 'Throughput (RPS)', type: 'number', unit: 'rps', default: 100, min: 1, max: 10000, costDriver: 'Workflow executions.' }
    ],
    costParams: [
      { key: 'workflowType', label: 'Workflow Type', type: 'enum', default: 'standard', group: 'type', options: [
        { value: 'standard', label: 'Standard (State Transitions)' },
        { value: 'express', label: 'Express (Requests + Compute)' }
      ] },
      { key: 'transitionsM', label: 'Transitions (M/mo)', type: 'number', unit: 'M', default: 1, min: 0, max: 10000, costDriver: '$25.00 per million (Standard).' },
      { key: 'expressRequestsM', label: 'Express Requests (M/mo)', type: 'number', unit: 'M', default: 0, min: 0, max: 10000, costDriver: '$1.00 per million (Express).' },
      { key: 'expressGBsecM', label: 'Express GB-sec (M/mo)', type: 'number', unit: 'M', default: 0, min: 0, max: 10000, costDriver: '$16.67 per million GB-sec (Express).' }
    ],
    costEvaluation: {
      formula: 'standardCost OR (expressReqCost + expressComputeCost)',
      components: [
        { id: 'std', name: 'Standard Transitions', formula: 'Millions × $25.00', variables: ['workflowType', 'transitionsM'] },
        { id: 'expReq', name: 'Express Requests', formula: 'Millions × $1.00', variables: ['workflowType', 'expressRequestsM'] },
        { id: 'expComp', name: 'Express Compute', formula: 'Millions GB-sec × $16.67', variables: ['workflowType', 'expressGBsecM'] }
      ]
    },
    pricingFactors: { standard: 25.00, expressReq: 1.00, expressGBsec: 16.67 }
  },
  iam: {
    primaryParams: [],
    costParams: [],
    costEvaluation: {
      formula: 'Free',
      components: [],
      freeTier: { description: 'AWS IAM is a globally free service.' }
    }
  },
  securityGroup: {
    primaryParams: [],
    costParams: [],
    costEvaluation: {
      formula: 'Free',
      components: [],
      freeTier: { description: 'AWS Security Groups are free of charge.' }
    }
  },
  client: {
    primaryParams: [
      { key: 'requestRate', label: 'User Traffic (RPS)', type: 'number', unit: 'rps', default: 100, min: 1, max: 100000, costDriver: 'Source of simulation traffic.' }
    ],
    costParams: [],
    costEvaluation: {
      formula: 'N/A',
      components: [],
      freeTier: { description: 'Client node represents external users. No AWS cost associated.' }
    }
  },
  autoScalingGroup: {
    primaryParams: [
      { key: 'minSize', label: 'Min Instances', type: 'number', unit: 'count', default: 1, min: 0, max: 100, costDriver: 'Minimum cluster size.' },
      { key: 'maxSize', label: 'Max Instances', type: 'number', unit: 'count', default: 5, min: 1, max: 100, costDriver: 'Maximum cluster size.' }
    ],
    costParams: [],
    costEvaluation: {
      formula: 'Free',
      components: [],
      freeTier: { description: 'Auto Scaling is free. You are billed only for the EC2 instances it launches (see EC2 node).' }
    }
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
