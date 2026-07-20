/** Development environment. `apiBaseUrl` is empty so requests stay relative and are forwarded by the Angular dev-server proxy (see proxy.conf.json). */
export const environment = {
  production: false,
  apiBaseUrl: '',
  /** Base URL of the Cloudflare Worker that stores challenge votes in D1; empty disables votes. */
  votesApiBase: 'http://localhost:4200',
  /** Base URL of the daily-analytics Worker serving /stats (landing-page live stats) and /fx (USD exchange rates); empty disables both. */
  dailyApiBase: 'http://localhost:4200',
};
