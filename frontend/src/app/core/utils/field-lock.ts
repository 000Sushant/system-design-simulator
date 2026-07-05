import { ArchitectureNode } from '../models/architecture.model';

/** The subset of a config-field descriptor that governs whether it is editable. */
export interface LockableField {
  key?: string;
  readonly?: boolean;
}

/**
 * Whether a config field should be shown as locked (non-editable) for a node.
 *
 * A field is locked when it is explicitly `readonly`, or when it is the
 * `throughput` field on a node whose requests/second is being synced from the
 * client (marked by the internal `_designThroughput` config value). Pure and
 * side-effect free.
 */
export function isFieldLocked(node: ArchitectureNode, field: LockableField | null | undefined): boolean {
  if (field?.readonly) return true;
  if (field?.key === 'throughput' && node.config?.['_designThroughput'] !== undefined) {
    return true;
  }
  return false;
}
