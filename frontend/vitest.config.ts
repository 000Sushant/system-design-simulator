import { defineConfig } from 'vitest/config';

/**
 * Vitest runs the deterministic engines and pure utilities in Node — no browser
 * required. UI/component tests (which need a DOM) are intentionally out of scope
 * here; this suite guards the business logic that the components delegate to.
 *
 * `functions/` holds the Cloudflare Pages Functions (plain ESM JS) that are
 * deployed alongside the app; their request-handling/security logic is tested here too.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'functions/**/*.spec.{js,ts}'],
    globals: false,
  },
});
