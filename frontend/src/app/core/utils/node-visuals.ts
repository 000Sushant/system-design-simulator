import { ArchitectureConnection, HealthStatus } from '../models/architecture.model';

/** Health status → node badge/border color. Single source for these hues. */
export const HEALTH_STATUS_COLOR: Record<HealthStatus, string> = {
  normal: '#16a34a',
  busy: '#d97706', // amber — nearing capacity (warning)
  overloaded: '#dc2626', // red — past capacity, treated as an error
  failing: '#dc2626',
  offline: '#dc2626', // red when stopped/offline
};

const EDGE_COLOR = {
  error: '#dc2626',
  busy: '#eab308',
  idleDark: '#64748b',
  idleLight: '#111827',
} as const;

const EDGE_ERROR_RATE_THRESHOLD = 10;
const EDGE_BUSY_INTENSITY_THRESHOLD = 0.7;

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60_000;

export function statusColor(status: HealthStatus): string {
  return HEALTH_STATUS_COLOR[status];
}

/** Edge color from its live traffic, falling back to a theme-aware idle hue. */
export function connectionColor(connection: ArchitectureConnection, isDark: boolean): string {
  const { errorRate, intensity } = connection.traffic;
  if (errorRate > EDGE_ERROR_RATE_THRESHOLD) return EDGE_COLOR.error;
  if (intensity > EDGE_BUSY_INTENSITY_THRESHOLD) return EDGE_COLOR.busy;
  // Idle edge stays legible: dark ink on light theme, light slate on dark.
  return isDark ? EDGE_COLOR.idleDark : EDGE_COLOR.idleLight;
}

/**
 * Human-readable latency: ms under 1s, seconds under 1 min, then "Xm Ys".
 * Keeps overloaded nodes legible as latency climbs from ms into minutes.
 */
export function formatLatency(ms: number | null | undefined): string {
  const value = Math.max(0, Math.round(Number(ms) || 0));
  if (value < MS_PER_SECOND) return `${value}ms`;
  if (value < MS_PER_MINUTE) {
    const seconds = value / MS_PER_SECOND;
    return `${seconds % 1 === 0 ? seconds : seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(value / MS_PER_MINUTE);
  const seconds = Math.round((value % MS_PER_MINUTE) / MS_PER_SECOND);
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
