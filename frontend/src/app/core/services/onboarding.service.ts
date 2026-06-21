import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OnboardingStep } from '../models/challenge.model';
import onboardingData from '../data/onboarding.json';

const DONE_KEY = 'sds.onboardingComplete';

export type OnboardingEvent = 'nodeAdded' | 'edgeCreated' | 'configChanged' | 'simulationStarted';

/**
 * Drives the first-run guided tour. Advances either via the Next button
 * (`manual` steps) or when the user performs the action a step waits for
 * (`notify`). Completion is remembered in localStorage and is replayable.
 */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  readonly steps: OnboardingStep[] = (onboardingData as unknown as { steps: OnboardingStep[] }).steps;

  private readonly activeIndexSubject = new BehaviorSubject<number>(-1);
  /** Current step index, or -1 when the tour is not running. */
  readonly activeIndex$ = this.activeIndexSubject.asObservable();

  get currentStep(): OnboardingStep | null {
    const index = this.activeIndexSubject.value;
    return index >= 0 && index < this.steps.length ? this.steps[index] : null;
  }

  get isRunning(): boolean {
    return this.activeIndexSubject.value >= 0;
  }

  hasCompleted(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(DONE_KEY) === 'true';
  }

  /** Starts the tour unless it has already been completed (force to replay). */
  start(force = false): void {
    if (!force && this.hasCompleted()) return;
    if (this.steps.length === 0) return;
    this.activeIndexSubject.next(0);
  }

  next(): void {
    const index = this.activeIndexSubject.value;
    if (index < 0) return;
    if (index >= this.steps.length - 1) {
      this.finish();
    } else {
      this.activeIndexSubject.next(index + 1);
    }
  }

  skip(): void {
    this.finish();
  }

  /** Advances the tour if the current step is waiting on this action. */
  notify(event: OnboardingEvent): void {
    const step = this.currentStep;
    if (step && step.completeOn === event) {
      this.next();
    }
  }

  private finish(): void {
    this.activeIndexSubject.next(-1);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(DONE_KEY, 'true');
      } catch {
        // ignore persistence failures
      }
    }
  }
}
