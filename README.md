# AWS System Design Simulator

A lightweight Angular + Node.js simulator for AWS architecture design. Users can drag AWS services onto a whiteboard canvas, connect valid service ports, configure capacity settings, and run a deterministic live simulation that visualizes data flow, bottlenecks, queue pressure, and failures.

## Structure

- `client/` - Angular frontend with canvas, palette, config editor, validation feedback, presets, and live simulation rendering.
- `server/` - Node.js/Express backend with MVC-style controllers, data models, validation rule APIs, project persistence, and a server-side simulation service.

## Run

```powershell
npm run install:all
npm run dev
```

Angular runs on `http://localhost:4200`; the API runs on `http://localhost:3000/api`.

## Key Extension Points

- Add AWS services in `client/src/app/core/services/aws-catalog.service.ts` and `server/src/data/aws-catalog.ts`.
- Add connection rules in `client/src/app/core/services/validation-rule.service.ts` and `server/src/data/connection-rules.ts`.
- Add simulation behavior in `client/src/app/core/services/simulation.service.ts` and `server/src/services/simulation.service.ts`.

## Improvements
- Indroduce GCP and Azure
- Introduce AI powered analyzer
- show correct architecture status
- fix play/pause/stop button