import { Injectable } from '@angular/core';
import { Challenge, Finding, GraphContext, ReviewResult } from '../../models/challenge.model';
import { evaluateRule, reachableFromClient } from './graph-rules';

/**
 * Strategy seam for scoring an architecture against a challenge.
 *
 * `RubricReviewer` is the deterministic, offline implementation used today.
 * A future `AiReviewer` can implement the same interface to add LLM-based
 * critique (the "hybrid" path) without touching callers.
 */
export interface ArchitectureReviewer {
  review(graph: GraphContext, challenge: Challenge): ReviewResult;
}

/** Which milestone ids currently pass for the given architecture. */
export function evaluateMilestones(graph: GraphContext, challenge: Challenge): string[] {
  const reachable = reachableFromClient(graph);
  return challenge.milestones
    .filter((milestone) => evaluateRule(milestone.rule, graph, reachable))
    .map((milestone) => milestone.id);
}

@Injectable({ providedIn: 'root' })
export class RubricReviewer implements ArchitectureReviewer {
  review(graph: GraphContext, challenge: Challenge): ReviewResult {
    const reachable = reachableFromClient(graph);
    const { checks, passScore } = challenge.rubric;

    const standardChecks = checks.filter((c) => !c.optional);
    const standardWeight = standardChecks.reduce((sum, check) => sum + check.weight, 0) || 1;
    
    let earned = 0;
    const findings: Finding[] = [];

    for (const check of checks) {
      const passed = evaluateRule(check.rule, graph, reachable);
      if (passed) {
        earned += check.weight;
        findings.push({ severity: 'pass', message: check.optional ? `${check.label} (Optional Bonus)` : check.label });
      } else {
        if (check.optional) {
          findings.push({ severity: 'warn', message: `${check.label} (Optional Bonus)` });
        } else {
          findings.push({ severity: 'fail', message: check.label, fixHint: check.failHint });
        }
      }
    }

    // Normalize using standardWeight, allowing score to exceed 100% when optional checks are met
    const score = Math.round((earned / standardWeight) * 100);
    const milestonesReached = challenge.milestones
      .filter((milestone) => evaluateRule(milestone.rule, graph, reachable))
      .map((milestone) => milestone.id);

    return {
      score,
      passScore,
      passed: score >= passScore,
      milestonesReached,
      findings,
    };
  }
}

/**
 * Placeholder for the future AI-assisted reviewer. Not wired in yet — kept so
 * the interface and injection seam exist for the hybrid evaluation path.
 */
@Injectable({ providedIn: 'root' })
export class AiReviewer implements ArchitectureReviewer {
  review(): ReviewResult {
    throw new Error('AiReviewer is not implemented yet. Use RubricReviewer.');
  }
}
