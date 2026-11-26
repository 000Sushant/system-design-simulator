// Shared fixtures for driving the relay with a fake browser canvas over WebSocket.
import assert from 'node:assert/strict';
import { once } from 'node:events';
import WebSocket from 'ws';
import { startCanvasRelay } from '../src/relay/canvas-relay.mjs';

export const origin = 'http://localhost:4200';
export const addArgs = { serviceType: 'client', name: 'Chat Users', x: 60, y: 360 };
export const sampleNode = { id: 'node-1', name: addArgs.name, ports: [{ id: 'out-http' }] };

export function send(socket, message) {
  socket.send(JSON.stringify({ version: 1, ...message }));
}

export async function nextFrame(socket) {
  const [message] = await once(socket, 'message');
  return JSON.parse(message.toString());
}

export async function openSocket(relay, { requestOrigin = origin, path = '/canvas', headers } = {}) {
  const socket = new WebSocket(`ws://127.0.0.1:${relay.port}${path}`, { origin: requestOrigin, headers });
  await once(socket, 'open');
  return socket;
}

export async function pair(relay, code = relay.issuePairing().data.code, canvasId = 'canvas-a') {
  const socket = await openSocket(relay);
  const confirmation = nextFrame(socket);
  send(socket, { type: 'pair', canvasId, code });
  assert.deepEqual(await confirmation, { version: 1, type: 'paired', canvasId });
  return socket;
}

export function respond(socket, request, result) {
  send(socket, { type: 'result', canvasId: request.canvasId, requestId: request.requestId, ...result });
}

export function sampleState(canvasId, nodes = []) {
  return {
    canvasId, nodes, connections: [], annotations: [], region: 'us-east-1', currency: 'USD',
    tick: 0, mode: 'idle', totals: { processed: 0, dropped: 0, avgLatency: 0 },
  };
}

export async function read(relay, socket, nodes = []) {
  const received = nextFrame(socket);
  const operation = relay.request('get_canvas_state', {});
  const request = await received;
  assert.equal(request.tool, 'get_canvas_state');
  const data = sampleState(request.canvasId, nodes);
  respond(socket, request, { ok: true, data });
  assert.deepEqual(await operation, { ok: true, data });
}

export async function start(t, options) {
  const relay = await startCanvasRelay({ port: 0, ...options });
  t.after(() => relay.close());
  return relay;
}

