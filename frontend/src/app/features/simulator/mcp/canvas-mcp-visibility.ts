type Bounds = Pick<DOMRectReadOnly, 'left' | 'top' | 'right' | 'bottom'>;

export function visibleElement(element: Element, ...clips: Bounds[]): boolean {
  const { ownerDocument } = element;
  const viewport = ownerDocument.documentElement;
  const bounds = element.getBoundingClientRect();
  const left = Math.max(bounds.left, 0, ...clips.map((clip) => clip.left));
  const top = Math.max(bounds.top, 0, ...clips.map((clip) => clip.top));
  const right = Math.min(bounds.right, viewport.clientWidth, ...clips.map((clip) => clip.right));
  const bottom = Math.min(
    bounds.bottom,
    viewport.clientHeight,
    ...clips.map((clip) => clip.bottom),
  );
  if (left >= right || top >= bottom || !hasVisibleStyle(element)) return false;

  const hit = ownerDocument.elementFromPoint((left + right) / 2, (top + bottom) / 2);
  return element.contains(hit);
}

export function visibleConnectionPath(connection: Element, clip: Bounds): boolean {
  const path = connection.querySelector<SVGPathElement>('path[f-connection-path]');
  if (!path || !hasVisibleStyle(path)) return false;
  const transform = path.getScreenCTM();
  const length = path.getTotalLength();
  if (!transform || length <= 0) return false;

  // A curve can cross the clip boundary without its bounds describing any visible stroke.
  const { ownerDocument } = path;
  const viewport = ownerDocument.documentElement;
  const left = Math.max(clip.left, 0);
  const top = Math.max(clip.top, 0);
  const right = Math.min(clip.right, viewport.clientWidth);
  const bottom = Math.min(clip.bottom, viewport.clientHeight);
  for (let index = 1; index < 16; index++) {
    const { x, y } = path.getPointAtLength((length * index) / 16).matrixTransform(transform);
    if (
      x > left &&
      x < right &&
      y > top &&
      y < bottom &&
      connection.contains(ownerDocument.elementFromPoint(x, y))
    ) {
      return true;
    }
  }
  return false;
}

function hasVisibleStyle(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view || view.getComputedStyle(element).visibility !== 'visible') return false;
  for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (view.getComputedStyle(ancestor).opacity === '0') return false;
  }
  return true;
}
