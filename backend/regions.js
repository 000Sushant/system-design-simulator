/**
 * Region allowlist shared by the backend routes.
 *
 * Mirrors the regions the UI offers (frontend CostService.regions) and the
 * Worker generates (worker/src/regions.ts). Used to reject unknown/garbage
 * region codes before they reach the KV lookup.
 */
const SUPPORTED_REGIONS = new Set([
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ca-central-1',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1', 'eu-central-2',
  'eu-north-1', 'eu-south-1', 'eu-south-2',
  'ap-east-1', 'ap-south-1', 'ap-south-2',
  'ap-northeast-1', 'ap-northeast-2', 'ap-northeast-3',
  'ap-southeast-1', 'ap-southeast-2', 'ap-southeast-3', 'ap-southeast-4',
  'me-south-1', 'me-central-1', 'sa-east-1', 'af-south-1',
]);

module.exports = { SUPPORTED_REGIONS };
