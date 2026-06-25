/**
 * Production environment.
 *
 * Keep `apiBaseUrl` empty to serve the API from the same origin as the app.
 * Set it to a full origin (e.g. 'https://api.example.com') if the pricing
 * backend is deployed separately.
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
  /** Deployed Worker URL that serves /votes and /stats. */
  votesApiBase: 'https://aws-pricing-generator.sr-architect.workers.dev',
};
