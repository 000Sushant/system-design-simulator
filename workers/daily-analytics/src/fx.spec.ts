import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { refreshFxRates, maybeRefreshFxRates, getFxRates } from './fx';
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

function makeEnv(): { env: Env; kv: FakeKV } {
  const kv = new FakeKV();
  const env = { DAILY_KV: kv } as unknown as Env;
  return { env, kv };
}

const GOOD_PAYLOAD = {
  base: 'USD',
  date: '2026-07-10',
  rates: { EUR: 0.93, GBP: 0.8, INR: 87.9, JPY: 151.2 },
};

let fetchSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchSpy = vi.fn(async () => new Response(JSON.stringify(GOOD_PAYLOAD)));
  globalThis.fetch = fetchSpy as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('refreshFxRates', () => {
  it('caches and returns the fetched rates', async () => {
    const { env, kv } = makeEnv();
    const fx = await refreshFxRates(env);
    expect(fx.rates).toEqual(GOOD_PAYLOAD.rates);
    expect(fx.base).toBe('USD');
    expect(fx.date).toBe('2026-07-10');
    expect(JSON.parse(kv.store.get('fx:rates')!).rates.INR).toBe(87.9);
    expect(kv.store.get('fx:lastRun')).toBeDefined();
  });

  it('rejects a payload with a missing or invalid rate and leaves the cache untouched', async () => {
    const { env, kv } = makeEnv();
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ ...GOOD_PAYLOAD, rates: { EUR: 0.93, GBP: 0.8, INR: -1, JPY: 151.2 } })),
    );
    await expect(refreshFxRates(env)).rejects.toThrow(/INR/);
    expect(kv.store.has('fx:rates')).toBe(false);
  });

  it('throws on an HTTP error', async () => {
    const { env } = makeEnv();
    fetchSpy.mockResolvedValueOnce(new Response('down', { status: 502 }));
    await expect(refreshFxRates(env)).rejects.toThrow(/502/);
  });
});

describe('maybeRefreshFxRates', () => {
  it('is a no-op when the refresh interval has not elapsed', async () => {
    const { env, kv } = makeEnv();
    kv.store.set('fx:lastRun', String(Date.now())); // just ran
    await maybeRefreshFxRates(env);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('refreshes when the cache is stale and never throws on failure', async () => {
    const { env, kv } = makeEnv();
    kv.store.set('fx:lastRun', String(Date.now() - 24 * 60 * 60 * 1000));
    fetchSpy.mockResolvedValueOnce(new Response('down', { status: 500 }));
    await expect(maybeRefreshFxRates(env)).resolves.toBeUndefined();
  });
});

describe('getFxRates', () => {
  it('serves the cached rates without a network call', async () => {
    const { env, kv } = makeEnv();
    kv.store.set('fx:rates', JSON.stringify({ base: 'USD', rates: { INR: 88 } }));
    const fx = await getFxRates(env);
    expect(fx?.rates.INR).toBe(88);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('refreshes on a cold cache, and returns null when that fails', async () => {
    const { env } = makeEnv();
    const fx = await getFxRates(env);
    expect(fx?.rates.EUR).toBe(0.93);

    const cold = makeEnv();
    fetchSpy.mockResolvedValueOnce(new Response('down', { status: 500 }));
    expect(await getFxRates(cold.env)).toBeNull();
  });
});
