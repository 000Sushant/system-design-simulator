import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { failure } from '../shared/result.mjs';
import { canvasTools } from '../tools/canvas-tools.mjs';

export const SERVER_INFO = { name: 'system-design-simulator', version: '0.1.0' };

function toolResult(result, summary) {
  if (!result.ok) {
    return {
      isError: true,
      structuredContent: result.error,
      content: [{ type: 'text', text: `${result.error.code}: ${result.error.message}` }],
    };
  }
  return {
    structuredContent: result.data,
    content: [{ type: 'text', text: summary(result.data) }],
  };
}

export function createCanvasMcpServer(relay, { operatorPairing = false } = {}) {
  const tools = new Map(canvasTools);
  // In operator mode the operator owns the code, so the client must not be able to request one.
  if (operatorPairing) tools.delete('get_canvas_pairing');
  const mcp = new Server(SERVER_INFO, { capabilities: { tools: {} } });

  mcp.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: Array.from(tools, ([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: z.toJSONSchema(tool.input),
    })),
  }));

  mcp.setRequestHandler(CallToolRequestSchema, async ({ params }, { signal }) => {
    const tool = tools.get(params.name);
    if (!tool) return toolResult(failure('UNKNOWN_TOOL', 'This simulator tool is unavailable.'));

    const input = tool.input.safeParse(params.arguments ?? {});
    if (!input.success) {
      const issue = input.error.issues[0];
      const path = issue.path.length ? `${issue.path.join('.')}: ` : '';
      return toolResult(failure('INVALID_ARGUMENT', `${path}${issue.message}`));
    }

    const result = params.name === 'get_canvas_pairing'
      ? relay.issuePairing()
      : await relay.request(params.name, input.data, signal);
    return toolResult(result, tool.summary);
  });

  return mcp;
}
