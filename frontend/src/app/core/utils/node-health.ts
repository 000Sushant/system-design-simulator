import {
  ArchitectureConnection,
  ArchitectureNode,
  AwsServiceDefinition,
} from '../models/architecture.model';

export interface NodeHealth {
  tone: 'success' | 'warning' | 'error' | 'neutral';
  message: string;
  /** Short label for compact UI (badges/tooltips). */
  short?: string;
  /** When true, the architecture cannot be simulated until this is fixed. */
  blocksRun?: boolean;
}

/**
 * Derives a node's health from its parameters, its connectivity (against the
 * service's behavior contract), and its current runtime status. Pure and
 * deterministic — the component supplies the live connections and the service
 * definition. Static/structural errors set `blocksRun`; runtime statuses
 * (busy/overloaded/offline) do not, so the user can re-run to tune.
 */
export function evaluateNodeHealth(
  node: ArchitectureNode,
  connections: ArchitectureConnection[],
  definition: AwsServiceDefinition,
): NodeHealth {
  // Parameter-level validation before connectivity checks.
  if (node.type === 'elb') {
    const count = node.config?.['count'];
    const numCount = count !== undefined && count !== null && count !== '' ? Number(count) : 1;
    if (isNaN(numCount) || numCount < 1) {
      return {
        tone: 'error',
        blocksRun: true,
        message:
          'Parameter error: at least 1 load balancer is required. Set "Number of Load Balancers" to 1 or more.',
      };
    }
  }

  const inputs = connections.filter((c) => c.targetNodeId === node.id).length;
  const outputs = connections.filter((c) => c.sourceNodeId === node.id).length;
  const { mandatoryInput, mandatoryOutput, allowFanIn, allowFanOut } = definition.behavior;

  if (mandatoryInput && inputs === 0) {
    return {
      tone: 'error',
      blocksRun: true,
      short: 'Integration required',
      message: `Integration error: ${node.name} must have at least one input connection.`,
    };
  }

  if (mandatoryOutput && outputs === 0) {
    return {
      tone: 'error',
      blocksRun: true,
      short: 'Integration required',
      message: `Integration error: ${node.name} must have an output connection to continue the flow.`,
    };
  }

  // Fully isolated node where neither side is mandatory (e.g. IAM/KMS placed
  // standalone): a soft warning instead of letting it pass silently.
  if (inputs === 0 && outputs === 0) {
    return {
      tone: 'warning',
      short: 'Not connected',
      message: `${node.name} is on the canvas but not connected to any other service.`,
    };
  }

  if (!allowFanIn && inputs > 1) {
    return {
      tone: 'error',
      blocksRun: true,
      message: `Architecture error: ${node.name} does not support multiple incoming connections (Fan-in prohibited).`,
    };
  }

  if (!allowFanOut && outputs > 1) {
    return {
      tone: 'error',
      blocksRun: true,
      message: `Architecture error: ${node.name} does not support multiple outgoing connections (Fan-out prohibited).`,
    };
  }

  // Runtime statuses persist after a run stops, so these stay as they were
  // during the run. They are NOT blocksRun, so the user can re-run to tune.
  if (node.status === 'offline' || node.status === 'failing') {
    return {
      tone: 'error',
      short: 'Over capacity',
      message: `Operational Failure: ${node.name} is ${node.status}. Traffic is being dropped.`,
    };
  }
  if (node.status === 'overloaded') {
    return {
      tone: 'error',
      short: 'Overloaded',
      message: `Overloaded: ${node.name} is past its capacity — excess requests are being throttled or dropped.`,
    };
  }
  if (node.status === 'busy') {
    return {
      tone: 'warning',
      short: 'High load',
      message: `Performance Warning: ${node.name} is busy and nearing capacity. Latency is increasing.`,
    };
  }

  return {
    tone: 'success',
    message: `${node.name} is correctly integrated and ready for traffic.`,
  };
}
