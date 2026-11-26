import {
  CanvasActionMarker,
  CanvasRequest,
  CanvasResult,
  canvasError,
  isCanvasRead,
  isRecord,
  readCanvasRequest,
} from './canvas-mcp-contract';

const CANVAS_SOCKET_URL = 'ws://127.0.0.1:4301/canvas';
const PAIRING_TIMEOUT_MS = 5000;
const RENDER_TIMEOUT_MS = 2000;
const ACTION_DWELL_MS = 500;

interface CanvasSession {
  socket: WebSocket;
  canvasId: string;
  pairingTimer: ReturnType<typeof setTimeout>;
  hasState: boolean;
  inFlight: boolean;
  cancelPresentation?: () => void;
}

interface CanvasHost {
  activeCanvasId(): string | undefined;
  apply(request: CanvasRequest): CanvasResult;
  renderAction(): void;
  hasRenderedAction(marker: CanvasActionMarker): boolean;
}

export class CanvasMcpConnection {
  status: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  message = 'Pair a local MCP client to this canvas.';
  lastAction?: CanvasActionMarker;

  private session?: CanvasSession;

  constructor(private readonly host: CanvasHost) {}

  static isSupportedOrigin(origin: string): boolean {
    return origin === 'http://localhost:4200' || origin === 'http://127.0.0.1:4200';
  }

  connect(code: string): void {
    const canvasId = this.host.activeCanvasId();
    if (
      this.session ||
      !canvasId ||
      !CanvasMcpConnection.isSupportedOrigin(window.location.origin)
    ) {
      return;
    }
    const pairingCode = code.trim();
    if (!pairingCode || pairingCode.length > 128) {
      this.message = 'Enter the pairing code from your local MCP client.';
      return;
    }

    const socket = new WebSocket(CANVAS_SOCKET_URL);
    const session: CanvasSession = {
      socket,
      canvasId,
      pairingTimer: setTimeout(
        () => this.close(session, 'Pairing timed out. Request a fresh code.'),
        PAIRING_TIMEOUT_MS,
      ),
      hasState: false,
      inFlight: false,
    };
    this.session = session;
    this.status = 'connecting';
    this.message = 'Connecting to the local MCP server…';

    socket.onopen = () => {
      if (!this.isCurrent(session)) return;
      socket.send(JSON.stringify({ version: 1, type: 'pair', code: pairingCode, canvasId }));
      socket.onopen = null;
    };
    socket.onmessage = (event: MessageEvent) => {
      void this.receive(session, event.data);
    };
    socket.onerror = () => this.close(session, 'The local MCP connection failed.');
    socket.onclose = (event) => {
      const message =
        this.status === 'connecting' && event.code === 1008
          ? 'Pairing was refused. Request a fresh code.'
          : 'The local MCP connection ended.';
      this.close(session, message);
    };
  }

  disconnect(): void {
    if (this.session) this.close(this.session, 'Disconnected from the local MCP client.');
  }

  private isCurrent(session: CanvasSession): boolean {
    return (
      this.session === session &&
      session.socket.readyState === WebSocket.OPEN &&
      this.host.activeCanvasId() === session.canvasId
    );
  }

  private close(session: CanvasSession, message: string): void {
    if (this.session !== session) return;
    this.session = undefined;
    clearTimeout(session.pairingTimer);
    session.cancelPresentation?.();
    const { socket } = session;
    socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
    if (socket.readyState < WebSocket.CLOSING) socket.close();
    this.status = 'disconnected';
    this.message = message;
    this.lastAction = undefined;
  }

