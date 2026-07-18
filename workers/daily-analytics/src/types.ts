export interface Env {
  DAILY_KV: KVNamespace;
  ALLOWED_ORIGINS?: string;
  GITHUB_TOKEN?: string;
  CF_API_TOKEN?: string;
  CF_ZONE_TAG?: string;
}
