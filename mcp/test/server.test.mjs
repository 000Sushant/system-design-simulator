import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createCanvasMcpServer } from '../src/server/create-server.mjs';
import { addArgs, nextFrame, pair, respond, sampleNode, sampleState, start } from './helpers.mjs';

async function connectMcp(t, relay, options) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'simulator-test', version: '1.0.0' });
  const server = createCanvasMcpServer(relay, options);
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  t.after(() => client.close());
  return client;
}

test('advertises strict MCP schemas and returns structured errors and values over the SDK', async (t) => {
  const relay = await start(t);
  const client = await connectMcp(t, relay);
  const { tools } = await client.listTools();
  assert.equal(tools.length, 8);
  assert.ok(tools.every((tool) => tool.inputSchema.additionalProperties === false));

  const invalid = await client.callTool({ name: 'add_node', arguments: { ...addArgs, wrapped: true } });
  assert.equal(invalid.isError, true);
  assert.equal(invalid.structuredContent.code, 'INVALID_ARGUMENT');

  const pairing = await client.callTool({ name: 'get_canvas_pairing', arguments: {} });
  const { code, expiresInSeconds } = pairing.structuredContent;
  assert.equal(expiresInSeconds, 300);
  assert.equal(code.length, 22);
  assert.ok(!pairing.content[0].text.includes(code));
  const socket = await pair(relay, code);

  const dispatch = nextFrame(socket);
  const operation = client.callTool({ name: 'get_canvas_state', arguments: {} });
  const expected = sampleState('canvas-a', [sampleNode]);
  respond(socket, await dispatch, { ok: true, data: expected });
  assert.deepEqual((await operation).structuredContent, expected);
});

test('operator pairing stays in memory and its tool is unavailable to the MCP client', async (t) => {
  const code = randomBytes(16).toString('base64url');
  const relay = await start(t, { operatorCode: code });
  const client = await connectMcp(t, relay, { operatorPairing: true });
  assert.ok(!(await client.listTools()).tools.some((tool) => tool.name === 'get_canvas_pairing'));
  const rejected = await client.callTool({ name: 'get_canvas_pairing', arguments: {} });
  assert.equal(rejected.structuredContent.code, 'UNKNOWN_TOOL');
  assert.ok(!JSON.stringify(rejected).includes(code));
  await pair(relay, code);
});
