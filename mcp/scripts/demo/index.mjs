#!/usr/bin/env node
import { withCanvas, trace } from './mcp-session.mjs';
import { compareProjects, confirmDemoFixture, readJson } from './project.mjs';
import { printPrompt } from './prompt.mjs';
import { replay, runBurst } from './scenarios.mjs';

const usage = `Usage from the repository root:
  node mcp/scripts/demo/index.mjs run <reference.json>
  node mcp/scripts/demo/index.mjs burst
  node mcp/scripts/demo/index.mjs compare <reference.json> <browser-export.json>
  node mcp/scripts/demo/index.mjs prompt <reference.json>`;

async function main([command, ...args]) {
  if (command === 'burst' && args.length === 0) {
    await withCanvas(runBurst);
    return;
  }
  if (command === 'compare' && args.length === 2) {
    const [reference, actual] = await Promise.all(args.map(readJson));
    trace({ phase: 'equivalent', ...compareProjects(reference, actual) });
    return;
  }
  if (command === 'prompt' && args.length === 1) {
    const reference = await readJson(args[0]);
    confirmDemoFixture(reference);
    printPrompt(reference);
    return;
  }
  if (command === 'run' && args.length === 1) {
    const reference = await readJson(args[0]);
    confirmDemoFixture(reference);
    await withCanvas((call, start) => replay(reference, call, start));
    return;
  }
  if (command === '--help' || command === undefined) {
    console.log(usage);
    return;
  }
  throw new Error(usage);
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
