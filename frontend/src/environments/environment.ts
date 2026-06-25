/**
 * Development environment.
 *
 * `apiBaseUrl` is empty so requests stay relative (e.g. `/api/prices`) and are
 * forwarded by the Angular dev-server proxy (see proxy.conf.json). Override it
 * in environment.prod.ts when the API lives on a different origin.
 */
export const environment = {
  production: false,
  apiBaseUrl: '',
  /**
   * Base URL of the Cloudflare Worker that stores challenge votes in D1.
   * Local dev points at `wrangler dev` (default port 8787). Empty disables votes.
   */
  votesApiBase: 'http://localhost:4200',
};
