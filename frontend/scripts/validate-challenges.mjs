#!/usr/bin/env node
/**
 * Validates challenges.json so contributors can self-check a new challenge in
 * seconds. No external dependencies — run with: npm run validate:challenges
 *
 * Checks, per authored challenge:
 *  - required fields are present and well-typed
 *  - exactly one hint per milestone (1:1)
 *  - every rule references a real AWS service type
 *  - every reference-solution edge is a legal connection (port-compatible)
 *  - the reference solution reaches ALL milestones and passes its own rubric
 *  - (warning) services used exist in the Developer-Mode palette
 *
 * Exits non-zero if any error is found.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const CHALLENGES = join(here, '../src/app/core/data/challenges.json');
const AWS_SERVICES = join(here, '../src/app/core/config/aws-services.json');

/** Service types draggable in Developer Mode. Keep in sync with the
 *  `devServices` set in features/simulator/simulator.component.ts. */
const DEV_PALETTE = new Set([
  'client', 'route53', 'cloudfront', 'apiGateway', 'elb', 'lambda', 'ec2', 'ecs',
  'eks', 'appRunner', 's3', 'efs', 'rds', 'aurora', 'dynamoDb', 'elastiCache',
  'sqs', 'sns', 'eventBridge', 'stepFunctions', 'cloudWatch', 'xray', 'cognito',
  'appSync', 'bedrock', 'kinesis', 'kinesisFirehose',
]);

const RULE_KINDS = new Set(['hasService', 'hasEdge', 'configAtLeast', 'countAtLeast', 'noOverload', 'allOf']);

const errors = [];
const warnings = [];
const fail = (id, msg) => errors.push(`[${id}] ${msg}`);
const warn = (id, msg) => warnings.push(`[${id}] ${msg}`);

function read(file, label) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Could not read/parse ${label} (${file}):\n  ${e.message}`);
    process.exit(1);
  }
}

const data = read(CHALLENGES, 'challenges.json');
const aws = read(AWS_SERVICES, 'aws-services.json');
const services = aws.services || (aws.default && aws.default.services) || [];
const byType = new Map(services.map((s) => [s.type, s]));

function edgeValid(src, tgt) {
  const S = byType.get(src);
  const T = byType.get(tgt);
  if (!S) return `unknown source type "${src}"`;
  if (!T) return `unknown target type "${tgt}"`;
  const outs = new Set((S.outputs || []).map((p) => p.type || p));
  const ins = new Set((T.inputs || []).map((p) => p.type || p));
  for (const r of S.rules || []) {
    if (r.target !== tgt && r.target !== '*') continue;
    if ((r.sourcePorts || []).some((p) => outs.has(p)) && (r.targetPorts || []).some((p) => ins.has(p))) return null;
  }
  return `no valid connection rule ${src} -> ${tgt}`;
}

// ── Rule evaluation (mirrors core/services/evaluation/graph-rules.ts) ──────────
function reachableFromClient(ctx) {
  const adj = new Map();
  for (const c of ctx.connections) {
    if (!c.allowed) continue;
    if (!adj.has(c.sourceNodeId)) adj.set(c.sourceNodeId, []);
    adj.get(c.sourceNodeId).push(c.targetNodeId);
  }
  const reach = new Set();
  const queue = ctx.nodes.filter((n) => n.type === 'client').map((n) => n.id);
  queue.forEach((id) => reach.add(id));
  while (queue.length) {
    const cur = queue.shift();
    for (const nx of adj.get(cur) || []) if (!reach.has(nx)) { reach.add(nx); queue.push(nx); }
  }
  return reach;
}
const nodesOf = (ctx, types) => { const s = new Set(types); return ctx.nodes.filter((n) => s.has(n.type)); };
function evalRule(rule, ctx, reach) {
  switch (rule.kind) {
    case 'hasService': {
      let m = nodesOf(ctx, rule.anyOf);
      if (rule.mustBeConnected) m = m.filter((n) => reach.has(n.id));
      return m.length >= (rule.min ?? 1);
    }
    case 'hasEdge': {
      const f = new Set(rule.fromAnyOf), t = new Set(rule.toAnyOf);
      const byId = new Map(ctx.nodes.map((n) => [n.id, n]));
      return ctx.connections.some((c) => {
        if (!c.allowed) return false;
        const s = byId.get(c.sourceNodeId), tg = byId.get(c.targetNodeId);
        return s && tg && f.has(s.type) && t.has(tg.type);
      });
    }
    case 'configAtLeast':
      return nodesOf(ctx, rule.anyOf).some((n) => typeof n.config?.[rule.key] === 'number' && n.config[rule.key] >= rule.value);
    case 'countAtLeast':
      return nodesOf(ctx, rule.anyOf).length >= rule.min;
    case 'noOverload':
      return ctx.nodes.length > 0 && !ctx.nodes.some((n) => ['overloaded', 'failing', 'offline'].includes(n.status));
    case 'allOf':
      return rule.rules.every((r) => evalRule(r, ctx, reach));
    default:
      return false;
  }
}

function collectTypes(rule, acc = []) {
  if (!rule || typeof rule !== 'object') return acc;
  if (rule.anyOf) acc.push(...rule.anyOf);
  if (rule.fromAnyOf) acc.push(...rule.fromAnyOf);
  if (rule.toAnyOf) acc.push(...rule.toAnyOf);
  if (rule.rules) rule.rules.forEach((r) => collectTypes(r, acc));
  return acc;
}
function checkRuleShape(id, rule, where) {
  if (!rule || !RULE_KINDS.has(rule.kind)) {
    fail(id, `${where}: invalid rule kind "${rule && rule.kind}". Allowed: ${[...RULE_KINDS].join(', ')}`);
    return;
  }
  for (const t of collectTypes(rule)) {
    if (!byType.has(t)) fail(id, `${where}: rule references unknown service type "${t}"`);
    else if (!DEV_PALETTE.has(t)) warn(id, `${where}: "${t}" is not in the Developer-Mode palette (won't be draggable)`);
  }
}

