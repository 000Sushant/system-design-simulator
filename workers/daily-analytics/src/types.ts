export interface Env {
  /** Dedicated KV namespace for cached analytics and FX rates. */
  DAILY_KV: KVNamespace;
  /**
   * Comma-separated list of browser origins allowed to call the CORS endpoints
   * (/fx, /stats). Defaults to the production site + localhost when unset.
   */
  ALLOWED_ORIGINS?: string;
  // ── Live stats (optional; /stats serves zeros until these are set) ──────────
  /** GitHub PAT with repo (push) access — required for the traffic/clones API. */
  GITHUB_TOKEN?: string;
  /** Cloudflare API token with Analytics:Read on the zone. */
  CF_API_TOKEN?: string;
  /** Cloudflare zone tag (zone ID) for the deployed domain. */
  CF_ZONE_TAG?: string;
}
