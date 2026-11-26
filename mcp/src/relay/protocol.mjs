// Wire protocol (version 1) between the relay and the browser canvas.
import { isObject } from '../shared/result.mjs';

export const PROTOCOL_VERSION = 1;

export function readFrame(data, isBinary) {
  if (isBinary) return null;
  try {
    const message = JSON.parse(data.toString('utf8'));
    return isObject(message) && message.version === PROTOCOL_VERSION ? message : null;
  } catch {
    return null;
  }
}

export function send(socket, message, onError) {
  socket.send(JSON.stringify({ version: PROTOCOL_VERSION, ...message }), (error) => {
    if (error) onError();
  });
}

export function isPairingCode(code) {
  return typeof code === 'string' && code.length === 22 && /^[A-Za-z0-9_-]+$/.test(code)
    && Buffer.from(code, 'base64url').toString('base64url') === code;
}

export function isResult(message) {
  if (message.ok === true) return isObject(message.data);
  return message.ok === false
    && isObject(message.error)
    && typeof message.error.code === 'string'
    && message.error.code.length > 0
    && message.error.code.length <= 64
    && typeof message.error.message === 'string'
    && message.error.message.length <= 500;
}
