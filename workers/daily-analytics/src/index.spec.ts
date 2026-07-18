import { describe, it, expect } from 'vitest';
import worker from './index';
import { Env } from './types';

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

function makeEnv(partial: Partial<Env> = {}): { env: Env; db: FakeD1 } {
  const db = new FakeD1();
  const env = { DB: db, ...partial } as unknown as Env;
  return { env, db };
}

const ctx = { waitUntil: () => undefined, passThroughOnException: () => undefined } as unknown as ExecutionContext;

function call(method: string, path: string, opts: { body?: unknown; headers?: Record<string, string> } = {}) {
  const { env, db } = makeEnv();
  const init: RequestInit = { method, headers: opts.headers };
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
  const request = new Request(`https://worker.example${path}`, init);
  return { promise: worker.fetch(request, env, ctx), db };
}

describe('worker fetch routing', () => {
  it('answers CORS preflight (OPTIONS) with 204', async () => {
    const { promise } = call('OPTIONS', '/votes', { headers: { Origin: 'http://localhost:4200' } });
    const res = await promise;
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:4200');
  });

  it('serves a health check on an unknown route listing the vote endpoints', async () => {
    const res = await (await call('GET', '/')).promise;
    expect(res.status).toBe(200);
    const body = await res.json() as { routes: string[] };
    expect(body.routes).toContain('GET  /votes');
    expect(body.routes).toContain('POST /votes');
  });
});

describe('GET /votes', () => {
  it('returns the tally keyed by challenge id', async () => {
    const { env, db } = makeEnv();
    db.allResults = [
      { challenge_id: 'url-shortener', up: 4, down: 1 },
      { challenge_id: 'chat-app', up: 2, down: 0 },
    ];
    const res = await worker.fetch(new Request('https://worker.example/votes'), env, ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      'url-shortener': { up: 4, down: 1 },
      'chat-app': { up: 2, down: 0 },
    });
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
