// Starts the MCP server over stdio, waits for a paired empty canvas, and exposes a traced `call` helper.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { takeOperatorCode, OPERATOR_CODE_ENV } from '../../src/config.mjs';
import { countElements } from './project.mjs';

const serverPath = fileURLToPath(new URL('../../src/index.mjs', import.meta.url));

export class ToolError extends Error {
  constructor(tool, { code, message }) {
    super(`${tool}: ${code}: ${message}`);
    this.code = code;
  }
}

export function trace(record) {
  process.stdout.write(`${JSON.stringify(record)}\n`);
}

export async function withCanvas(execute) {
  const operatorPairing = takeOperatorCode();
  const [{ Client }, { StdioClientTransport }] = await Promise.all([
    import('@modelcontextprotocol/sdk/client/index.js'),
    import('@modelcontextprotocol/sdk/client/stdio.js'),
  ]);
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: operatorPairing ? { [OPERATOR_CODE_ENV]: operatorPairing } : undefined,
  });
  const client = new Client({ name: 'system-design-simulator-demo', version: '1.0.0' });
  try {
    await client.connect(transport);
    async function invoke(name, args = {}) {
      const result = await client.callTool({ name, arguments: args });
      if (result.isError) {
        const detail = result.content.find((entry) => entry.type === 'text')?.text;
        throw new ToolError(name, result.structuredContent ?? {
          code: 'TOOL_ERROR', message: detail ?? 'The MCP call failed without a structured result.',
        });
      }
      assert(result.structuredContent, `${name} must return structured data`);
      return result.structuredContent;
    }

    let expiresInSeconds = 300;
    if (operatorPairing) {
      process.stderr.write('Waiting for the operator to pair the empty canvas.\n');
    } else {
      const pairing = await invoke('get_canvas_pairing');
      expiresInSeconds = pairing.expiresInSeconds;
      // Keep the code off stdout/stderr so a redirected evidence log excludes it.
      writeFileSync('/dev/tty', `Pair the empty Architect canvas with this one-time code: ${pairing.code}\n`);
    }

    const deadline = performance.now() + expiresInSeconds * 1000;
    let start;
    while (!start && performance.now() < deadline) {
      try {
        start = await invoke('get_canvas_state');
      } catch (error) {
        if (error.code !== 'NOT_CONNECTED') throw error;
        await wait(250);
      }
    }
    assert(start, 'Pairing expired before a canvas connected');
    assert.equal(start.mode, 'idle', 'Start with an idle canvas');
    assert.deepEqual(countElements(start), { nodes: 0, connections: 0, annotations: 0 }, 'Start with an empty canvas');
    trace({ phase: 'paired', canvasId: start.canvasId, mode: start.mode });

    let sequence = 0;
    const clockStart = performance.now();
    async function call(tool, args = {}) {
      const order = ++sequence;
      trace({ phase: 'request', order, tool, args, elapsedMs: Math.round(performance.now() - clockStart) });
      try {
        const data = await invoke(tool, args);
        trace({
          phase: 'result', order, tool, elapsedMs: Math.round(performance.now() - clockStart),
          target: data.node?.id ?? data.connection?.id ?? data.annotation?.id ?? data.nodeId,
          mode: data.mode, tick: data.tick, processed: data.totals?.processed, value: data.value,
        });
        return data;
      } catch (error) {
        trace({
          phase: 'error', order, tool, code: error.code, message: error.message,
          elapsedMs: Math.round(performance.now() - clockStart),
        });
        throw error;
      }
    }
    await execute(call, start);
  } finally {
    await client.close();
  }
}
