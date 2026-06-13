export async function onRequest(context) {
  const url = new URL(context.request.url);
  const regionCode = (url.searchParams.get('region') || 'us-east-1').trim().toLowerCase();

  // 1. Fetch the pricing file from the KV namespace binding
  // Note: Pages Functions bind the KV database to context.env.<BINDING_NAME>
  const kvKey = `pricing:${regionCode}`;
  
  if (!context.env.AWS_PRICING_KV) {
    return new Response(JSON.stringify({ 
      error: "Cloudflare KV binding 'AWS_PRICING_KV' is not configured in your Pages settings." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const rawData = await context.env.AWS_PRICING_KV.get(kvKey);

    if (!rawData) {
      return new Response(JSON.stringify({ 
        unsupportedRegion: true, 
        regionCode,
        message: `Pricing for region "${regionCode}" has not been generated yet. The Worker generates all regions weekly.`
      }), {
        status: 404,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Return the pricing JSON content to the frontend
    return new Response(rawData, {
      headers: { 
        "Content-Type": "application/json",
        "X-Cache": "KV_PAGES_FUNCTION",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
