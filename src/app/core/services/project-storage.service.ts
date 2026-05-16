import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArchitectureProject } from '../models/architecture.model';

const storageKey = 'aws-system-design-simulator-project';

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
}
