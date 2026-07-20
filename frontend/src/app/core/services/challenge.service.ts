import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ArchitectureConnection, ArchitectureNode } from '../models/architecture.model';
import {
  Challenge,
  ChallengeProgress,
  Hint,
  Milestone,
  ReviewResult,
} from '../models/challenge.model';
import challengesData from '../data/challenges.json';
import { RubricReviewer, evaluateMilestones } from './evaluation/architecture-reviewer';

const PROGRESS_KEY = 'sds.challengeProgress';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  constructor(private readonly reviewer: RubricReviewer) {}

  readonly challenges: Challenge[] = (challengesData as unknown as { challenges: Challenge[] })
    .challenges;

  private readonly activeChallengeSubject = new BehaviorSubject<Challenge | null>(null);
  readonly activeChallenge$ = this.activeChallengeSubject.asObservable();

  private readonly progressSubject = new BehaviorSubject<ChallengeProgress | null>(null);
  readonly progress$ = this.progressSubject.asObservable();

  private readonly milestoneReachedSubject = new Subject<{
    milestone: Milestone;
    number: number;
    total: number;
    isHidden?: boolean;
  }>();
  readonly milestoneReached$ = this.milestoneReachedSubject.asObservable();

  private readonly lastReviewSubject = new BehaviorSubject<ReviewResult | null>(null);
  readonly lastReview$ = this.lastReviewSubject.asObservable();

  getById(id: string): Challenge | undefined {
    return this.challenges.find((challenge) => challenge.id === id);
  }

  start(id: string): Challenge | undefined {
    const challenge = this.getById(id);
    if (!challenge || !challenge.authored) {
      return undefined;
    }
    const saved = this.loadProgress()[id];
    const progress: ChallengeProgress = saved ?? {
      challengeId: id,
      revealedHintIds: [],
      reachedMilestoneIds: [],
      completed: false,
    };
    this.activeChallengeSubject.next(challenge);
    this.progressSubject.next(progress);

    if (progress.completed) {
      const score = progress.lastScore ?? 100;
      this.lastReviewSubject.next({
        score,
        passScore: challenge.rubric.passScore,
        passed: true,
        milestonesReached: progress.reachedMilestoneIds,
        findings: [
          {
            severity: 'pass',
            message: 'All rubric checks passed successfully!',
          },
        ],
      });
    } else {
      this.lastReviewSubject.next(null);
    }
    return challenge;
  }

  reset(id: string): void {
    const challenge = this.getById(id);
    if (!challenge) return;

    const progress: ChallengeProgress = {
      challengeId: id,
      revealedHintIds: [],
      reachedMilestoneIds: [],
      completed: false,
      lastScore: undefined,
    };
    this.commit(progress);

    if (this.activeChallengeSubject.value?.id === id) {
      this.progressSubject.next(progress);
      this.lastReviewSubject.next(null);
    }
  }

  exit(): void {
    this.activeChallengeSubject.next(null);
    this.progressSubject.next(null);
    this.lastReviewSubject.next(null);
  }

  nextHintToReveal(): Hint | null {
    const challenge = this.activeChallengeSubject.value;
    const progress = this.progressSubject.value;
    if (!challenge || !progress) return null;

    const firstMissingIndex = challenge.milestones.findIndex(
      (m) => !progress.reachedMilestoneIds.includes(m.id),
    );
    if (firstMissingIndex === -1) {
      const unrevealedAdditionalHints = challenge.hints
        .filter(
          (h) => h.order > challenge.milestones.length && !progress.revealedHintIds.includes(h.id),
        )
        .sort((a, b) => a.order - b.order);
      return unrevealedAdditionalHints[0] || null;
    }

    const targetOrder = firstMissingIndex + 1;
    const hint = challenge.hints.find((h) => h.order === targetOrder);
    return hint ?? null;
  }

  revealNextHint(): Hint | null {
    const challenge = this.activeChallengeSubject.value;
    const progress = this.progressSubject.value;
    if (!challenge || !progress) return null;

    const next = this.nextHintToReveal();
    if (!next) return null;

    if (progress.revealedHintIds.includes(next.id)) return next;

    const updated: ChallengeProgress = {
      ...progress,
      revealedHintIds: [...progress.revealedHintIds, next.id],
    };
    this.commit(updated);
    return next;
  }

  revealedHints(): Hint[] {
    const challenge = this.activeChallengeSubject.value;
    const progress = this.progressSubject.value;
    if (!challenge || !progress) return [];

    const standardMilestones = challenge.milestones.filter((m) => !m.hidden);
    const reachedCount = standardMilestones.filter((m) =>
      progress.reachedMilestoneIds.includes(m.id),
    ).length;

    const allReached = challenge.milestones.every((m) =>
      progress.reachedMilestoneIds.includes(m.id),
    );

    return challenge.hints
      .filter((hint) => {
        if (!progress.revealedHintIds.includes(hint.id)) return false;

        if (hint.order > challenge.milestones.length) {
          return allReached;
        }

        return hint.order <= reachedCount + 1;
      })
      .sort((a, b) => a.order - b.order);
  }

  notifyGraphChanged(nodes: ArchitectureNode[], connections: ArchitectureConnection[]): void {
    const challenge = this.activeChallengeSubject.value;
    const progress = this.progressSubject.value;
    if (!challenge || !progress) return;

    const reached = evaluateMilestones({ nodes, connections }, challenge);

    if (progress.completed) {
      const previouslyReachedStandard = challenge.milestones.filter(
        (m) => !m.hidden && progress.reachedMilestoneIds.includes(m.id),
      ).length;
      const newlyReachedStandard = challenge.milestones.filter(
        (m) => !m.hidden && reached.includes(m.id),
      ).length;
      if (newlyReachedStandard < previouslyReachedStandard) {
        return;
      }
    }

    const previously = new Set(progress.reachedMilestoneIds);
    const newlyReached = reached.filter((id) => !previously.has(id));

    if (newlyReached.length === 0 && reached.length === progress.reachedMilestoneIds.length) {
      return;
    }

    const updated: ChallengeProgress = { ...progress, reachedMilestoneIds: reached };
    this.commit(updated);

    const standardMilestones = challenge.milestones.filter((m) => !m.hidden);

    for (const id of newlyReached) {
      const milestone = challenge.milestones.find((m) => m.id === id);
      if (milestone) {
        if (milestone.hidden) {
          this.milestoneReachedSubject.next({
            milestone,
            number: 0,
            total: 0,
            isHidden: true,
          });
        } else {
          const index = standardMilestones.findIndex((m) => m.id === id);
          this.milestoneReachedSubject.next({
            milestone,
            number: index + 1,
            total: standardMilestones.length,
            isHidden: false,
          });
        }
      }
    }
  }

  evaluate(nodes: ArchitectureNode[], connections: ArchitectureConnection[]): ReviewResult | null {
    const challenge = this.activeChallengeSubject.value;
    const progress = this.progressSubject.value;
    if (!challenge || !progress) return null;

    const result = this.reviewer.review({ nodes, connections }, challenge);
    const updated: ChallengeProgress = {
      ...progress,
      reachedMilestoneIds: result.milestonesReached,
      lastScore: result.score,
      completed: progress.completed || result.passed,
    };
    this.commit(updated);
    this.lastReviewSubject.next(result);
    return result;
  }

  progressFor(id: string): ChallengeProgress | undefined {
    return this.loadProgress()[id];
  }

  private commit(progress: ChallengeProgress): void {
    this.progressSubject.next(progress);
    const all = this.loadProgress();
    all[progress.challengeId] = progress;
    this.saveProgress(all);
  }

  private loadProgress(): Record<string, ChallengeProgress> {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, ChallengeProgress>) : {};
    } catch {
      return {};
    }
  }

  private saveProgress(all: Record<string, ChallengeProgress>): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    } catch {
    }
  }
}
