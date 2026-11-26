import { z } from 'zod';
import { configValue, dimension, fontWeight, id, item, node, position, simulationMode } from './schemas.mjs';

// Tool registry. `mutates` tools require a prior get_canvas_state read in the session.
// `output` validates the canvas result before it reaches the MCP client.
export const canvasTools = new Map([
  ['get_canvas_pairing', {
    description: 'Get a one-time code for a local operator to paste into the canvas MCP panel.',
    input: z.strictObject({}),
    summary: () => 'Pairing code generated for the local operator.',
  }],
  ['get_canvas_state', {
    description: 'Read this canvas before editing. Returns the graph, available ports, and simulation state.',
    input: z.strictObject({}),
    output: z.object({
      canvasId: id,
      nodes: z.array(node),
      connections: z.array(item),
      annotations: z.array(item),
      region: z.string(),
      currency: z.string(),
      mode: simulationMode,
      tick: z.number().int().nonnegative(),
      totals: z.object({ processed: z.number(), dropped: z.number(), avgLatency: z.number() }),
    }),
    summary: (state) => `Canvas ${state.canvasId} is ${state.mode}. Nodes: ${state.nodes?.length ?? 0}. Connections: ${state.connections?.length ?? 0}.`,
  }],
  ['get_node_config_fields', {
    description: 'Read current editable MCP configuration fields for a node.',
    input: z.strictObject({ nodeId: id }),
    output: z.object({ nodeId: id, fields: z.array(configValue.extend({ type: z.literal('number'), min: z.literal(2), max: z.literal(1000) })) }),
    summary: (data) => JSON.stringify(data),
  }],
  ['add_node', {
    description: 'Add one service to the idle canvas at the given coordinates. Returns its ID and ports.',
    input: z.strictObject({ serviceType: id, name: z.string().min(1).max(100).regex(/\S/), x: position, y: position }),
    output: z.object({ node }),
    mutates: true,
    summary: ({ node }) => `Added ${node.name} (${node.id}). Ports: ${JSON.stringify(node.ports)}.`,
  }],
  ['connect_nodes', {
    description: 'Connect one specified output port to one specified input port on the idle canvas.',
    input: z.strictObject({ sourceNodeId: id, sourcePortId: id, targetNodeId: id, targetPortId: id }),
    output: z.object({ connection: item }),
    mutates: true,
    summary: ({ connection }) => `Added connection ${connection.id}.`,
  }],
  ['set_node_config', {
    description: 'Set requestRate for a client node in idle mode with Dynamic RPS and Variable Traffic off.',
    input: z.strictObject({ nodeId: id, key: z.literal('requestRate'), value: z.number().int().min(2).max(1000) }),
    output: configValue.extend({ nodeId: id }),
    mutates: true,
    summary: (data) => JSON.stringify(data),
  }],
  ['add_annotation', {
    description: 'Add one plain-text annotation to the idle canvas.',
    input: z.strictObject({
      text: z.string().min(1).max(500).regex(/\S/),
      x: position,
      y: position,
      width: dimension,
      height: dimension,
      fontSize: z.number().min(8).max(72),
      fontWeight,
    }),
    output: z.object({ annotation: item }),
    mutates: true,
    summary: ({ annotation }) => `Added annotation ${annotation.id}.`,
  }],
  ['set_simulation', {
    description: 'Play, pause, resume or stop the simulation. Returns the resulting mode.',
    input: z.strictObject({ action: z.enum(['play', 'pause', 'resume', 'stop']) }),
    output: z.object({ mode: simulationMode }),
    mutates: true,
    summary: ({ mode }) => `Simulation mode: ${mode}.`,
  }],
]);
