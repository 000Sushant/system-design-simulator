import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildPricingFile, round } from './schema-builder';
import { PricingFetcher } from './fetcher';
import { Region } from './regions';

const region: Region = { code: 'us-east-1', name: 'US East (N. Virginia)' };

/** A fetcher whose every method resolves to `null` unless overridden. */
function fetcherReturning(overrides: Record<string, number> = {}): PricingFetcher {
  return new Proxy(
    {},
    {
      get: (_t, prop: string) => async () => (prop in overrides ? overrides[prop] : null),
    },
  ) as unknown as PricingFetcher;
}

describe('round', () => {
  it('rounds to the requested number of decimals', () => {
    expect(round(1.23456789, 2)).toBe(1.23);
    expect(round(0.1 + 0.2, 4)).toBe(0.3);
  });

  it('passes null through untouched', () => {
    expect(round(null)).toBeNull();
    expect(round(null, 2)).toBeNull();
  });
});

describe('buildPricingFile', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('leaves every baseline value untouched when all price fetches return null', async () => {
    const svc = await buildPricingFile(region, fetcherReturning());
    // Known baseline constants must survive a fully-failed fetch (no zeroing out).
    expect(svc.route53.zoneMonthly).toBe(0.5);
    expect(svc.route53.standardM).toBe(0.4);
    expect(svc.ec2.familyRatesLarge.t3).toBe(0.0832);
    expect(svc.elb.types.alb.hourly).toBe(0.0225);
  });

  it('applies and rounds a live override, and converts per-query to per-million', async () => {
    const svc = await buildPricingFile(
      region,
      fetcherReturning({ route53Zone: 0.75, route53Queries: 0.0000005 }),
    );
    expect(svc.route53.zoneMonthly).toBe(0.75);
    // 0.0000005 per query × 1,000,000 = 0.50 per million
    expect(svc.route53.standardM).toBe(0.5);
  });

  it('returns an independent object (does not mutate the shared baseline)', async () => {
    const a = await buildPricingFile(region, fetcherReturning({ route53Zone: 1.11 }));
    const b = await buildPricingFile(region, fetcherReturning());
    expect(a.route53.zoneMonthly).toBe(1.11);
    expect(b.route53.zoneMonthly).toBe(0.5); // unaffected by the first build's override
  });
});
