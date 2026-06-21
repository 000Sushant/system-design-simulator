/**
 * Pricing Backend — Static KV Reader
 *
 * Serves pre-generated regional pricing JSON files from Cloudflare KV.
 * Does NOT call AWS Pricing API or AWS SDK at runtime.
 *
 * Cloudflare KV is populated weekly by the Cloudflare Worker in /worker.
 * See /worker/src/index.ts for details.
 */

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const dotenv  = require('dotenv');
const fs      = require('fs');
const path    = require('path');
const { SUPPORTED_REGIONS } = require('./regions');

// ── Load credentials from .dev.vars (local dev only) ────────────────────────
const devVarsPath = path.join(__dirname, '.dev.vars');
if (fs.existsSync(devVarsPath)) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync(devVarsPath));
    for (const k in envConfig) process.env[k] = envConfig[k];
    console.log('[server] Loaded local credentials from .dev.vars');
  } catch (e) {
    console.error('[server] Failed to parse .dev.vars:', e);
  }
} else {
  dotenv.config();
}

// ── Config ───────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// Cloudflare KV REST API credentials
const CF_ACCOUNT_ID      = process.env.CF_ACCOUNT_ID      || '';
const CF_KV_NAMESPACE_ID = process.env.CF_KV_NAMESPACE_ID || '';
const CF_API_TOKEN       = process.env.CF_API_TOKEN        || '';

function isKVConfigured() {
  return !!(
    CF_ACCOUNT_ID && !CF_ACCOUNT_ID.startsWith('REPLACE_') &&
    CF_KV_NAMESPACE_ID && !CF_KV_NAMESPACE_ID.startsWith('REPLACE_') &&
    CF_API_TOKEN && !CF_API_TOKEN.startsWith('REPLACE_')
  );
}

const CF_KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values`;

// Comma-separated list of origins allowed to call this API.
// Defaults to the local Angular dev server when unset.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow same-origin / non-browser callers (no Origin header).
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
}));
app.use(express.json());

// ── In-memory cache (session-scoped, avoids repeated KV reads) ───────────────
/** @type {Map<string, {data: object, cachedAt: number}>} */
const memCache = new Map();
const MEM_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── KV read helper ────────────────────────────────────────────────────────────

/**
 * Fetches a regional pricing file from Cloudflare KV.
 * Returns null if the region key does not exist in KV.
 * @param {string} regionCode
 * @returns {Promise<object|null>}
 */
async function getPricingFromKV(regionCode) {
  // 1. Check in-memory cache
  const cached = memCache.get(regionCode);
  if (cached && (Date.now() - cached.cachedAt) < MEM_CACHE_TTL_MS) {
    console.log(`[server] 🟢 Memory cache HIT for: ${regionCode}`);
    return cached.data;
  }

  // 2. Validate CF credentials are configured
  if (!isKVConfigured()) {
    console.warn('[server] ⚠️  Cloudflare KV credentials not configured or placeholder in .dev.vars.');
    return null;
  }

  // 3. Fetch from Cloudflare KV REST API
  const kvKey = `pricing:${regionCode}`;
  const url   = `${CF_KV_BASE}/${encodeURIComponent(kvKey)}`;

  console.log(`[server] 🔵 Fetching from Cloudflare KV: ${kvKey}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      console.warn(`[server] ⚠️  Region not found in KV: ${regionCode} — this region has not been generated yet.`);
      return null;
    }

    if (!response.ok) {
      console.error(`[server] ❌ KV API error ${response.status} for ${regionCode}:`, await response.text());
      return null;
    }

    const data = await response.json();

    // 4. Store in memory cache
    memCache.set(regionCode, { data, cachedAt: Date.now() });
    console.log(`[server] ✅ Showing pricing for region: ${regionCode} (source: Cloudflare KV)`);
    return data;

  } catch (err) {
    console.error(`[server] ❌ Network error fetching from KV for ${regionCode}:`, err.message);
    return null;
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/prices?region={regionCode}
 *
 * Returns pre-generated pricing data for the requested region.
 * - 200: pricing JSON from KV
 * - 404: { unsupportedRegion: true, regionCode } if not yet generated
 * - 503: if KV credentials are misconfigured
 */
app.get('/api/prices', async (req, res) => {
  const regionCode = (req.query.region || 'us-east-1').trim().toLowerCase();

  // 0. Reject unknown region codes before any KV / filesystem lookup.
  if (!SUPPORTED_REGIONS.has(regionCode)) {
    return res.status(404).json({
      unsupportedRegion: true,
      regionCode,
      message: `Region "${regionCode}" is not a recognized AWS region code.`,
    });
  }

  // 1. If it's us-east-1, serve the local us-east-1.json file directly from frontend src folder to avoid duplicates
  if (regionCode === 'us-east-1') {
    const localFilePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'core', 'data', 'regions', 'us-east-1.json');
    if (fs.existsSync(localFilePath)) {
      try {
        const rawData = fs.readFileSync(localFilePath, 'utf8');
        const data = JSON.parse(rawData);
        res.setHeader('X-Cache', 'LOCAL_FILE');
        return res.json(data);
      } catch (err) {
        console.error('[server] ❌ Error reading local us-east-1.json file:', err.message);
      }
    }
  }

  // 2. Fetch from Cloudflare KV for other regions (or as fallback for us-east-1 if local file is missing)
  const data = await getPricingFromKV(regionCode);

  if (data === null) {
    // If KV is not configured, return 404 so frontend behaves gracefully
    if (!isKVConfigured()) {
      return res.status(404).json({
        unsupportedRegion: true,
        regionCode,
        message: `Cloudflare KV credentials not configured, and requested region is not us-east-1.`,
      });
    }

    return res.status(404).json({
      unsupportedRegion: true,
      regionCode,
      message: `Pricing for region "${regionCode}" has not been generated yet. The Worker generates all regions weekly.`,
    });
  }

  res.setHeader('X-Cache', 'KV');
  res.json(data);
});

/**
 * GET /api/status
 * Shows which regions are available in the in-memory cache (proxy indicator).
 */
app.get('/api/status', (_req, res) => {
  res.json({
    cachedRegions: [...memCache.keys()],
    kvConfigured:  isKVConfigured(),
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[server] 🚀 Pricing backend listening on port ${PORT}`);
  console.log(`[server] KV configured: ${isKVConfigured()}`);
});
