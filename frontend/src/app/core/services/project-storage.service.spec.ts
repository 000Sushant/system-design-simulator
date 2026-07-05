import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectStorageService, PersistedWorkspace } from './project-storage.service';
import { ArchitectureProject } from '../models/architecture.model';

/** Minimal in-memory localStorage — the suite runs in the `node` environment (no DOM). */
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

const project: ArchitectureProject = {
  id: 'p1',
  name: 'My Design',
  nodes: [],
  connections: [],
  annotations: [],
  currency: 'USD',
  region: 'us-east-1',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const workspace: PersistedWorkspace = {
  activeIndex: 1,
  tabs: [
    {
      id: 't1', name: 'Tab 1', projectName: 'My Design',
      nodes: [], connections: [], annotations: [], currency: 'USD', region: 'us-east-1',
    },
  ],
};

describe('ProjectStorageService', () => {
  let service: ProjectStorageService;

  beforeEach(() => {
    (globalThis as { localStorage?: unknown }).localStorage = new MemoryStorage();
    service = new ProjectStorageService();
  });

  afterEach(() => {
    delete (globalThis as { localStorage?: unknown }).localStorage;
  });

  describe('project', () => {
    it('round-trips a saved project through loadLocal', () => {
      service.save(project);
      expect(service.loadLocal()).toEqual(project);
    });

    it('returns null when no project is stored', () => {
      expect(service.loadLocal()).toBeNull();
    });

    it('returns null (does not throw) when the stored project JSON is corrupt', () => {
      localStorage.setItem('aws-system-design-simulator-project', '{truncated');
      expect(service.loadLocal()).toBeNull();
    });

    it('emits the saved project from the returned observable', () => {
      let emitted: ArchitectureProject | undefined;
      service.save(project).subscribe((p) => (emitted = p));
      expect(emitted).toEqual(project);
    });
  });

  describe('workspace', () => {
    it('round-trips a saved workspace through loadWorkspace', () => {
      service.saveWorkspace(workspace);
      expect(service.loadWorkspace()).toEqual(workspace);
    });

    it('returns null when no workspace is stored', () => {
      expect(service.loadWorkspace()).toBeNull();
    });

    it('returns null (does not throw) when the stored workspace JSON is corrupt', () => {
      localStorage.setItem('aws-system-design-simulator-workspace', '{not valid json');
      expect(service.loadWorkspace()).toBeNull();
    });

    it('clearWorkspace removes the workspace but leaves the project intact', () => {
      service.save(project);
      service.saveWorkspace(workspace);
      service.clearWorkspace();
      expect(service.loadWorkspace()).toBeNull();
      expect(service.loadLocal()).toEqual(project);
    });
  });
});
