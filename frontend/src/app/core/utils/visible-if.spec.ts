import { describe, it, expect } from 'vitest';
import { evaluateVisibleIf } from './visible-if';

describe('evaluateVisibleIf', () => {
  it('is visible when the expression is empty or missing', () => {
    expect(evaluateVisibleIf('', {})).toBe(true);
    expect(evaluateVisibleIf(undefined, {})).toBe(true);
    expect(evaluateVisibleIf('   ', {})).toBe(true);
  });

  it('evaluates strict equality against string literals', () => {
    expect(evaluateVisibleIf("config.type === 'rest'", { type: 'rest' })).toBe(true);
    expect(evaluateVisibleIf("config.type === 'rest'", { type: 'websocket' })).toBe(false);
    expect(evaluateVisibleIf("config.type === 'rest'", {})).toBe(false);
  });

  it('evaluates strict inequality', () => {
    expect(evaluateVisibleIf("config.lbType !== 'clb'", { lbType: 'alb' })).toBe(true);
    expect(evaluateVisibleIf("config.lbType !== 'clb'", { lbType: 'clb' })).toBe(false);
  });

  it('evaluates truthiness and negation', () => {
    expect(evaluateVisibleIf('config.variableTraffic', { variableTraffic: true })).toBe(true);
    expect(evaluateVisibleIf('config.variableTraffic', { variableTraffic: false })).toBe(false);
    expect(evaluateVisibleIf('!config.capacityMode', {})).toBe(true);
    expect(evaluateVisibleIf('!config.capacityMode', { capacityMode: 'provisioned' })).toBe(false);
  });

  it('compares boolean literals', () => {
    expect(evaluateVisibleIf('config.variableTraffic === true', { variableTraffic: true })).toBe(true);
    expect(evaluateVisibleIf('config.variableTraffic !== true', { variableTraffic: true })).toBe(false);
  });

  it('handles || (any clause wins) — mirrors the real cost-model grammar', () => {
    const expr = "config.capacityMode === 'on-demand' || !config.capacityMode";
    expect(evaluateVisibleIf(expr, { capacityMode: 'on-demand' })).toBe(true);
    expect(evaluateVisibleIf(expr, {})).toBe(true);
    expect(evaluateVisibleIf(expr, { capacityMode: 'provisioned' })).toBe(false);
  });

  it('handles && (all clauses required)', () => {
    const expr = "config.a === 'x' && config.b === 'y'";
    expect(evaluateVisibleIf(expr, { a: 'x', b: 'y' })).toBe(true);
    expect(evaluateVisibleIf(expr, { a: 'x', b: 'z' })).toBe(false);
  });

  it('does not split on operators inside quoted literals', () => {
    expect(evaluateVisibleIf("config.label === 'a || b'", { label: 'a || b' })).toBe(true);
  });

  it('fails open (returns true) for unparseable expressions', () => {
    expect(evaluateVisibleIf('config.x.y.z()', {})).toBe(true);
    expect(evaluateVisibleIf('totally invalid', {})).toBe(true);
  });

  it('never executes arbitrary code (no eval escape)', () => {
    const malicious = "config.x === 'a'); globalThis.__pwned = true; ('";
    const result = evaluateVisibleIf(malicious, {});
    expect(typeof result).toBe('boolean');
    expect((globalThis as Record<string, unknown>)['__pwned']).toBeUndefined();
  });
});
