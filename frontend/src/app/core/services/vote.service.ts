import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VoteTally {
  up: number;
  down: number;
}

export type VoteChoice = 'up' | 'down' | null;

const MY_VOTES_KEY = 'sds.challengeVotes';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private readonly talliesSubject = new BehaviorSubject<Record<string, VoteTally>>({});
  readonly tallies$ = this.talliesSubject.asObservable();

  private myVotes: Record<string, VoteChoice> = this.loadMyVotes();

  get enabled(): boolean {
    return !!environment.votesApiBase;
  }

  myVote(challengeId: string): VoteChoice {
    return this.myVotes[challengeId] ?? null;
  }

  tally(challengeId: string): VoteTally {
    return this.talliesSubject.value[challengeId] ?? { up: 0, down: 0 };
  }

  async load(): Promise<void> {
    if (!this.enabled) return;
    try {
      const res = await fetch(`${environment.votesApiBase}/votes`);
      if (!res.ok) return;
      this.talliesSubject.next((await res.json()) as Record<string, VoteTally>);
    } catch {
    }
  }

  async vote(challengeId: string, direction: 'up' | 'down'): Promise<void> {
    if (!this.enabled) return;

    const prev = this.myVote(challengeId);
    const next: VoteChoice = prev === direction ? null : direction;

    const upDelta = (next === 'up' ? 1 : 0) - (prev === 'up' ? 1 : 0);
    const downDelta = (next === 'down' ? 1 : 0) - (prev === 'down' ? 1 : 0);
    if (upDelta === 0 && downDelta === 0) return;

    const current = this.tally(challengeId);
    this.patchTally(challengeId, {
      up: Math.max(0, current.up + upDelta),
      down: Math.max(0, current.down + downDelta),
    });
    this.myVotes[challengeId] = next;
    this.saveMyVotes();

    try {
      const res = await fetch(`${environment.votesApiBase}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, upDelta, downDelta }),
      });
      if (res.ok) {
        const body = (await res.json()) as { up: number; down: number };
        this.patchTally(challengeId, { up: body.up, down: body.down });
      }
    } catch {
    }
  }

  private patchTally(challengeId: string, tally: VoteTally): void {
    this.talliesSubject.next({ ...this.talliesSubject.value, [challengeId]: tally });
  }

  private loadMyVotes(): Record<string, VoteChoice> {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(MY_VOTES_KEY);
      return raw ? (JSON.parse(raw) as Record<string, VoteChoice>) : {};
    } catch {
      return {};
    }
  }

  private saveMyVotes(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(MY_VOTES_KEY, JSON.stringify(this.myVotes));
    } catch {
    }
  }
}
