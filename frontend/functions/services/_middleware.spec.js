import { describe, it, expect } from 'vitest';
import { onRequest } from './_middleware.js';

function context(url, userAgent, nextMock = async () => new Response('Static Content')) {
  return {
    request: new Request(url, {
      headers: { 'user-agent': userAgent || '' }
    }),
    next: nextMock
  };
}

describe('services _middleware', () => {
  it('allows crawler bots to access the static SEO pages directly', async () => {
    const url = 'https://app.example/services/dynamodb/';
    const botUserAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
    
    let nextCalled = false;
    const ctx = context(url, botUserAgent, async () => {
      nextCalled = true;
      return new Response('Static Page');
    });

    const res = await onRequest(ctx);
    expect(nextCalled).toBe(true);
    expect(await res.text()).toBe('Static Page');
  });

  it('redirects human users to the dynamic documentation page', async () => {
    const url = 'https://app.example/services/dynamodb/';
    const humanUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    const ctx = context(url, humanUserAgent);
    const res = await onRequest(ctx);

    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toBe('https://app.example/docs?service=dynamodb');
  });

  it('redirects human users visiting the hub page to general docs', async () => {
    const url = 'https://app.example/services/';
    const humanUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    const ctx = context(url, humanUserAgent);
    const res = await onRequest(ctx);

    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toBe('https://app.example/docs');
  });
});
