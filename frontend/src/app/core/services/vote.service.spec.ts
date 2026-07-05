import { describe, it, expect, beforeEach, vi } from 'vitest';

// Votes are only enabled when a Worker base URL is configured.
vi.mock('../../../environments/environment', () => ({
  environment: { votesApiBase: 'https://worker.test' },
}));

import { VoteService } from './vote.service';

interface FetchCall {
  url: string;
  init?: RequestInit;
}

let fetchCalls: FetchCall[];

/** Installs a fetch stub that returns the given JSON bodies in call order. */
function stubFetch(responses: Array<{ ok?: boolean; body?: unknown }>): void {
  let i = 0;
  fetchCalls = [];
  globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    fetchCalls.push({ url: String(url), init });
    const r = responses[i++] ?? { ok: true, body: {} };
    return { ok: r.ok ?? true, json: async () => r.body } as Response;
  }) as unknown as typeof fetch;
}

function lastPostBody(): { challengeId: string; upDelta: number; downDelta: number } {
  const posts = fetchCalls.filter((c) => c.init?.method === 'POST');
  const post = posts[posts.length - 1];
  return JSON.parse(post.init!.body as string);
}

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(() => {
    service = new VoteService();
  });

  it('is enabled when a votes API base is configured', () => {
    expect(service.enabled).toBe(true);
  });

  it('defaults to a zero tally and no personal vote', () => {
    expect(service.tally('c')).toEqual({ up: 0, down: 0 });
    expect(service.myVote('c')).toBeNull();
  });

  describe('load', () => {
    it('populates tallies from the worker', async () => {
      stubFetch([{ body: { c1: { up: 4, down: 1 } } }]);
      await service.load();
      expect(service.tally('c1')).toEqual({ up: 4, down: 1 });
    });

    it('leaves tallies empty when the request fails', async () => {
      stubFetch([{ ok: false }]);
      await service.load();
      expect(service.tally('c1')).toEqual({ up: 0, down: 0 });
    });
  });

  describe('vote deltas', () => {
    it('a first up-vote sends +1 up and optimistically increments', async () => {
      stubFetch([{ body: { up: 1, down: 0 } }]);
      await service.vote('c', 'up');
      expect(lastPostBody()).toEqual({ challengeId: 'c', upDelta: 1, downDelta: 0 });
      expect(service.myVote('c')).toBe('up');
      expect(service.tally('c')).toEqual({ up: 1, down: 0 });
    });

    it('clicking the same direction again toggles the vote off (-1)', async () => {
      stubFetch([{ body: { up: 1, down: 0 } }, { body: { up: 0, down: 0 } }]);
      await service.vote('c', 'up');
      await service.vote('c', 'up');
      expect(lastPostBody()).toEqual({ challengeId: 'c', upDelta: -1, downDelta: 0 });
      expect(service.myVote('c')).toBeNull();
    });

    it('switching sides sends -1/+1 in one delta', async () => {
      stubFetch([{ body: { up: 1, down: 0 } }, { body: { up: 0, down: 1 } }]);
      await service.vote('c', 'up');
      await service.vote('c', 'down');
      expect(lastPostBody()).toEqual({ challengeId: 'c', upDelta: -1, downDelta: 1 });
      expect(service.myVote('c')).toBe('down');
    });

    it('reconciles the tally with the server response', async () => {
      stubFetch([{ body: { up: 42, down: 7 } }]);
      await service.vote('c', 'up');
      expect(service.tally('c')).toEqual({ up: 42, down: 7 });
    });

    it('keeps the optimistic value when the server call throws', async () => {
      globalThis.fetch = vi.fn(async () => {
        throw new Error('offline');
      }) as unknown as typeof fetch;
      await service.vote('c', 'up');
      expect(service.tally('c')).toEqual({ up: 1, down: 0 });
      expect(service.myVote('c')).toBe('up');
    });

    it('never lets an optimistic tally go negative', async () => {
      // No prior server tally, toggling off would compute up-1 → clamped at 0.
      stubFetch([{ body: { up: 1, down: 0 } }, { body: { up: 0, down: 0 } }]);
      await service.vote('c', 'up');
      // Reset optimistic base by reading, then toggle off from up:1
      await service.vote('c', 'up');
      expect(service.tally('c').up).toBeGreaterThanOrEqual(0);
    });
  });
});
