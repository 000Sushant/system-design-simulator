import { describe, it, expect } from 'vitest';
import { HistoryStack } from './history-stack';

describe('HistoryStack', () => {
  it('starts empty', () => {
    const stack = new HistoryStack<string>();
    expect(stack.canUndo).toBe(false);
    expect(stack.canRedo).toBe(false);
  });

  it('records snapshots and undoes to the prior state', () => {
    const stack = new HistoryStack<string>();
    stack.push('v1');
    expect(stack.canUndo).toBe(true);
    // current state is 'v2'; undo should return the recorded 'v1'.
    expect(stack.undo('v2')).toBe('v1');
    expect(stack.canUndo).toBe(false);
    expect(stack.canRedo).toBe(true);
  });

  it('redoes the state that was current at undo time', () => {
    const stack = new HistoryStack<string>();
    stack.push('v1');
    stack.undo('v2'); // redo stack now holds 'v2'
    expect(stack.redo('v1')).toBe('v2');
    expect(stack.canRedo).toBe(false);
    expect(stack.canUndo).toBe(true);
  });

  it('returns undefined when there is nothing to undo/redo', () => {
    const stack = new HistoryStack<string>();
    expect(stack.undo('current')).toBeUndefined();
    expect(stack.redo('current')).toBeUndefined();
  });

  it('clears the redo stack on a fresh push', () => {
    const stack = new HistoryStack<string>();
    stack.push('v1');
    stack.undo('v2'); // redo holds 'v2'
    expect(stack.canRedo).toBe(true);
    stack.push('v3'); // a new edit invalidates redo
    expect(stack.canRedo).toBe(false);
  });

  it('coalesces same-key edits within the time window', () => {
    const stack = new HistoryStack<string>({ coalesceWindowMs: 700 });
    expect(stack.push('a', 'slider', 1000)).toBe(true);
    expect(stack.push('b', 'slider', 1200)).toBe(false); // coalesced, nothing pushed
    expect(stack.push('c', 'slider', 1300)).toBe(false);
    // Only one entry exists despite three pushes.
    expect(stack.undo('current')).toBe('a');
    expect(stack.canUndo).toBe(false);
  });

  it('does not coalesce once the window elapses or the key changes', () => {
    const stack = new HistoryStack<string>({ coalesceWindowMs: 700 });
    expect(stack.push('a', 'slider', 1000)).toBe(true);
    expect(stack.push('b', 'slider', 2000)).toBe(true); // window elapsed
    expect(stack.push('c', 'move', 2100)).toBe(true); // different key
    expect(stack.undo('x')).toBe('c');
    expect(stack.undo('x')).toBe('b');
    expect(stack.undo('x')).toBe('a');
  });

  it('enforces the size limit by dropping the oldest entries', () => {
    const stack = new HistoryStack<number>({ limit: 3 });
    for (let i = 1; i <= 5; i++) stack.push(i);
    // Only the 3 most recent (3,4,5) are retained.
    expect(stack.undo(0)).toBe(5);
    expect(stack.undo(0)).toBe(4);
    expect(stack.undo(0)).toBe(3);
    expect(stack.undo(0)).toBeUndefined();
  });

  it('clear() empties both stacks', () => {
    const stack = new HistoryStack<string>();
    stack.push('v1');
    stack.undo('v2');
    stack.clear();
    expect(stack.canUndo).toBe(false);
    expect(stack.canRedo).toBe(false);
  });
});
