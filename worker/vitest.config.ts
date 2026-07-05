import { defineConfig } from 'vitest/config';

/**
 * Unit tests for the worker's pure security/HTTP helpers (admin auth, CORS
 * allowlist, vote-delta clamping). These run in Node — they only need the Web
 * Crypto (crypto.subtle) and Fetch (Request/Response) globals, both available
 * in Node 18+. The cron/KV/D1 handlers are out of scope here.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    globals: false,
  },
});
