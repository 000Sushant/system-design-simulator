import { describe, it, expect } from 'vitest';
import worker from './index';
import { Env } from './types';

// ─── Minimal fakes for the Cloudflare bindings the fetch handler touches ──────

class FakeKV {
  store = new Map<string, string>();
  async get(key: string): Promise<string | null> {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  async put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
}

class FakeStatement {
  constructor(private readonly db: FakeD1) {}
  bind(): this {
    return this;
  }
  async run(): Promise<{ success: boolean }> {
    this.db.runCount++;
    return { success: true };
  }
  async first<T>(): Promise<T | null> {
    return this.db.firstResult as T | null;
  }
  async all<T>(): Promise<{ results: T[] }> {
    return { results: this.db.allResults as T[] };
  }
}

class FakeD1 {
  runCount = 0;
  firstResult: unknown = null;
  allResults: unknown[] = [];
  prepare(): FakeStatement {
    return new FakeStatement(this);
  }
}

function makeEnv(partial: Partial<Env> = {}): { env: Env; kv: FakeKV; db: FakeD1 } {
  const kv = new FakeKV();
  const db = new FakeD1();
  const env = { AWS_PRICING_KV: kv, DB: db, ...partial } as unknown as Env;
  return { env, kv, db };
}

const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined } as unknown as ExecutionContext;

function call(method: string, path: string, opts: { body?: unknown; headers?: Record<string, string> } = {}, envParts: Partial<Env> = {}) {
  const { env, kv, db } = makeEnv(envParts);
  const init: RequestInit = { method, headers: opts.headers };
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
  const request = new Request(`https://worker.example${path}`, init);
  return { promise: worker.fetch(request, env, ctx), kv, db, env };
}

describe('worker fetch routing', () => {
  it('answers CORS preflight (OPTIONS) with 204', async () => {
    const { promise } = call('OPTIONS', '/votes', { headers: { Origin: 'http://localhost:4200' } });
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

describe('POST /votes validation', () => {
  it('rejects invalid JSON with 400', async () => {
    const { env } = makeEnv();
    const request = new Request('https://worker.example/votes', { method: 'POST', body: '{bad json' });
    const res = await worker.fetch(request, env, ctx);
    expect(res.status).toBe(400);
    expect((await res.json() as { error: string }).error).toMatch(/invalid json/i);
  });

  it('rejects a challengeId that fails the [a-z0-9-]{1,64} pattern', async () => {
    const res = await (await call('POST', '/votes', { body: { challengeId: 'Bad_ID!', upDelta: 1 } })).promise;
    expect(res.status).toBe(400);
    expect((await res.json() as { error: string }).error).toMatch(/invalid challengeid/i);
  });

  it('rejects an empty vote (both deltas clamp to 0) with 400', async () => {
    const res = await (await call('POST', '/votes', { body: { challengeId: 'valid-id', upDelta: 5, downDelta: 2 } })).promise;
    expect(res.status).toBe(400);
    expect((await res.json() as { error: string }).error).toMatch(/empty vote/i);
  });

  it('applies a valid vote and returns the updated tally', async () => {
    const { promise, db } = call('POST', '/votes', { body: { challengeId: 'valid-id', upDelta: 1 } });
    db.firstResult = { up: 3, down: 1 };
    const res = await promise;
    expect(res.status).toBe(200);
    const body = await res.json() as { challengeId: string; up: number; down: number };
    expect(body).toEqual({ challengeId: 'valid-id', up: 3, down: 1 });
    expect(db.runCount).toBe(1);
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
