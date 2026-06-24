import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ArchitectureProject,
  ArchitectureNode,
  ArchitectureConnection,
  Annotation,
  Currency,
} from '../models/architecture.model';

const storageKey = 'aws-system-design-simulator-project';
const workspaceKey = 'aws-system-design-simulator-workspace';

/** One canvas tab's persistable content (runtime-only fields are dropped). */
export interface PersistedTab {
  id: string;
  name: string;
  projectName: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  annotations: Annotation[];
  currency: Currency;
  region: string;
}

/** The full multi-tab workspace, so no canvas is lost on navigation. */
export interface PersistedWorkspace {
  activeIndex: number;
  tabs: PersistedTab[];
}

@Injectable({ providedIn: 'root' })
export class ProjectStorageService {
  constructor() {}

  save(project: ArchitectureProject): Observable<ArchitectureProject> {
    localStorage.setItem(storageKey, JSON.stringify(project));
    return of(project);
  }

  loadLocal(): ArchitectureProject | null {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as ArchitectureProject : null;
  }

  saveWorkspace(workspace: PersistedWorkspace): void {
    localStorage.setItem(workspaceKey, JSON.stringify(workspace));
  }

  loadWorkspace(): PersistedWorkspace | null {
    const raw = localStorage.getItem(workspaceKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PersistedWorkspace;
    } catch {
      return null;
    }
  }

  clearWorkspace(): void {
    localStorage.removeItem(workspaceKey);
  }
}
