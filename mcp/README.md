# Local playground MCP pilot

The MCP host starts `mcp/src/index.mjs` over stdio. The server relays one request at a time to an open Architect canvas via `ws://127.0.0.1:4301/canvas`. The browser applies mutations, reveals each change and acknowledges it after the visible step. The Angular playground and pricing server run normally.

## Layout

```text
mcp/
├── src/
│   ├── index.mjs               # Entry point: stdio transport, relay startup, shutdown
│   ├── config.mjs              # Environment variables (operator pairing code)
│   ├── server/create-server.mjs  # MCP server: tools/list and tools/call handlers
│   ├── tools/
│   │   ├── canvas-tools.mjs    # Tool registry: description, input/output schema, summary
│   │   └── schemas.mjs         # Shared Zod primitives
│   ├── relay/
│   │   ├── canvas-relay.mjs    # WebSocket relay: pairing, session, request queue
│   │   └── protocol.mjs        # Browser wire protocol (version 1) frames and validation
│   └── shared/result.mjs       # { ok, data } / { ok, error } result envelope
├── scripts/demo/               # Deterministic SDK demo runner (run, burst, compare, prompt)
└── test/                       # node:test suites for the relay and the MCP server
```

Dependencies point inward: `server` and `relay` use `tools` and `shared`, and only `index.mjs` connects them. To add a tool, add an entry to `src/tools/canvas-tools.mjs` and implement its handler in the Angular canvas. Run the tests with `npm test --prefix mcp`.

## Start the playground

Use Node.js and npm. From the repository root, install the locked dependencies if needed.

```sh
npm ci --prefix frontend
npm ci --prefix backend
npm ci --prefix mcp
```

Start these processes in separate terminals. Leave port `4301` free for the MCP host.

```sh
PORT=3001 npm start --prefix backend
```

```sh
npm start --prefix frontend -- --host 127.0.0.1
```

Open [the Architect playground](http://localhost:4200/playground?mode=architect) in a test browser profile. Select **Add new canvas**, then **MCP** to open the pairing panel. Keep the empty canvas visible throughout the run.

## Deterministic SDK demonstration

Run the following command in an interactive terminal. Paste the one-time pairing code into **Pairing code** and select **Pair canvas**. The code goes to the local terminal directly. To collect the JSONL trace, redirect stdout and leave the terminal available for pairing.

```sh
node mcp/scripts/demo/index.mjs run .brain/evidencias/BASE-01/real-time-messaging-app.json
```

The runner creates each node, connection and annotation through separate MCP calls. It starts with **Chat Users → App Domain (DNS)**, shows 50 → 100 → 50 RPS and runs **Play**, **Pause**, **Resume** and **Stop**. The trace records request order, tool, arguments, relative time and the returned target ID. The `equivalent` record compares the MCP state with BASE-01. Use **Export** in the browser for an independent comparison of the UI export.

```sh
node mcp/scripts/demo/index.mjs compare .brain/evidencias/BASE-01/real-time-messaging-app.json /path/to/browser-export.json
```

In another empty canvas, run `node mcp/scripts/demo/index.mjs burst`. The runner submits three independent node creations and a read together. Observe the three changes in order, including the initially offscreen CDN. It then checks that invalid Play, configuration and connection requests preserve the graph. To collect visual evidence, record the browser after pairing. The panel marker exposes `data-mcp-sequence`, `data-mcp-action`, `data-mcp-target` and `data-mcp-canvas` for correlating each action with the trace. If the session ends during a request, check the canvas state after reconnecting before deciding whether to send the request again.

## LLM demonstration with Claude Code

The browser QA used Claude Code 2.1.331 with existing local authentication. The CLI runs in a disposable directory with only the seven simulator MCP tools available. Prepare the empty canvas and open its MCP panel before running this block from the repository root in an interactive terminal. Paste the one-time code into the masked **Pairing code** field, select **Pair canvas**, and start recording after the field clears.

```sh
(
  simulator_workdir=$(mktemp -d) || exit 1
  operator_code=$(node -e 'process.stdout.write(require("node:crypto").randomBytes(16).toString("base64url"))')
  simulator_config=$(node -e '
    const { resolve } = require("node:path");
    process.stdout.write(JSON.stringify({ mcpServers: { simulator: {
      command: process.execPath,
      args: [resolve("mcp/src/index.mjs")],
      env: { SIMULATOR_MCP_OPERATOR_PAIRING_CODE: "${SIMULATOR_MCP_OPERATOR_PAIRING_CODE}" },
    } } }));
  ')
  simulator_tools='mcp__simulator__get_canvas_state,mcp__simulator__get_node_config_fields,mcp__simulator__add_node,mcp__simulator__connect_nodes,mcp__simulator__set_node_config,mcp__simulator__add_annotation,mcp__simulator__set_simulation'
  printf 'One-time playground pairing code: %s\n' "$operator_code" >/dev/tty
  node mcp/scripts/demo/index.mjs prompt .brain/evidencias/BASE-01/real-time-messaging-app.json |
    (
      cd "$simulator_workdir" || exit 1
      SIMULATOR_MCP_OPERATOR_PAIRING_CODE="$operator_code" claude \
        --print --verbose --output-format stream-json --no-session-persistence \
        --restricted --strict-mcp-config --mcp-config "$simulator_config" \
        --tools '' --allowedTools "$simulator_tools"
    )
)
```

The config contains an environment-variable reference. The host expands that reference for the relay, which omits the pairing tool in operator mode. For automated QA, generate the code in the launcher, pass it in the subprocess environment, and fill the browser field from the same in-memory value. Record tool calls and browser markers after pairing. Export the finished canvas from the browser and use `compare` to check it against BASE-01.

### Codex CLI compatibility

Codex CLI 0.172.0 started the relay over stdio with an ephemeral, read-only session. Its default non-interactive approval policy blocked `get_canvas_state` before dispatch with `MCP tool call requires approval, but approval policy is never`. Use the restricted Claude Code command above for the verified LLM path. The deterministic SDK runner works without an LLM host.
