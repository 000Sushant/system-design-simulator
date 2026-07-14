import { describe, it, expect, vi } from 'vitest';
import { extractMaxPrice, extractMatchingPrice, PricingFetcher } from './fetcher';

/** Builds a raw AWS GetProducts item with the given per-dimension USD prices. */
function priceItem(usdValues: Array<string | null>, extra: Record<string, unknown> = {}): string {
  const priceDimensions: Record<string, unknown> = {};
  usdValues.forEach((usd, i) => {
    priceDimensions[`dim${i}`] = usd === null ? {} : { pricePerUnit: { USD: usd } };
  });
  return JSON.stringify({ ...extra, terms: { OnDemand: { offer1: { priceDimensions } } } });
}

describe('extractMaxPrice', () => {
  it('extracts the USD price from a single price dimension', () => {
    expect(extractMaxPrice(priceItem(['0.096']))).toBe(0.096);
  });

  it('returns the maximum across dimensions so free-tier rates do not mask the standard rate', () => {
    expect(extractMaxPrice(priceItem(['0.0', '0.085', '0.04']))).toBe(0.085);
  });

  it('returns null when there are no OnDemand terms', () => {
    expect(extractMaxPrice(JSON.stringify({ terms: {} }))).toBeNull();
  });

  it('returns null for malformed JSON', () => {
    expect(extractMaxPrice('{not valid')).toBeNull();
  });

  it('returns null when no dimension carries a USD price', () => {
    expect(extractMaxPrice(priceItem([null]))).toBeNull();
  });
});

describe('extractMatchingPrice', () => {
  it('returns null when the price list is empty or missing', () => {
    expect(extractMatchingPrice({ PriceList: [] }, () => true)).toBeNull();
    expect(extractMatchingPrice({}, () => true)).toBeNull();
  });

  it('picks the item satisfying the predicate', () => {
    const result = {
      PriceList: [
        priceItem(['0.10'], { sku: 'A' }),
        priceItem(['0.20'], { sku: 'B' }),
      ],
    };
    expect(extractMatchingPrice(result, (p) => p.sku === 'B')).toBe(0.2);
  });

  it('returns null when no item matches the predicate (never prices a wrong product)', () => {
    const result = {
      PriceList: [priceItem(['0.10'], { sku: 'A' }), priceItem(['0.20'], { sku: 'B' })],
    };
    expect(extractMatchingPrice(result, (p) => p.sku === 'ZZZ')).toBeNull();
  });

  it('ignores items whose JSON does not parse when matching', () => {
    const result = { PriceList: ['{broken', priceItem(['0.30'], { sku: 'C' })] };
    expect(extractMatchingPrice(result, (p) => p.sku === 'C')).toBe(0.3);
  });
});

/** Bedrock price list item for the AmazonBedrock (on-demand) offer. */
function odItem(attributes: Record<string, string>, usd: string): string {
  return priceItem([usd], { product: { attributes } });
}

/** Installs a fake signed-fetch returning one page per call. */
function fetcherWithPages(pages: Array<{ PriceList: string[]; NextToken?: string }>): PricingFetcher {
  const fetcher = new PricingFetcher('key', 'secret');
  let call = 0;
  (fetcher as any).aws = {
    fetch: vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => pages[Math.min(call++, pages.length - 1)],
    })),
  };
  return fetcher;
}

describe('bedrockOnDemand', () => {
  it('collects standard-tier text token rates across pages, keyed by model', async () => {
    const fetcher = fetcherWithPages([
      {
        PriceList: [
          odItem({ feature: 'On-demand Inference', model: 'Nova Pro', inferenceType: 'Input tokens' }, '0.0008'),
          odItem({ feature: 'On-demand Inference', model: 'Nova Pro', inferenceType: 'Output tokens' }, '0.0032'),
          // flex tier must be ignored
          odItem({ feature: 'On-demand Inference', model: 'Nova Pro', inferenceType: 'Input tokens flex', service_tier: 'flex' }, '0.0004'),
          // image SKUs must be ignored
          odItem({ feature: 'On-demand Inference', model: 'Nova Pro', inferenceType: 'Input Image Token Count' }, '0.001'),
        ],
        NextToken: 'page2',
      },
      {
        PriceList: [
          // Titan models carry the titanModel attribute instead of model
          odItem({ feature: 'On-demand Inference', titanModel: 'Titan Text G1 Lite', inferenceType: 'Text Input Tokens' }, '0.00015'),
          odItem({ feature: 'On-demand Inference', titanModel: 'Titan Text G1 Lite', inferenceType: 'Text Output Tokens' }, '0.0002'),
        ],
      },
    ]);

    const rates = await fetcher.bedrockOnDemand('US East (N. Virginia)');
    expect(rates['Nova Pro']).toEqual({ in: 0.0008, out: 0.0032 });
    expect(rates['Titan Text G1 Lite']).toEqual({ in: 0.00015, out: 0.0002 });
  });
});

describe('bedrockMarketplace', () => {
  const mpItem = (servicename: string, usagetype: string, usd: string) =>
    priceItem([usd], { product: { attributes: { servicename, usagetype } } });

  it('prefers regional standard SKUs and falls back to global ones', async () => {
    const fetcher = fetcherWithPages([
      {
        PriceList: [
          // Regional + global present: regional must win
          mpItem('Claude Sonnet 5 (Amazon Bedrock Edition)', 'USE1-MP:USE1_input_tokens_standard-Units', '2.2'),
          mpItem('Claude Sonnet 5 (Amazon Bedrock Edition)', 'USE1-MP:USE1_input_tokens_global_standard-Units', '2.0'),
          mpItem('Claude Sonnet 5 (Amazon Bedrock Edition)', 'USE1-MP:USE1_output_tokens_standard-Units', '11'),
          // Only global present (cross-region inference regions)
          mpItem('Claude Opus 4.8 (Amazon Bedrock Edition)', 'APS3-MP:APS3_input_tokens_global_standard-Units', '5.0'),
          mpItem('Claude Opus 4.8 (Amazon Bedrock Edition)', 'APS3-MP:APS3_output_tokens_global_standard-Units', '25'),
          // Legacy-style marketplace usagetypes
          mpItem('Jamba 1.5 Mini (Amazon Bedrock Edition)', 'USE1-MP:USE1_InputTokenCount-Units', '0.2'),
          mpItem('Jamba 1.5 Mini (Amazon Bedrock Edition)', 'USE1-MP:USE1_OutputTokenCount-Units', '0.4'),
          // Batch/cache SKUs must be ignored
          mpItem('Claude Sonnet 5 (Amazon Bedrock Edition)', 'USE1-MP:USE1_InputTokenCount_Batch-Units', '1.1'),
          mpItem('Claude Sonnet 5 (Amazon Bedrock Edition)', 'USE1-MP:USE1_CacheReadInputTokenCount-Units', '0.22'),
        ],
      },
    ]);

    const rates = await fetcher.bedrockMarketplace('US East (N. Virginia)');
    expect(rates['Claude Sonnet 5 (Amazon Bedrock Edition)']).toEqual({ in: 2.2, out: 11 });
    expect(rates['Claude Opus 4.8 (Amazon Bedrock Edition)']).toEqual({ in: 5, out: 25 });
    expect(rates['Jamba 1.5 Mini (Amazon Bedrock Edition)']).toEqual({ in: 0.2, out: 0.4 });
  });
});
