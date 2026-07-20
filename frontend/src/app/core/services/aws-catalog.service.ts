import { Injectable } from '@angular/core';
import { AwsServiceDefinition, AwsServiceType, ServiceConfig } from '../models/architecture.model';
import awsServicesConfig from '../config/aws-services.json';
import * as serviceCostModelData from '../data/service-cost-model.json';
import * as regionAvailabilityData from '../data/region-availability.json';

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
  waf: 'AWS WAF filters web traffic before it reaches applications, helping block common attacks, abusive requests, and unwanted patterns.',
  amplify: 'AWS Amplify simplifies frontend web and mobile deployment with automated CI/CD builds, global CDN hosting, and easy serverless integrations.',
  ses: 'Amazon SES sends and receives application email at scale, including transactional mail, notifications, and campaigns, with bounce and complaint tracking.',
  documentDb: 'Amazon DocumentDB provides a managed, MongoDB-compatible document database with decoupled compute and storage for JSON workloads.',
  neptune: 'Amazon Neptune is a managed graph database for highly connected datasets, supporting Gremlin, openCypher, and SPARQL queries.',
  timestream: 'Amazon Timestream is a serverless time-series database that tiers recent data in memory and history on magnetic storage for IoT and ops analytics.',
  appConfig: 'AWS AppConfig manages feature flags and dynamic configuration, validating changes and rolling them out gradually to running applications.',
  appMesh: 'AWS App Mesh is a service mesh control plane that distributes routing rules to Envoy sidecar proxies for service-to-service traffic.',
  cloudMap: 'AWS Cloud Map is a service discovery registry where microservices register endpoints and resolve each other via DNS or API calls.',
  quickSight: 'Amazon QuickSight is a cloud BI service delivering interactive dashboards backed by the SPICE in-memory analytics engine.',
  lightsail: 'Amazon Lightsail offers simple flat-rate VPS bundles of compute, SSD storage, and data transfer for small applications and websites.'
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
      config.name.split(' ').pop() || config.type,
      config.category,
      config.icon || 'settings',
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

  private readonly regionAvailability: Record<string, string[]> =
    (regionAvailabilityData as any).unavailable || (regionAvailabilityData as any).default?.unavailable || {};

  isUnavailableInRegion(type: string, regionCode: string): boolean {
    return (this.regionAvailability[type] ?? []).includes(regionCode);
  }

  categoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Compute': '#c42a50',
      'Containers': '#1c78aa',
      'Networking & Content Delivery': '#596678',
      'Storage': '#27847c',
      'Database': '#7c3edd',
      'Analytics': '#6b37bd',
      'Machine Learning': '#1d8668',
      'Application Integration': '#c85424',
      'Developer Tools': '#1b90cd',
      'Management & Governance': '#a92a4d',
      'Security, Identity, & Compliance': '#686460',
      'Media Services': '#bc6422',
      'Internet of Things': '#27847c',
      'Users': '#219cba',
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
      iconUrl: `assets/icons/${type}.svg`,
      glyphUrl: `assets/icons/${type}.svg`,
      ports: [
        ...inputs.map((port) => ({ id: `in-${port}`, label: port.toUpperCase(), direction: 'input' as const, type: port as never })),
        ...outputs.map((port) => ({ id: `out-${port}`, label: port.toUpperCase(), direction: 'output' as const, type: port as never }))
      ],
      defaults: { ...baseDefaults, ...defaults, ...modelDefaults },
      behavior: {
        scalable: ['lambda', 'ecs', 'autoScalingGroup', 'sqs', 'sns', 'dynamoDb', 'cloudfront', 'batch', 'eks', 'aurora', 'appRunner', 'appSync', 'kinesisFirehose', 'glue', 'emr', 'kinesis', 'msk', 'openSearch', 'redshift', 'sageMaker', 'ecr', 'privateLink', 'amplify', 'ses', 'timestream', 'appConfig', 'appMesh', 'cloudMap'].includes(type),
        stateful: ['rds', 'elastiCache', 's3', 'dynamoDb', 'aurora', 'efs', 'openSearch', 'redshift', 'fsx', 'backup', 'ecr', 'documentDb', 'neptune', 'timestream'].includes(type),
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
