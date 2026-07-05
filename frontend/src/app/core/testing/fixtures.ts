/**
 * Typed test fixtures. Building full domain objects by hand is noisy, so these
 * factories fill the required fields with neutral defaults and accept overrides.
 * Only used by *.spec.ts files (never imported by the app).
 */
import {
  ArchitectureConnection,
  ArchitectureNode,
  AwsServiceDefinition,
  AwsServiceType,
  HealthStatus,
  ServiceConfig,
  ServiceMetrics,
} from '../models/architecture.model';
import { Challenge } from '../models/challenge.model';

const ZERO_CONFIG: ServiceConfig = {
  throughput: 0,
  latency: 0,
  requestRate: 0,
  cpu: 0,
  memory: 0,
  concurrency: 0,
  queueDepth: 0,
  connectionLimit: 0,
  autoscalingThreshold: 0,
  failureThreshold: 0,
  retryPolicy: 0,
  replication: 0,
  storageSize: 0,
  routingAlgorithm: 'round-robin',
  cacheHitRate: 0,
  timeoutMs: 0,
};

const ZERO_METRICS: ServiceMetrics = {
  processed: 0,
  received: 0,
  dropped: 0,
  retried: 0,
  queueSize: 0,
  avgLatency: 0,
  cpuPressure: 0,
  memoryPressure: 0,
  errorRate: 0,
  throughput: 0,
};

export function makeNode(
  id: string,
  type: AwsServiceType,
  overrides: { status?: HealthStatus; config?: Partial<ServiceConfig> } = {},
): ArchitectureNode {
  return {
    id,
    type,
    name: id,
    x: 0,
    y: 0,
    config: { ...ZERO_CONFIG, ...overrides.config },
    ports: [],
    status: overrides.status ?? 'normal',
    metrics: { ...ZERO_METRICS },
  };
}

export function makeConn(
  source: string,
  target: string,
  overrides: { allowed?: boolean } = {},
): ArchitectureConnection {
  return {
    id: `${source}->${target}`,
    sourceNodeId: source,
    sourcePortId: 'out',
    targetNodeId: target,
    targetPortId: 'in',
    type: 'http',
    allowed: overrides.allowed ?? true,
    traffic: { requestsPerSecond: 0, latency: 0, errorRate: 0, intensity: 0 },
    animationOffset: 0,
  };
}

type Behavior = AwsServiceDefinition['behavior'];

export function makeDefinition(
  type: AwsServiceType,
  behavior: Partial<Behavior> = {},
): AwsServiceDefinition {
  return {
    type,
    name: type,
    shortName: type,
    category: 'Compute',
    description: '',
    color: '#000000',
    icon: '',
    iconUrl: '',
    ports: [],
    defaults: { ...ZERO_CONFIG },
    behavior: {
      scalable: true,
      stateful: false,
      fanOut: true,
      mandatoryInput: false,
      mandatoryOutput: false,
      allowFanIn: true,
      allowFanOut: true,
      allowedTargets: [],
      ...behavior,
    },
  };
}

export function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'test',
    title: 'Test Challenge',
    difficulty: 'easy',
    category: 'Test',
    estMinutes: 10,
    problem: '',
    functionalRequirements: [],
    constraints: [],
    hints: [],
    milestones: [],
    rubric: { checks: [], passScore: 70 },
    referenceSolution: { nodes: [], edges: [] },
    authored: true,
    ...overrides,
  };
}
