import { describe, it, expect } from 'vitest';
import worker from './index';
import { Env } from './types';


class FakeKV {
  store = new Map<string, string>();
  async get(key: string): Promise<string | null> {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

function makeEnv(partial: Partial<Env> = {}): { env: Env; kv: FakeKV } {
  const kv = new FakeKV();
  const env = { AWS_PRICING_KV: kv, ...partial } as unknown as Env;
  return { env, kv };
}

const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined } as unknown as ExecutionContext;

function call(method: string, path: string, opts: { body?: unknown; headers?: Record<string, string> } = {}, envParts: Partial<Env> = {}) {
  const { env, kv } = makeEnv(envParts);
  const init: RequestInit = { method, headers: opts.headers };
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
  const request = new Request(`https://worker.example${path}`, init);
  return { promise: worker.fetch(request, env, ctx), kv, env };
}

describe('worker fetch routing', () => {
  it('answers CORS preflight (OPTIONS) with 204', async () => {
    const { promise } = call('OPTIONS', '/status', { headers: { Origin: 'http://localhost:4200' } });
    const res = await promise;
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:4200');
  });

  it('serves a health check on an unknown route, advertising only public endpoints', async () => {
    const res = await (await call('GET', '/')).promise;
    expect(res.status).toBe(200);
    const body = await res.json() as { routes: string[] };
    expect(body.routes.some((r) => r.includes('/trigger'))).toBe(false);
    expect(body.routes).toContain('GET  /status');
  });

  it('reports status derived from KV progress', async () => {
    const res = await (await call('GET', '/status')).promise;
    const body = await res.json() as { status: string; totalRegions: number };
    expect(body.status).toBe('idle');
    expect(body.totalRegions).toBeGreaterThan(0);
  });
});

describe('admin route protection (integration)', () => {
  it('POST /trigger is 503 when ADMIN_TOKEN is unset', async () => {
    const res = await (await call('POST', '/trigger')).promise;
    expect(res.status).toBe(503);
  });

  it('POST /reset is 401 with a wrong token', async () => {
    const res = await (await call('POST', '/reset', { headers: { Authorization: 'Bearer nope' } }, { ADMIN_TOKEN: 'right' })).promise;
    expect(res.status).toBe(401);
  });
});

describe('GET /pricing/{region}', () => {
  it('returns 404 with unsupportedRegion when the region is not in KV', async () => {
    const res = await (await call('GET', '/pricing/us-east-1')).promise;
    expect(res.status).toBe(404);
    expect((await res.json() as { unsupportedRegion: boolean }).unsupportedRegion).toBe(true);
  });

  it('serves the cached pricing file from KV when present', async () => {
    const { env, kv } = makeEnv();
    kv.store.set('pricing:us-east-1', JSON.stringify({ regionCode: 'us-east-1' }));
    const request = new Request('https://worker.example/pricing/us-east-1', { method: 'GET' });
    const res = await worker.fetch(request, env, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Cache')).toBe('KV');
  });

  it('does not match an invalid region code (falls through to health check)', async () => {
    const res = await (await call('GET', '/pricing/BAD_REGION!')).promise;
    expect(res.status).toBe(200);
    expect((await res.json() as { name?: string }).name).toContain('Pricing Generator');
  });
});
