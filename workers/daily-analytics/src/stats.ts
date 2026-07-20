import { Env } from './types';


const GH_OWNER = '000Sushant';
const GH_REPO = 'system-design-simulator';
const GH_API = 'https://api.github.com';
const CF_GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql';

const KEY_PUBLIC = 'stats:public';
const KEY_CLONES = 'stats:clones';
const KEY_VISITORS = 'stats:visitors';
const KEY_COUNTRIES = 'stats:countries';
const KEY_LASTRUN = 'stats:lastRun';

const REFRESH_INTERVAL_MS = 20 * 60 * 60 * 1000;
const LOOKBACK_DAYS = 30;

export interface PublicStats {
  stars: number;
  forks: number;
  clones: number;
  visitors: number;
  countries: number;
  topCountries: { code: string; requests: number }[];
  updatedAt: string | null;
}

export const EMPTY_STATS: PublicStats = {
  stars: 0, forks: 0, clones: 0, visitors: 0, countries: 0, topCountries: [], updatedAt: null,
};

interface DayMap { byDay: Record<string, number>; }

async function readDayMap(env: Env, key: string): Promise<DayMap> {
  const raw = await env.DAILY_KV.get(key);
  return raw ? (JSON.parse(raw) as DayMap) : { byDay: {} };
}

function sumDays(m: DayMap): number {
  return Object.values(m.byDay).reduce((a, b) => a + (b || 0), 0);
}

function ghHeaders(env: Env): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sr-architect-stats',
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}


async function fetchRepoMeta(env: Env): Promise<{ stars: number; forks: number }> {
  const res = await fetch(`${GH_API}/repos/${GH_OWNER}/${GH_REPO}`, { headers: ghHeaders(env) });
  if (!res.ok) throw new Error(`GitHub repo meta ${res.status}`);
  const data = (await res.json()) as any;
  return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
}

async function fetchClonesDays(env: Env): Promise<Record<string, number>> {
  const res = await fetch(`${GH_API}/repos/${GH_OWNER}/${GH_REPO}/traffic/clones`, {
    headers: ghHeaders(env),
  });
  if (!res.ok) throw new Error(`GitHub clones ${res.status}`);
  const data = (await res.json()) as any;
  const days: Record<string, number> = {};
  for (const d of data.clones ?? []) {
    days[String(d.timestamp).slice(0, 10)] = d.count ?? 0;
  }
  return days;
}


interface CfResult {
  days: Record<string, number>;
  windowCountries: Record<string, number>;
}

async function fetchCloudflare(env: Env): Promise<CfResult> {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000).toISOString().slice(0, 10);
  const query = `
    query Stats($zoneTag: String!, $since: String!) {
      viewer {
        zones(filter: { zoneTag: $zoneTag }) {
          httpRequests1dGroups(limit: 60, filter: { date_geq: $since }, orderBy: [date_ASC]) {
            dimensions { date }
            uniq { uniques }
            sum { countryMap { clientCountryName requests } }
          }
        }
      }
    }`;
  const res = await fetch(CF_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { zoneTag: env.CF_ZONE_TAG, since } }),
  });
  if (!res.ok) throw new Error(`Cloudflare GraphQL ${res.status}`);
  const data = (await res.json()) as any;
  if (data.errors?.length) throw new Error(`Cloudflare GraphQL: ${JSON.stringify(data.errors)}`);

  const groups = data.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
  const days: Record<string, number> = {};
  const windowCountries: Record<string, number> = {};
  for (const g of groups) {
    days[g.dimensions.date] = g.uniq?.uniques ?? 0;
    for (const c of g.sum?.countryMap ?? []) {
      const code = c.clientCountryName;
      if (!code || code === 'XX') continue;
      windowCountries[code] = (windowCountries[code] ?? 0) + (c.requests ?? 0);
    }
  }
  return { days, windowCountries };
}


function isConfigured(env: Env): boolean {
  return Boolean(env.GITHUB_TOKEN && env.CF_API_TOKEN && env.CF_ZONE_TAG);
}

export async function refreshStats(env: Env): Promise<PublicStats> {
  const [meta, cloneDays, cf] = await Promise.all([
    fetchRepoMeta(env),
    fetchClonesDays(env),
    fetchCloudflare(env),
  ]);

  const clones = await readDayMap(env, KEY_CLONES);
  for (const [date, count] of Object.entries(cloneDays)) clones.byDay[date] = count;
  await env.DAILY_KV.put(KEY_CLONES, JSON.stringify(clones));

  const visitors = await readDayMap(env, KEY_VISITORS);
  for (const [date, count] of Object.entries(cf.days)) visitors.byDay[date] = count;
  await env.DAILY_KV.put(KEY_VISITORS, JSON.stringify(visitors));

  const rawCountries = await env.DAILY_KV.get(KEY_COUNTRIES);
  const known = new Set<string>(rawCountries ? (JSON.parse(rawCountries) as string[]) : []);
  for (const code of Object.keys(cf.windowCountries)) known.add(code);
  await env.DAILY_KV.put(KEY_COUNTRIES, JSON.stringify([...known]));

  const topCountries = Object.entries(cf.windowCountries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, requests]) => ({ code, requests }));

  const stats: PublicStats = {
    stars: meta.stars,
    forks: meta.forks,
    clones: sumDays(clones),
    visitors: sumDays(visitors),
    countries: known.size,
    topCountries,
    updatedAt: new Date().toISOString(),
  };

  await env.DAILY_KV.put(KEY_PUBLIC, JSON.stringify(stats));
  await env.DAILY_KV.put(KEY_LASTRUN, String(Date.now()));
  return stats;
}

export async function maybeRefreshStats(env: Env): Promise<void> {
  if (!isConfigured(env)) return;
  const last = Number(await env.DAILY_KV.get(KEY_LASTRUN)) || 0;
  if (Date.now() - last < REFRESH_INTERVAL_MS) return;
  try {
    await refreshStats(env);
    console.log('[stats] refreshed');
  } catch (err) {
    console.error('[stats] refresh failed:', err);
  }
}

export async function getPublicStats(env: Env): Promise<PublicStats> {
  const raw = await env.DAILY_KV.get(KEY_PUBLIC);
  if (raw) return JSON.parse(raw) as PublicStats;
  if (isConfigured(env)) {
    try {
      return await refreshStats(env);
    } catch (err) {
      console.error('[stats] cold refresh failed:', err);
    }
  }
  return EMPTY_STATS;
}
