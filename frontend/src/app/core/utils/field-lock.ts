import { ArchitectureNode } from '../models/architecture.model';

export interface LockableField {
  key?: string;
  readonly?: boolean;
}

export function isFieldLocked(node: ArchitectureNode, field: LockableField | null | undefined): boolean {
  if (field?.readonly) return true;
  if (field?.key === 'throughput' && node.config?.['_designThroughput'] !== undefined) {
    return true;
  }
  return false;
}
