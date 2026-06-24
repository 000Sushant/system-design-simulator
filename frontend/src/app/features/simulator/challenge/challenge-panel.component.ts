import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Challenge,
  ChallengeProgress,
  Difficulty,
  Hint,
  ReviewResult,
  Milestone,
} from '../../../core/models/challenge.model';
import { ChallengeService } from '../../../core/services/challenge.service';
import { VoteService } from '../../../core/services/vote.service';
import { AwsCatalogService } from '../../../core/services/aws-catalog.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AwsServiceType } from '../../../core/models/architecture.model';
import { ChallengeTagComponent, categoryStyle } from './challenge-tag.component';

@Component({
  selector: 'app-challenge-panel',
  standalone: true,
  imports: [CommonModule, ChallengeTagComponent],
  templateUrl: './challenge-panel.component.html',
  styleUrls: ['./challenge-panel.component.css'],
})
export class ChallengePanelComponent implements OnInit, OnDestroy, AfterViewChecked {
  /** Asks the host to scaffold a fresh canvas for this challenge. */
  @Output() startChallenge = new EventEmitter<Challenge>();
  /** Asks the host to clear the canvas when resetting a challenge. */
  @Output() resetChallenge = new EventEmitter<Challenge>();
  /** Asks the host to load the curated sandbox preset. */
  @Output() freePractice = new EventEmitter<void>();
  /** Asks the host to (re)play the onboarding tour. */
  @Output() replayTour = new EventEmitter<void>();
  /** Asks the host to evaluate the current canvas. */
  @Output() requestEvaluate = new EventEmitter<void>();
  /** Asks the host to load the reference solution onto the canvas. */
  @Output() showReference = new EventEmitter<Challenge>();

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  selectedDiff: Difficulty = 'easy';

  active: Challenge | null = null;
  progress: ChallengeProgress | null = null;
  review: ReviewResult | null = null;

  private subscriptions: Subscription[] = [];

  indicatorStyle: any = { opacity: '0' };

  /** Collapsible state for the post-completion solution walkthrough. */
  solutionExpanded = true;

  constructor(
    private el: ElementRef,
    readonly challenges: ChallengeService,
    readonly votes: VoteService,
    private readonly catalog: AwsCatalogService,
    private readonly theme: ThemeService,
  ) {}

  /** Mascot illustration, swapped for a dark-friendly variant in dark mode. */
  get mascotImage(): string {
    return this.theme.isDark
      ? 'assets/mascot/server-metaphor-dark.png'
      : 'assets/mascot/server-metaphor.png';
  }

  /** Icon URL for a service shown in the solution walkthrough. */
  solutionIcon(type: AwsServiceType): string {
    return this.catalog.getByType(type).iconUrl;
  }

  /** Theme color for a service shown in the solution walkthrough. */
  solutionColor(type: AwsServiceType): string {
    return this.catalog.getByType(type).color;
  }

  toggleSolution(): void {
    this.solutionExpanded = !this.solutionExpanded;
  }

  ngAfterViewChecked(): void {
    this.updateIndicator();
  }

