
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { SUPPORTED_REGIONS } = require('./regions');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '';
const CF_KV_NAMESPACE_ID = process.env.CF_KV_NAMESPACE_ID || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';

function isKVConfigured() {
  return !!(
    CF_ACCOUNT_ID && !CF_ACCOUNT_ID.startsWith('REPLACE_') &&
    CF_KV_NAMESPACE_ID && !CF_KV_NAMESPACE_ID.startsWith('REPLACE_') &&
    CF_API_TOKEN && !CF_API_TOKEN.startsWith('REPLACE_')
  );
}

const CF_KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values`;

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
}));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const memCache = new Map();
const MEM_CACHE_TTL_MS = 60 * 60 * 1000;


async function getPricingFromKV(regionCode) {
  const cached = memCache.get(regionCode);
  if (cached && (Date.now() - cached.cachedAt) < MEM_CACHE_TTL_MS) {
    console.log(`[server] 🟢 Memory cache HIT for: ${regionCode}`);
    return cached.data;
  }

  if (!isKVConfigured()) {
    console.warn('[server] ⚠️  Cloudflare KV credentials not configured or placeholder in .env.');
    return null;
  }

  const kvKey = `pricing:${regionCode}`;
  const url = `${CF_KV_BASE}/${encodeURIComponent(kvKey)}`;

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

    memCache.set(regionCode, { data, cachedAt: Date.now() });
    console.log(`[server] ✅ Showing pricing for region: ${regionCode} (source: Cloudflare KV)`);
    return data;

  } catch (err) {
    console.error(`[server] ❌ Network error fetching from KV for ${regionCode}:`, err.message);
    return null;
  }
}


app.get('/api/prices', async (req, res) => {
  const regionCode = (req.query.region || 'us-east-1').trim().toLowerCase();

  if (!SUPPORTED_REGIONS.has(regionCode)) {
    return res.status(404).json({
      unsupportedRegion: true,
      regionCode,
      message: `Region "${regionCode}" is not a recognized AWS region code.`,
    });
  }

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

  const data = await getPricingFromKV(regionCode);

  if (data === null) {
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

app.get('/api/status', (_req, res) => {
  res.json({
    cachedRegions: [...memCache.keys()],
    kvConfigured: isKVConfigured(),
  });
});


app.listen(PORT, () => {
  console.log(`[server] 🚀 Pricing backend listening on port ${PORT}`);
  console.log(`[server] KV configured: ${isKVConfigured()}`);
});
