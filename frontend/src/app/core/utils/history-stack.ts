
export interface HistoryStackOptions {
  limit?: number;
  coalesceWindowMs?: number;
}

const DEFAULT_LIMIT = 50;
const DEFAULT_COALESCE_WINDOW_MS = 700;

export class HistoryStack<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private lastKey = '';
  private lastTime = 0;

  private readonly limit: number;
  private readonly coalesceWindowMs: number;

  constructor(options: HistoryStackOptions = {}) {
    this.limit = options.limit ?? DEFAULT_LIMIT;
    this.coalesceWindowMs = options.coalesceWindowMs ?? DEFAULT_COALESCE_WINDOW_MS;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  push(snapshot: T, coalesceKey?: string, now: number = Date.now()): boolean {
    if (
      coalesceKey &&
      coalesceKey === this.lastKey &&
      now - this.lastTime < this.coalesceWindowMs
    ) {
      this.lastTime = now;
      return false;
    }
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.limit) this.undoStack.shift();
    this.redoStack = [];
    this.lastKey = coalesceKey ?? '';
    this.lastTime = now;
    return true;
  }

  undo(current: T): T | undefined {
    const snapshot = this.undoStack.pop();
    if (snapshot === undefined) return undefined;
    this.redoStack.push(current);
    this.lastKey = '';
    return snapshot;
  }

  redo(current: T): T | undefined {
    const snapshot = this.redoStack.pop();
    if (snapshot === undefined) return undefined;
    this.undoStack.push(current);
    this.lastKey = '';
    return snapshot;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.lastKey = '';
    this.lastTime = 0;
  }
}
