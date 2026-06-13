export type AwsServiceType =
  | 'client'
  | 'route53'
  | 'cloudfront'
  | 'apiGateway'
  | 'elb'
  | 'vpc'
  | 'ec2'
  | 'ecs'
  | 'autoScalingGroup'
  | 'lambda'
  | 'sqs'
  | 'sns'
  | 's3'
  | 'rds'
  | 'elastiCache'
  | 'dynamoDb'
  | 'iam'
  | 'cloudWatch'
  | 'stepFunctions'
  | 'natGateway'
  | 'securityGroup'
  | 'batch'
  | 'eks'
  | 'aurora'
  | 'eventBridge'
  | 'kinesis'
  | 'msk'
  | 'cognito'
  | 'waf'
  | 'efs'
  | 'athena'
  | 'secretsManager'
  | 'transitGateway'
  | 'directConnect'
  | 'globalAccelerator'
  | 'xray'
  | 'openSearch'
  | 'redshift'
  | 'glue'
  | 'emr'
  | 'kinesisFirehose'
  | 'mq'
  | 'kms'
  | 'shield'
  | 'organizations'
  | 'codePipeline'
  | 'codeBuild'
  | 'codeDeploy'
  | 'bedrock'
  | 'sageMaker'
  | 'appSync'
  | 'iotCore'
  | 'rekognition'
  | 'textract'
  | 'mediaConvert'
  | 'cloudTrail'
  | 'backup'
  | 'appRunner'
  | 'elasticBeanstalk'
  | 'fsx'
  | 'certificateManager'
  | 'systemsManager'
  | 'ecr'
  | 'privateLink';


export type PortDirection = 'input' | 'output';
export type PortType =
  | 'http'
  | 'dns'
  | 'cdn'
  | 'network'
  | 'compute'
  | 'event'
  | 'queue'
  | 'topic'
  | 'storage'
  | 'database'
  | 'cache'
  | 'identity'
  | 'observability'
  | 'workflow'
  | 'job'
  | 'result';

export type HealthStatus = 'normal' | 'busy' | 'overloaded' | 'failing' | 'offline';
export type SimulationMode = 'idle' | 'running' | 'paused';

export interface ServiceConfig {
  [key: string]: any;
  throughput: number;
  latency: number;
  requestRate: number;
  cpu: number;
  memory: number;
  concurrency: number;
  queueDepth: number;
  connectionLimit: number;
  autoscalingThreshold: number;
  failureThreshold: number;
  retryPolicy: number;
  replication: number;
  storageSize: number;
  routingAlgorithm: 'round-robin' | 'least-connection' | 'consistent-hash';
  cacheHitRate: number;
  timeoutMs: number;
  instanceType?: string;
  storageType?: string;
  batchSize?: number;
  instanceSize?: 'nano' | 'micro' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | '4xlarge';
  storageClass?: 'standard' | 'infrequent-access' | 'glacier';
  dataTransferOut?: number;
}

export interface ServiceMetrics {
  processed: number;
  received: number;
  dropped: number;
  retried: number;
  queueSize: number;
  avgLatency: number;
  cpuPressure: number;
  memoryPressure: number;
  errorRate: number;
  throughput: number;
}

export interface ServicePort {
  id: string;
  label: string;
  direction: PortDirection;
  type: PortType;
  capacity?: number;
}

export interface AwsServiceDefinition {
  type: AwsServiceType;
  name: string;
  shortName: string;
  category: 'Compute' | 'Containers' | 'Networking & Content Delivery' | 'Storage' | 'Database' | 'Analytics' | 'Machine Learning' | 'Application Integration' | 'Developer Tools' | 'Management & Governance' | 'Security, Identity, & Compliance' | 'Media Services' | 'Internet of Things' | 'Users';
  description: string;
  color: string;
  icon: string;
  iconUrl: string;
  ports: ServicePort[];
  defaults: ServiceConfig;
  behavior: {
    scalable: boolean;
    stateful: boolean;
    fanOut: boolean;
    boundary?: boolean;
    mandatoryInput: boolean;
    mandatoryOutput: boolean;
    allowFanIn: boolean;
    allowFanOut: boolean;
    allowedTargets: string[];
  };
}

export interface ArchitectureNode {
  id: string;
  type: AwsServiceType;
  name: string;
  x: number;
  y: number;
  config: ServiceConfig;
  ports: ServicePort[];
  status: HealthStatus;
  metrics: ServiceMetrics;
  selected?: boolean;
}

export interface ArchitectureConnection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: PortType;
  allowed: boolean;
  label?: string;
  trafficWeight?: number;
  traffic: {
    requestsPerSecond: number;
    latency: number;
    errorRate: number;
    intensity: number;
  };
  animationOffset: number;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

export interface Annotation {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  selected?: boolean;
}

export interface ArchitectureProject {
  id: string;
  name: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  annotations?: Annotation[];
  currency: Currency;
  region?: string;
  updatedAt: string;
}

export interface ValidationResult {
  allowed: boolean;
  message: string;
  ruleId?: string;
}

export interface ConnectionRule {
  id: string;
  source: AwsServiceType | '*';
  target: AwsServiceType | '*';
  sourcePortTypes: PortType[];
  targetPortTypes: PortType[];
  connectionType: PortType;
  description: string;
}

export interface DataPacket {
  id: string;
  connectionId: string;
  progress: number;
  status: HealthStatus;
}
