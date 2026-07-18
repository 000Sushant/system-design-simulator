import { describe, it, expect } from 'vitest';
import {
  requireAdmin,
  timingSafeEqual,
  allowedOrigins,
  corsHeaders,
  clampDelta,
  DEFAULT_ALLOWED_ORIGINS,
} from './security';
import { Env } from './types';

function env(partial: Partial<Env> = {}): Env {
  return partial as Env;
}

function req(headers: Record<string, string> = {}): Request {
  return new Request('https://worker.example/votes', { headers });
}

describe('requireAdmin', () => {
  it('denies by default (503) when ADMIN_TOKEN is not configured', async () => {
    const res = await requireAdmin(req({ Authorization: 'Bearer anything' }), env({}));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(503);
  });

  it('allows (returns null) when a correct Bearer token is supplied', async () => {
    const res = await requireAdmin(req({ Authorization: 'Bearer s3cret' }), env({ ADMIN_TOKEN: 's3cret' }));
    expect(res).toBeNull();
  });

  it('rejects (401) a missing Authorization header', async () => {
    const res = await requireAdmin(req({}), env({ ADMIN_TOKEN: 's3cret' }));
    expect(res!.status).toBe(401);
  });

  it('rejects (401) a wrong token', async () => {
    const res = await requireAdmin(req({ Authorization: 'Bearer wrong' }), env({ ADMIN_TOKEN: 's3cret' }));
    expect(res!.status).toBe(401);
  });

  it('rejects (401) a non-Bearer scheme', async () => {
    const res = await requireAdmin(req({ Authorization: 'Basic s3cret' }), env({ ADMIN_TOKEN: 's3cret' }));
    expect(res!.status).toBe(401);
  });

  it('rejects (401) a case-mismatched scheme (bearer)', async () => {
    const res = await requireAdmin(req({ Authorization: 'bearer s3cret' }), env({ ADMIN_TOKEN: 's3cret' }));
    expect(res!.status).toBe(401);
  });
});

describe('timingSafeEqual', () => {
  it('is true for equal strings', async () => {
    expect(await timingSafeEqual('abc123', 'abc123')).toBe(true);
  });

  it('is false for different strings of equal length', async () => {
    expect(await timingSafeEqual('abc123', 'abc124')).toBe(false);
  });

  it('is false for strings of different length', async () => {
    expect(await timingSafeEqual('short', 'longer-secret')).toBe(false);
  });

  it('is true for two empty strings', async () => {
    expect(await timingSafeEqual('', '')).toBe(true);
  });
});

describe('allowedOrigins', () => {
  it('returns the default allowlist when ALLOWED_ORIGINS is unset', () => {
    expect(allowedOrigins(env({}))).toEqual(DEFAULT_ALLOWED_ORIGINS);
  });

  it('parses a comma-separated list, trimming whitespace and dropping empties', () => {
    const result = allowedOrigins(env({ ALLOWED_ORIGINS: ' https://a.com , https://b.com ,, ' }));
    expect(result).toEqual(['https://a.com', 'https://b.com']);
  });
});

describe('corsHeaders', () => {
  const base = { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };

  it('reflects the Origin when it is on the allowlist', () => {
    const headers = corsHeaders(req({ Origin: 'http://localhost:4200' }), env({}));
    expect(headers['Access-Control-Allow-Origin']).toBe('http://localhost:4200');
    expect(headers).toMatchObject(base);
    expect(headers['Vary']).toBe('Origin');
  });

  it('omits the ACAO header when the Origin is not allowlisted', () => {
    const headers = corsHeaders(req({ Origin: 'https://evil.example' }), env({}));
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('omits the ACAO header when there is no Origin (non-browser caller)', () => {
    const headers = corsHeaders(req({}), env({}));
    expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('honours a custom ALLOWED_ORIGINS allowlist', () => {
    const headers = corsHeaders(req({ Origin: 'https://custom.app' }), env({ ALLOWED_ORIGINS: 'https://custom.app' }));
    expect(headers['Access-Control-Allow-Origin']).toBe('https://custom.app');
  });
});

describe('clampDelta', () => {
  it('passes through exactly 1 and -1', () => {
    expect(clampDelta(1)).toBe(1);
    expect(clampDelta(-1)).toBe(-1);
  });

  it('clamps any other number to 0', () => {
    expect(clampDelta(0)).toBe(0);
    expect(clampDelta(5)).toBe(0);
    expect(clampDelta(-3)).toBe(0);
    expect(clampDelta(0.5)).toBe(0);
  });

  it('clamps non-number inputs to 0', () => {
    expect(clampDelta('1')).toBe(0);
    expect(clampDelta(undefined)).toBe(0);
    expect(clampDelta(null)).toBe(0);
    expect(clampDelta({})).toBe(0);
  });
});
