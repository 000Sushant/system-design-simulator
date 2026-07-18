import { AwsClient } from 'aws4fetch';
import { BedrockTokenRates, RawPriceResult } from './types';

const RATE_LIMIT_DELAY_MS = 200;

const THROTTLE_BACKOFF_MS = 3000;

const PRICING_ENDPOINT = 'https://api.pricing.us-east-1.amazonaws.com/';

type Filter = { Type: 'TERM_MATCH'; Field: string; Value: string };


function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractMaxPrice(raw: string): number | null {
  try {
    return extractMaxPriceParsed(JSON.parse(raw));
  } catch {
    return null;
  }
}

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

export function extractMatchingPrice(
  result: RawPriceResult,
  predicate: (parsed: any) => boolean,
  rawPredicate?: (raw: string) => boolean
): number | null {
  if (!result.PriceList?.length) return null;
  const match = result.PriceList.find(raw => {
    if (rawPredicate && !rawPredicate(raw)) return false;
    try { return predicate(JSON.parse(raw)); } catch { return false; }
  });
  return match === undefined ? null : extractMaxPrice(match);
}


export class PricingFetcher {
  private aws: AwsClient;
  private callCount = 0;
  private nextSlotAt = 0;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.aws = new AwsClient({
      accessKeyId,
      secretAccessKey,
      service: 'pricing',
      region: 'us-east-1',
    });
  }

  get calls(): number {
    return this.callCount;
  }

  private async reserveSlot(): Promise<void> {
    const slot = Math.max(Date.now(), this.nextSlotAt);
    this.nextSlotAt = slot + RATE_LIMIT_DELAY_MS;
    const wait = slot - Date.now();
    if (wait > 0) await sleep(wait);
  }

  private backOff(): Promise<void> {
    this.nextSlotAt = Math.max(this.nextSlotAt, Date.now() + THROTTLE_BACKOFF_MS);
    return sleep(THROTTLE_BACKOFF_MS);
  }


  private async query(
    serviceCode: string,
    filters: Filter[],
    predicate?: (parsed: any) => boolean,
    maxResults = 25,
    rawPredicate?: (raw: string) => boolean
  ): Promise<number | null> {
    await this.reserveSlot();
    this.callCount++;

    const body = JSON.stringify({ ServiceCode: serviceCode, Filters: filters, MaxResults: maxResults });

    const attempt = async (retried = false): Promise<number | null> => {
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
          console.warn(`[Fetcher] Throttled on call #${this.callCount} (${serviceCode}). Backing off ${THROTTLE_BACKOFF_MS}ms...`);
          await this.backOff();
          return attempt(true);
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
      if (predicate) return extractMatchingPrice(result, predicate, rawPredicate);
      return extractMaxPrice(result.PriceList[0]);
    };

    try {
      return await attempt();
    } catch (e: any) {
      console.warn(`[Fetcher] Network error for ${serviceCode}:`, e?.message ?? e);
      return null;
    }
  }

  private async queryBulk(
    serviceCode: string,
    filters: Filter[],
    maxPages = 8,
    rawFilter?: (raw: string) => boolean
  ): Promise<any[]> {
    const items: any[] = [];
    let nextToken: string | undefined;

    for (let page = 0; page < maxPages; page++) {
      await this.reserveSlot();
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
              await this.backOff();
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
        if (rawFilter && !rawFilter(raw)) continue;
        try { items.push(JSON.parse(raw)); } catch { }
      }
      nextToken = result.NextToken;
      if (!nextToken) break;
    }
    return items;
  }


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

  async bedrockMarketplace(regionName: string): Promise<BedrockTokenRates> {
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
    return this.query('AmazonRDS', filters, p => {
      const ut = String(p.product?.attributes?.usagetype ?? '');
      return ut.includes('InstanceUsage') && !ut.includes('ExtendedSupport');
    }, 100, raw => raw.includes('InstanceUsage') && !raw.includes('ExtendedSupport'));
  }

  rdsStorageGp2(regionName: string): Promise<number | null> {
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',    Value: 'General Purpose (SSD)' },
    ]);
  }


  auroraInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'databaseEngine',   Value: 'Aurora MySQL' },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
    ], p => {
      const ut = String(p.product?.attributes?.usagetype ?? '');
      return ut.includes('InstanceUsage:') && !ut.includes('IOOptimized');
    }, 100, raw => raw.includes('InstanceUsage:') && !raw.includes('IOOptimized'));
  }

  auroraServerlessAcu(regionName: string): Promise<number | null> {
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',       Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily',  Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'databaseEngine', Value: 'Aurora MySQL' },
    ]);
  }


  elastiCacheInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonElastiCache', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'cacheEngine',  Value: 'Redis' },
    ], p => {
      const a = p.product?.attributes ?? {};
      const ut = String(a.usagetype ?? '');
      return ut.includes('NodeUsage:') && !ut.includes('ExtendedSupport')
        && !ut.includes('Outpost') && a.locationType !== 'AWS Outposts';
    }, 100, raw => raw.includes('NodeUsage:') && !raw.includes('ExtendedSupport') && !raw.includes('Outpost') && !raw.includes('AWS Outposts'));
  }

  async elastiCacheBulk(regionName: string): Promise<Record<string, number>> {
    const items = await this.queryBulk('AmazonElastiCache', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'cacheEngine', Value: 'Redis' }
    ], 8, raw => raw.includes('NodeUsage:') && !raw.includes('ExtendedSupport') && !raw.includes('Outpost') && !raw.includes('AWS Outposts'));

    const instances: Record<string, number> = {};
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const inst = a.instanceType;
      if (!inst) continue;
      const price = extractMaxPriceParsed(item);
      if (price !== null) {
        instances[inst] = price;
      }
    }
    return instances;
  }


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


  s3Storage(regionName: string, volumeType: string): Promise<number | null> {
    return this.query('AmazonS3', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
      { Type: 'TERM_MATCH', Field: 'volumeType',    Value: volumeType },
    ]);
  }


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


  openSearchInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonES', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
    ]);
  }

  openSearchStorage(regionName: string): Promise<number | null> {
    return this.query('AmazonES', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Amazon OpenSearch Service Volume' },
      { Type: 'TERM_MATCH', Field: 'storageMedia',   Value: 'GP3' },
    ]);
  }


  redshiftInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonRedshift', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',  Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Compute Instance' },
    ]);
  }

  redshiftServerless(regionName: string): Promise<number | null> {
    return this.query('AmazonRedshift', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Serverless' },
      { Type: 'TERM_MATCH', Field: 'operation',     Value: 'RunServerlessCompute:001' },
    ], p => String(p.product?.attributes?.usagetype ?? '').endsWith(':ServerlessUsage'), 100);
  }


  async emrInstance(regionName: string, instanceType: string): Promise<number | null> {
    const fee = await this.query('ElasticMapReduce', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
    ]);
    if (fee === null) return null;
    const ec2 = await this.ec2Instance(regionName, instanceType);
    return ec2 === null ? null : ec2 + fee;
  }


  mskInstance(regionName: string, instanceType: string): Promise<number | null> {
    const family = instanceType.replace('kafka.', '');
    return this.query('AmazonMSK', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'computeFamily', Value: family },
      { Type: 'TERM_MATCH', Field: 'group',         Value: 'Broker' },
    ]);
  }


  mqInstance(regionName: string, instanceType: string): Promise<number | null> {
    const type = instanceType.replace('mq.', '');
    return this.query('AmazonMQ', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: type },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
      { Type: 'TERM_MATCH', Field: 'brokerEngine',     Value: 'ActiveMQ' },
    ]);
  }


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


  glueDpu(regionName: string): Promise<number | null> {
    return this.query('AWSGlue', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'group',    Value: 'ETL Job run' },
    ]);
  }


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


  efsStorage(regionName: string, storageClass: string): Promise<number | null> {
    if (storageClass === 'Standard') {
      return this.query('AmazonEFS', [
        { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
        { Type: 'TERM_MATCH', Field: 'storageClass', Value: 'General Purpose' },
      ], p => (p.product?.attributes?.usagetype || '').includes('TimedStorage'));
    }
    return this.query('AmazonEFS', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Storage' },
    ], p => (p.product?.attributes?.usagetype || '').endsWith('IATimedStorage-ET-ByteHrs'), 100);
  }


  cloudfrontDtOut(regionName: string): Promise<number | null> {
    return this.query('AmazonCloudFront', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Data Transfer' },
    ]);
  }


  apiGatewayRest(regionName: string): Promise<number | null> {
    return this.query('AmazonApiGateway', [
      { Type: 'TERM_MATCH', Field: 'location',      Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'API Calls' },
    ], p => String(p.product?.attributes?.usagetype ?? '').endsWith('ApiGatewayRequest'), 100);
  }


  async dataTransferOut(regionName: string): Promise<number | null> {
    const price = await this.query('AWSDataTransfer', [
      { Type: 'TERM_MATCH', Field: 'fromLocation', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'toLocation',   Value: 'External' },
      { Type: 'TERM_MATCH', Field: 'transferType', Value: 'AWS Outbound' },
    ], (p: any) => {
      const dim = Object.values(p.terms?.OnDemand ?? {}) as any[];
      if (!dim.length) return false;
      const dims = Object.values(dim[0]?.priceDimensions ?? {}) as any[];
      return dims.some((d: any) => parseFloat(d.pricePerUnit?.USD) > 0);
    });

    if (price !== null) return price;

    if (regionName.startsWith('South America')) return 0.15;
    if (regionName.startsWith('Asia Pacific') || regionName.startsWith('Middle East') || regionName.startsWith('Africa')) return 0.11;
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
      const ut: string = a.usagetype ?? '';
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;
      if (group === 'Provisioned shard hour') result.shardHour = price;
      else if (group === 'Payload Units') result.putM = price * 1_000_000;
      else if (group === 'OnDemand' && ut.endsWith('OnDemand-StreamHour')) result.onDemandStreamHour = price;
      else if (group === 'OnDemand' && ut.endsWith('OnDemand-BilledIncomingBytes')) result.onDemandIngestGB = price;
      else if (group === 'OnDemand' && ut.endsWith('OnDemand-BilledOutgoingBytes')) result.onDemandEgressGB = price;
      else if (group === 'OnDemand' && ut.endsWith('OnDemand-BilledOutgoingEFOBytes')) result.efoEgressGB = price;
      else if (group === 'Enhanced fan-out consumer-shard hour') result.consumerShardHour = price;
      else if (group === 'OnDemand' && ut.endsWith('OnDemand-ExtendedRetention-ByteHrs')) result.extendedRetentionGB = price;
      else if (group === 'Long-term Data Retention GB-month') result.longTermRetentionGB = price;
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

      const ut: string = a.usagetype ?? '';
      if (group === 'DDB-ReadUnits' && operation === 'PayPerRequestThroughput') {
        result.std.readM = price * 1_000_000;
      } else if (group === 'DDB-WriteUnits' && operation === 'PayPerRequestThroughput') {
        result.std.writeM = price * 1_000_000;
      } else if (volumeType === 'Amazon DynamoDB - Indexed DataStore') {
        result.std.storageGB = price;
      } else if (volumeType === 'Amazon DynamoDB - Indexed DataStore - IA') {
        result.ia.storageGB = price;
      } else if (group === 'DDB-ReadUnitsIA' && operation === 'PayPerRequestThroughput') {
        result.ia.readM = price * 1_000_000;
      } else if (group === 'DDB-WriteUnitsIA' && operation === 'PayPerRequestThroughput') {
        result.ia.writeM = price * 1_000_000;
      } else if (group === 'DDB-ReplicatedWriteUnits' && operation === 'PayPerRequestThroughput') {
        result.std.replicatedWriteM = price * 1_000_000;
      } else if (group === 'DDB-WriteUnits' && operation === 'CommittedThroughput') {
        result.std.wcuHr = price;
      } else if (group === 'DDB-ReadUnits' && operation === 'CommittedThroughput') {
        result.std.rcuHr = price;
      } else if (group === 'DDB-WriteUnitsIA' && operation === 'CommittedThroughput') {
        result.ia.wcuHr = price;
      } else if (group === 'DDB-ReadUnitsIA' && operation === 'CommittedThroughput') {
        result.ia.rcuHr = price;
      } else if (group === 'DDB-ReplicatedWriteUnitsIA' && operation === 'PayPerRequestThroughput') {
        result.ia.replicatedWriteM = price * 1_000_000;
      } else if (ut.endsWith('TimedPITRStorage-ByteHrs')) {
        result.pitrStorageGB = price;
      } else if (ut.endsWith('TimedBackupStorage-ByteHrs')) {
        result.backupStorageGB = price;
      } else if (ut.endsWith('RestoreDataSize-Bytes')) {
        result.restoreGB = price;
      } else if (group === 'DDB-StreamsReadRequests' && operation === 'GetRecords') {
        result.streamsRequestsM = price * 1_000_000;
      } else if (ut.endsWith('-ExportDataSize-Bytes')) {
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
          const key = computeFamily.startsWith('express.') ? computeFamily : `express.${computeFamily}`;
          result.expressInstances[key] = price;
        }
      } else if (type?.includes('KafkaServerless')) {
        if (type.endsWith('KafkaServerless-ClusterHours')) result.serverless.clusterHour = price;
        else if (type.endsWith('KafkaServerless-PartitionHours')) result.serverless.partitionHour = price;
        else if (type.endsWith('KafkaServerless-In-Bytes')) result.serverless.ingestGB = price;
        else if (type.endsWith('KafkaServerless-Out-Bytes')) result.serverless.egressGB = price;
      } else if (type?.endsWith('Kafka.Storage.GP2')) {
        result.storageGB = price;
      } else if (type?.endsWith('Kafka.Storage.Tiered')) {
        result.tieredStorageGB = price;
      } else if (type?.endsWith('Express.Storage')) {
        result.expressStorageGB = price;
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
      const operation: string = a.operation ?? '';
      const group: string = a.group ?? '';
      const ut: string = a.usagetype ?? '';
      const price = extractMaxPriceParsed(item);
      if (price === null) continue;

      if (group === 'Rekognition Image API Requests' && /(^|-)ImagesProcessed$/.test(ut) && !ut.includes('ImageProperties')) {
        result.imageM = price * 1_000_000;
      } else if (group === 'Rekognition Video API Requests - Archived Content' && ut.endsWith('MinsOfArchVideoProcessed')) {
        result.videoArchivedMin = price;
      } else if (group === 'Rekognition Video API Requests - Live Streams' && ut.endsWith('MinsOfLiveVideoProcessed') && !operation) {
        result.videoLiveMin = price;
      } else if (group === 'Face Vector Storage') {
        result.faceVectorM = price * 1_000_000;
      }
    }
    return result;
  }

  async elastiCacheServerless(regionName: string): Promise<Record<string, Record<string, number>>> {
    const items = await this.queryBulk('AmazonElastiCache', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'ElastiCache Serverless' },
    ], 8, raw => raw.includes('CachedData:') || raw.includes('ElastiCacheProcessingUnits:'));
    const result: Record<string, Record<string, number>> = {};
    for (const item of items) {
      const a = item.product?.attributes ?? {};
      const ut: string = a.usagetype ?? '';
      const engine = String(a.cacheEngine ?? '').toLowerCase();
      const price = extractMaxPriceParsed(item);
      if (price === null || !engine) continue;
      if (ut.includes('CachedData:')) {
        (result[engine] ??= {}).storageGBHour = price;
      } else if (ut.includes('ElastiCacheProcessingUnits:')) {
        (result[engine] ??= {}).ecpuM = price * 1_000_000;
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

  async amplifyBuild(regionName: string, instanceType: string = 'Standard8GB'): Promise<number | null> {
    return this.query('AWSAmplify', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      const inst = p.product?.attributes?.instancetype ?? '';
      return u.includes('BuildDuration') && inst === instanceType;
    });
  }

  async amplifyStorage(regionName: string): Promise<number | null> {
    return this.query('AWSAmplify', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.endsWith('DataStorage');
    });
  }

  async amplifyDataTransfer(regionName: string): Promise<number | null> {
    return this.query('AWSAmplify', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.endsWith('DataTransferOut');
    });
  }


  async sesOutboundEmail(regionName: string): Promise<number | null> {
    return this.query('AmazonSES', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Sending Email' }
    ], p => /(^|-)Recipients$/.test(p.product?.attributes?.usagetype ?? ''), 100);
  }

  async sesInboundEmail(regionName: string): Promise<number | null> {
    return this.query('AmazonSES', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Receiving Email' }
    ], p => /(^|-)Message$/.test(p.product?.attributes?.usagetype ?? ''), 100);
  }

  async sesAttachment(regionName: string): Promise<number | null> {
    return this.query('AmazonSES', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Sending Attachments' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('AttachmentsSize-Bytes'), 100);
  }

  async sesDedicatedIp(regionName: string): Promise<number | null> {
    return this.query('AmazonSES', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Sending Email' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('DIP-Hours'), 100);
  }

  async sesVdm(regionName: string): Promise<number | null> {
    return this.query('AmazonSES', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('Recipients-VirtDelivMgr'), 100);
  }


  async docDbInstance(regionName: string, instanceType: string, ioOptimized = false): Promise<number | null> {
    return this.query('AmazonDocDB', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return ioOptimized ? u.includes('InstanceUsageIOOptimized:') : (u.includes('InstanceUsage:') && !u.includes('IOOptimized'));
    }, 100);
  }

  async docDbStorage(regionName: string, ioOptimized = false): Promise<number | null> {
    return this.query('AmazonDocDB', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      if (u.includes('Elastic')) return false;
      return ioOptimized ? u.endsWith('IO-OptimizedStorageUsage') : (u.endsWith('StorageUsage') && !u.includes('IO-Optimized'));
    }, 100);
  }

  async docDbIo(regionName: string): Promise<number | null> {
    return this.query('AmazonDocDB', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'System Operation' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('StorageIOUsage'), 100);
  }


  async neptuneInstance(regionName: string, instanceType: string): Promise<number | null> {
    return this.query('AmazonNeptune', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.includes('InstanceUsage:') && !u.includes('IOOptimized');
    }, 100);
  }

  async neptuneStorage(regionName: string): Promise<number | null> {
    return this.query('AmazonNeptune', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.endsWith('StorageUsage') && !u.includes('IO-Optimized');
    }, 100);
  }

  async neptuneIo(regionName: string): Promise<number | null> {
    return this.query('AmazonNeptune', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'System Operation' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('StorageIOUsage'), 100);
  }


  async timestreamIngest(regionName: string): Promise<number | null> {
    return this.query('AmazonTimestream', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Data Payload' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('DataIngestion-Bytes'), 100);
  }

  async timestreamMemoryStore(regionName: string): Promise<number | null> {
    return this.query('AmazonTimestream', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('MemoryStore-ByteHrs'), 100);
  }

  async timestreamMagneticStore(regionName: string): Promise<number | null> {
    return this.query('AmazonTimestream', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Database Storage' }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('MagneticStore-ByteHrs'), 100);
  }

  async timestreamScanned(regionName: string): Promise<number | null> {
    return this.query('AmazonTimestream', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('DataScanned-Bytes'), 100);
  }


  async appConfigRequests(regionName: string): Promise<number | null> {
    return this.query('AWSSystemsManager', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('AppConfig-Requests'), 100);
  }

  async appConfigDeployment(regionName: string): Promise<number | null> {
    return this.query('AWSSystemsManager', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('AppConfig-Deployments'), 100);
  }


  async cloudMapResource(regionName: string): Promise<number | null> {
    return this.query('AWSCloudMap', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('Cloud-Map-Resources'), 100);
  }

  async cloudMapQuery(regionName: string): Promise<number | null> {
    return this.query('AWSCloudMap', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.endsWith('Cloud-Map-API-Calls') && !u.includes('DIR');
    }, 100);
  }


  async quickSightAuthorPro(regionName: string): Promise<number | null> {
    return this.query('AmazonQuickSight', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.group === 'Author Pro Subscription' && !(a.usagetype ?? '').includes('Free-Trial');
    }, 100, raw => raw.includes('Author Pro Subscription') && !raw.includes('Free-Trial'));
  }

  async quickSightReader(regionName: string): Promise<number | null> {
    return this.query('AmazonQuickSight', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => {
      const a = p.product?.attributes ?? {};
      return a.group === 'Reader Subscription' && !(a.usagetype ?? '').includes('Free-Trial');
    }, 100, raw => raw.includes('Reader Subscription') && !raw.includes('Free-Trial'));
  }

  async quickSightSpice(regionName: string): Promise<number | null> {
    return this.query('AmazonQuickSight', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName }
    ], p => (p.product?.attributes?.usagetype ?? '').endsWith('QS-Enterprise-SPICE'), 100, raw => raw.includes('QS-Enterprise-SPICE'));
  }


  async lightsailBundles(regionName: string, sizes: string[]): Promise<Record<string, number | null>> {
    const items = await this.queryBulk('AmazonLightsail', [
      { Type: 'TERM_MATCH', Field: 'location', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Lightsail Instance' }
    ], 8, raw => raw.includes('BundleUsage:'));
    const out: Record<string, number | null> = {};
    for (const size of sizes) {
      const re = new RegExp(`(^|-)BundleUsage:${size.replace('.', '\\.')}$`);
      const match = items.find(p => re.test(p.product?.attributes?.usagetype ?? ''));
      out[size] = match ? extractMaxPriceParsed(match) : null;
    }
    return out;
  }

  async lightsailOverage(regionName: string): Promise<number | null> {
    return this.query('AmazonLightsail', [
      { Type: 'TERM_MATCH', Field: 'fromLocation', Value: regionName },
      { Type: 'TERM_MATCH', Field: 'productFamily', Value: 'Lightsail Networking' }
    ], p => {
      const u = p.product?.attributes?.usagetype ?? '';
      return u.endsWith('DataXfer-Out-Overage-Bytes') && !u.includes('Storage');
    }, 100, raw => raw.includes('DataXfer-Out-Overage-Bytes') && !raw.includes('Storage'));
  }
}
