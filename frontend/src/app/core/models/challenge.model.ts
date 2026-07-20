import { ArchitectureConnection, ArchitectureNode, AwsServiceType } from './architecture.model';


export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GraphContext {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
}

export type GraphRule =
  | { kind: 'hasService'; anyOf: AwsServiceType[]; min?: number; mustBeConnected?: boolean }
  | { kind: 'hasEdge'; fromAnyOf: AwsServiceType[]; toAnyOf: AwsServiceType[] }
  | { kind: 'configAtLeast'; anyOf: AwsServiceType[]; key: string; value: number }
  | { kind: 'countAtLeast'; anyOf: AwsServiceType[]; min: number }
  | { kind: 'noOverload' }
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
  weight: number;
  failHint: string;
  optional?: boolean;
}

export interface Rubric {
  checks: RubricCheck[];
  passScore: number;
}

export interface ReferenceNode {
  key: string;
  type: AwsServiceType;
  name?: string;
  x: number;
  y: number;
  config?: Record<string, number | string | boolean>;
}

export interface SolutionService {
  type: AwsServiceType;
  name?: string;
  role: string;
  why: string;
}

export interface SolutionExplanation {
  summary: string;
  requirementsMet?: { requirement: string; satisfiedBy: string }[];
  services: SolutionService[];
}

export interface ReferenceSolution {
  nodes: ReferenceNode[];
  edges: Array<[string, string]>;
  notes?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  estMinutes: number;
  problem: string;
  functionalRequirements: string[];
  constraints: string[];
  targetScale?: string;
  paletteSubset?: AwsServiceType[];
  hints: Hint[];
  milestones: Milestone[];
  rubric: Rubric;
  referenceSolution: ReferenceSolution;
  solution?: SolutionExplanation;
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

export interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  completeOn: 'manual' | 'nodeAdded' | 'edgeCreated' | 'configChanged' | 'simulationStarted';
}
