import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CanvasMcpConnection } from './canvas-mcp-connection';
import type { CanvasRequest, CanvasResult } from './canvas-mcp-contract';

class TestSocket {
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static instances: TestSocket[] = [];

  readyState = TestSocket.OPEN;
  sent: Record<string, unknown>[] = [];
  onopen?: (() => void) | null;
  onmessage?: ((event: { data: string }) => void) | null;
  onclose?: ((event: { code: number }) => void) | null;
  onerror?: (() => void) | null;

  constructor(readonly url: string) {
    TestSocket.instances.push(this);
  }

  send(payload: string): void {
    this.sent.push(JSON.parse(payload));
  }

  close(): void {
    this.readyState = TestSocket.CLOSING;
  }

  receive(message: Record<string, unknown>): void {
    this.onmessage?.({ data: JSON.stringify({ version: 1, ...message }) });
  }
}

const applying = (request: CanvasRequest): CanvasResult =>
  request.tool === 'get_canvas_state'
    ? {
        ok: true,
        data: {
          canvasId: request.canvasId,
          nodes: [],
          connections: [],
          annotations: [],
          region: 'us-east-1',
          currency: 'USD',
          mode: 'idle',
          tick: 0,
          totals: { processed: 0, dropped: 0, avgLatency: 0 },
        },
      }
    : {
        ok: true,
        data: { mode: 'running' },
        action: {
          tool: 'set_simulation',
          mode: 'running',
          targetId: request.canvasId,
          description: 'Simulation running.',
        },
      };

function createConnection() {
  let canvasId = 'first';
  const host = {
    activeCanvasId: () => canvasId,
    apply: vi.fn(applying),
    renderAction: vi.fn(),
    hasRenderedAction: vi.fn(() => true),
  };
  const connection = new CanvasMcpConnection(host);
  const pair = (target = 'first'): TestSocket => {
    canvasId = target;
    connection.connect('test-code');
    const socket = TestSocket.instances.at(-1)!;
    socket.onopen?.();
    socket.receive({ type: 'paired', canvasId });
    return socket;
  };
  return { connection, host, pair };
}

function sendRead(socket: TestSocket, canvasId = 'first'): void {
  socket.receive({
    type: 'request',
    requestId: 'read',
    canvasId,
    tool: 'get_canvas_state',
    args: {},
  });
}

function sendPlay(socket: TestSocket, canvasId = 'first'): void {
  socket.receive({
    type: 'request',
    requestId: 'play',
    canvasId,
    tool: 'set_simulation',
    args: { action: 'play' },
  });
}

