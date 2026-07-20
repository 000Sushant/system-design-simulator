import { Env } from './types';


export const FX_SYMBOLS = ['EUR', 'GBP', 'INR', 'JPY'] as const;

const FRANKFURTER_URL = `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${FX_SYMBOLS.join(',')}`;

const KEY_RATES = 'fx:rates';
const KEY_LASTRUN = 'fx:lastRun';

const REFRESH_INTERVAL_MS = 20 * 60 * 60 * 1000;

export interface FxRates {
  base: 'USD';
  rates: Record<string, number>;
  date: string;
  updatedAt: string;
  source: 'frankfurter';
}

export async function refreshFxRates(env: Env): Promise<FxRates> {
  const res = await fetch(FRANKFURTER_URL);
  if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
  const data = (await res.json()) as { base?: string; date?: string; rates?: Record<string, number> };

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