// ── Validate ──────────────────────────────────────────────────────────────────
if (!Array.isArray(data.challenges)) {
  console.error('challenges.json must have a top-level "challenges" array.');
  process.exit(1);
}

const seenIds = new Set();
let authoredCount = 0;

for (const ch of data.challenges) {
  const id = ch.id || '(missing id)';
  if (seenIds.has(id)) fail(id, 'duplicate challenge id');
  seenIds.add(id);
  if (!['easy', 'medium', 'hard'].includes(ch.difficulty)) fail(id, `difficulty must be easy|medium|hard, got "${ch.difficulty}"`);
  if (!ch.authored) continue;
  authoredCount++;

  for (const field of ['title', 'category', 'problem', 'targetScale']) {
    if (typeof ch[field] !== 'string' || !ch[field].trim()) warn(id, `field "${field}" is empty`);
  }
  for (const arr of ['functionalRequirements', 'constraints', 'hints', 'milestones']) {
    if (!Array.isArray(ch[arr])) fail(id, `"${arr}" must be an array`);
  }

  const hints = ch.hints || [];
  const milestones = ch.milestones || [];
  if (hints.length < milestones.length) {
    fail(id, `expected at least one hint per milestone: ${hints.length} hints vs ${milestones.length} milestones`);
  }

  const seenOrders = new Set();
  const seenHintIds = new Set();
  for (const h of hints) {
    if (typeof h.order !== 'number' || h.order < 1) {
      fail(id, `hint "${h.id || '(missing id)'}" has invalid order "${h.order}"`);
    }
    if (seenOrders.has(h.order)) {
      fail(id, `duplicate hint order "${h.order}"`);
    }
    seenOrders.add(h.order);
    if (h.id) {
      if (seenHintIds.has(h.id)) {
        fail(id, `duplicate hint id "${h.id}"`);
      }
      seenHintIds.add(h.id);
    }
  }

  // Verify hints cover 1..hints.length contiguously
  for (let o = 1; o <= hints.length; o++) {
    if (!seenOrders.has(o)) {
      fail(id, `missing hint with order ${o}`);
    }
  }

  // Verify each milestone has a corresponding hint mapped by 1-based order index
  for (let i = 0; i < milestones.length; i++) {
    if (!seenOrders.has(i + 1)) {
      fail(id, `milestone at index ${i} ("${milestones[i].label || milestones[i].id}") has no corresponding hint with order ${i + 1}`);
    }
  }

  milestones.forEach((m, i) => checkRuleShape(id, m.rule, `milestone[${i}] "${m.label || m.id}"`));
  const checks = ch.rubric?.checks || [];
  if (!checks.length) fail(id, 'rubric has no checks');
  checks.forEach((c) => checkRuleShape(id, c.rule, `rubric check "${c.id || c.label}"`));

  const ref = ch.referenceSolution || {};
  const refNodes = ref.nodes || [];
  const refEdges = ref.edges || [];
  if (!refNodes.length) { fail(id, 'referenceSolution has no nodes'); continue; }

  const keyType = new Map();
  for (const n of refNodes) {
    if (keyType.has(n.key)) fail(id, `duplicate reference node key "${n.key}"`);
    if (!byType.has(n.type)) fail(id, `reference node "${n.key}" has unknown type "${n.type}"`);
    else if (!DEV_PALETTE.has(n.type)) warn(id, `reference node "${n.key}" type "${n.type}" not in palette`);
    keyType.set(n.key, n.type);
  }
  for (const [s, t] of refEdges) {
    if (!keyType.has(s) || !keyType.has(t)) { fail(id, `edge ${s} -> ${t} references an unknown node key`); continue; }
    const err = edgeValid(keyType.get(s), keyType.get(t));
    if (err) fail(id, `edge ${s} -> ${t}: ${err}`);
  }

  // The reference solution must be a winning solution.
  const idByKey = new Map(refNodes.map((n, i) => [n.key, `n${i}`]));
  const ctx = {
    nodes: refNodes.map((n, i) => ({ id: `n${i}`, type: n.type, status: 'normal', config: {} })),
    connections: refEdges
      .filter(([s, t]) => idByKey.has(s) && idByKey.has(t))
      .map(([s, t]) => ({ sourceNodeId: idByKey.get(s), targetNodeId: idByKey.get(t), allowed: true })),
  };
  const reach = reachableFromClient(ctx);
  for (const m of milestones) {
    if (!evalRule(m.rule, ctx, reach)) fail(id, `reference solution does NOT reach milestone "${m.label || m.id}" (check mustBeConnected / edges)`);
  }
  const standardWeight = checks.filter((c) => !c.optional).reduce((a, c) => a + c.weight, 0) || 1;
  let earned = 0;
  for (const c of checks) if (evalRule(c.rule, ctx, reach)) earned += c.weight;
  const score = Math.round((earned / standardWeight) * 100);
  const pass = ch.rubric?.passScore ?? 70;
  if (score < pass) fail(id, `reference solution scores ${score}/100, below passScore ${pass}`);
  else console.log(`  ✓ ${id} — reference scores ${score}/100 (pass ${pass}), ${milestones.length} milestones, ${hints.length} hints`);
}

console.log(`\n${authoredCount} authored challenge(s) checked.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ! ' + w));
}
if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  errors.forEach((e) => console.error('  ✗ ' + e));
  console.error('\nValidation FAILED.');
  process.exit(1);
}
console.log('\nAll challenges valid ✅');
