// Pure helpers for reading, normalizing and comparing exported canvas projects.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const orderBy = (key) => (left, right) => key(left).localeCompare(key(right));

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export function resolveEndpoint(project, edge, direction) {
  const from = direction === 'output';
  const nodeId = from ? edge.sourceNodeId : edge.targetNodeId;
  const portId = from ? edge.sourcePortId : edge.targetPortId;
  const node = project.nodes.find((candidate) => candidate.id === nodeId);
  const port = node?.ports.find((candidate) => candidate.id === portId);
  assert(port?.direction === direction, `Invalid ${direction} endpoint on connection ${edge.id}`);
  return { node: node.name, id: port.id, type: port.type, direction };
}

export function normalizeProject(project) {
  const { nodes, connections, annotations, region, currency } = project;
  assert(Array.isArray(nodes) && Array.isArray(connections) && Array.isArray(annotations), 'Invalid project');
  assert.equal(new Set(nodes.map((node) => node.name)).size, nodes.length, 'Node names must be unique');
  assert.equal(new Set(nodes.map((node) => node.id)).size, nodes.length, 'Node IDs must be unique');

  return {
    region,
    currency,
    nodes: nodes.map(({ type, name, x, y, config, ports }) => ({
      type, name, x, y, config,
      ports: ports.map(({ id, type, direction, label }) => ({ id, type, direction, label }))
        .sort(orderBy((port) => port.id)),
    })).sort(orderBy((node) => node.name)),
    connections: connections.map((edge) => ({
      from: resolveEndpoint(project, edge, 'output'),
      to: resolveEndpoint(project, edge, 'input'),
      type: edge.type,
      allowed: edge.allowed,
      label: edge.label,
    })).sort(orderBy((edge) => JSON.stringify([edge.from, edge.to, edge.type, edge.label]))),
    annotations: annotations.map(({ text, x, y, width, height, fontSize, fontWeight }) => ({
      text, x, y, width, height, fontSize, fontWeight,
    })).sort(orderBy((annotation) => JSON.stringify(annotation))),
  };
}

export function compareProjects(reference, actual) {
  const expected = normalizeProject(reference);
  const observed = normalizeProject(actual);
  for (const key of ['region', 'currency', 'nodes', 'connections', 'annotations']) {
    assert.deepEqual(observed[key], expected[key], `Equivalent project ${key}`);
  }
  return countElements(observed);
}

export function countElements(project) {
  return {
    nodes: project.nodes.length,
    connections: project.connections.length,
    annotations: project.annotations.length,
  };
}

export function nodeArguments(node) {
  return { serviceType: node.type, name: node.name, x: node.x, y: node.y };
}

export function annotationArguments({ text, x, y, width, height, fontSize, fontWeight }) {
  return { text, x, y, width, height, fontSize, fontWeight };
}

export function confirmDemoFixture(reference) {
  const project = normalizeProject(reference);
  assert.deepEqual(countElements(project), { nodes: 17, connections: 24, annotations: 2 }, 'Use the BASE-01 fixture');
  const [users, dns] = reference.nodes;
  const [firstConnection] = reference.connections;
  assert.equal(users.name, 'Chat Users');
  assert.equal(users.type, 'client');
  assert.equal(users.config.requestRate, 50);
  assert.equal(dns.name, 'App Domain (DNS)');
  assert.equal(dns.type, 'route53');
  assert.equal(firstConnection.sourceNodeId, users.id);
  assert.equal(firstConnection.targetNodeId, dns.id);
}

