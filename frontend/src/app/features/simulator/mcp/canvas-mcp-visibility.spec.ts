import { describe, expect, it, vi } from 'vitest';
import { visibleConnectionPath, visibleElement } from './canvas-mcp-visibility';

const canvas = { left: 100, top: 90, right: 700, bottom: 500 };

function createDocument() {
  return {
    documentElement: { clientWidth: 800, clientHeight: 600 },
    defaultView: { getComputedStyle: vi.fn(() => ({ visibility: 'visible', opacity: '1' })) },
    elementFromPoint: vi.fn<(x: number, y: number) => unknown>(),
  };
}

describe('MCP target visibility', () => {
  it('requires the highlighted element to intersect the canvas clip and be unobscured', () => {
    const ownerDocument = createDocument();
    const getBoundingClientRect = vi.fn(() => ({ left: 720, top: 120, right: 780, bottom: 180 }));
    const node = {
      ownerDocument,
      parentElement: null,
      getBoundingClientRect,
      contains: (element: unknown) => element === node,
    };
    const target = node as unknown as Element;
    ownerDocument.elementFromPoint.mockReturnValue(node);
    expect(visibleElement(target, canvas)).toBe(false);
    expect(ownerDocument.elementFromPoint).not.toHaveBeenCalled();

    getBoundingClientRect.mockReturnValue({ left: 120, top: 120, right: 180, bottom: 180 });
    expect(visibleElement(target, canvas)).toBe(true);
    ownerDocument.elementFromPoint.mockReturnValue({});
    expect(visibleElement(target, canvas)).toBe(false);
  });

  it('uses the actual SVG path points to check for a visible edge, including horizontal edges', () => {
    const ownerDocument = createDocument();
    let y = 60;
    const path = {
      ownerDocument,
      parentElement: null,
      getTotalLength: () => 80,
      getScreenCTM: () => ({}),
      getPointAtLength: (distance: number) => ({
        matrixTransform: () => ({ x: 150 + distance, y }),
      }),
    };
    const connection = {
      querySelector: () => path,
      contains: (element: unknown) => element === path,
    } as unknown as Element;
    ownerDocument.elementFromPoint.mockReturnValue(path);
    expect(visibleConnectionPath(connection, canvas)).toBe(false);

    y = 140;
    expect(visibleConnectionPath(connection, canvas)).toBe(true);
    ownerDocument.elementFromPoint.mockReturnValue({});
    expect(visibleConnectionPath(connection, canvas)).toBe(false);
  });
});
