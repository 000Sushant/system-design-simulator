import { describe, it, expect } from 'vitest';
import { HEALTH_STATUS_COLOR, connectionColor, formatLatency, statusColor } from './node-visuals';
import { makeConn } from '../testing/fixtures';

describe('statusColor', () => {
  it('maps every health status to its configured color', () => {
    expect(statusColor('normal')).toBe(HEALTH_STATUS_COLOR.normal);
    expect(statusColor('overloaded')).toBe('#dc2626');
  });
});

describe('connectionColor', () => {
  const edge = (errorRate: number, intensity: number) => {
    const c = makeConn('a', 'b');
    c.traffic = { requestsPerSecond: 0, latency: 0, errorRate, intensity };
    return c;
  };

  it('is red when the error rate is high', () => {
    expect(connectionColor(edge(20, 0), false)).toBe('#dc2626');
  });

  it('is amber when busy (high intensity, low errors)', () => {
    expect(connectionColor(edge(0, 0.9), false)).toBe('#eab308');
  });

  it('falls back to a theme-aware idle color', () => {
    expect(connectionColor(edge(0, 0), true)).toBe('#64748b');
    expect(connectionColor(edge(0, 0), false)).toBe('#111827');
  });
});

describe('formatLatency', () => {
  it('renders sub-second values in milliseconds', () => {
    expect(formatLatency(0)).toBe('0ms');
    expect(formatLatency(999)).toBe('999ms');
  });

  it('renders seconds, dropping the decimal when whole', () => {
    expect(formatLatency(1000)).toBe('1s');
    expect(formatLatency(1500)).toBe('1.5s');
  });

  it('renders minutes and seconds past a minute', () => {
    expect(formatLatency(60000)).toBe('1m');
    expect(formatLatency(90000)).toBe('1m 30s');
  });

  it('coerces null/undefined/negative to 0ms', () => {
    expect(formatLatency(null)).toBe('0ms');
    expect(formatLatency(undefined)).toBe('0ms');
    expect(formatLatency(-50)).toBe('0ms');
  });
});
