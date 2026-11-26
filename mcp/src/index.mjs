#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { takeOperatorCode } from './config.mjs';
import { DEFAULT_RELAY_PORT, startCanvasRelay } from './relay/canvas-relay.mjs';
import { createCanvasMcpServer } from './server/create-server.mjs';

let operatorCode = takeOperatorCode();
const operatorPairing = operatorCode !== undefined;

let relay;
try {
  relay = await startCanvasRelay({ operatorCode });
} catch (error) {
  const detail = error.code === 'EADDRINUSE'
    ? `Port ${DEFAULT_RELAY_PORT} is in use. Close the other simulator MCP process and retry.`
    : 'Could not start the canvas relay. Check the local operator pairing configuration.';
  process.stderr.write(`${detail}\n`);
  process.exit(1);
}
operatorCode = undefined;

const mcp = createCanvasMcpServer(relay, { operatorPairing });

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  process.stdin.off('end', stop);
  await Promise.all([mcp.close(), relay.close()]);
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
process.stdin.once('end', stop);
mcp.onclose = stop;
await mcp.connect(new StdioServerTransport());
