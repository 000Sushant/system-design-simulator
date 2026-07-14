import { defineConfig } from 'vitest/config';

/**
 * Unit tests for the daily worker's pure helpers (stats caching/gating, FX
 * refresh gating, CORS). These run in Node — they only need the Fetch globals
 * (Request/Response), available in Node 18+. Live KV/cron are out of scope.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    globals: false,
  },
});
