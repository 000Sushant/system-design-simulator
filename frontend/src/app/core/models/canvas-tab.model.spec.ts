import { describe, it, expect } from 'vitest';
import { CanvasTab, fromPersistedTab, toPersistedTab } from './canvas-tab.model';
import { makeNode } from '../testing/fixtures';
import type { PersistedTab } from '../services/project-storage.service';

function makeTab(overrides: Partial<CanvasTab> = {}): CanvasTab {
  return {
    id: 't1',
    name: 'Tab 1',
    projectName: 'My Project',
    nodes: [],
    connections: [],
    annotations: [],
    packets: [],
    selectedNodeIds: [],
    selectedConnectionIds: [],
    zoom: 0.85,
    pan: { x: 40, y: 40 },
    globalCurrency: 'USD',
    globalRegion: 'us-east-1',
    simulationMode: 'idle',
    totals: { processed: 0, dropped: 0, avgLatency: 0 },
    tick: 0,
    dirty: true,
    ...overrides,
  };
}

describe('toPersistedTab', () => {
  it('keeps persistable fields and drops runtime-only state', () => {
    const tab = makeTab({ globalCurrency: 'EUR', globalRegion: 'eu-west-1', nodes: [makeNode('a', 'ec2')] });
    const persisted = toPersistedTab(tab);

    expect(persisted.currency).toBe('EUR');
    expect(persisted.region).toBe('eu-west-1');
    expect(persisted.nodes).toBe(tab.nodes);
    expect(persisted).not.toHaveProperty('dirty');
    expect(persisted).not.toHaveProperty('packets');
    expect(persisted).not.toHaveProperty('zoom');
  });
});

describe('fromPersistedTab', () => {
  it('fills runtime defaults and applies the given zoom', () => {
    const persisted = toPersistedTab(makeTab());
    const tab = fromPersistedTab(persisted, 0, 0.65);

    expect(tab.zoom).toBe(0.65);
    expect(tab.dirty).toBe(false);
    expect(tab.simulationMode).toBe('idle');
    expect(tab.packets).toEqual([]);
    expect(tab.pan).toEqual({ x: 40, y: 40 });
  });

  it('tolerates partial/legacy records without losing the canvas', () => {
    const tab = fromPersistedTab({} as PersistedTab, 2, 0.85);
    expect(tab.name).toBe('Canvas 3');
    expect(tab.projectName).toBe('Untitled AWS Architecture');
    expect(tab.nodes).toEqual([]);
    expect(tab.globalCurrency).toBe('USD');
    expect(tab.globalRegion).toBe('us-east-1');
    expect(tab.id).toMatch(/^tab-/);
  });
});

describe('round-trip', () => {
  it('preserves all persistent data through save → restore', () => {
    const original = makeTab({
      id: 'abc',
      name: 'Design A',
      projectName: 'Shortener',
      globalCurrency: 'GBP',
      globalRegion: 'eu-west-2',
      nodes: [makeNode('n', 'lambda')],
    });
    const restored = fromPersistedTab(toPersistedTab(original), 0, 0.85);

    expect(restored.id).toBe('abc');
    expect(restored.name).toBe('Design A');
    expect(restored.projectName).toBe('Shortener');
    expect(restored.globalCurrency).toBe('GBP');
    expect(restored.globalRegion).toBe('eu-west-2');
    expect(restored.nodes).toEqual(original.nodes);
  });
});
