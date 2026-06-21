# Architecture

This project follows a pragmatic **Layered (Clean-lite) architecture**. The
goal is that a newcomer can open any file and immediately know which layer it
belongs to and what it is allowed to depend on.

The golden rule is **dependencies point inward**: outer layers may import inner
layers, never the reverse.

```
            ┌──────────────────────────────────────────────┐
            │              Presentation                     │  features/*  (Angular components)
            │   simulator · documentation · landing · canvas│
            └───────────────┬──────────────────────────────┘
                            │ depends on
            ┌───────────────▼──────────────────────────────┐
            │              Application                      │  core/services/*  (use-cases / orchestration)
            │   simulation · cost · validation-rule ·       │
            │   architecture-factory · preset · catalog     │
            └───────────────┬──────────────────────────────┘
                            │ depends on
            ┌───────────────▼──────────────────────────────┐
            │               Domain                          │  core/models/*  (types only, zero deps)
            │   ArchitectureNode · Connection · ports …      │
            └──────────────────────────────────────────────┘

   Infrastructure (adapters to the outside world) is injected into Application:
     · CostService pricing fetch  → backend /api/prices → Cloudflare KV / Worker
     · ProjectStorageService      → browser localStorage
     · AwsCatalogService          → AWS icon CDN + aws-services.json
     · worker/  + backend/        → pricing generation & serving
```

## Layers

| Layer | Location | Responsibility | May depend on |
|---|---|---|---|
| **Domain** | `frontend/src/app/core/models/` | Pure TypeScript types describing the architecture graph and config. No logic, no framework, no I/O. | nothing |
| **Application** | `frontend/src/app/core/services/` | The simulation engine, cost engine, validation, factory and presets. Holds the business rules. | Domain |
| **Infrastructure** | `cost.service` HTTP fetch, `project-storage.service`, `aws-catalog.service`, plus `worker/` and `backend/` | Talks to the outside world: pricing API/KV, `localStorage`, icon CDN. | Domain |
| **Presentation** | `frontend/src/app/features/` | Angular standalone components: the canvas UI, inspector, docs, landing. Renders state and forwards user intent to Application services. | Application, Domain |

**Rules of thumb**
- Domain depends on nothing and contains no logic.
- Presentation never reaches past Application into infrastructure details (no raw `fetch`/`localStorage` in components).
- Cross-cutting literals live in `core/constants/` or the data files, not inline in business logic.

## The data-driven core

Services are described by **data, not code**. These JSON files are the system of
record for the 64 supported AWS services (see the project `CLAUDE.md` for the
full contract):

- `core/config/aws-services.json` — ports and connection rules.
- `core/data/service-cost-model.json` — simulation and cost parameters + defaults.
- `core/data/service-documentation.json` — documentation prose.
- `core/data/regions/us-east-1.json` — the canonical pricing factors (also the
  offline fallback). This is the single source of truth for fallback rates; the
  cost engine backfills any region missing a factor from this file.

## Security model

- **Worker** (`worker/src/index.ts`): all routes (read routes like `/status` and `/pricing/{region}`, and mutating routes like `/trigger`, `/reset`, and `/start`) are public.
- **Backend** (`backend/server.js`): CORS is restricted to `ALLOWED_ORIGINS`,
  `helmet` sets security headers, and the `region` query param is validated
  against an allowlist before any KV/filesystem lookup.
- **Secrets** never live in the repo: `.dev.vars`, `.env`, and `.wrangler/` are
  git-ignored; only `*.example` files are tracked. Worker secrets are set with
  `wrangler secret put`.

## Known follow-ups (intentional debt)

These are documented so they are not mistaken for hidden problems:

- `cost.service.ts` mixes the Application cost logic with the Infrastructure
  pricing fetch — split the HTTP fetch into a dedicated pricing gateway.
- `cost.service.ts` `switch (node.type)` and `documentation.component.ts`
  (per-service `illustrationSvg` map) are large; decompose into per-service
  strategies / move illustrations to data, matching the data-driven philosophy.
- The inline numeric `pf.X || N` fallbacks in `cost.service.ts` now duplicate
  values already present in `us-east-1.json`; they can be removed safely since
  `pf` is backfilled from that file.