  updateIndicator(): void {
    const activeBtn = this.el.nativeElement.querySelector('.tab-btn.active');
    if (activeBtn) {
      const parent = activeBtn.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const rect = activeBtn.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(parent);
        const borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
        const borderTop = parseFloat(parentStyle.borderTopWidth) || 0;
        const left = rect.left - parentRect.left - borderLeft;
        const top = rect.top - parentRect.top - borderTop;

        const newStyle = {
          transform: `translate3d(${left}px, ${top}px, 0)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          opacity: '1'
        };

        if (
          this.indicatorStyle.transform !== newStyle.transform ||
          this.indicatorStyle.width !== newStyle.width ||
          this.indicatorStyle.height !== newStyle.height ||
          this.indicatorStyle.opacity !== newStyle.opacity
        ) {
          Promise.resolve().then(() => {
            this.indicatorStyle = newStyle;
          });
        }
      }
    } else {
      if (this.indicatorStyle.opacity !== '0') {
        Promise.resolve().then(() => {
          this.indicatorStyle = { opacity: '0' };
        });
      }
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.challenges.activeChallenge$.subscribe((c) => (this.active = c)),
      this.challenges.progress$.subscribe((p) => (this.progress = p)),
      this.challenges.lastReview$.subscribe((r) => (this.review = r)),
    );
    void this.votes.load();
  }

  /** Casts a vote without triggering the card's open action. */
  onVote(challenge: Challenge, direction: 'up' | 'down', event: Event): void {
    event.stopPropagation();
    void this.votes.vote(challenge.id, direction);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  challengesByDifficulty(difficulty: Difficulty): Challenge[] {
    return this.challenges.challenges.filter((c) => c.difficulty === difficulty);
  }

  /** Count of authored (playable) challenges in a difficulty, for the tab badge. */
  authoredCount(difficulty: Difficulty): number {
    return this.challengesByDifficulty(difficulty).filter((c) => c.authored).length;
  }

  isCompleted(challenge: Challenge): boolean {
    return !!this.challenges.progressFor(challenge.id)?.completed;
  }

  isClearedWithMaxScore(): boolean {
    if (!this.active || !this.progress) return false;
    const maxScore = this.maxPossibleScore();
    return !!(this.progress.completed && (this.progress.lastScore ?? 0) >= maxScore);
  }

  maxPossibleScore(): number {
    if (!this.active) return 100;
    const standardChecks = this.active.rubric.checks.filter(c => !c.optional);
    const standardWeight = standardChecks.reduce((sum, c) => sum + c.weight, 0) || 1;
    const totalWeight = this.active.rubric.checks.reduce((sum, c) => sum + c.weight, 0);
    return Math.round((totalWeight / standardWeight) * 100);
  }

  standardMilestones(): Milestone[] {
    if (!this.active) return [];
    return this.active.milestones.filter(m => !m.hidden);
  }

  /** Only the completed standard milestones, so the list can number them 1..N
   *  by how many are done (not by their fixed position in the full list). */
  reachedStandardMilestones(): Milestone[] {
    if (!this.progress) return [];
    return this.standardMilestones().filter(m => this.progress!.reachedMilestoneIds.includes(m.id));
  }

  reachedHiddenMilestones(): Milestone[] {
    if (!this.active || !this.progress) return [];
    return this.active.milestones.filter(m => m.hidden && this.progress!.reachedMilestoneIds.includes(m.id));
  }

  reachedHiddenCount(): number {
    return this.reachedHiddenMilestones().length;
  }

  totalHiddenCount(): number {
    if (!this.active) return 0;
    return this.active.milestones.filter(m => m.hidden).length;
  }

  hasHiddenMilestones(challenge: Challenge): boolean {
    return challenge.milestones.some(m => m.hidden);
  }

  hiddenMilestonesCount(challenge: Challenge): number {
    return challenge.milestones.filter(m => m.hidden).length;
  }

  savedScore(challenge: Challenge): number | undefined {
    return this.challenges.progressFor(challenge.id)?.lastScore;
  }

  /** A topic icon derived from the challenge title (purely cosmetic). */
  iconFor(challenge: Challenge): string {
    const t = challenge.title.toLowerCase();
    if (/(url|shorten|link|dns|cdn)/.test(t)) return 'fa-link';
    if (/(chat|messeng|notif|inbox)/.test(t)) return 'fa-comments';
    if (/(video|stream|youtube|live)/.test(t)) return 'fa-video';
    if (/(shop|commerce|checkout|cart|order)/.test(t)) return 'fa-cart-shopping';
    if (/(paste|doc|snippet|note)/.test(t)) return 'fa-file-lines';
    if (/(feed|photo|insta|celebrity|image|gram)/.test(t)) return 'fa-camera-retro';
    if (/(rate|limit|throttle)/.test(t)) return 'fa-gauge-high';
    if (/(schedul|job|cron|queue|task)/.test(t)) return 'fa-clock';
    if (/(search|index)/.test(t)) return 'fa-magnifying-glass';
    return 'fa-sitemap';
  }

  /** Accent color for a challenge's icon tile (by category). */
  accentFor(challenge: Challenge): string {
    return categoryStyle(challenge.category).color;
  }

  revealedHints(): Hint[] {
    return this.challenges.revealedHints();
  }

  hasHintToReveal(): boolean {
    return this.challenges.nextHintToReveal() !== null;
  }

  isCurrentHintRevealed(): boolean {
    const nextHint = this.challenges.nextHintToReveal();
    if (!nextHint || !this.progress) return false;
    return this.progress.revealedHintIds.includes(nextHint.id);
  }

  remainingHintCount(): number {
    if (!this.active || !this.progress) return 0;
    return this.active.hints.length - this.progress.revealedHintIds.length;
  }

  isMilestoneReached(milestoneId: string): boolean {
    return !!this.progress?.reachedMilestoneIds.includes(milestoneId);
  }

  reachedCount(): number {
    if (!this.active || !this.progress) return 0;
    return this.active.milestones.filter((m) => !m.hidden && this.progress!.reachedMilestoneIds.includes(m.id)).length;
  }

  milestonePercent(): number {
    if (!this.active) return 0;
    const standards = this.active.milestones.filter(m => !m.hidden);
    if (standards.length === 0) return 0;
    return Math.round((this.reachedCount() / standards.length) * 100);
  }

  onSelect(challenge: Challenge): void {
    if (!challenge.authored) return;
    this.startChallenge.emit(challenge);
  }

  onRevealHint(): void {
    this.challenges.revealNextHint();
  }

  onDesignAgain(): void {
    if (!this.active) return;
    this.challenges.reset(this.active.id);
    this.resetChallenge.emit(this.active);
  }

  onExit(): void {
    this.challenges.exit();
  }
}
