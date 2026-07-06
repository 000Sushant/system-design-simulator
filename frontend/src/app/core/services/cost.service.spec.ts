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
  const billableTypes: AwsServiceType[] = ['ec2', 's3', 'lambda', 'rds', 'dynamoDb', 'apiGateway'];

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
