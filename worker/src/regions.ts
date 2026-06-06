export interface Region {
  /** AWS region code, e.g. "us-east-1" */
  code: string;
  /** AWS Pricing API location name, e.g. "US East (N. Virginia)" */
  name: string;
}

/**
 * All 27 regions supported by this Worker.
 * The `name` field must match the "location" attribute value
 * returned by the AWS Pricing API exactly.
 */
export const REGIONS: Region[] = [
  { code: 'us-east-1',      name: 'US East (N. Virginia)' },
  { code: 'us-east-2',      name: 'US East (Ohio)' },
  { code: 'us-west-1',      name: 'US West (N. California)' },
  { code: 'us-west-2',      name: 'US West (Oregon)' },
  { code: 'ca-central-1',   name: 'Canada (Central)' },
  { code: 'eu-west-1',      name: 'EU (Ireland)' },
  { code: 'eu-west-2',      name: 'EU (London)' },
  { code: 'eu-west-3',      name: 'EU (Paris)' },
  { code: 'eu-central-1',   name: 'EU (Frankfurt)' },
  { code: 'eu-central-2',   name: 'Europe (Zurich)' },
  { code: 'eu-north-1',     name: 'EU (Stockholm)' },
  { code: 'eu-south-1',     name: 'EU (Milan)' },
  { code: 'eu-south-2',     name: 'Europe (Spain)' },
  { code: 'ap-east-1',      name: 'Asia Pacific (Hong Kong)' },
  { code: 'ap-south-1',     name: 'Asia Pacific (Mumbai)' },
  { code: 'ap-south-2',     name: 'Asia Pacific (Hyderabad)' },
  { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { code: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { code: 'ap-northeast-3', name: 'Asia Pacific (Osaka)' },
  { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { code: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { code: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)' },
  { code: 'ap-southeast-4', name: 'Asia Pacific (Melbourne)' },
  { code: 'me-south-1',     name: 'Middle East (Bahrain)' },
  { code: 'me-central-1',   name: 'Middle East (UAE)' },
  { code: 'sa-east-1',      name: 'South America (Sao Paulo)' },
  { code: 'af-south-1',     name: 'Africa (Cape Town)' },
];

/** 7 days in milliseconds — used to decide when a new weekly run should start */
export const WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

/** 30-minute cooldown after a failed region before retry */
export const FAILURE_COOLDOWN_MS = 30 * 60 * 1000;
