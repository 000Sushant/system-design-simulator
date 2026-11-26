import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import WebSocket from 'ws';
import { addArgs, nextFrame, openSocket, pair, read, respond, sampleNode, sampleState, send, start } from './helpers.mjs';

test('accepts only the exact local origin, relay host and canvas path', async (t) => {
  const relay = await start(t);
  await assert.rejects(openSocket(relay, { requestOrigin: 'http://example.invalid' }), /403/);
  await assert.rejects(openSocket(relay, { path: '/canvas?code=ignored' }), /403/);
  await assert.rejects(openSocket(relay, { headers: { Host: `example.invalid:${relay.port}` } }), /403/);
  const socket = await openSocket(relay, { requestOrigin: 'http://127.0.0.1:4200' });
  assert.equal(socket.readyState, WebSocket.OPEN);
});

test('expires and rotates one-time codes and rejects a second active socket', async (t) => {
  const relay = await start(t, { pairingTtlMs: 100 });
  const expired = relay.issuePairing().data.code;
  await delay(110);

  const rejected = await openSocket(relay);
  const close = once(rejected, 'close');
  send(rejected, { type: 'pair', canvasId: 'canvas-a', code: expired });
  assert.equal((await close)[0], 1008);

  const old = relay.issuePairing().data.code;
  const current = relay.issuePairing().data.code;
  assert.notEqual(old, current);
  const canvas = await pair(relay, current);
  assert.equal(relay.issuePairing().error.code, 'ALREADY_CONNECTED');
  const second = await openSocket(relay);
  assert.equal((await once(second, 'close'))[0], 1008);

  const currentClosed = once(canvas, 'close');
  canvas.close();
  await currentClosed;
  const duplicate = await openSocket(relay);
  const duplicateClose = once(duplicate, 'close');
  send(duplicate, { type: 'pair', canvasId: 'canvas-b', code: current });
  assert.equal((await duplicateClose)[0], 1008);
});

test('requires a canvas read and dispatches mutations and reads one at a time', async (t) => {
  const relay = await start(t);
  assert.equal((await relay.request('get_canvas_state', {})).error.code, 'NOT_CONNECTED');
  const socket = await pair(relay);
  assert.equal((await relay.request('add_node', addArgs)).error.code, 'CANVAS_STATE_REQUIRED');
  await read(relay, socket);

  const frames = [];
  socket.on('message', (message) => frames.push(JSON.parse(message.toString())));
  const first = nextFrame(socket);
  const add = relay.request('add_node', addArgs);
  const state = relay.request('get_canvas_state', {});
  const request = await first;
  assert.deepEqual(request.args, addArgs);
  assert.equal(request.tool, 'add_node');
  await delay(20);
  assert.equal(frames.length, 1);

  const second = nextFrame(socket);
  respond(socket, request, { ok: true, data: { node: sampleNode } });
  assert.deepEqual((await add).data.node, sampleNode);
  const readRequest = await second;
  assert.equal(readRequest.tool, 'get_canvas_state');
  respond(socket, readRequest, { ok: true, data: sampleState('canvas-a', [sampleNode]) });
  assert.equal((await state).data.nodes.length, 1);
});

test('distinguishes a lost result from queued operations and reconnects without replay', async (t) => {
  const relay = await start(t, { requestTimeoutMs: 100 });
  const socket = await pair(relay);
  await read(relay, socket);

  const frames = [];
  socket.on('message', (message) => frames.push(JSON.parse(message.toString())));
  const dispatched = nextFrame(socket);
  const update = relay.request('add_node', addArgs);
  const queued = Array.from({ length: 31 }, () => relay.request('get_canvas_state', {}));
  assert.equal((await relay.request('get_canvas_state', {})).error.code, 'QUEUE_FULL');
  assert.equal((await dispatched).tool, 'add_node');
  assert.equal((await update).error.code, 'RESULT_UNKNOWN');
  assert.ok((await Promise.all(queued)).every((result) => result.error.code === 'SESSION_ENDED'));
  assert.equal(frames.length, 1);

  const replacement = await pair(relay, undefined, 'canvas-b');
  assert.equal((await relay.request('add_node', addArgs)).error.code, 'CANVAS_STATE_REQUIRED');
  await read(relay, replacement);
});

test('forwards canvas errors and closes the session when the canvas reports an unknown result', async (t) => {
  const relay = await start(t);
  const socket = await pair(relay);
  await read(relay, socket);

  const dispatch = nextFrame(socket);
  const rejected = relay.request('add_node', addArgs);
  const hidden = { code: 'TAB_HIDDEN', message: 'Show the browser tab before editing.' };
  respond(socket, await dispatch, { ok: false, error: hidden });
  assert.deepEqual((await rejected).error, hidden);

  const dispatchAgain = nextFrame(socket);
  const write = relay.request('add_node', addArgs);
  const queued = relay.request('get_canvas_state', {});
  const unknown = { code: 'RESULT_UNKNOWN', message: 'The change could not be confirmed.' };
  respond(socket, await dispatchAgain, { ok: false, error: unknown });
  assert.deepEqual((await write).error, unknown);
  assert.equal((await queued).error.code, 'SESSION_ENDED');
  assert.equal((await relay.request('get_canvas_state', {})).error.code, 'NOT_CONNECTED');
});

