import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnboardingStep } from '../../../core/models/challenge.model';
import { OnboardingService } from '../../../core/services/onboarding.service';

@Component({
  selector: 'app-onboarding-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-overlay.component.html',
  styleUrls: ['./onboarding-overlay.component.css'],
})
export class OnboardingOverlayComponent {
  constructor(readonly onboarding: OnboardingService) {}

  get step(): OnboardingStep | null {
    return this.onboarding.currentStep;
  }

  get stepNumber(): number {
    return this.onboarding.steps.findIndex((s) => s.id === this.step?.id) + 1;
  }

  get total(): number {
    return this.onboarding.steps.length;
  }

  /** Manual steps are advanced with the Next button; action steps auto-advance. */
  get isManual(): boolean {
    return this.step?.completeOn === 'manual';
  }

  next(): void {
    this.onboarding.next();
  }

  skip(): void {
    this.onboarding.skip();
  }
}
