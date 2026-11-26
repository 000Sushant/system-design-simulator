// Builds the LLM prompt that asks an MCP host to rebuild the BASE-01 sample step by step.
import { annotationArguments, nodeArguments, resolveEndpoint } from './project.mjs';

export function printPrompt(reference) {
  console.log(`Reconstruct the Real-Time Messaging Application sample in the empty Architect canvas with the simulator MCP tools. These are local simulated services and synthetic data. Use only the simulator MCP tools for the task. Pairing is done by the operator. Begin with get_canvas_state and wait for pairing if it has not completed. Check that the canvas is empty, idle and uses ${reference.region} and ${reference.currency}.

Call add_node individually in the order shown below, using exactly the listed name and coordinates. Keep each returned node ID associated with its name. Start with Chat Users, then App Domain (DNS), then call connect_nodes for their first edge. If a tool reports a validation error, report the error and stop to let the operator recover.

After connecting Chat Users, call get_node_config_fields. Apply two separate set_node_config calls for its requestRate, first 100 and then 50. Add the remaining nodes, then call connect_nodes for each remaining edge in order, translating each name into its actual node ID. Use the listed IDs for the ports. Add each annotation with its own add_annotation call.

Read the final state, check the counts, then call set_simulation for play, pause, resume and stop separately. Report the resulting counts and observed modes. Use structured results from the calls, keep the operation sequence in the trace, and let the operator export the result through the browser.

Nodes:
${reference.nodes.map((node) => JSON.stringify(nodeArguments(node))).join('\n')}

Connections as source name, output port ID, target name, input port ID:
${reference.connections.map((edge) => {
    const from = resolveEndpoint(reference, edge, 'output');
    const to = resolveEndpoint(reference, edge, 'input');
    return JSON.stringify([from.node, from.id, to.node, to.id]);
  }).join('\n')}

Annotations:
${reference.annotations.map((annotation) => JSON.stringify(annotationArguments(annotation))).join('\n')}`);
}
