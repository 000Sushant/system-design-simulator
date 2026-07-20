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
    return await context.next();
  }

  const pathParts = url.pathname.split('/').filter(Boolean);

  if (pathParts.length > 1) {
    const slug = pathParts[1].toLowerCase();
    return Response.redirect(`${url.origin}/docs?service=${slug}`, 307);
  }

  return Response.redirect(`${url.origin}/docs`, 307);
}
