import { describe, it, expect, vi } from 'vitest';
import { onRequest } from './prices.js';

function fakeKv(entries = {}, throwOnGet = false) {
  const store = new Map(Object.entries(entries));
  return {
    async get(key) {
      if (throwOnGet) throw new Error('internal KV detail that must not leak');
      return store.has(key) ? store.get(key) : null;
    },
  };
}

function context(region, env = {}) {
  const base = 'https://app.example/api/prices';
  const url = region === undefined ? base : `${base}?region=${region}`;
  return { request: new Request(url), env };
}

describe('prices Pages function', () => {
  it('rejects a region code that fails the [a-z0-9-]{1,32} pattern (400)', async () => {
    const res = await onRequest(context('invalid_region', { AWS_PRICING_KV: fakeKv() }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.unsupportedRegion).toBe(true);
    expect(body.message).toMatch(/invalid region/i);
  });

  it('rejects an over-long region code (400)', async () => {
    const res = await onRequest(context('a'.repeat(33), { AWS_PRICING_KV: fakeKv() }));
    expect(res.status).toBe(400);
  });

  it('normalizes case before lookup and serves a matching cached file (200)', async () => {
    const env = { AWS_PRICING_KV: fakeKv({ 'pricing:us-east-1': '{"regionCode":"us-east-1"}' }) };
    const res = await onRequest(context('US-EAST-1', env));
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Cache')).toBe('KV_PAGES_FUNCTION');
  });

  it('defaults to us-east-1 when no region is supplied', async () => {
    const env = { AWS_PRICING_KV: fakeKv() };
    const res = await onRequest(context(undefined, env));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.regionCode).toBe('us-east-1');
  });

  it('returns 503 with a generic message when the KV binding is missing', async () => {
    const res = await onRequest(context('us-east-1', {}));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/temporarily unavailable/i);
  });

  it('returns 404 unsupportedRegion when the region is not in KV', async () => {
    const res = await onRequest(context('ap-south-1', { AWS_PRICING_KV: fakeKv() }));
    expect(res.status).toBe(404);
    expect((await res.json()).unsupportedRegion).toBe(true);
  });

  it('returns a generic 500 on KV failure without leaking error details', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = await onRequest(context('us-east-1', { AWS_PRICING_KV: fakeKv({}, true) }));
    errSpy.mockRestore();
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toMatch(/failed to read pricing data/i);
    expect(text).not.toMatch(/internal KV detail/);
  });
});
