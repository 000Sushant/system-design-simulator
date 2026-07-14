import { Env } from './types';

// ──────────────────────────────────────────────────────────────────────────────
// USD exchange rates for the frontend's display-currency conversion.
//
// Source: Frankfurter (https://frankfurter.dev) — free, keyless API serving the
// European Central Bank's official daily reference rates. Rates change once per
// business day, so a daily refresh keeps them market-accurate. The frontend
// keeps hardcoded rates as a last-resort fallback, so /fx may serve 404 until
// the first cron run completes.
// ──────────────────────────────────────────────────────────────────────────────

/** Must stay in sync with the frontend's `Currency` type (USD is the base). */
export const FX_SYMBOLS = ['EUR', 'GBP', 'INR', 'JPY'] as const;

const FRANKFURTER_URL = `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${FX_SYMBOLS.join(',')}`;

// KV keys
const KEY_RATES = 'fx:rates';     // the cached FxRates JSON served to the frontend
const KEY_LASTRUN = 'fx:lastRun'; // unix ms of the last successful refresh

// Refresh at most this often. The cron fires daily; the gate makes manual or
// cold-start refreshes cheap no-ops when the cache is still fresh.
const REFRESH_INTERVAL_MS = 20 * 60 * 60 * 1000; // 20h

export interface FxRates {
  base: 'USD';
  /** Currency code → units per 1 USD, e.g. { INR: 87.9 }. */
  rates: Record<string, number>;
  /** ECB reference date the rates belong to, YYYY-MM-DD. */
  date: string;
  updatedAt: string;
  source: 'frankfurter';
}

/** Fetches fresh rates, caches them in KV and returns them. */
export async function refreshFxRates(env: Env): Promise<FxRates> {
  const res = await fetch(FRANKFURTER_URL);
  if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
  const data = (await res.json()) as { base?: string; date?: string; rates?: Record<string, number> };

  // Sanity-check the payload so a malformed response never overwrites a good cache.
  const rates: Record<string, number> = {};
  for (const symbol of FX_SYMBOLS) {
    const rate = data.rates?.[symbol];
    if (typeof rate !== 'number' || !isFinite(rate) || rate <= 0) {
      throw new Error(`Frankfurter payload missing a valid ${symbol} rate`);
    }
    rates[symbol] = rate;
  }

  const fx: FxRates = {
    base: 'USD',
    rates,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString(),
    source: 'frankfurter',
  };

  await env.DAILY_KV.put(KEY_RATES, JSON.stringify(fx));
  await env.DAILY_KV.put(KEY_LASTRUN, String(Date.now()));
  return fx;
}

/** Cron-friendly: refresh only if the interval has elapsed. Never throws. */
export async function maybeRefreshFxRates(env: Env): Promise<void> {
  const last = Number(await env.DAILY_KV.get(KEY_LASTRUN)) || 0;
  if (Date.now() - last < REFRESH_INTERVAL_MS) return;
  try {
    await refreshFxRates(env);
    console.log('[fx] refreshed');
  } catch (err) {
    console.error('[fx] refresh failed:', err);
  }
}

/** Reads the cached rates; refreshes on-demand if the cache is cold. */
export async function getFxRates(env: Env): Promise<FxRates | null> {
  const raw = await env.DAILY_KV.get(KEY_RATES);
  if (raw) return JSON.parse(raw) as FxRates;
  try {
    return await refreshFxRates(env);
  } catch (err) {
    console.error('[fx] cold refresh failed:', err);
    return null;
  }
}
