import { Injectable } from '@angular/core';
import { AwsServiceDefinition, AwsServiceType, ServiceConfig } from '../models/architecture.model';
import awsServicesConfig from '../config/aws-services.json';
import * as serviceCostModelData from '../data/service-cost-model.json';

const baseDefaults: ServiceConfig = {
  throughput: 100,
  cpu: 35,
  memory: 40,
  latency: 40,
  concurrency: 100,
  requestRate: 80,
  queueDepth: 0,
  storageSize: 100,
  connectionLimit: 1000,
  autoscalingThreshold: 70,
  failureThreshold: 95,
  retryPolicy: 2,
  replication: 1,
  routingAlgorithm: 'round-robin',
  cacheHitRate: 0,
  timeoutMs: 3000,
  batchSize: 10,
  instanceSize: 'micro',
  storageClass: 'standard',
  dataTransferOut: 0
};

const serviceDescriptions: Partial<Record<AwsServiceType, string>> = {
  client: 'Represents the external users, devices, or client applications that send traffic into an architecture for simulation and testing.',
  route53: 'Route 53 provides DNS routing that translates user-friendly domain names into the AWS endpoints that serve an application.',
  cloudfront: 'CloudFront delivers cached content from edge locations close to users, reducing latency and lowering load on origin services.',
  apiGateway: 'API Gateway provides a managed front door for HTTP APIs, routing client requests to backend services while supporting authorization, throttling, and request controls.',
  elb: 'Elastic Load Balancer distributes HTTP and HTTPS traffic across healthy backend targets to improve availability and scale request handling.',
  lambda: 'Lambda runs backend code in response to events without requiring server management, scaling automatically for short-lived workloads.',
  ec2: 'EC2 provides configurable virtual servers for applications that need operating-system access, long-running processes, or custom runtime control.',
  ecs: 'ECS runs containerized services on managed AWS compute, helping teams deploy and scale Docker-based applications.',
  sqs: 'SQS buffers messages between services so producers and consumers can work independently during traffic spikes or downstream slowdowns.',
  sns: 'SNS publishes messages to multiple subscribers, supporting fan-out notification and event-distribution patterns.',
  s3: 'S3 stores objects such as static assets, uploads, backups, and logs with high durability and elastic capacity.',
  rds: 'RDS provides managed relational databases for structured data that needs SQL queries, transactions, backups, and read scaling.',
  dynamoDb: 'DynamoDB provides a managed NoSQL database for high-throughput key-value and document access with predictable low latency.',
  elastiCache: 'ElastiCache provides in-memory caching to serve frequent reads quickly and reduce pressure on databases or application backends.',
  cloudWatch: 'CloudWatch collects metrics, logs, alarms, and operational signals that help monitor applications and trigger automated actions.',
  stepFunctions: 'Step Functions coordinates multi-step workflows across AWS services with state tracking, branching, retries, and error handling.',
  eventBridge: 'EventBridge provides a serverless event bus that routes application and AWS service events to matching downstream targets.',
  cognito: 'Cognito manages user sign-up, sign-in, identity federation, and access tokens for web and mobile applications.',
  waf: 'AWS WAF filters web traffic before it reaches applications, helping block common attacks, abusive requests, and unwanted patterns.'
};

