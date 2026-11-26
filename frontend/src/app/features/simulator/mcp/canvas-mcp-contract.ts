import type {
  Annotation,
  ArchitectureConnection,
  ArchitectureNode,
  Currency,
  SimulationMode,
} from '../../../core/models/architecture.model';

type CanvasToolInput = {
  get_canvas_state: Record<string, never>;
  get_node_config_fields: { nodeId: string };
  add_node: { serviceType: string; name: string; x: number; y: number };
  connect_nodes: {
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
  };
  set_node_config: { nodeId: string; key: 'requestRate'; value: number };
  add_annotation: Pick<
    Annotation,
    'text' | 'x' | 'y' | 'width' | 'height' | 'fontSize' | 'fontWeight'
  >;
  set_simulation: { action: 'play' | 'pause' | 'resume' | 'stop' };
};

type CanvasToolOutput = {
  get_canvas_state: {
    canvasId: string;
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
    annotations: Annotation[];
    region: string;
    currency: Currency;
    mode: SimulationMode;
    tick: number;
    totals: { processed: number; dropped: number; avgLatency: number };
  };
  get_node_config_fields: { nodeId: string; fields: RequestRateField[] };
  add_node: { node: ArchitectureNode };
  connect_nodes: { connection: ArchitectureConnection };
  set_node_config: CanvasToolInput['set_node_config'];
  add_annotation: { annotation: Annotation };
  set_simulation: { mode: SimulationMode };
};

export interface RequestRateField {
  key: 'requestRate';
  type: 'number';
  min: 2;
  max: 1000;
  value: number;
}

type CanvasTool = keyof CanvasToolInput;
type ReadTool = 'get_canvas_state' | 'get_node_config_fields';
type CanvasMutation = Exclude<CanvasTool, ReadTool>;

export type CanvasRequest = {
  [Tool in CanvasTool]: {
    requestId: string;
    canvasId: string;
    tool: Tool;
    args: CanvasToolInput[Tool];
  };
}[CanvasTool];

export type CanvasAction = {
  targetId: string;
  description: string;
} & (
  | { tool: 'add_node' | 'connect_nodes' | 'add_annotation' }
  | { tool: 'set_node_config'; value: number }
  | { tool: 'set_simulation'; mode: SimulationMode }
);

export type CanvasActionMarker = CanvasAction & {
  canvasId: string;
  sequence: number;
};

export type CanvasResult =
  | { ok: false; error: { code: string; message: string } }
  | { ok: true; data: CanvasToolOutput[ReadTool]; action?: never }
  | { ok: true; data: CanvasToolOutput[CanvasMutation]; action: CanvasAction };

export function canvasError(code: string, message: string): Extract<CanvasResult, { ok: false }> {
  return { ok: false, error: { code, message } };
}

export function requestRateField(node: ArchitectureNode): RequestRateField | undefined {
  if (
    node.type !== 'client' ||
    node.config['variableTraffic'] ||
    node.config['syncRpsToServices']
  ) {
    return undefined;
  }
  const value = Number(node.config['requestRate']);
  return Number.isFinite(value)
    ? { key: 'requestRate', type: 'number', min: 2, max: 1000, value }
    : undefined;
}

export function isCanvasRead(tool: CanvasTool): tool is ReadTool {
  return tool === 'get_canvas_state' || tool === 'get_node_config_fields';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.length <= maxLength && value.trim().length > 0;
}

function between(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

type ArgumentValidator = (value: unknown) => boolean;
const identifier: ArgumentValidator = (value) => text(value, 128);
const coordinate: ArgumentValidator = (value) => between(value, -10000, 10000);
const dimension: ArgumentValidator = (value) => between(value, Number.MIN_VALUE, 2000);

const inputValidators: {
  [Tool in CanvasTool]: { [Key in keyof CanvasToolInput[Tool]]: ArgumentValidator };
} = {
  get_canvas_state: {},
  get_node_config_fields: { nodeId: identifier },
  add_node: {
    serviceType: identifier,
    name: (value) => text(value, 100),
    x: coordinate,
    y: coordinate,
  },
  connect_nodes: {
    sourceNodeId: identifier,
    sourcePortId: identifier,
    targetNodeId: identifier,
    targetPortId: identifier,
  },
  set_node_config: {
    nodeId: identifier,
    key: (value) => value === 'requestRate',
    value: (value) => between(value, 2, 1000) && Number.isInteger(value),
  },
  add_annotation: {
    text: (value) => text(value, 500),
    x: coordinate,
    y: coordinate,
    width: dimension,
    height: dimension,
    fontSize: (value) => between(value, 8, 72),
    fontWeight: (value) => value === 'normal' || value === 'bold',
  },
  set_simulation: {
    action: (value) =>
      value === 'play' || value === 'pause' || value === 'resume' || value === 'stop',
  },
};

export function readCanvasRequest(message: Record<string, unknown>): CanvasRequest | undefined {
  const { requestId, canvasId, tool, args } = message;
  if (
    !identifier(requestId) ||
    !identifier(canvasId) ||
    typeof tool !== 'string' ||
    !Object.hasOwn(inputValidators, tool) ||
    !isRecord(args)
  )
    return undefined;

  const validators = Object.entries(inputValidators[tool as CanvasTool]);
  if (
    Object.keys(args).length !== validators.length ||
    !validators.every(([key, validate]) => Object.hasOwn(args, key) && validate(args[key]))
  )
    return undefined;

  return { requestId, canvasId, tool, args } as CanvasRequest;
}
