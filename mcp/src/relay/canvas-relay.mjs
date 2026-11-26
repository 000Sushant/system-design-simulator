import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { failure, success } from '../shared/result.mjs';
import { canvasIdSchema } from '../tools/schemas.mjs';
import { canvasTools } from '../tools/canvas-tools.mjs';
import { isPairingCode, isResult, readFrame, send } from './protocol.mjs';

export const DEFAULT_RELAY_PORT = 4301;
const ORIGINS = new Set(['http://localhost:4200', 'http://127.0.0.1:4200']);
const PAIRING_PATH = '/canvas';
const PAIRING_TTL_MS = 5 * 60 * 1000;
const PAIRING_TIMEOUT_MS = 3000;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_REQUESTS = 32;
const MAX_FRAME_BYTES = 1024 * 1024;
const CODE_BYTES = 16;

export async function startCanvasRelay({
  port = DEFAULT_RELAY_PORT,
  operatorCode,
  pairingTtlMs = PAIRING_TTL_MS,
  requestTimeoutMs = REQUEST_TIMEOUT_MS,
} = {}) {
  const operatorPairing = operatorCode !== undefined;
  if (operatorPairing && !isPairingCode(operatorCode)) {
    throw new Error('The operator pairing code must encode 16 random bytes as base64url.');
  }

  let pairing = operatorPairing ? { code: operatorCode, expiresAt: Date.now() + pairingTtlMs } : null;
  operatorCode = undefined;
  let waitingSocket = null;
  let active = null;
  const httpServer = createServer((_, response) => response.writeHead(404).end());
  const sockets = new WebSocketServer({ noServer: true, maxPayload: MAX_FRAME_BYTES, closeTimeout: 1000 });

  function issuePairing() {
    if (active) return failure('ALREADY_CONNECTED', 'Disconnect the current canvas to pair another.');
    if (operatorPairing) return failure('OPERATOR_PAIRING', 'Pairing is managed by the local operator.');
    const code = randomBytes(CODE_BYTES).toString('base64url');
    pairing = { code, expiresAt: Date.now() + pairingTtlMs };
    return success({ code, expiresInSeconds: Math.ceil(pairingTtlMs / 1000) });
  }

  function finish(entry, result) {
    clearTimeout(entry.timer);
    entry.signal?.removeEventListener('abort', entry.abort);
    entry.resolve(result);
  }

  function endSession(session, inFlightResult = failure(
    'RESULT_UNKNOWN', 'The canvas did not confirm the dispatched request. Reconnect and read the canvas before retrying.',
  )) {
    if (active !== session) return;
    active = null;
    if (session.inFlight) finish(session.inFlight, inFlightResult);
    session.inFlight = null;
    for (const entry of session.queue.splice(0)) {
      finish(entry, failure('SESSION_ENDED', 'The canvas disconnected before the request was dispatched.'));
    }
    session.socket.close(1000, 'Canvas session ended');
  }

  function dispatchNext(session) {
    if (active !== session || session.inFlight) return;
    while (session.queue.length) {
      const entry = session.queue.shift();
      if (!session.ready && canvasTools.get(entry.tool).mutates) {
        finish(entry, failure('CANVAS_STATE_REQUIRED', 'Read the canvas with get_canvas_state before editing.'));
        continue;
      }
      session.inFlight = entry;
      entry.timer = setTimeout(() => endSession(session), requestTimeoutMs);
      send(session.socket, {
        type: 'request', requestId: entry.id, canvasId: session.canvasId, tool: entry.tool, args: entry.args,
      }, () => endSession(session));
      return;
    }
  }

  function request(tool, args, signal) {
    const session = active;
    if (!session) return Promise.resolve(failure('NOT_CONNECTED', 'Pair the canvas before using this tool.'));
    if (signal?.aborted) return Promise.resolve(failure('SESSION_ENDED', 'The client cancelled before dispatch.'));
    if (session.queue.length + Number(Boolean(session.inFlight)) >= MAX_REQUESTS) {
      return Promise.resolve(failure('QUEUE_FULL', 'The canvas request queue is full.'));
    }

    return new Promise((resolve) => {
      const entry = { id: randomUUID(), tool, args, signal, resolve };
      entry.abort = () => {
        if (session.inFlight === entry) {
          endSession(session);
          return;
        }
        const index = session.queue.indexOf(entry);
        if (index !== -1) {
          session.queue.splice(index, 1);
          finish(entry, failure('SESSION_ENDED', 'The client cancelled before dispatch.'));
        }
      };
      signal?.addEventListener('abort', entry.abort, { once: true });
      session.queue.push(entry);
      dispatchNext(session);
    });
  }

  function receiveResult(session, message) {
    if (active !== session) return;
    if (!message || message.type !== 'result' || message.canvasId !== session.canvasId || !isResult(message)) {
      endSession(session);
      return;
    }
    const entry = session.inFlight;
    if (!entry || entry.id !== message.requestId) return;
    if (message.ok && (!canvasTools.get(entry.tool).output.safeParse(message.data).success
      || (entry.tool === 'get_canvas_state' && message.data.canvasId !== session.canvasId))) {
      endSession(session);
      return;
    }
    if (!message.ok && message.error.code === 'RESULT_UNKNOWN') {
      endSession(session, { ok: false, error: message.error });
      return;
    }
    if (entry.tool === 'get_canvas_state' && message.ok) session.ready = true;
    session.inFlight = null;
    finish(entry, message.ok ? success(message.data) : { ok: false, error: message.error });
    dispatchNext(session);
  }

  function accept(socket) {
    socket.on('error', () => socket.terminate());
    if (active || waitingSocket) {
      socket.close(1008, 'Canvas already connected');
      return;
    }
    waitingSocket = socket;
    let session;
    const timer = setTimeout(() => socket.close(1008, 'Pairing timed out'), PAIRING_TIMEOUT_MS);

    socket.on('close', () => {
      clearTimeout(timer);
      if (waitingSocket === socket) waitingSocket = null;
      if (session) endSession(session);
    });
    socket.on('message', (data, isBinary) => {
      const message = readFrame(data, isBinary);
      if (session) {
        receiveResult(session, message);
        return;
      }
      if (waitingSocket !== socket || socket.readyState !== socket.OPEN) return;
      if (message?.type !== 'pair' || !canvasIdSchema.safeParse(message.canvasId).success
        || !pairing || Date.now() >= pairing.expiresAt || !isPairingCode(message.code)
        || !timingSafeEqual(Buffer.from(pairing.code), Buffer.from(message.code))) {
        socket.close(1008, 'Invalid or expired pairing code');
        return;
      }

      pairing = null;
      waitingSocket = null;
      clearTimeout(timer);
      session = { socket, canvasId: message.canvasId, ready: false, inFlight: null, queue: [] };
      active = session;
      send(socket, { type: 'paired', canvasId: session.canvasId }, () => endSession(session));
    });
  }

  httpServer.on('upgrade', (request, socket, head) => {
    const relayPort = httpServer.address().port;
    const validHost = request.headers.host === `127.0.0.1:${relayPort}` || request.headers.host === `localhost:${relayPort}`;
    if (!validHost || !ORIGINS.has(request.headers.origin) || request.url !== PAIRING_PATH) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
      return;
    }
    sockets.handleUpgrade(request, socket, head, accept);
  });

  httpServer.listen(port, '127.0.0.1');
  await once(httpServer, 'listening');

  return {
    port: httpServer.address().port,
    issuePairing,
    request,
    async close() {
      pairing = null;
      if (active) endSession(active);
      for (const socket of sockets.clients) socket.terminate();
      await Promise.all([
        new Promise((resolve) => sockets.close(resolve)),
        new Promise((resolve) => httpServer.close(resolve)),
      ]);
    },
  };
}
