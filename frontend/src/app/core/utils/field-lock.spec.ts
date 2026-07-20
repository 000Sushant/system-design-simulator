import { describe, it, expect } from 'vitest';
import { isFieldLocked } from './field-lock';
import { makeNode } from '../testing/fixtures';

describe('isFieldLocked', () => {
  it('locks a field explicitly marked readonly', () => {
    const node = makeNode('a', 'ec2');
    expect(isFieldLocked(node, { key: 'cpu', readonly: true })).toBe(true);
  });

  it('does not lock a normal editable field', () => {
    const node = makeNode('a', 'ec2');
    expect(isFieldLocked(node, { key: 'cpu' })).toBe(false);
  });

  it('locks throughput when the node is synced from the client (_designThroughput set)', () => {
    const node = makeNode('a', 'ec2', { config: { _designThroughput: 500 } as never });
    expect(isFieldLocked(node, { key: 'throughput' })).toBe(true);
  });

  it('does not lock throughput when the node is not synced', () => {
    const node = makeNode('a', 'ec2');
    expect(isFieldLocked(node, { key: 'throughput' })).toBe(false);
  });

  it('only locks the throughput key on a synced node, not other fields', () => {
    const node = makeNode('a', 'ec2', { config: { _designThroughput: 500 } as never });
    expect(isFieldLocked(node, { key: 'cpu' })).toBe(false);
  });

  it('is safe with a null/undefined field', () => {
    const node = makeNode('a', 'ec2');
    expect(isFieldLocked(node, null)).toBe(false);
    expect(isFieldLocked(node, undefined)).toBe(false);
  });
});