const iconBase = 'https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main';
const iconUrls: Record<AwsServiceType, string> = {
  client: `${iconBase}/Resource-Icons_02072025/Res_General-Icons/Res_48_Light/Res_Users_48_Light.svg`,
  route53: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg`,
  cloudfront: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg`,
  apiGateway: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg`,
  elb: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg`,
  vpc: `${iconBase}/Architecture-Group-Icons_02072025/Virtual-private-cloud-VPC_32.svg`,
  ec2: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_Amazon-EC2_48.svg`,
  ecs: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Containers/48/Arch_Amazon-Elastic-Container-Service_48.svg`,
  autoScalingGroup: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_Amazon-EC2-Auto-Scaling_48.svg`,
  lambda: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Lambda_48.svg`,
  sqs: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_Amazon-Simple-Queue-Service_48.svg`,
  sns: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_Amazon-Simple-Notification-Service_48.svg`,
  s3: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Storage/48/Arch_Amazon-Simple-Storage-Service_48.svg`,
  rds: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Database/48/Arch_Amazon-RDS_48.svg`,
  elastiCache: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Database/48/Arch_Amazon-ElastiCache_48.svg`,
  dynamoDb: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Database/48/Arch_Amazon-DynamoDB_48.svg`,
  iam: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Identity-and-Access-Management_48.svg`,
  cloudWatch: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Management-Governance/48/Arch_Amazon-CloudWatch_48.svg`,
  stepFunctions: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_AWS-Step-Functions_48.svg`,
  natGateway: `${iconBase}/Resource-Icons_02072025/Res_Networking-Content-Delivery/Res_Amazon-VPC_NAT-Gateway_48.svg`,
  securityGroup: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Identity-and-Access-Management_48.svg`,
  batch: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Batch_48.svg`,
  eks: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Containers/48/Arch_Amazon-Elastic-Kubernetes-Service_48.svg`,
  aurora: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Database/48/Arch_Amazon-Aurora_48.svg`,
  eventBridge: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_Amazon-EventBridge_48.svg`,
  kinesis: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-Kinesis-Data-Streams_48.svg`,
  msk: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-Managed-Streaming-for-Apache-Kafka_48.svg`,
  cognito: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_Amazon-Cognito_48.svg`,
  waf: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-WAF_48.svg`,
  efs: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Storage/48/Arch_Amazon-EFS_48.svg`,
  athena: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-Athena_48.svg`,
  secretsManager: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Secrets-Manager_48.svg`,
  transitGateway: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_AWS-Transit-Gateway_48.svg`,
  directConnect: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_AWS-Direct-Connect_48.svg`,
  globalAccelerator: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_AWS-Global-Accelerator_48.svg`,
  xray: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Developer-Tools/48/Arch_AWS-X-Ray_48.svg`,
  openSearch: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-OpenSearch-Service_48.svg`,
  redshift: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-Redshift_48.svg`,
  glue: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_AWS-Glue_48.svg`,
  emr: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-EMR_48.svg`,
  kinesisFirehose: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Analytics/48/Arch_Amazon-Data-Firehose_48.svg`,
  mq: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_Amazon-MQ_48.svg`,
  kms: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Key-Management-Service_48.svg`,
  shield: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Shield_48.svg`,
  organizations: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Management-Governance/48/Arch_AWS-Organizations_48.svg`,
  codePipeline: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Developer-Tools/48/Arch_AWS-CodePipeline_48.svg`,
  codeBuild: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Developer-Tools/48/Arch_AWS-CodeBuild_48.svg`,
  codeDeploy: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Developer-Tools/48/Arch_AWS-CodeDeploy_48.svg`,
  bedrock: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Artificial-Intelligence/48/Arch_Amazon-Bedrock_48.svg`,
  sageMaker: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Artificial-Intelligence/48/Arch_Amazon-SageMaker-AI_48.svg`,
  appSync: `${iconBase}/Architecture-Service-Icons_02072025/Arch_App-Integration/48/Arch_AWS-AppSync_48.svg`,
  iotCore: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Internet-of-Things/48/Arch_AWS-IoT-Core_48.svg`,
  rekognition: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Artificial-Intelligence/48/Arch_Amazon-Rekognition_48.svg`,
  textract: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Artificial-Intelligence/48/Arch_Amazon-Textract_48.svg`,
  mediaConvert: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Media-Services/48/Arch_AWS-Elemental-MediaConvert_48.svg`,
  cloudTrail: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Management-Governance/48/Arch_AWS-CloudTrail_48.svg`,
  backup: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Storage/48/Arch_AWS-Backup_48.svg`,
  appRunner: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-App-Runner_48.svg`,
  elasticBeanstalk: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Elastic-Beanstalk_48.svg`,
  fsx: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Storage/48/Arch_Amazon-FSx_48.svg`,
  certificateManager: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Security-Identity-Compliance/48/Arch_AWS-Certificate-Manager_48.svg`,
  systemsManager: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Management-Governance/48/Arch_AWS-Systems-Manager_48.svg`,
  ecr: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Containers/48/Arch_Amazon-Elastic-Container-Registry_48.svg`,
  privateLink: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_AWS-PrivateLink_48.svg`
};

@Injectable({ providedIn: 'root' })
export class AwsCatalogService {
  readonly services: AwsServiceDefinition[];
  private readonly costModel = (serviceCostModelData as any).serviceCostModel || (serviceCostModelData as any).default?.serviceCostModel || {};

