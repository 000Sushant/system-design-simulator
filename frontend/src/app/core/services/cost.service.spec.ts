import { describe, it, expect, beforeEach } from 'vitest';
import { CostService } from './cost.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ArchitectureNode, AwsServiceType, Currency } from '../models/architecture.model';
import * as serviceCostModelData from '../data/service-cost-model.json';
import * as usEast1Data from '../data/regions/us-east-1.json';

const catalog = new AwsCatalogService();
const allServiceTypes: AwsServiceType[] = catalog.services.map((s) => s.type);

describe('CostService', () => {
  let cost: CostService;
  let factory: ArchitectureFactoryService;

  beforeEach(() => {
    cost = new CostService();
    factory = new ArchitectureFactoryService(new AwsCatalogService());
  });

  const node = (type: AwsServiceType): ArchitectureNode => factory.createNode(type, 0, 0);
  const billableTypes: AwsServiceType[] = ['ec2', 's3', 'lambda', 'rds', 'dynamoDb', 'apiGateway', 'amplify'];

  it('returns a currency symbol for every supported currency', () => {
    const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
    for (const c of currencies) {
      expect(cost.getCurrencySymbol(c)).toBeTruthy();
    }
  });

  it('costs nothing for an empty architecture', () => {
    expect(cost.calculateTotalMonthlyCost([], 'USD', 'us-east-1')).toBe(0);
  });

  it('never returns a negative cost for any billable node', () => {
    for (const type of billableTypes) {
      expect(cost.calculateNodeCostUsd(node(type), 'us-east-1')).toBeGreaterThanOrEqual(0);
    }
  });

  it('produces a real positive cost for compute/storage defaults', () => {
    expect(cost.calculateNodeCostUsd(node('ec2'), 'us-east-1')).toBeGreaterThan(0);
    expect(cost.calculateNodeCostUsd(node('s3'), 'us-east-1')).toBeGreaterThan(0);
  });

  it('aggregates the total as the sum of per-node USD costs', () => {
    const nodes = billableTypes.map(node);
    const expected = nodes.reduce((sum, n) => sum + cost.calculateNodeCostUsd(n, 'us-east-1', nodes), 0);
    expect(cost.calculateTotalMonthlyCost(nodes, 'USD', 'us-east-1')).toBeCloseTo(expected, 5);
  });

  it('is deterministic for identical input', () => {
    const nodes = billableTypes.map(node);
    const first = cost.calculateTotalMonthlyCost(nodes, 'USD', 'us-east-1');
    const second = cost.calculateTotalMonthlyCost(nodes, 'USD', 'us-east-1');
    expect(second).toBe(first);
  });

  it('returns an itemized breakdown whose total matches the node cost', () => {
    const ec2 = node('ec2');
    const breakdown = cost.getCostBreakdown(ec2, 'us-east-1', [ec2]);
    expect(breakdown.total).toBeCloseTo(cost.calculateNodeCostUsd(ec2, 'us-east-1', [ec2]), 5);
    expect(breakdown.lines.length).toBeGreaterThan(0);
  });

  describe('Bedrock provider/model pricing', () => {
    const bedrockNode = (config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node('bedrock');
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };

    it('defaults to Anthropic / Claude Sonnet 5 and prices from the catalog', () => {
      const n = bedrockNode();
      expect(n.config['provider']).toBe('anthropic');
      expect(n.config['model']).toBe('claude-sonnet-5');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(44, 5);
    });

    it('prices every model of every provider with its own catalog rate', () => {
      const bedrockModel = (serviceCostModelData as any).serviceCostModel.bedrock;
      const baseline = (usEast1Data as any).services.bedrock;
      const modelParams = bedrockModel.costParams.filter((p: { key: string }) => p.key === 'model');
      expect(modelParams.length).toBeGreaterThanOrEqual(15);

      for (const param of modelParams) {
        const provider = /'([a-z0-9]+)'/.exec(param.visibleIf)?.[1];
        for (const opt of param.options) {
          const n = bedrockNode({ provider, model: opt.value, inTokensM: 1, outTokensM: 1 });
          const expected = baseline.inM[opt.value] + baseline.outM[opt.value];
          expect(expected, `${opt.value} missing from baseline`).toBeGreaterThan(0);
          expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n]), opt.value).toBeCloseTo(expected, 5);
        }
      }
    });

    it('still prices architectures saved before the provider/model split', () => {
      const n = bedrockNode({ model: 'claude-haiku', inTokensM: 10, outTokensM: 2 });
      delete (n.config as Record<string, unknown>)['provider'];
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(5, 5);
    });
  });

  describe('Amplify pricing', () => {
    const amplifyNode = (config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node('amplify');
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };

    it('prices the defaults from the cost-model params (build + served + storage)', () => {
      const n = amplifyNode();
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(20.23, 5);
    });

    it('itemizes all three billable dimensions with readable labels and formulas', () => {
      const n = amplifyNode();
      const breakdown = cost.getCostBreakdown(n, 'us-east-1', [n]);
      const labels = breakdown.lines.map((l) => l.label);
      expect(labels).toEqual([
        'Build & Deploy (Standard)',
        'Hosting Data Served',
        'Hosting Data Storage',
      ]);
      for (const line of breakdown.lines) {
        expect(line.formula.length).toBeGreaterThan(0);
        expect(Number.isFinite(line.value)).toBe(true);
      }
      expect(breakdown.freeTierNote).toBeTruthy();
    });

    it('scales each dimension with its cost param', () => {
      const n = amplifyNode({ buildMinutes: 1000, dataServedGB: 200, storageGB: 100 });
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(42.3, 5);
    });

    it('bills build minutes at the selected build instance size rate', () => {
      const large = amplifyNode({ buildInstanceType: 'large' });
      expect(cost.calculateNodeCostUsd(large, 'us-east-1', [large])).toBeCloseTo(500 * 0.025 + 15.23, 5);

      const xlarge = amplifyNode({ buildInstanceType: 'xlarge' });
      expect(cost.calculateNodeCostUsd(xlarge, 'us-east-1', [xlarge])).toBeCloseTo(500 * 0.1 + 15.23, 5);

      const label = cost.getCostBreakdown(xlarge, 'us-east-1', [xlarge]).lines[0].label;
      expect(label).toBe('Build & Deploy (XLarge)');
    });

    it('falls back to the standard rate for an unknown instance type', () => {
      const n = amplifyNode({ buildInstanceType: 'bogus' });
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(20.23, 5);
    });
  });

  describe('Global Accelerator DT-Premium (deployment region → Request Region)', () => {
    const gaNode = (config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node('globalAccelerator');
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };
    const clientNode = (requestRegion: string): ArchitectureNode => {
      const n = node('client');
      return { ...n, config: { ...n.config, requestRegion } as ArchitectureNode['config'] };
    };

    it('prices the default (no Users node) at the US/Canada→US/Canada baseline', () => {
      const ga = gaNode();
      expect(cost.calculateNodeCostUsd(ga, 'us-east-1', [ga])).toBeCloseTo(19.75, 5);
    });

    it('prices Global (Mixed) users identically to the US/Canada baseline', () => {
      const ga = gaNode();
      const c = clientNode('global');
      expect(cost.calculateNodeCostUsd(ga, 'us-east-1', [ga, c])).toBeCloseTo(19.75, 5);
    });

    it('charges the official cross-geography rate for distant users', () => {
      const ga = gaNode();
      const c = clientNode('ap-southeast-2');
      expect(cost.calculateNodeCostUsd(ga, 'us-east-1', [ga, c])).toBeCloseTo(28.75, 5);
    });

    it('charges the cheap intra-geography rate when app and users share a group', () => {
      const ga = gaNode();
      const c = clientNode('ap-southeast-2');
      expect(cost.calculateNodeCostUsd(ga, 'ap-southeast-2', [ga, c])).toBeCloseTo(18.95, 5);
    });

    it('itemizes the DT-Premium line with the source→destination pair', () => {
      const ga = gaNode();
      const c = clientNode('sa-east-1');
      const breakdown = cost.getCostBreakdown(ga, 'eu-west-1', [ga, c]);
      const dt = breakdown.lines.find((l) => l.label === 'Data Transfer (DT-Premium)');
      expect(dt).toBeTruthy();
      expect(dt!.value).toBeCloseTo(4.3, 5);
      expect(dt!.formula).toContain('Europe → South America');
      expect(breakdown.lines.some((l) => l.label === 'Regional Adjustment')).toBe(false);
    });
  });

  describe('missing-services batch pricing (report v2)', () => {
    const withConfig = (type: AwsServiceType, config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node(type);
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };

    it('prices SES defaults and doubles up correctly with VDM + dedicated IP', () => {
      const n = withConfig('ses');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(3.12, 5);
      const loaded = withConfig('ses', { vdmEnabled: true, dedicatedIPs: 1, inboundDailyVolume: 100 });
      expect(cost.calculateNodeCostUsd(loaded, 'us-east-1', [loaded])).toBeCloseTo(3.12 + 2.1 + 24.95 + 0.3, 5);
    });

    it('prices DocumentDB standard vs I/O-Optimized storage correctly', () => {
      const std = withConfig('documentDb');
      expect(cost.calculateNodeCostUsd(std, 'us-east-1', [std])).toBeCloseTo(2 * 0.2631 * 730 + 10 + 20, 5);
      const io = withConfig('documentDb', { storageType: 'io-optimized' });
      expect(cost.calculateNodeCostUsd(io, 'us-east-1', [io])).toBeCloseTo(2 * 0.2895 * 730 + 100 * 0.30, 5);
    });

    it('prices Neptune instances, storage, and I/O', () => {
      const n = withConfig('neptune');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(2 * 0.3287 * 730 + 10 + 10, 5);
      const big = withConfig('neptune', { instanceClass: 'db.r6g.2xlarge', instanceCount: 1 });
      expect(cost.calculateNodeCostUsd(big, 'us-east-1', [big])).toBeCloseTo(1.3149 * 730 + 10 + 10, 5);
    });

    it('prices Timestream across all four dimensions', () => {
      const n = withConfig('timestream');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(50 + 262.8 + 3 + 10, 5);
    });

    it('prices AppConfig requests and per-target deployments', () => {
      const n = withConfig('appConfig');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(2.8, 5);
    });

    it('keeps App Mesh free but itemized', () => {
      const n = withConfig('appMesh');
      const breakdown = cost.getCostBreakdown(n, 'us-east-1', [n]);
      expect(breakdown.total).toBe(0);
      expect(breakdown.lines.length).toBe(1);
      expect(breakdown.lines[0].label).toBe('Control Plane');
    });

    it('prices Cloud Map registry and discovery calls', () => {
      const n = withConfig('cloudMap');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(15, 5);
    });

    it('prices QuickSight licenses and SPICE', () => {
      const n = withConfig('quickSight');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(298, 5);
    });

    it('prices Lightsail bundles flat and bills only transfer overage', () => {
      const n = withConfig('lightsail');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(0.01612 * 730, 5);
      const over = withConfig('lightsail', { bundleSize: '0.5GB', bandwidthGB: 1500 });
      expect(cost.calculateNodeCostUsd(over, 'us-east-1', [over])).toBeCloseTo(0.00672 * 730 + 476 * 0.09, 5);
    });
  });

  describe('client packageSize drives payload-based billing', () => {
    const withConfig = (type: AwsServiceType, config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node(type);
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };
    const client = (packageSize: number, requestRate = 100): ArchitectureNode =>
      withConfig('client', { packageSize, requestRate });

    it('derives CloudFront DT-out from RPS × packageSize instead of the static knob', () => {
      const cf = withConfig('cloudfront', { throughput: 100, dataTransferOut: 5000 });
      const c = client(100);
      const withClient = cost.getCostBreakdown(cf, 'us-east-1', [cf, c]);
      const dtLine = withClient.lines.find((l) => l.label === 'Data Transfer Out');
      expect(dtLine?.formula).toContain('KB/req');
      const alone = cost.getCostBreakdown(cf, 'us-east-1', [cf]);
      const dtAlone = alone.lines.find((l) => l.label === 'Data Transfer Out');
      expect(dtLine!.value).toBeGreaterThan(dtAlone!.value);
    });

    it('derives S3 DT-out from GET volume × packageSize', () => {
      const s3 = withConfig('s3', { getsM: 10, dataTransferOut: 100 });
      const c = client(200);
      const withClient = cost.getCostBreakdown(s3, 'us-east-1', [s3, c]);
      const dtLine = withClient.lines.find((l) => l.label === 'Data Transfer Out');
      expect(dtLine?.formula).toContain('KB/obj');
      const alone = cost.getCostBreakdown(s3, 'us-east-1', [s3]);
      const dtAlone = alone.lines.find((l) => l.label === 'Data Transfer Out');
      expect(dtLine!.value).toBeGreaterThan(dtAlone!.value);
    });

    it('bills SQS one request per 64 KB chunk of the payload', () => {
      const sqs = withConfig('sqs', { throughput: 100 });
      const small = cost.calculateNodeCostUsd(sqs, 'us-east-1', [sqs, client(50)]);
      const large = cost.calculateNodeCostUsd(sqs, 'us-east-1', [sqs, client(200)]);
      expect(large).toBeGreaterThan(small * 3);
      const huge = cost.calculateNodeCostUsd(sqs, 'us-east-1', [sqs, client(4000)]);
      expect(huge).toBeCloseTo(large, 5);
    });

    it('bills SNS publishes per 64 KB chunk of the payload', () => {
      const sns = withConfig('sns', { throughput: 100 });
      const small = cost.calculateNodeCostUsd(sns, 'us-east-1', [sns, client(50)]);
      const large = cost.calculateNodeCostUsd(sns, 'us-east-1', [sns, client(200)]);
      expect(large).toBeGreaterThan(small);
    });

    it('keeps static-knob behavior when no client node exists', () => {
      for (const type of ['cloudfront', 's3', 'sqs', 'sns'] as AwsServiceType[]) {
        const n = node(type);
        const alone = cost.calculateNodeCostUsd(n, 'us-east-1', [n]);
        expect(Number.isFinite(alone)).toBe(true);
        expect(alone).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe.each(allServiceTypes)('cost invariants for "%s"', (type) => {
    it('is finite, non-negative, deterministic, and breakdown-consistent', () => {
      const n = node(type);
      const first = cost.calculateNodeCostUsd(n, 'us-east-1', [n]);
      const second = cost.calculateNodeCostUsd(n, 'us-east-1', [n]);

      expect(Number.isFinite(first)).toBe(true);
      expect(first).toBeGreaterThanOrEqual(0);
      expect(second).toBe(first);
      expect(cost.getCostBreakdown(n, 'us-east-1', [n]).total).toBeCloseTo(first, 5);
    });
  });
});
