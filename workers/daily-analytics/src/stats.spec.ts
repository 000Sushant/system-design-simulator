import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getPublicStats, maybeRefreshStats, EMPTY_STATS } from './stats';
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
  const env = { DAILY_KV: kv, ...partial } as unknown as Env;
  return { env, kv };
}

const CONFIGURED = { GITHUB_TOKEN: 'gh', CF_API_TOKEN: 'cf', CF_ZONE_TAG: 'zone' };

let fetchSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // If any test triggers an external call, fail loudly rather than hit the network.
  fetchSpy = vi.fn(async () => {
    throw new Error('unexpected network call');
  });
  globalThis.fetch = fetchSpy as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getPublicStats', () => {
  it('returns the cached stats when present, without any network call', async () => {
    const { env, kv } = makeEnv(CONFIGURED);
    const cached = { ...EMPTY_STATS, stars: 12, forks: 3, updatedAt: '2026-01-01T00:00:00.000Z' };
    kv.store.set('stats:public', JSON.stringify(cached));
    const result = await getPublicStats(env);
    expect(result).toEqual(cached);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns EMPTY_STATS when the cache is cold and no tokens are configured', async () => {
    const { env } = makeEnv({}); // unconfigured
    const result = await getPublicStats(env);
    expect(result).toEqual(EMPTY_STATS);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('maybeRefreshStats', () => {
  it('is a no-op when the required secrets are not configured', async () => {
    const { env, kv } = makeEnv({});
    await maybeRefreshStats(env);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(kv.store.get('stats:lastRun')).toBeUndefined();
  });

  it('is a no-op when the refresh interval has not elapsed', async () => {
    const { env, kv } = makeEnv(CONFIGURED);
    kv.store.set('stats:lastRun', String(Date.now())); // just ran
    await maybeRefreshStats(env);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
