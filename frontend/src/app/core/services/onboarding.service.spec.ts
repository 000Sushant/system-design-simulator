import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OnboardingService, OnboardingEvent } from './onboarding.service';
import { OnboardingStep } from '../models/challenge.model';

const DONE_KEY = 'sds.onboardingComplete';

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as { localStorage?: unknown }).localStorage = storage;
});

afterEach(() => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
});

function step(id: string, completeOn?: OnboardingEvent): OnboardingStep {
  return { id, completeOn } as unknown as OnboardingStep;
}

function serviceWithSteps(steps: OnboardingStep[]): OnboardingService {
  const service = new OnboardingService();
  (service as unknown as { steps: OnboardingStep[] }).steps = steps;
  return service;
}

describe('OnboardingService', () => {
  describe('start', () => {
    it('starts at step 0 when not previously completed', () => {
      const service = serviceWithSteps([step('a'), step('b')]);
      service.start();
      expect(service.isRunning).toBe(true);
      expect(service.currentStep?.id).toBe('a');
    });

    it('does not start when already completed', () => {
      storage.setItem(DONE_KEY, 'true');
      const service = serviceWithSteps([step('a')]);
      service.start();
      expect(service.isRunning).toBe(false);
    });

    it('replays when forced, even if completed', () => {
      storage.setItem(DONE_KEY, 'true');
      const service = serviceWithSteps([step('a')]);
      service.start(true);
      expect(service.isRunning).toBe(true);
    });

    it('does nothing when there are no steps', () => {
      const service = serviceWithSteps([]);
      service.start();
      expect(service.isRunning).toBe(false);
    });
  });

  describe('next', () => {
    it('advances to the following step', () => {
      const service = serviceWithSteps([step('a'), step('b')]);
      service.start();
      service.next();
      expect(service.currentStep?.id).toBe('b');
    });

    it('finishes and persists completion when past the last step', () => {
      const service = serviceWithSteps([step('a')]);
      service.start();
      service.next();
      expect(service.isRunning).toBe(false);
      expect(storage.getItem(DONE_KEY)).toBe('true');
      expect(service.hasCompleted()).toBe(true);
    });

    it('is a no-op when the tour is not running', () => {
      const service = serviceWithSteps([step('a')]);
      service.next();
      expect(service.isRunning).toBe(false);
      expect(storage.getItem(DONE_KEY)).toBeNull();
    });
  });

  describe('skip', () => {
    it('finishes the tour and marks it completed', () => {
      const service = serviceWithSteps([step('a'), step('b')]);
      service.start();
      service.skip();
      expect(service.isRunning).toBe(false);
      expect(service.hasCompleted()).toBe(true);
    });
  });

  describe('notify', () => {
    it('advances when the current step is waiting on that event', () => {
      const service = serviceWithSteps([step('a', 'nodeAdded'), step('b')]);
      service.start();
      service.notify('nodeAdded');
      expect(service.currentStep?.id).toBe('b');
    });

    it('ignores an event the current step is not waiting on', () => {
      const service = serviceWithSteps([step('a', 'nodeAdded'), step('b')]);
      service.start();
      service.notify('edgeCreated');
      expect(service.currentStep?.id).toBe('a');
    });

    it('does nothing when the tour is not running', () => {
      const service = serviceWithSteps([step('a', 'nodeAdded')]);
      service.notify('nodeAdded');
      expect(service.isRunning).toBe(false);
    });
  });

  describe('currentStep', () => {
    it('is null when the tour is not running', () => {
      const service = serviceWithSteps([step('a')]);
      expect(service.currentStep).toBeNull();
    });
  });
});
