/**
 * Cloudflare Pages Middleware: Intercepts all requests under /services/*
 * - Serves static pre-rendered SEO pages for search engine crawlers/bots and link previews.
 * - Redirects human users to the dynamic, interactive Angular documentation app route.
 */
export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  const BOT_USER_AGENTS = [
    'googlebot',
    'bingbot',
    'yandex',
    'baiduspider',
    'duckduckgo',
    'slurp',
    'sogou',
    'exabot',
    'ia_archiver',
    'oai-searchbot',
    'chatgpt',
    'perplexity',
    'claudebot',
    'claude-search',
    'applebot',
    'twitterbot',
    'facebookexternalhit',
    'linkedinbot',
    'slackbot',
    'discordbot',
    'telegrambot',
    'lighthouse',
    'pagespeed'
  ];

  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

  if (isBot) {
    // Search engines, crawlers, and preview bots get the static HTML.
    return await context.next();
  }

  // Human users are redirected to the corresponding documentation page in the Angular SPA.
  const pathParts = url.pathname.split('/').filter(Boolean); // e.g., ["services", "dynamodb"]

  if (pathParts.length > 1) {
    const slug = pathParts[1].toLowerCase();
    return Response.redirect(`${url.origin}/docs?service=${slug}`, 307);
  }

  // Redirect /services itself to the general docs page
  return Response.redirect(`${url.origin}/docs`, 307);
}
