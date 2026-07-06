import { AwsClient } from 'aws4fetch';
import { BedrockTokenRates, RawPriceResult } from './types';

/** Milliseconds between consecutive AWS Pricing API calls. 200ms = 5 req/sec (well under 10/sec limit). */
const RATE_LIMIT_DELAY_MS = 200;

/** Extra wait after a ThrottlingException before retrying. */
const THROTTLE_BACKOFF_MS = 3000;

/** AWS Pricing API base URL (global endpoint, us-east-1 only). */
const PRICING_ENDPOINT = 'https://api.pricing.us-east-1.amazonaws.com/';

type Filter = { Type: 'TERM_MATCH'; Field: string; Value: string };

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extracts the single highest unit price from an AWS GetProducts result item.
 * Selects the maximum across all priceDimensions so free-tier tiers don't
 * mask the standard rate.
 */
export function extractMaxPrice(raw: string): number | null {
  try {
    return extractMaxPriceParsed(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Same as extractMaxPrice but for an already-parsed price list item. */
export function extractMaxPriceParsed(parsed: any): number | null {
  const onDemand = parsed?.terms?.OnDemand;
  if (!onDemand) return null;
  const offer: any = Object.values(onDemand)[0];
  const dimensions: Record<string, any> = offer?.priceDimensions ?? {};
  let max = -1;
  for (const dim of Object.values(dimensions)) {
    const v = parseFloat(dim?.pricePerUnit?.USD ?? '-1');
    if (v > max) max = v;
  }
  return max >= 0 ? max : null;
}

/**
 * Among all returned price list items, pick the one satisfying `predicate`,
 * then extract the max price. Strict: returns null when nothing matches, so
 * a wrong product is never priced silently (the baseline is used instead).
 */
export function extractMatchingPrice(
  result: RawPriceResult,
  predicate: (parsed: any) => boolean
): number | null {
  if (!result.PriceList?.length) return null;
  const match = result.PriceList.find(raw => {
    try { return predicate(JSON.parse(raw)); } catch { return false; }
  });
  return match === undefined ? null : extractMaxPrice(match);
}

// ─── Main fetcher class ─────────────────────────────────────────────────────

export class PricingFetcher {
  private aws: AwsClient;
  private callCount = 0;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.aws = new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: 'pricing',
      region: 'us-east-1',
    });
  }

  // ── Low-level query ──────────────────────────────────────────────────────

  private async query(
    serviceCode: string,
    filters: Filter[],
    predicate?: (parsed: any) => boolean,
    maxResults = 25
  ): Promise<number | null> {
    // Enforce rate limit before every call
    await sleep(RATE_LIMIT_DELAY_MS);
    this.callCount++;

    const body = JSON.stringify({ ServiceCode: serviceCode, Filters: filters, MaxResults: maxResults });

    const attempt = async (): Promise<number | null> => {
      const resp = await this.aws.fetch(PRICING_ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSPriceListService.GetProducts',
          'Content-Type': 'application/x-amz-json-1.1',
        },
        body,
      });

      if (resp.status === 429 || resp.status === 400) {
        // 429 = ThrottlingException; 400 can also be used for throttling
        const text = await resp.text();
        if (text.includes('ThrottlingException') || text.includes('Rate exceeded')) {
          console.warn(`[Fetcher] Throttled on call #${this.callCount} (${serviceCode}). Backing off ${THROTTLE_BACKOFF_MS}ms...`);
          await sleep(THROTTLE_BACKOFF_MS);
          return attempt(); // single retry
        }
        console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode}:`, text.slice(0, 200));
        return null;
      }

      if (!resp.ok) {
        console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode}`);
        return null;
      }

      const result: RawPriceResult = await resp.json();
      if (!result.PriceList?.length) return null;
      if (predicate) return extractMatchingPrice(result, predicate);
      return extractMaxPrice(result.PriceList[0]);
    };

    try {
      return await attempt();
    } catch (e: any) {
      console.warn(`[Fetcher] Network error for ${serviceCode}:`, e?.message ?? e);
      return null;
    }
  }

  /**
   * Fetches ALL price list items matching `filters`, following NextToken
   * pagination (100 items/page, capped at `maxPages` to bound subrequests).
   * Returns parsed items; a failed page ends pagination with what was
   * collected so far rather than discarding earlier pages.
   */
  private async queryBulk(
    serviceCode: string,
    filters: Filter[],
    maxPages = 8
  ): Promise<any[]> {
    const items: any[] = [];
    let nextToken: string | undefined;

    for (let page = 0; page < maxPages; page++) {
      await sleep(RATE_LIMIT_DELAY_MS);
      this.callCount++;

      const body = JSON.stringify({
        ServiceCode: serviceCode,
        Filters: filters,
        MaxResults: 100,
        ...(nextToken ? { NextToken: nextToken } : {}),
      });

      let result: RawPriceResult | null = null;
      try {
        const attempt = async (retried: boolean): Promise<RawPriceResult | null> => {
          const resp = await this.aws.fetch(PRICING_ENDPOINT, {
            method: 'POST',
            headers: {
              'X-Amz-Target': 'AWSPriceListService.GetProducts',
              'Content-Type': 'application/x-amz-json-1.1',
            },
            body,
          });
          if (resp.status === 429 || resp.status === 400) {
            const text = await resp.text();
            if (!retried && (text.includes('ThrottlingException') || text.includes('Rate exceeded'))) {
              console.warn(`[Fetcher] Throttled on bulk call #${this.callCount} (${serviceCode}). Backing off ${THROTTLE_BACKOFF_MS}ms...`);
              await sleep(THROTTLE_BACKOFF_MS);
              return attempt(true);
            }
            console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode} (bulk):`, text.slice(0, 200));
            return null;
          }
          if (!resp.ok) {
            console.warn(`[Fetcher] HTTP ${resp.status} for ${serviceCode} (bulk)`);
            return null;
          }
          return resp.json();
        };
        result = await attempt(false);
      } catch (e: any) {
        console.warn(`[Fetcher] Network error for ${serviceCode} (bulk):`, e?.message ?? e);
      }

      if (!result) break;
      for (const raw of result.PriceList ?? []) {
        try { items.push(JSON.parse(raw)); } catch { /* skip malformed item */ }
      }
      nextToken = result.NextToken;
      if (!nextToken) break;
    }
    return items;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Amazon Bedrock
  //
  // Two offer files cover Bedrock model pricing:
  //  - AmazonBedrock: 1P + openly-licensed models (Nova, Titan, Llama,
  //    Mistral, DeepSeek, ...) with rich attributes; token prices are $/1K.
  //  - AmazonBedrockFoundationModels: marketplace-listed models (modern
  //    Claude, Cohere, AI21, Writer, ...) identified only by `servicename`;
  //    token prices are $/1M.
  // ────────────────────────────────────────────────────────────────────────

  /**
   * Standard-tier on-demand TEXT token rates from the AmazonBedrock offer,
   * keyed by the `model` (or `titanModel`) attribute. Prices are $ per 1K
   * tokens. Excludes flex/priority/batch tiers and non-text modalities.
   */
  async bedrockOnDemand(regionName: string): Promise<BedrockTokenRates> {
    const IN_RE = /^(input tokens|text input tokens?)$/i;
    const OUT_RE = /^(output tokens|text output tokens?)$/i;

    const items = await this.queryBulk('AmazonBedrock', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'feature',  Value: 'On-demand Inference' },
    ]);

    const rates: BedrockTokenRates = {};
    for (const parsed of items) {
      const a = parsed.product?.attributes ?? {};
      if (a.service_tier && a.service_tier !== 'standard') continue;
      const model: string | undefined = a.model || a.titanModel;
      if (!model) continue;
      const it: string = a.inferenceType ?? '';
      const dir = IN_RE.test(it) ? 'in' : OUT_RE.test(it) ? 'out' : null;
      if (!dir) continue;
      const usd = extractMaxPriceParsed(parsed);
      if (usd === null) continue;
      rates[model] = rates[model] ?? {};
      rates[model][dir] = usd;
    }
    return rates;
  }

  /**
   * Standard-tier on-demand token rates from the marketplace
   * (AmazonBedrockFoundationModels) offer, keyed by `servicename`. Prices
   * are $ per 1M tokens. Prefers regional SKUs; falls back to global
   * (cross-region) SKUs for models only offered that way in a region.
   */
  async bedrockMarketplace(regionName: string): Promise<BedrockTokenRates> {
    // [direction, priority (0 = regional preferred, 1 = global fallback), usagetype suffix]
    const SUFFIXES: Array<['in' | 'out', 0 | 1, string]> = [
      ['in',  0, '_InputTokenCount-Units'],
      ['in',  0, '_input_tokens_standard-Units'],
      ['out', 0, '_OutputTokenCount-Units'],
      ['out', 0, '_output_tokens_standard-Units'],
      ['in',  1, '_InputTokenCount_Global-Units'],
      ['in',  1, '_input_tokens_global_standard-Units'],
      ['out', 1, '_OutputTokenCount_Global-Units'],
      ['out', 1, '_output_tokens_global_standard-Units'],
    ];

    const items = await this.queryBulk('AmazonBedrockFoundationModels', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
    ]);

    const acc: Record<string, { in: Array<number | undefined>; out: Array<number | undefined> }> = {};
    for (const parsed of items) {
      const a = parsed.product?.attributes ?? {};
      const name: string | undefined = a.servicename;
      const usagetype: string = a.usagetype ?? '';
      if (!name) continue;
      for (const [dir, tier, suffix] of SUFFIXES) {
        if (!usagetype.endsWith(suffix)) continue;
        const usd = extractMaxPriceParsed(parsed);
        if (usd === null) continue;
        acc[name] = acc[name] ?? { in: [], out: [] };
        acc[name][dir][tier] = usd;
      }
    }

    const rates: BedrockTokenRates = {};
    for (const [name, v] of Object.entries(acc)) {
      const inRate = v.in[0] ?? v.in[1];
      const outRate = v.out[0] ?? v.out[1];
      if (inRate === undefined && outRate === undefined) continue;
      rates[name] = {};
      if (inRate !== undefined) rates[name].in = inRate;
      if (outRate !== undefined) rates[name].out = outRate;
    }
    return rates;
  }

  // ────────────────────────────────────────────────────────────────────────
  // EC2
  // ────────────────────────────────────────────────────────────────────────

  ec2Instance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'operatingSystem',  Value: 'Linux' },
      { Type: 'TERM_MATCH', Field: 'tenancy',          Value: 'Shared' },
      { Type: 'TERM_MATCH', Field: 'preInstalledSw',   Value: 'NA' },
      { Type: 'TERM_MATCH', Field: 'capacitystatus',   Value: 'Used' },
    ]);
  }

  ec2EbsGp2(regionName: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',    Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',  Value: 'General Purpose' },
      { Type: 'TERM_MATCH', Field: 'storageMedia', Value: 'SSD-backed' },
    ]);
  }

  ec2EbsGp3(regionName: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeApiName', Value: 'gp3' },
    ]);
  }

  ec2EbsIo2(regionName: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeApiName', Value: 'io2' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // RDS
  // ────────────────────────────────────────────────────────────────────────

  rdsInstance(regionName: string, instanceType: string, engine = 'MySQL'): Promise<number | null> {
    const filters = [
      { Type: 'TERM_MATCH' as const, Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH' as const, Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH' as const, Field: 'databaseEngine',   Value: engine },
      { Type: 'TERM_MATCH' as const, Field: 'deploymentOption', Value: 'Single-AZ' },
    ];
    if (engine.includes('SQL Server') || engine.includes('Oracle') || engine.includes('se2') || engine.includes('ee') || engine.includes('web')) {
      filters.push({ Type: 'TERM_MATCH' as const, Field: 'licenseModel', Value: 'License included' });
    } else {
      filters.push({ Type: 'TERM_MATCH' as const, Field: 'licenseModel', Value: 'No license required' });
    }
    // Pin the plain instance-hour SKU: the same filters also match RDS
    // Extended Support surcharge SKUs.
    return this.query('AmazonRDS', filters, p => {
      const ut = String(p.product?.attributes?.usagetype ?? '');
      return ut.includes('InstanceUsage') && !ut.includes('ExtendedSupport');
    }, 100);
  }

  rdsStorageGp2(regionName: string): Promise<number | null> {
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',    Value: 'General Purpose (SSD)' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Aurora
  // ────────────────────────────────────────────────────────────────────────

  auroraInstance(regionName: string, instanceType: string): Promise<number | null> {
    // Pin the Aurora Standard SKU (usagetype "InstanceUsage:<type>"); the same
    // filters also match the pricier I/O-Optimized SKU ("InstanceUsageIOOptimized:").
    // The simulator applies ioOptimizedComputeMultiplier separately.
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'databaseEngine',   Value: 'Aurora MySQL' },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
    ], p => {
      const ut = String(p.product?.attributes?.usagetype ?? '');
      return ut.includes('InstanceUsage:') && !ut.includes('IOOptimized');
    }, 100);
  }

  auroraServerlessAcu(regionName: string): Promise<number | null> {
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',       Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',  Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'databaseEngine', Value: 'Aurora MySQL' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // ElastiCache
  // ────────────────────────────────────────────────────────────────────────

  elastiCacheInstance(regionName: string, instanceType: string): Promise<number | null> {
    // Pin the plain node-hour SKU ("NodeUsage:<type>"); the same filters also
    // match Extended Support surcharges ("ExtendedSupportYr3-NodeUsage:") and
    // AWS Outposts SKUs ("Outpost-NodeUsage:").
    return this.query('AmazonElastiCache', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'cacheEngine',  Value: 'Redis' },
    ], p => {
      const a = p.product?.attributes ?? {};
      const ut = String(a.usagetype ?? '');
      return ut.includes('NodeUsage:') && !ut.includes('ExtendedSupport')
        && !ut.includes('Outpost') && a.locationType !== 'AWS Outposts';
    }, 100);
  }

  // ────────────────────────────────────────────────────────────────────────
  // ECS Fargate
  // ────────────────────────────────────────────────────────────────────────

  ecsFargateCpu(regionName: string): Promise<number | null> {
    return this.query('AmazonECS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute' },
      { Type: 'TERM_MATCH', Field: 'cputype',       Value: 'perCPU' },
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture !== 'ARM' && a.operatingSystem !== 'Windows';
    });
  }

  ecsFargateMemory(regionName: string): Promise<number | null> {
    return this.query('AmazonECS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute' },
      { Type: 'TERM_MATCH', Field: 'memorytype',    Value: 'perGB' },
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture !== 'ARM' && a.operatingSystem !== 'Windows';
    });
  }

  ecsFargateArmCpu(regionName: string): Promise<number | null> {
    return this.query('AmazonECS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute' },
      { Type: 'TERM_MATCH', Field: 'cputype',       Value: 'perCPU' },
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture === 'ARM' && a.operatingSystem !== 'Windows';
    });
  }

  ecsFargateArmMemory(regionName: string): Promise<number | null> {
    return this.query('AmazonECS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute' },
      { Type: 'TERM_MATCH', Field: 'memorytype',    Value: 'perGB' },
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.cpuArchitecture === 'ARM' && a.operatingSystem !== 'Windows';
    });
  }

  ecsFargateEphemeral(regionName: string): Promise<number | null> {
    return this.query('AmazonECS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute' },
      { Type: 'TERM_MATCH', Field: 'storagetype',    Value: 'default' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Lambda
  // ────────────────────────────────────────────────────────────────────────

  lambdaRequests(regionName: string): Promise<number | null> {
    return this.query('AWSLambda', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'group',         Value: 'AWS-Lambda-Requests' },
    ]);
  }

  lambdaDurationX86(regionName: string): Promise<number | null> {
    return this.query('AWSLambda', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'group',         Value: 'AWS-Lambda-Duration' },
    ], p => {
      const arch: string = p.product?.attributes?.cpuArchitecture ?? '';
      return arch !== 'ARM64';
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // S3
  // ────────────────────────────────────────────────────────────────────────

  s3Storage(regionName: string, volumeType: string): Promise<number | null> {
    return this.query('AmazonS3', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',    Value: volumeType },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // ELB
  // ────────────────────────────────────────────────────────────────────────

  elbHourly(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Application' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Application' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Application Load Balancer' },
    ]);
  }

  elbLcu(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Application' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Application' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Used Application Load Balancer capacity units-hr' },
    ]);
  }

  nlbHourly(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Network' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Network' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Network Load Balancer' },
    ]);
  }

  nlbLcu(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Network' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Network' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Used Network Load Balancer capacity units-hr' },
    ]);
  }

  clbHourly(regionName: string): Promise<number | null> {
    // The CLB hourly SKU no longer carries the old groupDescription value;
    // select by usagetype instead.
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Load Balancer' },
      { Type: 'TERM_MATCH', Field: 'operation',     Value: 'LoadBalancing' },
      { Type: 'TERM_MATCH', Field: 'locationType',  Value: 'AWS Region' },
    ], p => String(p.product?.attributes?.usagetype ?? '').endsWith('LoadBalancerUsage'), 100);
  }

  clbDataGB(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Data processed by Classic Load Balancer' },
    ]);
  }

  gwlbHourly(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Gateway' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Gateway' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'LoadBalancer hourly usage by Gateway Load Balancer' },
    ]);
  }

  gwlbLcu(regionName: string): Promise<number | null> {
    return this.query('AWSELB', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'Load Balancer-Gateway' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'LoadBalancing:Gateway' },
      { Type: 'TERM_MATCH', Field: 'locationType',     Value: 'AWS Region' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Used Gateway Load Balancer capacity units-hr' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // NAT Gateway
  // ────────────────────────────────────────────────────────────────────────

  natGatewayHourly(regionName: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'NAT Gateway' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'NatGateway' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Hourly charge for NAT Gateways' },
    ]);
  }

  natGatewayData(regionName: string): Promise<number | null> {
    return this.query('AmazonEC2', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',    Value: 'NAT Gateway' },
      { Type: 'TERM_MATCH', Field: 'operation',        Value: 'NatGateway' },
      { Type: 'TERM_MATCH', Field: 'groupDescription', Value: 'Charge for per GB data processed by NatGateways' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // DynamoDB
  // ────────────────────────────────────────────────────────────────────────

  // The bare group filter matches BOTH the on-demand request-unit SKU and the
  // provisioned capacity-unit-hour SKU, in nondeterministic order per region.
  // readM/writeM are on-demand request prices, so pin PayPerRequestThroughput.
  dynamoDbRead(regionName: string): Promise<number | null> {
    return this.query('AmazonDynamoDB', [
      { Type: 'TERM_MATCH', Field: 'location',  Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',     Value: 'DDB-ReadUnits' },
      { Type: 'TERM_MATCH', Field: 'operation', Value: 'PayPerRequestThroughput' },
    ]);
  }

  dynamoDbWrite(regionName: string): Promise<number | null> {
    return this.query('AmazonDynamoDB', [
      { Type: 'TERM_MATCH', Field: 'location',  Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',     Value: 'DDB-WriteUnits' },
      { Type: 'TERM_MATCH', Field: 'operation', Value: 'PayPerRequestThroughput' },
    ]);
  }

  dynamoDbStorage(regionName: string): Promise<number | null> {
    return this.query('AmazonDynamoDB', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',    Value: 'Amazon DynamoDB - Indexed DataStore' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // OpenSearch
  // ────────────────────────────────────────────────────────────────────────

  openSearchInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonES', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
    ]);
  }

  openSearchStorage(regionName: string): Promise<number | null> {
    // GP3 is the baseline semantic (us-east-1 gp3 = $0.122/GB-mo).
    return this.query('AmazonES', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Amazon OpenSearch Service Volume' },
      { Type: 'TERM_MATCH', Field: 'storageMedia',   Value: 'GP3' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Redshift
  // ────────────────────────────────────────────────────────────────────────

  redshiftInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonRedshift', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',  Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute Instance' },
    ]);
  }

  redshiftServerless(regionName: string): Promise<number | null> {
    // The operation also matches capacity-reservation SKUs (e.g. $2,430/RPU-Hr
    // upfront). Pin the plain on-demand ServerlessUsage SKU.
    return this.query('AmazonRedshift', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'operation',     Value: 'RunServerlessCompute:001' },
    ], p => String(p.product?.attributes?.usagetype ?? '').endsWith(':ServerlessUsage'), 100);
  }

  // ────────────────────────────────────────────────────────────────────────
  // EMR
  // ────────────────────────────────────────────────────────────────────────

  /**
   * All-in EMR node cost = EC2 Linux on-demand + EMR service fee.
   * The ElasticMapReduce service code prices only the EMR fee (~25% of the
   * EC2 rate), while the simulator bills the full node.
   */
  async emrInstance(regionName: string, instanceType: string): Promise<number | null> {
    const fee = await this.query('ElasticMapReduce', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
    ]);
    if (fee === null) return null;
    const ec2 = await this.ec2Instance(regionName, instanceType);
    return ec2 === null ? null : ec2 + fee;
  }

  // ────────────────────────────────────────────────────────────────────────
  // MSK
  // ────────────────────────────────────────────────────────────────────────

  mskInstance(regionName: string, instanceType: string): Promise<number | null> {
    const family = instanceType.replace('kafka.', '');
    return this.query('AmazonMSK', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'computeFamily', Value: family },
      { Type: 'TERM_MATCH', Field: 'group',         Value: 'Broker' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Amazon MQ
  // ────────────────────────────────────────────────────────────────────────

  mqInstance(regionName: string, instanceType: string): Promise<number | null> {
    const type = instanceType.replace('mq.', '');
    return this.query('AmazonMQ', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: type },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
      { Type: 'TERM_MATCH', Field: 'brokerEngine',     Value: 'ActiveMQ' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Route 53 (global — no location filter)
  // ────────────────────────────────────────────────────────────────────────

  route53Zone(): Promise<number | null> {
    return this.query('AmazonRoute53', [
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'DNS Zone' },
      { Type: 'TERM_MATCH', Field: 'usagetype',     Value: 'HostedZone' },
    ]);
  }

  route53Queries(): Promise<number | null> {
    return this.query('AmazonRoute53', [
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'DNS Query' },
      { Type: 'TERM_MATCH', Field: 'routingType',   Value: 'Standard' },
      { Type: 'TERM_MATCH', Field: 'routingTarget', Value: 'External' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Glue
  // ────────────────────────────────────────────────────────────────────────

  glueDpu(regionName: string): Promise<number | null> {
    return this.query('AWSGlue', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',    Value: 'ETL Job run' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Kinesis Data Streams
  // ────────────────────────────────────────────────────────────────────────

  kinesisShardHour(regionName: string): Promise<number | null> {
    return this.query('AmazonKinesis', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',    Value: 'Provisioned shard hour' },
    ]);
  }

  kinesisPutUnits(regionName: string): Promise<number | null> {
    return this.query('AmazonKinesis', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',    Value: 'Payload Units' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // EFS
  // ────────────────────────────────────────────────────────────────────────

  efsStorage(regionName: string, storageClass: string): Promise<number | null> {
    if (storageClass === 'Standard') {
      return this.query('AmazonEFS', [
        { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
        { Type: 'TERM_MATCH', Field: 'storageClass', Value: 'General Purpose' },
      ], p => (p.product?.attributes?.usagetype || '').includes('TimedStorage'));
    }
    // IA: the AWS pricing page quotes the Elastic-Throughput IA SKU (-ET),
    // not the legacy bursting IA SKU (which is ~55% pricier).
    return this.query('AmazonEFS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
    ], p => (p.product?.attributes?.usagetype || '').endsWith('IATimedStorage-ET-ByteHrs'), 100);
  }

  // ────────────────────────────────────────────────────────────────────────
  // CloudFront (per-region pricing for data transfer out)
  // ────────────────────────────────────────────────────────────────────────

  cloudfrontDtOut(regionName: string): Promise<number | null> {
    return this.query('AmazonCloudFront', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Data Transfer' },
    ]);
  }

  // ────────────────────────────────────────────────────────────────────────
  // API Gateway
  // ────────────────────────────────────────────────────────────────────────

  /** Returns the REST first-tier price PER REQUEST (e.g. 0.0000035 in us-east-1).
   *  The productFamily also contains HTTP-API and $0 SKUs, so the REST request
   *  SKU is pinned by usagetype. Callers must scale ×1,000,000 for per-million. */
  apiGatewayRest(regionName: string): Promise<number | null> {
    return this.query('AmazonApiGateway', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'API Calls' },
    ], p => String(p.product?.attributes?.usagetype ?? '').endsWith('ApiGatewayRequest'), 100);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Data Transfer Out (Internet Egress)
  // ────────────────────────────────────────────────────────────────────────

  /**
   * Fetches the standard internet egress price per GB for a given region.
   * Uses AWSDataTransfer service with fromLocation = region name, toLocation = External.
   * Falls back to a region-group estimate if the API returns null.
   */
  async dataTransferOut(regionName: string): Promise<number | null> {
    const price = await this.query('AWSDataTransfer', [
      { Type: 'TERM_MATCH', Field: 'fromLocation', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'toLocation',   Value: 'External' },
      { Type: 'TERM_MATCH', Field: 'transferType', Value: 'AWS Outbound' },
    ], (p: any) => {
      // Prefer the primary standard tier (not free tier at 0.00)
      const dim = Object.values(p.terms?.OnDemand ?? {}) as any[];
      if (!dim.length) return false;
      const dims = Object.values(dim[0]?.priceDimensions ?? {}) as any[];
      return dims.some((d: any) => parseFloat(d.pricePerUnit?.USD) > 0);
    });

    if (price !== null) return price;

    // Fallback: regional group estimates (standard AWS pricing tiers)
    if (regionName.startsWith('South America')) return 0.15;
    if (regionName.startsWith('Asia Pacific') || regionName.startsWith('Middle East') || regionName.startsWith('Africa')) return 0.11;
    // US, Canada, EU
    return 0.09;
  }

  async sageMakerHosting(regionName: string): Promise<Record<string, number>> {
    const items = await this.queryBulk('AmazonSageMaker', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'component', Value: 'Hosting' },
    ]);
    const instances: Record<string, number> = {};
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const inst = a.instanceType;
      if (!inst) continue;
      const price = extractMaxPriceParsed(item);
      if (price !== null) {
        const key = inst.endsWith('-Hosting') ? inst.replace('-Hosting', '') : inst;
        instances[key] = price;
      }
    }
    return instances;
  }

  async kinesisBulk(regionName: string): Promise<Record<string, number>> {
    const items = await this.queryBulk('AmazonKinesis', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
    const result: Record<string, number> = {};
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const group = a.group;
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;
      if (group === 'Provisioned shard hour') result.shardHour = price;
      else if (group === 'Payload Units') result.putM = price * 1_000_000;
      else if (group === 'Stream Hour') result.onDemandStreamHour = price;
      else if (group === 'Data Ingestion') result.onDemandIngestGB = price;
      else if (group === 'Data Retrieval') result.onDemandEgressGB = price;
      else if (group === 'Enhanced Fan-Out retrieval') result.efoEgressGB = price;
      else if (group === 'Consumer shard hour') result.consumerShardHour = price;
    }
    return result;
  }

  async dynamoDbBulk(regionName: string): Promise<Record<string, any>> {
    const items = await this.queryBulk('AmazonDynamoDB', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
    const result: Record<string, any> = {
      std: {},
      ia: {}
    };
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const group = a.group;
      const operation = a.operation;
      const volumeType = a.volumeType;
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;

      if (group === 'DDB-ReadUnits' && operation === 'PayPerRequestThroughput') {
        result.std.readM = price * 1_000_000;
      } else if (group === 'DDB-WriteUnits' && operation === 'PayPerRequestThroughput') {
        result.std.writeM = price * 1_000_000;
      } else if (volumeType === 'Amazon DynamoDB - Indexed DataStore') {
        result.std.storageGB = price;
      } else if (volumeType === 'Amazon DynamoDB - Infrequent Access Indexed DataStore') {
        result.ia.storageGB = price;
      } else if (group === 'DDB-ReadUnitsIA' && operation === 'PayPerRequestThroughputIA') {
        result.ia.readM = price * 1_000_000;
      } else if (group === 'DDB-WriteUnitsIA' && operation === 'PayPerRequestThroughputIA') {
        result.ia.writeM = price * 1_000_000;
      } else if (operation === 'PITRBackupStorage') {
        result.pitrStorageGB = price;
      } else if (operation === 'OnDemandBackupStorage') {
        result.backupStorageGB = price;
      } else if (operation === 'RestoreTable') {
        result.restoreGB = price;
      } else if (operation === 'GetRecords') {
        result.streamsRequestsM = price * 100_000;
      } else if (operation === 'ExportTableToS3') {
        result.exportGB = price;
      }
    }
    return result;
  }

  async mskBulk(regionName: string): Promise<Record<string, any>> {
    const items = await this.queryBulk('AmazonMSK', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
    const result: Record<string, any> = {
      instances: {},
      expressInstances: {},
      serverless: {}
    };
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const group = a.group;
      const type = a.usagetype;
      const computeFamily = a.computeFamily;
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;

      if (group === 'Broker') {
        if (computeFamily) {
          result.instances[`kafka.${computeFamily}`] = price;
        }
      } else if (group === 'ExpressBroker') {
        if (computeFamily) {
          result.expressInstances[`express.${computeFamily}`] = price;
        }
      } else if (type?.includes('KafkaServerless')) {
        if (type.includes('ClusterPerHour')) result.serverless.clusterHour = price;
        else if (type.includes('PartitionHour')) result.serverless.partitionHour = price;
        else if (type.includes('TrafficIn-Bytes')) result.serverless.ingestGB = price;
        else if (type.includes('TrafficOut-Bytes')) result.serverless.egressGB = price;
      } else if (group === 'BrokerStorage') {
        result.storageGB = price;
      } else if (group === 'TieredStorage') {
        result.tieredStorageGB = price;
      }
    }
    return result;
  }

  async rekognitionBulk(regionName: string): Promise<Record<string, number>> {
    const items = await this.queryBulk('AmazonRekognition', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
    const result: Record<string, number> = {};
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const operation = a.operation;
      const group = a.group;
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;

      if (operation === 'DetectFaces' || operation === 'DetectLabels') {
        result.imageM = price * 1000;
      } else if (operation === 'StartFaceDetection' || operation === 'StartLabelDetection') {
        result.videoArchivedMin = price;
      } else if (operation === 'StartFaceSearch') {
        result.videoLiveMin = price;
      } else if (group === 'FaceVectors') {
        result.faceVectorM = price * 1_000_000;
      }
    }
    return result;
  }

  async mediaConvertBulk(regionName: string): Promise<any[]> {
    return this.queryBulk('AWSElementalMediaConvert', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
  }

  async mqBulk(regionName: string): Promise<Record<string, any>> {
    const items = await this.queryBulk('AmazonMQ', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ]);
    const result: Record<string, any> = {
      instances: {},
      storage: {}
    };
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const inst = a.instanceType;
      const engine = a.brokerEngine;
      const deploy = a.deploymentOption;
      const storageMedia = a.storageMedia;
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;

      if (inst && engine === 'ActiveMQ' && deploy === 'Single-AZ') {
        result.instances[`mq.${inst}`] = price;
      }
      if (storageMedia) {
        result.storage[storageMedia] = price;
      }
    }
    return result;
  }
}
