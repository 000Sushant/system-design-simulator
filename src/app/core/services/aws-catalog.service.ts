import { Injectable } from '@angular/core';
import { AwsServiceDefinition, AwsServiceType, ServiceConfig } from '../models/architecture.model';
import awsServicesConfig from '../config/aws-services.json';

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

const iconBase = 'https://raw.githubusercontent.com/icacho-dev/aws-architecture-icons/main';
const iconUrls: Record<AwsServiceType, string> = {
  client: `${iconBase}/Resource-Icons_02072025/Res_General-Icons/Res_48_Light/Res_Users_48_Light.svg`,
  route53: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-Route-53_48.svg`,
  cloudfront: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-CloudFront_48.svg`,
  apiGateway: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Amazon-API-Gateway_48.svg`,
  alb: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Networking-Content-Delivery/48/Arch_Elastic-Load-Balancing_48.svg`,
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
  batch: `${iconBase}/Architecture-Service-Icons_02072025/Arch_Compute/48/Arch_AWS-Batch_48.svg`
};

@Injectable({ providedIn: 'root' })
export class AwsCatalogService {
  readonly services: AwsServiceDefinition[];

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
      'Entry': '#8b5cf6',         // Violet
      'Network': '#64748b',       // Slate
      'Compute': '#d946ef',       // Fuchsia
      'Integration': '#f97316',   // Bright Orange
      'Storage': '#0d9488',       // Teal
      'Data': '#7c3aed',          // Deep Purple
      'Security': '#78716c',      // Stone
      'Observability': '#ec4899'  // Pink/Rose
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

    return {
      type,
      name,
      shortName,
      category,
      description: `${name} architecture component`,
      color: this.categoryColor(category),
      icon,
      iconUrl: iconUrls[type],
      ports: [
        ...inputs.map((port) => ({ id: `in-${port}`, label: port.toUpperCase(), direction: 'input' as const, type: port as never })),
        ...outputs.map((port) => ({ id: `out-${port}`, label: port.toUpperCase(), direction: 'output' as const, type: port as never }))
      ],
      defaults: { ...baseDefaults, ...defaults },
      behavior: {
        scalable: ['lambda', 'ecs', 'autoScalingGroup', 'sqs', 'sns', 'dynamoDb', 'cloudfront', 'batch'].includes(type),
        stateful: ['rds', 'elastiCache', 's3', 'dynamoDb'].includes(type),
        fanOut: ['sns', 'stepFunctions', 'apiGateway'].includes(type),
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
