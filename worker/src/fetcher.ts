import { AwsClient } from 'aws4fetch';
import { RawPriceResult } from './types';

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
function extractMaxPrice(raw: string): number | null {
  try {
    const parsed = JSON.parse(raw);
    const onDemand = parsed.terms?.OnDemand;
    if (!onDemand) return null;
    const offer: any = Object.values(onDemand)[0];
    const dimensions: Record<string, any> = offer?.priceDimensions ?? {};
    let max = -1;
    for (const dim of Object.values(dimensions)) {
      const v = parseFloat(dim?.pricePerUnit?.USD ?? '-1');
      if (v > max) max = v;
    }
    return max >= 0 ? max : null;
  } catch {
    return null;
  }
}

/**
 * Among all returned price list items, pick the one satisfying `predicate`,
 * then extract the max price. Strict: returns null when nothing matches, so
 * a wrong product is never priced silently (the baseline is used instead).
 */
function extractMatchingPrice(
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
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'databaseEngine',   Value: engine },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
      { Type: 'TERM_MATCH', Field: 'licenseModel',     Value: 'No license required' },
    ]);
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
    return this.query('AmazonRDS', [
      { Type: 'TERM_MATCH', Field: 'location',         Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType',     Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'databaseEngine',   Value: 'Aurora MySQL' },
      { Type: 'TERM_MATCH', Field: 'deploymentOption', Value: 'Single-AZ' },
    ]);
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
    return this.query('AmazonElastiCache', [
      { Type: 'TERM_MATCH', Field: 'location',     Value: regionName },
      { Type: 'TERM_MATCH', Field: 'instanceType', Value: instanceType },
      { Type: 'TERM_MATCH', Field: 'cacheEngine',  Value: 'Redis' },
    ]);
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
}
