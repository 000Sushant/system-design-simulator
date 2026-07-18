
const REGION_PATTERN = /^[a-z0-9-]{1,32}$/;
const JSON_HEADERS = { 'Content-Type': 'application/json' };
const DEFAULT_REGION = 'us-east-1';

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const regionCode = (url.searchParams.get('region') || DEFAULT_REGION).trim().toLowerCase();

  if (!REGION_PATTERN.test(regionCode)) {
    return jsonResponse({ unsupportedRegion: true, regionCode, message: 'Invalid region code.' }, 400);
  }

  if (!context.env.AWS_PRICING_KV) {
    console.error("[prices] KV binding 'AWS_PRICING_KV' is not configured.");
    return jsonResponse({ error: 'Pricing service is temporarily unavailable.' }, 503);
  }

  try {
    const rawData = await context.env.AWS_PRICING_KV.get(`pricing:${regionCode}`);

    if (!rawData) {
      return jsonResponse(
        {
          unsupportedRegion: true,
          regionCode,
          message: `Pricing for region "${regionCode}" has not been generated yet. The Worker generates all regions weekly.`,
        },
        404,
      );
    }

    return new Response(rawData, { headers: { ...JSON_HEADERS, 'X-Cache': 'KV_PAGES_FUNCTION' } });
  } catch (err) {
    console.error(`[prices] KV read failed for ${regionCode}:`, err);
    return jsonResponse({ error: 'Failed to read pricing data.' }, 500);
  }
}
