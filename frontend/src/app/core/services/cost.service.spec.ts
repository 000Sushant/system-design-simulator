import { describe, it, expect, beforeEach } from 'vitest';
import { CostService } from './cost.service';
import { AwsCatalogService } from './aws-catalog.service';
import { ArchitectureFactoryService } from './architecture-factory.service';
import { ArchitectureNode, AwsServiceType, Currency } from '../models/architecture.model';
import * as serviceCostModelData from '../data/service-cost-model.json';
import * as usEast1Data from '../data/regions/us-east-1.json';

const catalog = new AwsCatalogService();
const allServiceTypes: AwsServiceType[] = catalog.services.map((s) => s.type);

/**
 * Characterization tests for the cost engine. They assert structural invariants
 * (aggregate = sum of parts, non-negativity, determinism) rather than exact AWS
 * prices, so they guard against regressions while a refactor is in flight without
 * being brittle to pricing-data updates. Runs against the bundled us-east-1
 * fallback pricing — no network.
 */
describe('CostService', () => {
  let cost: CostService;
  let factory: ArchitectureFactoryService;

  beforeEach(() => {
    cost = new CostService();
    factory = new ArchitectureFactoryService(new AwsCatalogService());
  });

  const node = (type: AwsServiceType): ArchitectureNode => factory.createNode(type, 0, 0);
  // Types that should always carry a non-zero monthly cost on their defaults.
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
      // 10M in × $2.2/M + 2M out × $11/M = $44
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(44, 5);
    });

    it('prices every model of every provider with its own catalog rate', () => {
      const bedrockModel = (serviceCostModelData as any).serviceCostModel.bedrock;
      const baseline = (usEast1Data as any).services.bedrock;
      const modelParams = bedrockModel.costParams.filter((p: { key: string }) => p.key === 'model');
      expect(modelParams.length).toBeGreaterThanOrEqual(15); // one per provider

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
      // Legacy configs carry model keys like "claude-haiku" and no provider.
      const n = bedrockNode({ model: 'claude-haiku', inTokensM: 10, outTokensM: 2 });
      delete (n.config as Record<string, unknown>)['provider'];
      // 10M × $0.25/M + 2M × $1.25/M = $5
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
      // 500 min × $0.01 + 100 GB × $0.15 + 10 GB × $0.023 = $20.23
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
      // 1000 × $0.01 + 200 × $0.15 + 100 × $0.023 = $42.30
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(42.3, 5);
    });

    it('bills build minutes at the selected build instance size rate', () => {
      // Non-build dimensions stay fixed: 100 GB × $0.15 + 10 GB × $0.023 = $15.23
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

  describe('missing-services batch pricing (report v2)', () => {
    const withConfig = (type: AwsServiceType, config: Record<string, unknown> = {}): ArchitectureNode => {
      const n = node(type);
      return { ...n, config: { ...n.config, ...config } as ArchitectureNode['config'] };
    };

    it('prices SES defaults and doubles up correctly with VDM + dedicated IP', () => {
      // 1000/day × 30 × $0.0001 + 1 GB × $0.12 = $3.12
      const n = withConfig('ses');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(3.12, 5);
      // + VDM 30000 × 0.00007 = 2.10, + 1 IP 24.95, + inbound 100/day × 30 × 0.0001 = 0.30
      const loaded = withConfig('ses', { vdmEnabled: true, dedicatedIPs: 1, inboundDailyVolume: 100 });
      expect(cost.calculateNodeCostUsd(loaded, 'us-east-1', [loaded])).toBeCloseTo(3.12 + 2.1 + 24.95 + 0.3, 5);
    });

    it('prices DocumentDB standard vs I/O-Optimized storage correctly', () => {
      // 2 × $0.2631 × 730 + 100 × $0.10 + 100M × $0.20 = 384.126 + 10 + 20
      const std = withConfig('documentDb');
      expect(cost.calculateNodeCostUsd(std, 'us-east-1', [std])).toBeCloseTo(2 * 0.2631 * 730 + 10 + 20, 5);
      // I/O-Optimized: higher instance + storage rate, no I/O line
      const io = withConfig('documentDb', { storageType: 'io-optimized' });
      expect(cost.calculateNodeCostUsd(io, 'us-east-1', [io])).toBeCloseTo(2 * 0.2895 * 730 + 100 * 0.30, 5);
    });

    it('prices Neptune instances, storage, and I/O', () => {
      // 2 × $0.3287 × 730 + 100 × $0.10 + 50 × $0.20 = 479.902 + 10 + 10
      const n = withConfig('neptune');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(2 * 0.3287 * 730 + 10 + 10, 5);
      const big = withConfig('neptune', { instanceClass: 'db.r6g.2xlarge', instanceCount: 1 });
      expect(cost.calculateNodeCostUsd(big, 'us-east-1', [big])).toBeCloseTo(1.3149 * 730 + 10 + 10, 5);
    });

    it('prices Timestream across all four dimensions', () => {
      // 100 × $0.50 + 10 × $0.036 × 730 + 100 × $0.03 + 1000 × $0.01 = 50 + 262.8 + 3 + 10
      const n = withConfig('timestream');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(50 + 262.8 + 3 + 10, 5);
    });

    it('prices AppConfig requests and per-target deployments', () => {
      // 10M × $0.20 + 100 targets × 10 deploys × $0.0008 = 2 + 0.8
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
      // 50 × $0.10 + 10M × $1.00 = 5 + 10
      const n = withConfig('cloudMap');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(15, 5);
    });

    it('prices QuickSight licenses and SPICE', () => {
      // 5 × $40 + 20 × $3 + 100 × $0.38 = 200 + 60 + 38
      const n = withConfig('quickSight');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(298, 5);
    });

    it('prices Lightsail bundles flat and bills only transfer overage', () => {
      // 2GB bundle: $0.01612 × 730 ≈ $11.77, 100 GB within 3 TB allowance → $0 overage
      const n = withConfig('lightsail');
      expect(cost.calculateNodeCostUsd(n, 'us-east-1', [n])).toBeCloseTo(0.01612 * 730, 5);
      // 0.5GB bundle with 1500 GB used: allowance 1024 GB → 476 GB × $0.09
      const over = withConfig('lightsail', { bundleSize: '0.5GB', bandwidthGB: 1500 });
      expect(cost.calculateNodeCostUsd(over, 'us-east-1', [over])).toBeCloseTo(0.00672 * 730 + 476 * 0.09, 5);
    });
  });

  // Broad net over the entire per-service cost switch (~70 cases). This guards
  // the decomposition: every type must stay finite, non-negative, deterministic,
  // and its breakdown total must equal its node cost.
  describe.each(allServiceTypes)('cost invariants for "%s"', (type) => {
    it('is finite, non-negative, deterministic, and breakdown-consistent', () => {
      const n = node(type);
      const first = cost.calculateNodeCostUsd(n, 'us-east-1', [n]);
      const second = cost.calculateNodeCostUsd(n, 'us-east-1', [n]);

      expect(Number.isFinite(first)).toBe(true);
      expect(first).toBeGreaterThanOrEqual(0);
      expect(second).toBe(first); // deterministic
      expect(cost.getCostBreakdown(n, 'us-east-1', [n]).total).toBeCloseTo(first, 5);
    });
  });
});
