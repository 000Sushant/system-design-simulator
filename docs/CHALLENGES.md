# Adding a Design Challenge

Challenges are **pure data** — you add one object to a JSON file, no code or
component changes. The hub, problem view, hints, milestones, scoring, and votes
all pick it up automatically.

1. Edit [`frontend/src/app/core/data/challenges.json`](../frontend/src/app/core/data/challenges.json) — add an object to the `challenges` array.
2. Run the validator:

   ```bash
   cd frontend
   npm run validate:challenges
   ```

   It fails fast with a clear message if anything is off (and runs in CI on every PR).

That's it. Set `"authored": true` to make it playable; leave it `false` to show a
locked "coming soon" card.

## The shape of a challenge

```jsonc
{
  "id": "url-shortener",            // unique kebab-case id
  "title": "URL Shortener",
  "difficulty": "easy",             // easy | medium | hard
  "category": "Web Services",       // colours the category chip
  "companyTag": "Bit.ly",           // optional, shown as a tag
  "estMinutes": 15,
  "authored": true,
  "problem": "Design a service like bit.ly that ...",
  "functionalRequirements": ["...", "..."],
  "constraints": ["...", "..."],
  "targetScale": "~10k redirects/sec, millions of stored codes",

  "hints": [ /* one per milestone, see below */ ],
  "milestones": [ /* ordered checkpoints, see below */ ],
  "rubric": { "passScore": 70, "checks": [ /* weighted, see below */ ] },
  "referenceSolution": { "nodes": [...], "edges": [...] }
}
```

### Hints (one per milestone)

There must be **exactly one hint per milestone**, and hint *N* should guide the
learner toward milestone *N*. Hints stay hidden until the user reveals them.

```jsonc
{ "id": "h1", "order": 1, "title": "Start at the edge", "body": "Put an API Gateway in front ..." }
```

### Milestones (live progress)

Milestones light up as the user builds the right thing. The last one is usually
observability, marked `"hidden": true` so it isn't given away up front.

```jsonc
{
  "id": "m1",
  "label": "Clients can reach an API",
  "detail": "An API Gateway is wired into the request path.",
  "rule": { "kind": "hasService", "anyOf": ["apiGateway"], "mustBeConnected": true },
  "hidden": false
}
```

### Rubric (final score, 0–100)

Each check has a `weight`; the engine normalises non-optional weights to 100.
`"optional": true` makes a check a **bonus** (failing it only warns, passing it can
push the score above 100). Always include a `noOverload` check so a design that
saturates under load scores lower.

```jsonc
{
  "id": "c-cache",
  "label": "Read caching for hot redirects",
  "weight": 2,
  "rule": { "kind": "hasService", "anyOf": ["elastiCache", "cloudfront"], "mustBeConnected": true },
  "failHint": "Add ElastiCache or CloudFront so popular reads skip the database."
}
```

### Reference solution

A model answer, used by the "Show solution" button. It's built through the same
validation as the canvas, so **every edge must be a legal connection**. The
validator confirms the reference reaches every milestone and passes its rubric.

```jsonc
{
  "nodes": [
    { "key": "users", "type": "client", "name": "Users", "x": 60, "y": 220 },
    { "key": "api", "type": "apiGateway", "name": "Redirect API", "x": 320, "y": 220 }
  ],
  "edges": [ ["users", "api"] ]   // [sourceKey, targetKey]
}
```

## Rule kinds

Milestones and rubric checks share one small, typed rule language — no free-form code:

| kind | passes when | example |
|---|---|---|
| `hasService` | ≥ `min` (default 1) of the listed types exist; with `mustBeConnected`, they must be reachable from a client | `{ "kind": "hasService", "anyOf": ["dynamoDb","rds","aurora"], "mustBeConnected": true }` |
| `hasEdge` | a real connection exists from any `fromAnyOf` type to any `toAnyOf` type | `{ "kind": "hasEdge", "fromAnyOf": ["apiGateway"], "toAnyOf": ["lambda","ecs"] }` |
| `configAtLeast` | a node of a listed type has `config[key] >= value` | `{ "kind": "configAtLeast", "anyOf": ["lambda"], "key": "throughput", "value": 500 }` |
| `countAtLeast` | ≥ `min` distinct nodes across the listed types | `{ "kind": "countAtLeast", "anyOf": ["ec2"], "min": 2 }` |
| `noOverload` | no node is overloaded/failing/offline (after a sim run) | `{ "kind": "noOverload" }` |
| `allOf` | every sub-rule passes | `{ "kind": "allOf", "rules": [ ... ] }` |

Use `anyOf` so "a database" can match DynamoDB **or** RDS **or** Aurora — don't
hard-code one product unless the challenge truly requires it.

## Two gotchas the validator catches for you

1. **Only use Developer-Mode services.** Challenges can only use services that are
   draggable in Developer Mode:

   `client, route53, cloudfront, apiGateway, elb, lambda, ec2, ecs, eks, appRunner,
   s3, efs, rds, aurora, dynamoDb, elastiCache, sqs, sns, eventBridge, stepFunctions,
   cloudWatch, xray, cognito, appSync, bedrock`

   (Source of truth: the `devServices` set in `features/simulator/simulator.component.ts`.)

2. **`mustBeConnected` means reachable from the client.** Reachability follows
   connection direction from the `client` node. A *trigger source* like EventBridge
   or an SQS queue fed by a scheduler sits **off** the client request path, so
   `mustBeConnected` will never pass for it. For those, assert wiring with `hasEdge`
   instead (e.g. `eventBridge -> lambda`).

Connection legality comes from the rules in
[`aws-services.json`](../frontend/src/app/core/config/aws-services.json); the
validator reports any illegal reference edge with the offending pair.
