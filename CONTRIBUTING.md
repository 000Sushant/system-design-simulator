# Contributing to Sr. Architect

Thanks for taking the time to help improve the AWS System Design Simulator. Whether you are fixing a typo, refining a cost formula, or adding a whole new service, your contribution is welcome here.

This project aims to be highly accurate in both cost and traffic simulation, so the guidelines below help keep that quality bar high.

## Ways to contribute

- Report a bug or a pricing inaccuracy by opening an issue
- Suggest a feature or a new AWS service
- Improve documentation or service descriptions
- Submit a pull request with a fix or enhancement

## Getting set up

```bash
# Frontend (the simulator + docs)
cd frontend
npm install
npm run start        # http://localhost:4200

# Worker (regional pricing)
cd worker
npm install
npm run dev
```

## Before you open a pull request

- Keep changes focused. One topic per pull request is much easier to review.
- The frontend should type-check cleanly (`cd frontend && npx tsc --noEmit`), and the same for the worker.
- If you change any pricing factor, remember it lives in two places that must stay in sync:
  - `frontend/src/app/core/data/regions/us-east-1.json`
  - `worker/src/schema-builder.ts` (`BASELINE_SERVICES`)
- Services are data-driven. Most service changes happen in the JSON files under `frontend/src/app/core`, not in code.
- Write commit messages that explain the why, not just the what.

## How services are defined

A single service is described across three JSON files keyed by its `type`:

| File | Owns |
|---|---|
| `core/config/aws-services.json` | Ports, connection rules, category, defaults |
| `core/data/service-cost-model.json` | Simulation params and cost params |
| `core/data/service-documentation.json` | Docs prose |

If something is unclear, please open an issue and ask. We would rather answer a question early than have you spend time guessing.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the GNU GPL v3. By contributing, you agree that your contributions will be licensed under the same license.