  private getDefaultsFromModel(serviceType: string): Record<string, any> {
    const serviceModel = this.costModel[serviceType];
    const defaults: Record<string, any> = {};
    if (!serviceModel) return defaults;

    if (Array.isArray(serviceModel.primaryParams)) {
      for (const param of serviceModel.primaryParams) {
        if (param.key && param.default !== undefined) {
          defaults[param.key] = param.default;
        }
      }
    }
    if (Array.isArray(serviceModel.costParams)) {
      for (const param of serviceModel.costParams) {
        if (param.key && param.default !== undefined) {
          defaults[param.key] = param.default;
        }
      }
    }
    return defaults;
  }

  constructor() {
    const rawData: any = awsServicesConfig;
    const servicesData = rawData.services || (rawData.default && rawData.default.services) || [];

    this.services = servicesData.map((config: any) => this.service(
      config.type,
      config.name,
      config.name.split(' ').pop() || config.type, // Fallback short name
      config.category,
      config.icon || 'settings', // Default icon
      config.inputs || [],
      config.outputs || [],
      config.defaults || {}
    ));
  }

  getByType(type: AwsServiceType): AwsServiceDefinition {
    const definition = this.services.find((service) => service.type === type);
    if (!definition) {
      throw new Error(`Unknown AWS service type: ${type}`);
    }
    return definition;
  }

  categoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Compute': '#be123c',       // Rose (Deep Crimson/Rose)
      'Containers': '#0369a1',    // Sky (Deep Ocean Blue)
      'Networking & Content Delivery': '#475569', // Slate (Dark gray-blue)
      'Storage': '#0f766e',       // Teal (Deep Teal - S3 style)
      'Database': '#6d28d9',      // Purple (Royal Purple)
      'Analytics': '#5b21b6',     // Violet (Deep violet-blue)
      'Machine Learning': '#047857', // Emerald (Deep forest emerald)
      'Application Integration': '#c2410c', // Orange (Burnt Orange)
      'Developer Tools': '#0284c7', // Sky-600 (Medium-dark sky blue)
      'Management & Governance': '#9f1239', // Rose-800 (Deep Crimson)
      'Security, Identity, & Compliance': '#57534e', // Stone (Deep gray-brown)
      'Media Services': '#b45309', // Amber (Warm Amber/Ochre)
      'Internet of Things': '#0f766e', // Teal (Deep Teal)
      'Users': '#0891b2',         // Cyan (Deep Cyan)
    };
    return colors[category] || '#94a3b8';
  }

  private service(
    type: AwsServiceType,
    name: string,
    shortName: string,
    category: AwsServiceDefinition['category'],
    icon: string,
    inputs: string[],
    outputs: string[],
    defaults: Partial<ServiceConfig>
  ): AwsServiceDefinition {
    const rawData: any = awsServicesConfig;
    const servicesData = rawData.services || (rawData.default && rawData.default.services) || [];
    const config = servicesData.find((s: any) => s.type === type);
    const modelDefaults = this.getDefaultsFromModel(type);

    return {
      type,
      name,
      shortName,
      category,
      description: serviceDescriptions[type] || config?.description || `${name} architecture component`,
      color: this.categoryColor(category),
      icon,
      iconUrl: iconUrls[type],
      ports: [
        ...inputs.map((port) => ({ id: `in-${port}`, label: port.toUpperCase(), direction: 'input' as const, type: port as never })),
        ...outputs.map((port) => ({ id: `out-${port}`, label: port.toUpperCase(), direction: 'output' as const, type: port as never }))
      ],
      defaults: { ...baseDefaults, ...defaults, ...modelDefaults },
      behavior: {
        scalable: ['lambda', 'ecs', 'autoScalingGroup', 'sqs', 'sns', 'dynamoDb', 'cloudfront', 'batch', 'eks', 'aurora', 'appRunner', 'appSync', 'kinesisFirehose', 'glue', 'emr', 'kinesis', 'msk', 'openSearch', 'redshift', 'sageMaker', 'ecr', 'privateLink'].includes(type),
        stateful: ['rds', 'elastiCache', 's3', 'dynamoDb', 'aurora', 'efs', 'openSearch', 'redshift', 'fsx', 'backup', 'ecr'].includes(type),
        fanOut: ['sns', 'stepFunctions', 'apiGateway', 'eventBridge', 'kinesis', 'msk', 'mq', 'appSync', 'transitGateway'].includes(type),
        boundary: type === 'vpc',
        mandatoryInput: config?.mandatoryInput ?? true,
        mandatoryOutput: config?.mandatoryOutput ?? true,
        allowFanIn: config?.allowFanIn ?? true,
        allowFanOut: config?.allowFanOut ?? true,
        allowedTargets: config?.allowedTargets ?? []
      }
    };
  }
}
