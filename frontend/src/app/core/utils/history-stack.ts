/**
 * Generic undo/redo stack with edit coalescing and a bounded size.
 *
 * The stack stores opaque snapshots of type `T`; capturing and restoring them
 * is the caller's responsibility. This keeps the mechanics (coalescing, the
 * size limit, the undo↔redo swap) reusable and free of any UI coupling.
 *
 * Snapshots are recorded *before* a mutation, so `undo` restores the prior
 * state. Rapid successive edits that share a `coalesceKey` within
 * `coalesceWindowMs` fold into the entry already on the stack — e.g. a slider
 * drag becomes one undo entry instead of dozens.
 */

export interface HistoryStackOptions {
  /** Maximum number of undo entries kept; oldest are dropped past this. */
  limit?: number;
  /** Time window (ms) during which same-key edits coalesce into one entry. */
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

  /**
   * Records a pre-mutation snapshot. Returns `false` when the edit was coalesced
   * into the previous entry (nothing was pushed), `true` otherwise.
   */
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

  /**
   * Pops the most recent undo snapshot and pushes `current` onto the redo stack.
   * Returns the snapshot to restore, or `undefined` when there is nothing to undo.
   */
  undo(current: T): T | undefined {
    const snapshot = this.undoStack.pop();
    if (snapshot === undefined) return undefined;
    this.redoStack.push(current);
    this.lastKey = '';
    return snapshot;
  }

  /**
   * Pops the most recent redo snapshot and pushes `current` onto the undo stack.
   * Returns the snapshot to restore, or `undefined` when there is nothing to redo.
   */
  redo(current: T): T | undefined {
    const snapshot = this.redoStack.pop();
    if (snapshot === undefined) return undefined;
    this.undoStack.push(current);
    this.lastKey = '';
    return snapshot;
  }

  /** Clears both stacks — e.g. when loading a project or switching canvases. */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.lastKey = '';
    this.lastTime = 0;
  }
}
