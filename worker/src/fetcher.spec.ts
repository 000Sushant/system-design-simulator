import { describe, it, expect } from 'vitest';
import { extractMaxPrice, extractMatchingPrice } from './fetcher';

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

  it('falls back to the first item when no item matches the predicate', () => {
    const result = {
      PriceList: [priceItem(['0.10'], { sku: 'A' }), priceItem(['0.20'], { sku: 'B' })],
    };
    expect(extractMatchingPrice(result, (p) => p.sku === 'ZZZ')).toBe(0.1);
  });

  it('ignores items whose JSON does not parse when matching', () => {
    const result = { PriceList: ['{broken', priceItem(['0.30'], { sku: 'C' })] };
    expect(extractMatchingPrice(result, (p) => p.sku === 'C')).toBe(0.3);
  });
});
