# ☁️ Sr. Architect: AWS System Design Simulator

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare-workers&logoColor=white)](https://workers.cloudflare.com/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](LICENSE)

> **Design. Simulate. Optimize.** A browser-based AWS architecture sketchbook featuring a **deterministic traffic-and-cost simulation engine**. Drag AWS services onto a canvas, connect them, tune system knobs, and watch a live simulation trace traffic flow, detect bottlenecks, and evaluate real-time monthly billing.

---

## 🗺️ System Architecture

Sr. Architect decouples canvas UI, simulation iterations, and AWS rate-fetching into a modern distributed layout:

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef worker fill:#7c2d12,stroke:#f97316,stroke-width:2px,color:#fff;
    classDef aws fill:#7e22ce,stroke:#a855f7,stroke-width:2px,color:#fff;

    %% Nodes
    A["Angular Canvas UI<br/>(@foblex/flow)"]:::frontend
    B["Simulation Engine<br/>(RxJS, 180ms step loop)"]:::frontend
    C["Cost Evaluation Service<br/>(evaluateServiceCost)"]:::frontend
    D["Cloudflare Worker<br/>(AWS Pricing Fetcher)"]:::worker
    E["Cloudflare KV Store<br/>(PRICING_KV)"]:::worker
    F["Local Fallback JSON<br/>(us-east-1.json)"]:::frontend
    G["AWS Pricing API"]:::aws

    %% Connections
    A <--> B
    B --> C
    C -- "1. Reads Rates" --> E
    C -- "2. Fallback (if KV fails)" --> F
    D -- "Weekly CRON" --> G
    D -- "Writes Regional Pricing" --> E
```

---

## 🔄 Simulation & Cost Evaluation Lifecycle

Every canvas modification triggers a deterministic step loop (running at ~180ms intervals) to update node capacity, demand, queue delays, and cost lines:

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
    CS->>KV: Read regional rates (e.g. EC2 hourly, GB-sec x86/ARM, requestsM)
    CS->>CS: Compute formulas (e.g. REST API, Lambda provisioned, S3 tiering)
    CS->>User: Render Live Cost Panel ($ per month breakdown)
```

---

## 🎛️ Dual-Mode Design System

Sr. Architect features two distinct operation modes tailored to different engineering goals:

### 🎓 Developer Mode (Learning-Oriented Sandbox)
Designed for students and developers learning cloud engineering fundamentals. The experience is optimized for system behavior, traffic logic, and architectural patterns:
- **Core Service Catalog**: Simplifies the workspace palette to essential AWS resources (24+ core services).
- **Interactive Documentation**: Instant access to overview guides, integration patterns, and best practices directly next to the canvas nodes.
- **Simplified Controls**: Abstracts complex billing parameters into easy-to-use sliders (e.g., base latency, request loads).
- **Simplicity Focus**: All complex pricing factors, region selectors, and billing tabs are hidden to keep you focused on structural system design.
- **Traffic & Bottleneck Analysis**: Easily watch animated packets flow through nodes and see bottlenecks turn red under high demand.

### 📐 Architect Mode (Production-Grade Design)
Exposes the complete feature set needed by Senior Engineers and Cloud Architects to model enterprise environments:
- **Comprehensive Catalog**: Unlock **60+ AWS services** (compute, database, serverless, networking, analytics, security).
- **Granular Parameter Control**: Exposes hardware options (such as EC2 instance sizes, EBS types, DB engines, cache sizes, Multi-AZ switches).
- **In-Depth Cost Estimation**: Employs real AWS billing formulas driven by live weekly pricing updates fetched directly from the AWS Pricing API.
- **Bigger & Complex Architectures**: Design multi-tier architectures with custom traffic distribution rules, variable loads, and failover pathways.

---

## 💻 Technical Stack

- **Frontend Core**: Angular 19 (Standalone Components, Signals, RxJS streams)
- **Canvas Framework**: `@foblex/flow` (interactive drawing, port bindings)
- **Worker Infrastructure**: Cloudflare Worker running Wrangler, writing to Cloudflare KV.
- **AWS API Integration**: `aws4fetch` for signing requests to the AWS Price List API.
- **Styling**: Premium Glassmorphism Design System constructed with Vanilla CSS.

---

## 🚀 Getting Started

Sr. Architect is split into a frontend Angular simulator application, a Cloudflare Worker directory, and localized automation scripts.

### Prerequisites
- Node.js (v20+)
- npm (v10+)

---

### 📦 Installation

#### 1. Clone the repository
```bash
git clone https://github.com/000Sushant/system-design-simulator.git
cd system-design-simulator
```

#### 2. Run the Frontend (Angular Simulator)
```bash
cd frontend
npm install
npm run start
```
The application will launch at `http://localhost:4200/`.

#### 3. Run the Cloudflare Worker (Weekly Pricing Sync)
```bash
cd ../worker
npm install
npm run dev
```
To configure credentials and deploy:
```bash
# Add AWS Credentials for Pricing API
npm run secret:aws-key
npm run secret:aws-secret
# Deploy
npm run deploy
```

#### 4. Run the Pricing Validation Script
The workspace includes a validation script in `scripts/` to verify that pricing fallback parameters remain in sync with the live AWS Pricing API:
```bash
cd ../scripts
npm install
# Set Process Environment Variables or use a scripts/.env file
# Run validation (defaults to ap-south-1)
node --env-file=.env validate-pricing.mjs
```

---

## 👤 About the Creator

**Sushant Kumar**  
*Backend-focused Full-Stack Engineer and Systems Builder*  

Obsessed with building high-performance, developer-centric tooling. Feel free to connect:
- ✉️ [Email](mailto:000suahntkumar@gmail.com)
- 💼 [LinkedIn](https://linkedin.com/in/sushant--kumar)
- 🌐 [Portfolio](https://000sushant.github.io/sushant-portfolio/)
- 🐙 [GitHub](https://github.com/000Sushant)

---

## 📦 Release History

### Version 1.2 (Current)
- **Expanded AWS Service Catalog**: Model architectures with **60+ hand-crafted AWS services**, each with custom properties, input/output port definitions, and visual flow mappings.
- **Dual-Mode Workspace**: Seamlessly transition between **Developer Mode** (a simplified sandbox designed for learning cloud concepts) and **Architect Mode** (a professional designer with detailed hardware classes and pricing options).
- **Interactive Documentation**: Comprehensive, in-app guide articles for all 64 services detailing Conceptual Models, Architectural Working (with custom animations), Recommended Practices, and common Failure Modes.
- **Live AWS Cost Estimation**: Accurate monthly cost updates driven by real AWS pricing rates fetched weekly from the live AWS Pricing API and updated on the fly.
- **Multi-Canvas Configuration Support**: Create, manage, and design multiple independent cloud architectures side-by-side using tabs.
- **Variable Traffic Modeling**: Model realistic user traffic behavior by configuring minimum/maximum traffic bounds with live, randomized fluctuations.
- **Traffic Distribution Manager**: Route and manage traffic flows between multiple downstream nodes with custom routing weights or percentages.
- **Canvas Keyboard Hotkeys**: Accelerate your design iterations with keyboard shortcuts (e.g., `Ctrl+Z` / `Ctrl+Y` or `Ctrl+Shift+Z` for Undo/Redo, `Ctrl+S` to save, and `Delete` / `Backspace` to remove selected canvas elements).
- **Realistic Bottleneck Modeling**: Advanced multi-factor resource-bound modeling (evaluating queue depths, CPU pressure, and concurrent execution limits) featuring load-shedding/throttling and server collapses.

### Version 1.1
- Integrated regional pricing calculations.
- Responsive simulation and cost layouts.
- Added compact run stats bar.

Built with ❤️ for the Cloud Community. Licensed under the [GNU General Public License v3.0](LICENSE).
