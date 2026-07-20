import { describe, it, expect, beforeEach } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { ChallengeService } from './challenge.service';
import { RubricReviewer } from './evaluation/architecture-reviewer';
import { Challenge, ChallengeProgress, GraphRule, Hint, Milestone } from '../models/challenge.model';
import { makeChallenge } from '../testing/fixtures';

const anyRule = {} as GraphRule;

function milestone(id: string, hidden = false): Milestone {
  return { id, label: id, rule: anyRule, hidden };
}
function hint(id: string, order: number): Hint {
  return { id, title: id, body: `body ${id}`, order };
}

function activate(service: ChallengeService, challenge: Challenge, progress: ChallengeProgress): void {
  const internal = service as unknown as {
    activeChallengeSubject: BehaviorSubject<Challenge | null>;
    progressSubject: BehaviorSubject<ChallengeProgress | null>;
  };
  internal.activeChallengeSubject.next(challenge);
  internal.progressSubject.next(progress);
}

function progressWith(reached: string[], revealed: string[] = []): ChallengeProgress {
  return { challengeId: 'c', revealedHintIds: revealed, reachedMilestoneIds: reached, completed: false };
}

describe('ChallengeService', () => {
  let service: ChallengeService;

  const challenge = makeChallenge({
    id: 'c',
    milestones: [milestone('m1'), milestone('m2')],
    hints: [hint('h1', 1), hint('h2', 2), hint('h3', 3)],
  });

  beforeEach(() => {
    service = new ChallengeService(new RubricReviewer());
  });

  describe('catalog', () => {
    it('exposes a non-empty challenge catalog and looks up by id', () => {
      expect(service.challenges.length).toBeGreaterThan(0);
      const first = service.challenges[0];
      expect(service.getById(first.id)).toBe(first);
    });

    it('returns undefined for an unknown id', () => {
      expect(service.getById('does-not-exist')).toBeUndefined();
    });

    it('does not start an unknown challenge', () => {
      expect(service.start('does-not-exist')).toBeUndefined();
    });
  });

  describe('nextHintToReveal', () => {
    it('returns the hint for the first missing milestone', () => {
      activate(service, challenge, progressWith([]));
      expect(service.nextHintToReveal()?.id).toBe('h1');

      activate(service, challenge, progressWith(['m1']));
      expect(service.nextHintToReveal()?.id).toBe('h2');
    });

    it('returns the additional hint once all milestones are reached', () => {
      activate(service, challenge, progressWith(['m1', 'm2']));
      expect(service.nextHintToReveal()?.id).toBe('h3');
    });

    it('returns null when all milestones are reached and additional hints are revealed', () => {
      activate(service, challenge, progressWith(['m1', 'm2'], ['h3']));
      expect(service.nextHintToReveal()).toBeNull();
    });

    it('returns null when there is no active challenge', () => {
      expect(service.nextHintToReveal()).toBeNull();
    });
  });

  describe('revealNextHint', () => {
    it('reveals the next hint and records it in progress', () => {
      activate(service, challenge, progressWith([]));
      const revealed = service.revealNextHint();
      expect(revealed?.id).toBe('h1');
      let current: ChallengeProgress | null = null;
      service.progress$.subscribe((p) => (current = p));
      expect(current!.revealedHintIds).toContain('h1');
    });

    it('is idempotent when the next hint is already revealed', () => {
      activate(service, challenge, progressWith([], ['h1']));
      expect(service.revealNextHint()?.id).toBe('h1');
      let current: ChallengeProgress | null = null;
      service.progress$.subscribe((p) => (current = p));
      expect(current!.revealedHintIds).toEqual(['h1']);
    });
  });

  describe('revealedHints (gating)', () => {
    it('gates a revealed hint until its milestone is reached', () => {
      activate(service, challenge, progressWith([], ['h1', 'h2']));
      expect(service.revealedHints().map((h) => h.id)).toEqual(['h1']);
    });

    it('shows hints up to reachedCount + 1, in order', () => {
      activate(service, challenge, progressWith(['m1'], ['h1', 'h2']));
      expect(service.revealedHints().map((h) => h.id)).toEqual(['h1', 'h2']);
    });

    it('shows additional hints only once every milestone is reached', () => {
      activate(service, challenge, progressWith(['m1', 'm2'], ['h1', 'h2', 'h3']));
      expect(service.revealedHints().map((h) => h.id)).toEqual(['h1', 'h2', 'h3']);
    });
  });
});
