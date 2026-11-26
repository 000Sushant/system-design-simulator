// Demo scenarios driven through the MCP client: the BASE-01 replay and the paced burst check.
import assert from 'node:assert/strict';
import { setTimeout as wait } from 'node:timers/promises';
import { ToolError, trace } from './mcp-session.mjs';
import { annotationArguments, compareProjects, countElements, nodeArguments } from './project.mjs';

export async function replay(reference, call, start) {
  assert.equal(start.region, reference.region, 'Canvas pricing region');
  assert.equal(start.currency, reference.currency, 'Canvas currency');
  const nodeIds = new Map();
  async function addNode(node) {
    const result = await call('add_node', nodeArguments(node));
    assert.equal(result.node.name, node.name);
    nodeIds.set(node.id, result.node.id);
  }
  async function connectNodes(edge) {
    await call('connect_nodes', {
      sourceNodeId: nodeIds.get(edge.sourceNodeId),
      sourcePortId: edge.sourcePortId,
      targetNodeId: nodeIds.get(edge.targetNodeId),
      targetPortId: edge.targetPortId,
    });
  }

  await addNode(reference.nodes[0]);
  await addNode(reference.nodes[1]);
  await connectNodes(reference.connections[0]);

  const [users] = reference.nodes;
  const nodeId = nodeIds.get(users.id);
  const { fields } = await call('get_node_config_fields', { nodeId });
  assert.deepEqual(fields, [{ key: 'requestRate', type: 'number', value: 50, min: 2, max: 1000 }]);
  for (const value of [100, 50]) {
    const applied = await call('set_node_config', { nodeId, key: 'requestRate', value });
    assert.deepEqual(applied, { nodeId, key: 'requestRate', value });
    const visible = await call('get_canvas_state');
    assert.equal(visible.nodes.find((node) => node.id === nodeId)?.config.requestRate, value);
  }

  for (const node of reference.nodes.slice(2)) {
    await addNode(node);
  }
  for (const edge of reference.connections.slice(1)) {
    await connectNodes(edge);
  }
  for (const annotation of reference.annotations) {
    await call('add_annotation', annotationArguments(annotation));
  }

  const finished = await call('get_canvas_state');
  trace({ phase: 'equivalent', ...compareProjects(reference, finished) });

  assert.equal((await call('set_simulation', { action: 'play' })).mode, 'running');
  const running = await call('get_canvas_state');
  assert(running.tick > 0 && running.totals.processed > 0, 'Running simulation must process requests');
  assert.equal((await call('set_simulation', { action: 'pause' })).mode, 'paused');
  const paused = await call('get_canvas_state');
  await wait(400);
  const stillPaused = await call('get_canvas_state');
  assert.equal(stillPaused.tick, paused.tick, 'Tick must stay stable while paused');
  assert.equal(stillPaused.totals.processed, paused.totals.processed, 'Processed requests must stay stable while paused');
  assert.equal((await call('set_simulation', { action: 'resume' })).mode, 'running');
  const resumed = await call('get_canvas_state');
  assert(resumed.tick > paused.tick, 'Tick must advance after resume');
  assert.equal((await call('set_simulation', { action: 'stop' })).mode, 'idle');
  trace({ phase: 'simulation-complete', pausedTick: paused.tick, resumedTick: resumed.tick });
}

export async function runBurst(call) {
  const creations = [
    { serviceType: 'client', name: 'Chat Users', x: 60, y: 360 },
    { serviceType: 'route53', name: 'App Domain (DNS)', x: 300, y: 220 },
    { serviceType: 'cloudfront', name: 'Offscreen CDN', x: 3500, y: 80 },
  ];
  const acknowledgments = [];
  const addCalls = creations.map((node) => call('add_node', node).then((result) => {
    acknowledgments.push({ name: result.node.name, at: performance.now() });
    return result;
  }));
  const [users, dns, , graph] = await Promise.all([...addCalls, call('get_canvas_state')]);
  assert.deepEqual(graph.nodes.map(({ name }) => name), creations.map(({ name }) => name));
  assert.deepEqual(acknowledgments.map(({ name }) => name), creations.map(({ name }) => name));
  for (const index of [1, 2]) {
    assert(acknowledgments[index].at - acknowledgments[index - 1].at >= 400, 'Burst acknowledgments must remain paced');
  }
  const reject = (error) => error instanceof ToolError &&
    !['NOT_CONNECTED', 'SESSION_ENDED', 'RESULT_UNKNOWN'].includes(error.code);
  await assert.rejects(call('set_simulation', { action: 'play' }), reject);
  await assert.rejects(call('set_node_config', { nodeId: users.node.id, key: 'requestRate', value: 1 }), reject);
  await assert.rejects(call('connect_nodes', {
    sourceNodeId: dns.node.id, sourcePortId: 'in-dns', targetNodeId: users.node.id, targetPortId: 'out-http',
  }), reject);
  const afterRejections = await call('get_canvas_state');
  assert.deepEqual(countElements(afterRejections), { nodes: 3, connections: 0, annotations: 0 });
  assert.equal(afterRejections.nodes.find((node) => node.id === users.node.id)?.config.requestRate, 50);
  assert.equal(afterRejections.mode, 'idle');
  await call('connect_nodes', {
    sourceNodeId: users.node.id, sourcePortId: 'out-http', targetNodeId: dns.node.id, targetPortId: 'in-dns',
  });
  trace({ phase: 'burst-complete' });
}
