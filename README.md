# ☁️ Sr. Architect: AWS System Design Simulator

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare-workers&logoColor=white)](https://workers.cloudflare.com/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-db2777?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/000Sushant)

**Learn. Design. Simulate. Optimize.** Sr. Architect is an interactive, browser-based system design simulator and cloud architecture sketchbook. It features a deterministic traffic-and-cost simulation engine that lets you model AWS environments, watch real-time traffic flow, spot bottlenecks under load, and evaluate real-time monthly billing.

---

## ✨ Key Features

### 🏆 Interactive System Design Challenges
Learn cloud engineering and system design by solving real-world challenges directly on the canvas:
- **Guided Scenarios**: Solve design problems such as scaling a URL shortener, building a chat system, or optimizing a video transcoding pipeline.
- **Interactive Scoring & Hints**: Receive instant, data-driven feedback on your architecture's performance, capacity, and cost, alongside guided hints to help you improve.
- **Reference Solutions**: Access architectural diagrams and expert guides detailing the trade-offs and rationale behind every decision.

### 📐 Interactive Architecture Dashboard
Model production-grade topologies with a comprehensive, interactive service palette:
- **74 Hand-Crafted AWS Services**: Exposes compute, database, networking, serverless, storage, analytics, and security services — including Amplify, SES, DocumentDB, Neptune, Timestream, AppConfig, App Mesh, Cloud Map, QuickSight, and Lightsail.
- **Hardware-Level Configurations**: Customize instance sizes (e.g. EC2 `t3.medium` vs `c6g.xlarge`, GPU families like `g5`/`g6`), storage volumes (gp3/io2), DB engine families, read replicas, and caching states.
- **Regional Availability Awareness**: The UI detects real AWS regional service gaps (e.g. Timestream missing in 19 of 27 regions) and flags unsupported services to prevent invalid architectures.
- **Multi-Canvas Workspace**: Organize your architectures using tabbed views, enabling you to design and compare alternative topologies side-by-side, with resizable service palette and dashboard panels.

### ⚡ Real-Time Traffic & Bottleneck Simulation
Observe how your system behaves under variable workloads with a built-in step simulator:
- **Visual Flow Mapping**: Watch animated SVG packets cascade through nodes along defined paths, showing how data distributes.
- **Dynamic Resource Constraints**: Node-level resources evaluate CPU utilization, queue depth delays, and request limits, warning you of bottlenecks in red.
- **Realistic Failures**: Simulate load-shedding, traffic throttling, server collapses, and offline cascading failures.

### 💰 Live AWS Cost Estimation Engine
Design cost-efficient architectures with a real-time billing dashboard:
- **Live AWS Pricing Sync**: A weekly Cloudflare **Workflow** durably rebuilds regional rate tables from the live AWS Pricing API (27 regions × 9 phases, with automatic step retries and a daily repair run for failed regions).
- **Benchmarked 100% Pricing Accuracy**: Independently audited against the AWS Price List API — all 7,511 active cost parameters across 27 regions match ground truth exactly, with a 92.4% weighted cost-realism score (see the in-app Reports page).
- **Granular Billing Formulas**: Calculates monthly cost estimates reflecting request counts, provisioned throughput, database engines, regional transfer, and advanced tier configurations — Aurora I/O-Optimized, Kinesis On-Demand, MSK Serverless/Express, DynamoDB Global Tables & PITR, ElastiCache Valkey, Lambda SnapStart, MediaConvert codec tiers, and more.
- **Cost Breakdown**: View a detailed, itemized cost panel showing the exact billing impact of each node in your architecture.
- **Multi-Currency Display**: Convert bills into EUR, GBP, INR, or JPY using ECB reference rates refreshed daily by a dedicated analytics worker.

### 📊 In-App Engineering Reports
A built-in Reports page (`/reports`) publishes the project's own audit artifacts:
- **Cost-Accuracy Benchmark v5**: The full audit methodology, per-service coverage matrix, and regional gap analysis.
- **Engine Deep-Dive**: An engineering write-up of the PulseFlow traffic engine and the Rubix grading engine internals.

---

## ⚙️ Core Simulation Engines

Sr. Architect's interactive simulator runs on two custom, deterministic engines:

### 💓 PulseFlow: Reactive Traffic Simulation Engine
PulseFlow is the reactive heartbeat of the visual workspace, running about 5 times a second (at a steady ~180ms tick interval). It is designed to mimic realistic production environment characteristics:
- **Reactive Stream Traversal**: Traverses your active canvas node graph in logical topological flow order using RxJS, ensuring upstream loads accurately cascade down to child nodes.
- **Compounding Backlog Latency**: Rather than simple static metrics, it simulates request queues over time. If a service experiences traffic past its capacity, queue delays build up and latency compounds exponentially tick-by-tick.
- **Cascading Backpressure**: Bottlenecks propagate backward up the stack. If a database is slow, it blocks database connection pools, which in turn blocks app servers, degrading API Gateway response times tick-by-tick.
- **Dynamic Workloads**: Clients sample new request rates using random walk intervals to simulate real-world user traffic spikes and noise.
- **Sustained Pressure Collapses**: Compute nodes (EC2, ECS, RDS) tolerate short, transient load spikes, but trigger a hard offline crash if they remain overloaded past a sustained duration.
- **Auto Scaling & Provisioning Delay**: A crashed node undergoes a boot/provisioning loop, only recovering once incoming load stays below safe limits for a set duration.

#### ⚙️ Realism Modeling & Mathematical Assumptions
To model actual hardware and network constraints, PulseFlow enforces the following constants:
*   **Tick Interval (`180ms`)**: The discrete time step at which all queues and network states are recalculated.
*   **Request Timeout (`DEFAULT_TIMEOUT_MS = 60s`, per-node `timeoutMs` override)**: Under sustained overload, latency compounds (`+12ms` growth × `1.12` acceleration per tick) until it reaches the request timeout — at which point requests time out and shed, clearing the backlog.
*   **Crash Sustain Limit (`OFFLINE_SUSTAIN_TICKS = 6` / `~1.1s`)**: The number of consecutive timed-out ticks required to collapse a resource-bound node offline; managed services (throttle-class) keep shedding and stay up.
*   **Auto Scaling Boot Delay (`RECOVERY_TICKS = 10` / `~1.8s`)**: The provisioning window required for a collapsed server to initialize and come back online.
*   **Auto Scaling Safe Headroom (`RECOVERY_HEADROOM = 0.9`)**: A collapsed node only restarts once demand stays at or below 90% of the capacity its current configuration would provide.
*   **Max Queue Buffer (`MAX_QUEUE_TICKS = 8`)**: Bounded queue size of 8 ticks-worth of request capacity to prevent infinite queue growth.
*   **Overload Latency Decay (`OVERLOAD_LATENCY_DECAY = 0.6`)**: Once load drops back under capacity, accumulated overload latency decays at 0.6 per tick (~40% per 180ms), so latency visibly recovers within about a second.

### 🧩 Rubix: Automated Architecture Rubric Engine
Rubix is a declarative verification and grading engine that analyzes your visual topologies against design challenges:
- **Declarative Rule Parser**: Processes a lightweight JSON rule grammar supporting validation operators like `hasService`, `hasEdge`, `configAtLeast`, `countAtLeast`, and `noOverload`.
- **Live Scoring & Milestones**: Calculates a final design score from 0–100 dynamically, awarding bonus points for best practices (e.g. read replicas) and applying penalties for resource overloads.
- **Topology Compliance Checker**: Cross-references your canvas connections against service specs to immediately flag illegal port configurations (such as connecting a client directly to an internal DB node).

---

## 🗺️ System Architecture

Sr. Architect decouples the canvas UI, the simulation iteration loop, and the live AWS pricing pipelines into a highly efficient distributed topology:

![System Architecture Diagram](file:///C:/Users/harsh/.gemini/antigravity-ide/brain/ac9242b1-791f-4140-b60b-d5b22e6865c4/system_architecture_light_1784041467957.png)

---

## 🔄 Simulation & Cost Lifecycle

Every canvas change triggers a deterministic evaluation loop (running at ~180ms intervals) to evaluate traffic flow, queue depths, bottlenecks, and costs:

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Canvas)
    participant C as Canvas (@foblex/flow)
    participant SE as Simulation Engine (180ms loop)
    participant CS as Cost Service
    participant KV as Pricing KV / Fallback

    User->>C: Drag/Connect Nodes & Tune Sliders
    SE->>SE: Evaluate Traffic Demand (BFS from Client Nodes)
    SE->>SE: Calculate Utilization & Bottlenecks (cascades offline status)
    C->>User: Animate Traffic Flows (categorized SVG packets)
    SE->>CS: Request Cost Calculation
    CS->>KV: Read regional rates (e.g. EC2 hourly, GB-sec, requestsM)
    CS->>CS: Compute formulas (e.g. REST API, Lambda, S3 tiering)
    CS->>User: Render Live Cost Panel ($ per month breakdown)
```

---

## 💻 Tech Stack

- **Frontend Core**: Angular 21 (Standalone Components, Signals, RxJS streams)
- **Canvas Engine**: `@foblex/flow` (interactive drawing, port bindings)
- **Worker Infrastructure**: Two Cloudflare Workers managed with Wrangler — a weekly pricing rebuild running as a durable **Cloudflare Workflow** (automatic step retries, failure queue + daily repair cron), and a daily analytics worker (ECB FX rates, project stats) — both storing data in Cloudflare KV.
- **AWS API Integration**: `aws4fetch` for signing requests to the AWS Price List API.
- **Testing**: Vitest unit and characterization suites across the frontend engines and both workers.
- **Styling**: Premium CSS Glassmorphism Design System.

---

## 🧱 Project Structure

The project is structured with clean separation between the domain logic, simulation handlers, and visual presentation layers. Refer to **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for a detailed file map.

```
frontend/src/app/
  core/
    models/        # Domain — pure types (no logic, no deps)
    services/      # Application — simulation, cost & validation engines
    constants/     # Shared configuration and magic constants
    data/ config/  # Data-driven core: 74 services described in JSON, region availability map
  features/        # Presentation — Angular components (canvas, docs, landing, reports)
workers/
  aws-pricing-generator/  # Infrastructure — weekly AWS pricing rebuild (Cloudflare Workflow)
  daily-analytics/        # Infrastructure — daily FX rates + project analytics worker
backend/           # Infrastructure — Express reader serving regional pricing from KV
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm (v10+)

### Installation & Run

#### 1. Clone the repository
```bash
git clone https://github.com/000Sushant/system-design-simulator.git
cd system-design-simulator
```

#### 2. Run the Angular Frontend (Simulator)
```bash
cd frontend
npm install
npm run start
```
The application will launch locally at `http://localhost:4200/`.

Run the unit/characterization test suite (Vitest) and lint:
```bash
npm test
npm run lint
```

#### 3. Run the Cloudflare Workers (Pricing Scraper / Daily Analytics)
```bash
cd ../workers/aws-pricing-generator   # or ../workers/daily-analytics
npm install
npm run dev
```

#### 4. Run the Pricing Validation Script
Verify local pricing database files match the schema requirements:
```bash
cd ../scripts
npm install
# Set process environment variables or use a local .env file
node --env-file=.env validate-pricing.mjs
```

---

## 🤝 Contributing

Contributions from the community are welcome!
- To report a bug or suggest a feature, please open an issue in the [GitHub Issues](https://github.com/000Sushant/system-design-simulator/issues) page.
- If you'd like to add a new system design challenge, please refer to the [Challenges Guideline](docs/CHALLENGES.md).
- To contribute new service parameters, edit the data JSON files in `frontend/src/app/core/data/` and submit a Pull Request.

---

## 👤 About the Creator

**Sushant Kumar**  
*Backend-focused Full-Stack Engineer and Systems Builder*  
- ✉️ [Email](mailto:000suahntkumar@gmail.com)
- 💼 [LinkedIn](https://linkedin.com/in/sushant--kumar)
- 🌐 [Portfolio](https://000sushant.github.io/sushant-portfolio/)
- 🐙 [GitHub](https://github.com/000Sushant)

---

## 💜 Support the Project
If this tool has helped you learn system design, model cloud environments, or evaluate AWS bills, please consider supporting its development:
> 💖 [**Become a sponsor on GitHub →**](https://github.com/sponsors/000Sushant)

---

Built with ❤️ for the Cloud Community.

**© 2026 Sushant Kumar. All rights reserved.** Licensed under the [GNU General Public License v3.0](LICENSE).
