import { ArchitectureConnection, ArchitectureNode, AwsServiceType } from './architecture.model';

/**
 * Domain types for Developer-Mode learning challenges.
 *
 * Challenges are authored as data (challenges.json). The evaluation engine
 * understands a small, typed set of `GraphRule`s — there is no free-form rule
 * DSL — so milestones and rubric checks stay declarative but type-safe.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

/** The user's current architecture, passed to the evaluation engine. */
export interface GraphContext {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
}

/**
 * A declarative predicate over the user's architecture. Every milestone and
 * rubric check is expressed as one of these so a single evaluator covers both.
 */
export type GraphRule =
  /** At least `min` (default 1) live service(s) of any listed type exist;
   *  when `mustBeConnected`, they must also be reachable from a client node. */
  | { kind: 'hasService'; anyOf: AwsServiceType[]; min?: number; mustBeConnected?: boolean }
  /** A real, allowed connection exists from any `fromAnyOf` type to any `toAnyOf` type. */
  | { kind: 'hasEdge'; fromAnyOf: AwsServiceType[]; toAnyOf: AwsServiceType[] }
  /** A node of a listed type has `config[key] >= value`. */
  | { kind: 'configAtLeast'; anyOf: AwsServiceType[]; key: string; value: number }
  /** At least `min` distinct nodes across the listed types. */
  | { kind: 'countAtLeast'; anyOf: AwsServiceType[]; min: number }
  /** No node is overloaded/failing/offline (meaningful after a simulation run). */
  | { kind: 'noOverload' }
  /** Composite: all sub-rules pass. */
  | { kind: 'allOf'; rules: GraphRule[] };

export interface Hint {
  id: string;
  title: string;
  body: string;
  order: number;
}

export interface Milestone {
  id: string;
  label: string;
  detail?: string;
  rule: GraphRule;
  hidden?: boolean;
}

export interface RubricCheck {
  id: string;
  label: string;
  rule: GraphRule;
  /** Relative contribution to the score; the engine normalizes to 0-100. */
  weight: number;
  /** Actionable suggestion shown when this check fails. */
  failHint: string;
  optional?: boolean;
}

export interface Rubric {
  checks: RubricCheck[];
  /** Score (0-100) at or above which the challenge is considered passed. */
  passScore: number;
}

export interface ReferenceNode {
  key: string;
  type: AwsServiceType;
  name?: string;
  x: number;
  y: number;
  /**
   * Per-challenge param overrides merged onto the service-type defaults. Lets a
   * challenge express its workload (e.g. a write-heavy limiter vs a read-heavy
   * shortener) using existing sim/cost knobs like requestRate, packageSize,
   * cacheHitRate, throughput. Only keys present here override the defaults.
   */
  config?: Record<string, number | string | boolean>;
}

/** One service's plain-English role in the reference solution. */
export interface SolutionService {
  /** Service type, used to look up its icon/color. */
  type: AwsServiceType;
  /** Display name (defaults to the service name if omitted). */
  name?: string;
  /** What this service does in this architecture. */
  role: string;
  /** Why it's the right choice over alternatives. */
  why: string;
}

/**
 * A friendly post-completion walkthrough: how the architecture satisfies the
 * requirements, and the role + rationale of each service.
 */
export interface SolutionExplanation {
  /** One or two sentences summarizing how the design meets the brief. */
  summary: string;
  /** Maps each requirement to the part of the design that satisfies it. */
  requirementsMet?: { requirement: string; satisfiedBy: string }[];
  /** Per-service role and rationale. */
  services: SolutionService[];
}

export interface ReferenceSolution {
  nodes: ReferenceNode[];
  /** Logical edges as [sourceKey, targetKey] pairs over `nodes[].key`. */
  edges: Array<[string, string]>;
  notes?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  estMinutes: number;
  /** Problem statement (plain text / lightweight markdown). */
  problem: string;
  functionalRequirements: string[];
  constraints: string[];
  targetScale?: string;
  /** Optional palette restriction while this challenge is active. */
  paletteSubset?: AwsServiceType[];
  hints: Hint[];
  milestones: Milestone[];
  rubric: Rubric;
  referenceSolution: ReferenceSolution;
  /** Friendly walkthrough shown once the challenge is passed. */
  solution?: SolutionExplanation;
  /** Stub challenges (authored === false) appear locked/"coming soon". */
  authored: boolean;
  companyTag?: string;
}

export type FindingSeverity = 'pass' | 'warn' | 'fail';

export interface Finding {
  severity: FindingSeverity;
  message: string;
  fixHint?: string;
}

export interface ReviewResult {
  /** 0-100. */
  score: number;
  passScore: number;
  passed: boolean;
  milestonesReached: string[];
  findings: Finding[];
}

export interface ChallengeProgress {
  challengeId: string;
  revealedHintIds: string[];
  reachedMilestoneIds: string[];
  lastScore?: number;
  completed: boolean;
}

/** A single onboarding tour step. */
export interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  /** What the user must do to advance. `manual` advances via the Next button. */
  completeOn: 'manual' | 'nodeAdded' | 'edgeCreated' | 'configChanged' | 'simulationStarted';
}