describe('Canvas MCP connection', () => {
  let tab: EventTarget & { visibilityState: 'visible' | 'hidden' };

  beforeEach(() => {
    vi.useFakeTimers();
    TestSocket.instances = [];
    tab = Object.assign(new EventTarget(), { visibilityState: 'visible' as const });
    vi.stubGlobal('window', { location: { origin: 'http://localhost:4200' } });
    vi.stubGlobal('document', tab);
    vi.stubGlobal('WebSocket', TestSocket);
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => setTimeout(callback, 16));
    vi.stubGlobal('cancelAnimationFrame', (frame: number) => clearTimeout(frame));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('pairs on loopback, requires the initial read, and waits after the rendered action', async () => {
    const { connection, host, pair } = createConnection();
    const socket = pair();
    expect(socket.url).toBe('ws://127.0.0.1:4301/canvas');
    expect(socket.sent[0]).toEqual({
      version: 1,
      type: 'pair',
      code: 'test-code',
      canvasId: 'first',
    });
    expect(connection.status).toBe('connected');

    sendPlay(socket);
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: false,
      error: { code: 'INVALID_STATE' },
    });
    expect(host.apply).not.toHaveBeenCalled();
    sendRead(socket);
    expect(socket.sent.at(-1)).toMatchObject({ requestId: 'read', ok: true });

    sendPlay(socket);
    expect(connection.lastAction).toMatchObject({
      tool: 'set_simulation',
      canvasId: 'first',
      sequence: 1,
    });
    expect(host.renderAction).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(31);
    expect(host.hasRenderedAction).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(500);
    expect(host.hasRenderedAction).toHaveBeenCalledWith(connection.lastAction);
    expect(socket.sent.at(-1)).toMatchObject({ requestId: 'read' });
    await vi.advanceTimersByTimeAsync(1);
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: true,
      data: { mode: 'running' },
    });
  });

  it('permits a hidden canvas read and rejects a hidden canvas mutation before applying it', () => {
    const { connection, host, pair } = createConnection();
    const socket = pair();
    tab.visibilityState = 'hidden';
    sendRead(socket);
    sendPlay(socket);

    expect(host.apply).toHaveBeenCalledOnce();
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: false,
      error: { code: 'TAB_HIDDEN' },
    });
    expect(connection.status).toBe('connected');
  });

  it('ends the session when visibility is lost after applying a mutation', async () => {
    const { connection, host, pair } = createConnection();
    const socket = pair();
    sendRead(socket);
    sendPlay(socket);
    await vi.advanceTimersByTimeAsync(35);
    tab.visibilityState = 'hidden';
    tab.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(1);

    expect(host.apply).toHaveBeenCalledTimes(2);
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: false,
      error: { code: 'RESULT_UNKNOWN' },
    });
    expect(connection.status).toBe('disconnected');
    expect(connection.lastAction).toBeUndefined();
  });

  it('ends the session with an unknown result if the action never becomes visible', async () => {
    const { connection, host, pair } = createConnection();
    host.hasRenderedAction.mockReturnValue(false);
    const socket = pair();
    sendRead(socket);
    sendPlay(socket);
    await vi.advanceTimersByTimeAsync(1999);
    expect(socket.sent.at(-1)).toMatchObject({ requestId: 'read' });
    await vi.advanceTimersByTimeAsync(1);

    expect(host.apply).toHaveBeenCalledTimes(2);
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: false,
      error: { code: 'RESULT_UNKNOWN' },
    });
    expect(connection.status).toBe('disconnected');
  });

  it('ends the session when a pan or undo removes an initially visible action during the dwell', async () => {
    const { connection, host, pair } = createConnection();
    const socket = pair();
    sendRead(socket);
    sendPlay(socket);
    await vi.advanceTimersByTimeAsync(32);
    expect(host.hasRenderedAction).toHaveBeenCalledOnce();
    expect(socket.sent.at(-1)).toMatchObject({ requestId: 'read' });

    host.hasRenderedAction.mockReturnValue(false);
    await vi.advanceTimersByTimeAsync(500);

    expect(host.hasRenderedAction).toHaveBeenCalledTimes(2);
    expect(socket.sent.at(-1)).toMatchObject({
      requestId: 'play',
      ok: false,
      error: { code: 'RESULT_UNKNOWN' },
    });
    expect(connection.status).toBe('disconnected');
  });

  it('invalidates pending work and does not replay when a new canvas pairs', async () => {
    const { connection, host, pair } = createConnection();
    const first = pair();
    sendRead(first);
    sendPlay(first);
    connection.disconnect();
    const second = pair('second');
    sendRead(second, 'second');
    await vi.advanceTimersByTimeAsync(1000);

    expect(first.sent.at(-1)).toMatchObject({ requestId: 'read' });
    expect(host.apply.mock.calls.map(([request]) => [request.canvasId, request.tool])).toEqual([
      ['first', 'get_canvas_state'],
      ['first', 'set_simulation'],
      ['second', 'get_canvas_state'],
    ]);
    expect(connection.lastAction).toBeUndefined();
    expect(connection.status).toBe('connected');
  });

  it('rejects invalid input before it reaches the canvas', () => {
    const { host, pair } = createConnection();
    const socket = pair();
    sendRead(socket);
    socket.receive({
      type: 'request',
      requestId: 'config',
      canvasId: 'first',
      tool: 'set_node_config',
      args: { nodeId: 'node', key: 'requestRate', value: 1 },
    });
    socket.receive({
      type: 'request',
      requestId: 'node',
      canvasId: 'first',
      tool: 'add_node',
      args: { serviceType: 'client', name: 'Users', x: 0, y: 0, unexpected: true },
    });

    expect(host.apply).toHaveBeenCalledOnce();
    expect(socket.sent.slice(-2)).toMatchObject([
      { requestId: 'config', ok: false, error: { code: 'INVALID_ARGUMENT' } },
      { requestId: 'node', ok: false, error: { code: 'INVALID_ARGUMENT' } },
    ]);
  });
});
