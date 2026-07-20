import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeService } from './theme.service';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

function fakeClassList() {
  const set = new Set<string>();
  return {
    add: (c: string) => set.add(c),
    remove: (c: string) => set.delete(c),
    contains: (c: string) => set.has(c),
  };
}

const KEY = 'sr-architect-darkmode';
type Globals = { window?: unknown; document?: unknown; localStorage?: unknown };

let storage: MemoryStorage;
let htmlClasses: ReturnType<typeof fakeClassList>;
let bodyClasses: ReturnType<typeof fakeClassList>;

beforeEach(() => {
  storage = new MemoryStorage();
  htmlClasses = fakeClassList();
  bodyClasses = fakeClassList();
  const g = globalThis as Globals;
  g.window = {};
  g.localStorage = storage;
  g.document = { documentElement: { classList: htmlClasses }, body: { classList: bodyClasses } };
});

afterEach(() => {
  const g = globalThis as Globals;
  delete g.window;
  delete g.localStorage;
  delete g.document;
});

describe('ThemeService', () => {
  it('defaults to light when nothing is stored', () => {
    const service = new ThemeService();
    expect(service.isDark).toBe(false);
    expect(htmlClasses.contains('dark')).toBe(false);
  });

  it('restores dark mode when the stored value is "true"', () => {
    storage.setItem(KEY, 'true');
    const service = new ThemeService();
    expect(service.isDark).toBe(true);
    expect(htmlClasses.contains('dark')).toBe(true);
    expect(bodyClasses.contains('dark')).toBe(true);
  });

  it('restores light mode when the stored value is "false"', () => {
    storage.setItem(KEY, 'false');
    const service = new ThemeService();
    expect(service.isDark).toBe(false);
    expect(htmlClasses.contains('dark')).toBe(false);
  });

  it('toggleTheme flips the mode and persists it', () => {
    const service = new ThemeService();
    service.toggleTheme();
    expect(service.isDark).toBe(true);
    expect(storage.getItem(KEY)).toBe('true');
    service.toggleTheme();
    expect(service.isDark).toBe(false);
    expect(storage.getItem(KEY)).toBe('false');
  });

  it('setDark toggles the dark class on <html> and <body>', () => {
    const service = new ThemeService();
    service.setDark(true);
    expect(htmlClasses.contains('dark')).toBe(true);
    expect(bodyClasses.contains('dark')).toBe(true);
    service.setDark(false);
    expect(htmlClasses.contains('dark')).toBe(false);
    expect(bodyClasses.contains('dark')).toBe(false);
  });

  it('emits the current mode on isDark$', () => {
    const service = new ThemeService();
    const seen: boolean[] = [];
    service.isDark$.subscribe((v) => seen.push(v));
    service.setDark(true);
    expect(seen).toEqual([false, true]);
  });
});