  private async receive(session: CanvasSession, value: unknown): Promise<void> {
    if (!this.isCurrent(session)) return;
    const message = this.parseMessage(value);
    if (
      message?.['type'] === 'paired' &&
      this.status === 'connecting' &&
      message['canvasId'] === session.canvasId
    ) {
      clearTimeout(session.pairingTimer);
      this.status = 'connected';
      this.message = 'Connected to this canvas.';
      return;
    }

    if (
      this.status !== 'connected' ||
      message?.['type'] !== 'request' ||
      message['canvasId'] !== session.canvasId ||
      session.inFlight
    ) {
      this.close(session, 'The local MCP server sent an unexpected message.');
      return;
    }

    const request = readCanvasRequest(message);
    if (!request) {
      const requestId = message['requestId'];
      if (typeof requestId !== 'string' || !requestId || requestId.length > 128) {
        this.close(session, 'The local MCP server sent an invalid request.');
        return;
      }
      this.sendResult(
        session,
        requestId,
        canvasError('INVALID_ARGUMENT', 'Invalid canvas tool or arguments.'),
      );
      return;
    }

    const read = isCanvasRead(request.tool);
    if (!read && !session.hasState) {
      this.sendResult(
        session,
        request.requestId,
        canvasError('INVALID_STATE', 'Read the canvas state before editing.'),
      );
      return;
    }
    if (!read && document.visibilityState !== 'visible') {
      this.sendResult(
        session,
        request.requestId,
        canvasError('TAB_HIDDEN', 'Show the canvas before editing.'),
      );
      return;
    }

    session.inFlight = true;
    try {
      // No asynchronous boundary separates the target/visibility checks from the mutation.
      const result = this.host.apply(request);
      if (result.ok && result.action) {
        const marker: CanvasActionMarker = {
          ...result.action,
          canvasId: session.canvasId,
          sequence: (this.lastAction?.sequence ?? 0) + 1,
        };
        this.lastAction = marker;
        this.host.renderAction();
        if (!(await this.waitForPresentation(session, marker))) {
          this.finishUnknown(session, request.requestId);
          return;
        }
      }
      if (result.ok && request.tool === 'get_canvas_state') session.hasState = true;
      this.sendResult(session, request.requestId, result);
    } catch {
      if (read) {
        this.sendResult(
          session,
          request.requestId,
          canvasError('INTERNAL_ERROR', 'Could not read the canvas.'),
        );
      } else {
        this.finishUnknown(session, request.requestId);
      }
    } finally {
      session.inFlight = false;
    }
  }

  private parseMessage(value: unknown): Record<string, unknown> | undefined {
    if (typeof value !== 'string') return undefined;
    try {
      const message: unknown = JSON.parse(value);
      return isRecord(message) && message['version'] === 1 ? message : undefined;
    } catch {
      return undefined;
    }
  }

  private sendResult(session: CanvasSession, requestId: string, result: CanvasResult): void {
    if (!this.isCurrent(session)) return;
    const outcome = result.ok
      ? { ok: true, data: result.data }
      : { ok: false, error: result.error };
    session.socket.send(
      JSON.stringify({
        version: 1,
        type: 'result',
        requestId,
        canvasId: session.canvasId,
        ...outcome,
      }),
    );
  }

  private finishUnknown(session: CanvasSession, requestId: string): void {
    const message =
      'The canvas change could not be confirmed. Reconnect and read the canvas state.';
    this.sendResult(session, requestId, canvasError('RESULT_UNKNOWN', message));
    this.close(session, message);
  }

  private waitForPresentation(
    session: CanvasSession,
    marker: CanvasActionMarker,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let frame = 0;
      let dwell: ReturnType<typeof setTimeout> | undefined;
      const visible = () => this.isCurrent(session) && document.visibilityState === 'visible';
      const finish = (presented: boolean) => {
        clearTimeout(timeout);
        clearTimeout(dwell);
        cancelAnimationFrame(frame);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        session.cancelPresentation = undefined;
        resolve(presented);
      };
      const onVisibilityChange = () => {
        if (!visible()) finish(false);
      };
      const timeout = setTimeout(() => finish(false), RENDER_TIMEOUT_MS);

      session.cancelPresentation = () => finish(false);
      document.addEventListener('visibilitychange', onVisibilityChange);
      const observeAction = () => {
        if (!visible()) {
          finish(false);
          return;
        }
        if (!this.host.hasRenderedAction(marker)) {
          frame = requestAnimationFrame(observeAction);
          return;
        }
        clearTimeout(timeout);
        dwell = setTimeout(
          () => finish(visible() && this.host.hasRenderedAction(marker)),
          ACTION_DWELL_MS,
        );
      };
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(observeAction);
      });
    });
  }
}
