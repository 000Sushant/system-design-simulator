import { describe, it, expect } from 'vitest';
import { RubricReviewer, evaluateMilestones } from './architecture-reviewer';
import { GraphContext } from '../../models/challenge.model';
import { makeChallenge, makeConn, makeNode } from '../../testing/fixtures';

const graph: GraphContext = {
  nodes: [makeNode('c', 'client'), makeNode('e', 'ec2'), makeNode('d', 'rds')],
  connections: [makeConn('c', 'e'), makeConn('e', 'd')],
};

describe('evaluateMilestones', () => {
  it('returns the ids of milestones whose rule passes', () => {
    const challenge = makeChallenge({
      milestones: [
        { id: 'has-compute', label: 'Add compute', rule: { kind: 'hasService', anyOf: ['ec2'] } },
        { id: 'has-cache', label: 'Add a cache', rule: { kind: 'hasService', anyOf: ['elastiCache'] } },
      ],
    });
    expect(evaluateMilestones(graph, challenge)).toEqual(['has-compute']);
  });
});

describe('RubricReviewer', () => {
  const reviewer = new RubricReviewer();

  it('normalizes the score to standard-check weight and flags pass/fail', () => {
    const challenge = makeChallenge({
      rubric: {
        passScore: 70,
        checks: [
          { id: 'a', label: 'Has compute', weight: 1, failHint: 'add ec2', rule: { kind: 'hasService', anyOf: ['ec2'] } },
          { id: 'b', label: 'Has cache', weight: 1, failHint: 'add cache', rule: { kind: 'hasService', anyOf: ['elastiCache'] } },
        ],
      },
    });
    const result = reviewer.review(graph, challenge);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(false);
    expect(result.findings.find((f) => f.message === 'Has cache')?.severity).toBe('fail');
    expect(result.findings.find((f) => f.message === 'Has cache')?.fixHint).toBe('add cache');
  });

  it('lets optional bonus checks push the score above 100', () => {
    const challenge = makeChallenge({
      rubric: {
        passScore: 70,
        checks: [
          { id: 'a', label: 'Has compute', weight: 1, failHint: '', rule: { kind: 'hasService', anyOf: ['ec2'] } },
          { id: 'bonus', label: 'Has DB', weight: 1, optional: true, failHint: '', rule: { kind: 'hasService', anyOf: ['rds'] } },
        ],
      },
    });
    const result = reviewer.review(graph, challenge);
    expect(result.score).toBe(200);
    expect(result.passed).toBe(true);
    expect(result.findings.find((f) => f.message.includes('Has DB'))?.severity).toBe('pass');
  });
});
