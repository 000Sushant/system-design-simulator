import { DocArticle, ReleaseNote, ServiceDoc } from './documentation.types';

/**
 * Per-service documentation content (text + inline SVG illustrations) shown in
 * the docs UI. Extracted verbatim from DocumentationComponent so the component
 * stays presentation logic and this stays editable content/data.
 */
export const SERVICE_DOCS: Record<
  string,
  Partial<Omit<ServiceDoc, 'illustrationSvg'>> & { illustrationSvg?: string }
> = {
  client: {
    practicalExample:
      'Simulating 5,000 global shoppers accessing your ecommerce website concurrently during a Black Friday flash sale event.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <path d="M 65 45 L 155 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 65 90 L 155 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 65 135 L 155 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- 2. Aggregated traffic to endpoint -->
          <path d="M 195 90 L 290 90" fill="none" stroke="#ec4899" stroke-width="2.2" stroke-dasharray="5 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="3.5" fill="#ec4899"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 65 45 L 155 90" /></circle>
          <circle r="3.5" fill="#a855f7"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 65 90 L 155 90" /></circle>
          <circle r="3.5" fill="#ec4899"><animateMotion dur="2.7s" repeatCount="indefinite" path="M 65 135 L 155 90" /></circle>
          <circle r="4.5" fill="#ec4899" filter="url(#glow-soft)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 195 90 L 290 90" />
          </circle>

          <!-- NODES -->
          <!-- User 1: Desktop -->
          <g transform="translate(45, 45)">
            <rect x="-18" y="-12" width="36" height="22" rx="2" fill="none" stroke="#475569" stroke-width="1.8" />
            <line x1="-22" y1="11" x2="22" y2="11" stroke="#475569" stroke-width="2" stroke-linecap="round" />
            <circle cx="0" cy="-1" r="3" fill="#ec4899" class="ill-pulse" />
            <text x="0" y="26" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Desktop</text>
          </g>

          <!-- User 2: Mobile (center, primary) -->
          <g transform="translate(45, 90)">
            <rect x="-10" y="-15" width="20" height="30" rx="3" fill="none" stroke="#a855f7" stroke-width="2" />
            <line x1="-7" y1="-10" x2="7" y2="-10" stroke="#a855f7" stroke-width="1" />
            <circle cx="0" cy="11" r="1.5" fill="#a855f7" />
            <text x="0" y="28" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Mobile</text>
          </g>

          <!-- User 3: Tablet -->
          <g transform="translate(45, 135)">
            <rect x="-14" y="-10" width="28" height="20" rx="2" fill="none" stroke="#475569" stroke-width="1.8" />
            <circle cx="0" cy="0" r="2" fill="#ec4899" class="ill-pulse" />
            <text x="0" y="22" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Tablet</text>
          </g>

          <!-- Aggregator (Internet hub) -->
          <g transform="translate(175, 90)">
            <circle cx="0" cy="0" r="18" fill="#fdf2f8" stroke="#db2777" stroke-width="2" />
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#db2777" stroke-width="1.2" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#db2777" stroke-width="1.2" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#db2777" stroke-width="1.2" />
            <text x="0" y="32" font-size="8.5" text-anchor="middle" font-weight="800" fill="#be185d">Internet</text>
          </g>

          <!-- Target endpoint (Application) -->
          <g transform="translate(325, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="6" fill="#eef2ff" stroke="#6366f1" stroke-width="2" />
            <line x1="-30" y1="-10" x2="30" y2="-10" stroke="#c7d2fe" stroke-width="1" />
            <circle cx="-20" cy="-15" r="2" fill="#22c55e" />
            <circle cx="-12" cy="-15" r="1.5" fill="#6366f1" />
            <rect x="-22" y="-3" width="44" height="5" rx="1" fill="#818cf8" opacity="0.45" />
            <rect x="-22" y="6" width="44" height="5" rx="1" fill="#818cf8" opacity="0.45" />
            <text x="0" y="32" font-size="8.5" text-anchor="middle" font-weight="800" fill="#3730a3">Application</text>
          </g>
        </svg>
      `,
  },
  route53: {
    practicalExample:
      'Resolving `api.shop.com` to a localized Application Load Balancer IP address dynamically, routing users to their nearest server cluster.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Client query to Route 53 -->
          <path d="M 55 90 L 100 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Route 53 to routing policy -->
          <path d="M 145 90 L 175 90" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3a. Policy → US endpoint -->
          <path d="M 220 90 Q 260 45 295 45" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3b. Policy → EU endpoint -->
          <path d="M 220 90 L 295 90" fill="none" stroke="#94a3b8" stroke-width="1.5" />
          <!-- 3c. Policy → APAC endpoint (unhealthy, faded) -->
          <path d="M 220 90 Q 260 135 295 135" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 55 90 L 100 90" /></circle>
          <circle r="4" fill="#f59e0b"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 145 90 L 175 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 220 90 Q 260 45 295 45" /></circle>

          <!-- Unhealthy marker on APAC path -->
          <g transform="translate(255, 116) scale(0.8)">
            <circle cx="0" cy="0" r="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" />
          </g>

          <!-- NODES -->
          <!-- 1. Client query -->
          <g transform="translate(35, 90)">
            <rect x="-16" y="-12" width="32" height="24" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.8" />
            <text x="0" y="-2" font-size="7" text-anchor="middle" font-weight="700" fill="#475569">DNS</text>
            <text x="0" y="7" font-size="6.5" font-family="monospace" text-anchor="middle" fill="#64748b">QUERY</text>
            <text x="0" y="22" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Client</text>
          </g>

          <!-- 2. Route 53 hosted zone (globe + record) -->
          <g transform="translate(122, 90)">
            <circle cx="0" cy="0" r="18" fill="#fffbeb" stroke="#f59e0b" stroke-width="2" />
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="none" stroke="#f59e0b" stroke-width="1.2" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#f59e0b" stroke-width="1.2" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#f59e0b" stroke-width="1.2" />
            <text x="0" y="30" font-size="8" text-anchor="middle" font-weight="800" fill="#b45309">Route 53</text>
            <text x="0" y="38" font-size="7" text-anchor="middle" font-weight="600" fill="#92400e">api.shop.com</text>
          </g>

          <!-- 3. Routing policy hub (latency-based) -->
          <g transform="translate(197, 90)">
            <rect x="-22" y="-18" width="44" height="36" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="2" />
            <path d="M -10 -8 L -3 -2 L -10 4" fill="none" stroke="#b45309" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M -10 0 L 8 0 M 0 -8 L 8 -8 M 0 8 L 8 8" stroke="#b45309" stroke-width="1.5" stroke-linecap="round" />
            <text x="0" y="28" font-size="8" text-anchor="middle" font-weight="800" fill="#b45309">Latency</text>
          </g>

          <!-- 4a. US-East endpoint (healthy) -->
          <g transform="translate(335, 45)">
            <rect x="-38" y="-15" width="76" height="30" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <text x="-30" y="-3" font-size="8.5" font-weight="800" fill="#065f46" text-anchor="start">us-east-1</text>
            <text x="-30" y="7" font-size="7" font-family="monospace" fill="#047857" text-anchor="start">52.4.3.1</text>
            <circle cx="26" cy="-1" r="5" fill="#10b981" />
            <path d="M 23 -1 L 25 1 L 29 -3" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" />
          </g>

          <!-- 4b. EU-West endpoint (healthy) -->
          <g transform="translate(335, 90)">
            <rect x="-38" y="-13" width="76" height="26" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.4" />
            <text x="-30" y="-2" font-size="8" font-weight="700" fill="#475569" text-anchor="start">eu-west-1</text>
            <text x="-30" y="7" font-size="7" font-family="monospace" fill="#64748b" text-anchor="start">3.5.140.2</text>
          </g>

          <!-- 4c. APAC endpoint (unhealthy) -->
          <g transform="translate(335, 135)">
            <rect x="-38" y="-13" width="76" height="26" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="1.4" stroke-dasharray="3 2" />
            <text x="-30" y="-2" font-size="8" font-weight="700" fill="#991b1b" text-anchor="start">ap-south-1</text>
            <text x="-30" y="7" font-size="7" font-family="monospace" fill="#dc2626" text-anchor="start">UNHEALTHY</text>
          </g>
        </svg>
      `,
  },
  cloudfront: {
    practicalExample:
      'Serving cached product catalog images instantly from an edge location in London to a local UK buyer, bypassing the origin server located in Oregon.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Viewer → nearest edge POP -->
          <path d="M 50 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2a. Edge → CACHE HIT response (loops back fast) -->
          <path d="M 162 80 Q 105 50 50 78" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-left" />
          <!-- 2b. Edge → CACHE MISS → origin -->
          <path d="M 162 100 L 295 100" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3. Origin → returns object to edge (populates cache) -->
          <path d="M 295 115 L 162 115" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 50 90 L 120 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 162 80 Q 105 50 50 78" /></circle>
          <circle r="4" fill="#8b5cf6"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 162 100 L 295 100" /></circle>

          <!-- NODES -->
          <!-- 1. Viewer (browser) -->
          <g transform="translate(30, 90)">
            <rect x="-15" y="-12" width="30" height="22" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.8" />
            <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#475569" stroke-width="1" />
            <circle cx="-10" cy="-9" r="1" fill="#ef4444" />
            <circle cx="-6" cy="-9" r="1" fill="#f59e0b" />
            <circle cx="-2" cy="-9" r="1" fill="#22c55e" />
            <text x="0" y="22" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Viewer</text>
          </g>

          <!-- 2. CloudFront Edge POP -->
          <g transform="translate(141, 90)">
            <rect x="-22" y="-22" width="44" height="44" rx="6" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2" />
            <circle cx="0" cy="-4" r="10" fill="none" stroke="#7c3aed" stroke-width="1.5" />
            <ellipse cx="0" cy="-4" rx="4" ry="10" fill="none" stroke="#7c3aed" stroke-width="1" />
            <line x1="-10" y1="-4" x2="10" y2="-4" stroke="#7c3aed" stroke-width="1" />
            <text x="0" y="14" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6b21a8">EDGE POP</text>
            <text x="0" y="34" font-size="8.5" text-anchor="middle" font-weight="800" fill="#6b21a8">CloudFront</text>
          </g>

          <!-- 2a. Cache HIT label -->
          <g transform="translate(95, 38)">
            <rect x="-30" y="-10" width="60" height="18" rx="9" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="2" font-size="8" text-anchor="middle" font-weight="800" fill="#047857">CACHE HIT ~5ms</text>
          </g>

          <!-- 2b. Cache MISS label -->
          <g transform="translate(228, 88)">
            <rect x="-32" y="-9" width="64" height="16" rx="8" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.2" />
            <text x="0" y="2" font-size="7.5" text-anchor="middle" font-weight="800" fill="#6b21a8">CACHE MISS ~120ms</text>
          </g>

          <!-- 3. Origin (S3 bucket) -->
          <g transform="translate(325, 108)">
            <ellipse cx="0" cy="-20" rx="22" ry="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.6" />
            <path d="M -22 -20 L -22 18 A 22 6 0 0 0 22 18 L 22 -20" fill="none" stroke="#10b981" stroke-width="1.6" />
            <ellipse cx="0" cy="-6" rx="22" ry="5" fill="none" stroke="#10b981" stroke-dasharray="3 2" />
            <ellipse cx="0" cy="8" rx="22" ry="5" fill="none" stroke="#10b981" stroke-dasharray="3 2" />
            <text x="0" y="38" font-size="8.5" text-anchor="middle" font-weight="800" fill="#065f46">Origin (S3)</text>
          </g>
        </svg>
      `,
  },
  apiGateway: {
    practicalExample:
      "Receiving requests on `/checkout` and verifying the user's Cognito authentication token before routing the request downstream to the Checkout microservice.",
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS WITH ANIMATION -->
          <!-- 1. Client to Authorizer -->
          <path d="M 65 90 L 95 90" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3" class="ill-flow-right" />
          
          <!-- 2. Authorizer to Router -->
          <path d="M 135 90 L 165 90" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- 3. Router to Lambda Target -->
          <path d="M 215 90 Q 255 45 285 45" fill="none" stroke="#ff9900" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- 4. Router to ECS Target -->
          <path d="M 215 90 Q 255 135 285 135" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED FLOW PACKETS -->
          <circle r="4" fill="#6366f1">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 65 90 L 95 90" />
          </circle>

          <circle r="4" fill="#10b981">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 135 90 L 165 90" />
          </circle>

          <circle r="4" fill="#ff9900">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 215 90 Q 255 45 285 45" />
          </circle>

          <circle r="4" fill="#3b82f6">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 215 90 Q 255 135 285 135" />
          </circle>

          <!-- NODES -->
          <!-- 1. Client Node -->
          <g transform="translate(45, 90)">
            <rect x="-18" y="-18" width="36" height="26" rx="3" fill="#ffffff" stroke="#64748b" stroke-width="2" />
            <rect x="-14" y="-14" width="28" height="18" fill="#f1f5f9" rx="1" />
            <path d="M -6 8 L 6 8 L 8 13 L -8 13 Z" fill="#64748b" />
            <text x="0" y="25" font-size="9.5" text-anchor="middle" font-weight="700" fill="#475569">Client</text>
          </g>

          <!-- 2. Authorizer / Security Check -->
          <g transform="translate(115, 90)">
            <circle cx="0" cy="0" r="16" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
            <path d="M -5 -6 L 0 -8 L 5 -6 L 5 -1 Q 5 3 0 6 Q -5 3 -5 -1 Z" fill="none" stroke="#10b981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M -2 0 L -0.5 1.5 L 2 -1" fill="none" stroke="#10b981" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="26" font-size="8.5" text-anchor="middle" font-weight="700" fill="#047857">Auth Check</text>
          </g>

          <!-- 3. API Gateway Routing Hub -->
          <g transform="translate(190, 90)">
            <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#fdf2f8" stroke="#db2777" stroke-width="2" />
            <path d="M -9 -9 H 9 M -9 0 H 9 M -9 9 H 9" stroke="#db2777" stroke-width="2" stroke-linecap="round" />
            <path d="M 3 -9 L 7 -9 L 7 -5 M 3 9 L 7 9 L 7 5" fill="none" stroke="#db2777" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="-5" cy="0" r="3" fill="#db2777" />
            <text x="0" y="28" font-size="9" text-anchor="middle" font-weight="800" fill="#db2777">Gateway</text>
          </g>

          <!-- 4. Target Lambda Function -->
          <g transform="translate(325, 45)">
            <rect x="-32" y="-18" width="64" height="36" rx="5" fill="#fffbeb" stroke="#ff9900" stroke-width="2" />
            <g transform="translate(-16, -1)">
              <path d="M -4 -6 L 2 6 M 2 6 L 5 8 M 2 6 L -3 6" fill="none" stroke="#ff9900" stroke-width="2" stroke-linecap="round" />
              <path d="M -4 -6 C -3 -3 0 0 2 6" fill="none" stroke="#ff9900" stroke-width="2" stroke-linecap="round" />
            </g>
            <text x="10" y="-3" font-size="9.5" text-anchor="middle" font-weight="700" fill="#0f172a">GET</text>
            <text x="10" y="8" font-size="8" text-anchor="middle" font-weight="600" fill="#ff9900">/users</text>
            <text x="0" y="27" font-size="8.5" text-anchor="middle" font-weight="700" fill="#7c2d12">Lambda</text>
          </g>

          <!-- 5. Target ECS Container -->
          <g transform="translate(325, 135)">
            <rect x="-32" y="-18" width="64" height="36" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
            <g transform="translate(-16, 0) scale(0.8)">
              <path d="M 0 -8 L 8 -4 L 8 4 L 0 8 L -8 4 L -8 -4 Z" fill="none" stroke="#3b82f6" stroke-width="1.8" />
              <path d="M 0 -8 L 0 8 M 0 0 L 8 -4 M 0 0 L -8 -4 M -8 4 L 0 0 L 8 4" fill="none" stroke="#3b82f6" stroke-width="1.2" />
            </g>
            <text x="10" y="-3" font-size="9.5" text-anchor="middle" font-weight="700" fill="#0f172a">POST</text>
            <text x="10" y="8" font-size="8" text-anchor="middle" font-weight="600" fill="#2563eb">/orders</text>
            <text x="0" y="27" font-size="8.5" text-anchor="middle" font-weight="700" fill="#1e3a8a">ECS Fargate</text>
          </g>
        </svg>
      `,
  },
  elb: {
    practicalExample:
      'Distributing incoming checkout traffic across a pool of 5 EC2 instances. If instance #3 crashes, the ELB automatically detects the health check failure and reroutes new payments to the remaining 4 instances.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Client to Load Balancer -->
          <path d="M 25 90 L 95 90" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3" class="ill-flow-right" />
          
          <!-- 2. Balancer to Healthy Target 1 (Active) -->
          <path d="M 170 90 Q 210 45 250 45" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="5 3" class="ill-flow-right" />

          <!-- 3. Balancer to Healthy Target 2 (Active) -->
          <path d="M 170 90 L 250 90" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="5 3" class="ill-flow-right" />

          <!-- 4. Balancer to Unhealthy Target 3 (Blocked/Faded) -->
          <path d="M 170 90 Q 210 135 250 135" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3" />

          <!-- ANIMATED FLOW PACKETS -->
          <circle r="4" fill="#94a3b8">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 25 90 L 95 90" />
          </circle>

          <circle r="4" fill="#3b82f6">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 170 90 Q 210 45 250 45" />
          </circle>

          <circle r="4" fill="#3b82f6">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 170 90 L 250 90" />
          </circle>

          <!-- Warning/Block indicator on path 3 -->
          <g transform="translate(205, 116) scale(0.8)">
            <circle cx="0" cy="0" r="7" fill="#fdf2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" />
          </g>

          <!-- NODES -->
          <!-- 1. Client Node / Ingress Label -->
          <g transform="translate(30, 90)">
            <circle cx="-16" cy="0" r="12" fill="none" stroke="#4f46e5" stroke-width="1.8" />
            <rect x="-21" y="-4" width="10" height="7" rx="1" fill="#eff6ff" stroke="#4f46e5" stroke-width="1" />
            <line x1="-23" y1="4.5" x2="-9" y2="4.5" stroke="#4f46e5" stroke-width="1.2" />
            <text x="-16" y="22" font-size="8.5" text-anchor="middle" font-weight="700" fill="#475569">Ingress</text>
          </g>

          <!-- 2. Application Load Balancer Hub -->
          <g transform="translate(135, 90)">
            <circle cx="0" cy="0" r="24" fill="none" stroke="#2563eb" stroke-width="2" />
            <line x1="-12" y1="-5" x2="12" y2="5" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="-12" cy="-5" r="4.5" fill="#3b82f6" />
            <circle cx="12" cy="5" r="4.5" fill="#3b82f6" />
            <text x="0" y="36" font-size="9" text-anchor="middle" font-weight="800" fill="#2563eb">ELB Balancer</text>
          </g>

          <!-- 3. Target Group Instances -->
          <!-- Target 1: Healthy -->
          <g transform="translate(295, 45)">
            <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="-26" y="-2" font-size="9" font-weight="800" fill="#065f46" text-anchor="start">EC2 #1</text>
            <text x="-26" y="8" font-size="7.5" font-weight="700" fill="#047857" text-anchor="start">HEALTHY</text>
            <g transform="translate(20, 0)">
              <circle cx="0" cy="0" r="6" fill="#10b981" />
              <path d="M -3 0 L -1 2 L 3 -2" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Target 2: Healthy -->
          <g transform="translate(295, 90)">
            <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="-26" y="-2" font-size="9" font-weight="800" fill="#065f46" text-anchor="start">EC2 #2</text>
            <text x="-26" y="8" font-size="7.5" font-weight="700" fill="#047857" text-anchor="start">HEALTHY</text>
            <g transform="translate(20, 0)">
              <circle cx="0" cy="0" r="6" fill="#10b981" />
              <path d="M -3 0 L -1 2 L 3 -2" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Target 3: Unhealthy -->
          <g transform="translate(295, 140)">
            <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#fdf2f2" stroke="#ef4444" stroke-width="1.5" />
            <text x="-26" y="-2" font-size="9" font-weight="800" fill="#991b1b" text-anchor="start">EC2 #3</text>
            <text x="-26" y="8" font-size="7.5" font-weight="700" fill="#ef4444" text-anchor="start">FAILED</text>
            <g transform="translate(20, 0)">
              <circle cx="0" cy="0" r="6" fill="#ef4444" />
              <path d="M 0 -3.5 L 0 0.5 M 0 2 H 0" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
            </g>
          </g>
        </svg>
      `,
  },
  lambda: {
    practicalExample:
      'A microservice that activates the instant a customer uploads a profile image to S3, resizing the image into standard sizes and generating database thumbnail URLs.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1a. S3 event → Lambda -->
          <path d="M 65 45 L 165 85" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 1b. API Gateway → Lambda -->
          <path d="M 65 90 L 165 90" fill="none" stroke="#db2777" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 1c. SQS poll → Lambda -->
          <path d="M 65 135 L 165 95" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- 2a. Lambda → DynamoDB -->
          <path d="M 235 80 Q 280 45 320 45" fill="none" stroke="#ff9900" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2b. Lambda → S3 output -->
          <path d="M 235 100 Q 280 135 320 135" fill="none" stroke="#ff9900" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#10b981"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 65 45 L 165 85" /></circle>
          <circle r="4" fill="#db2777"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 65 90 L 165 90" /></circle>
          <circle r="4" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 65 135 L 165 95" /></circle>
          <circle r="4" fill="#ff9900"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 235 80 Q 280 45 320 45" /></circle>
          <circle r="4" fill="#ff9900"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 235 100 Q 280 135 320 135" /></circle>

          <!-- NODES -->
          <!-- Trigger 1: S3 event -->
          <g transform="translate(45, 45)">
            <ellipse cx="0" cy="-7" rx="14" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <path d="M -14 -7 L -14 5 A 14 4 0 0 0 14 5 L 14 -7" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="700" fill="#065f46">S3 Event</text>
          </g>

          <!-- Trigger 2: API Gateway -->
          <g transform="translate(45, 90)">
            <rect x="-14" y="-12" width="28" height="24" rx="4" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5" />
            <path d="M -7 -6 H 7 M -7 0 H 7 M -7 6 H 7" stroke="#db2777" stroke-width="1.5" stroke-linecap="round" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="700" fill="#be185d">API GW</text>
          </g>

          <!-- Trigger 3: SQS -->
          <g transform="translate(45, 135)">
            <rect x="-14" y="-8" width="28" height="16" rx="3" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.5" />
            <rect x="-10" y="-5" width="6" height="10" rx="1" fill="#c4b5fd" />
            <rect x="-2" y="-5" width="6" height="10" rx="1" fill="#c4b5fd" />
            <rect x="6" y="-5" width="6" height="10" rx="1" fill="#c4b5fd" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="700" fill="#6b21a8">SQS</text>
          </g>

          <!-- Lambda execution node -->
          <g transform="translate(200, 90)">
            <circle cx="0" cy="0" r="34" fill="#fffbeb" stroke="#ff9900" stroke-width="2.5" />
            <path d="M 4 -18 L -12 2 L 2 2 L -5 18 L 12 -3 L -2 -3 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" class="ill-pulse" />
            <text x="0" y="50" font-size="9" text-anchor="middle" font-weight="800" fill="#7c2d12">AWS Lambda</text>
          </g>

          <!-- Output 1: DynamoDB -->
          <g transform="translate(340, 45)">
            <ellipse cx="0" cy="-8" rx="18" ry="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <path d="M -18 -8 L -18 6 A 18 5 0 0 0 18 6 L 18 -8" fill="none" stroke="#3b82f6" stroke-width="1.5" />
            <ellipse cx="0" cy="-2" rx="18" ry="4" fill="none" stroke="#3b82f6" stroke-dasharray="2 2" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="800" fill="#1e3a8a">DynamoDB</text>
          </g>

          <!-- Output 2: S3 -->
          <g transform="translate(340, 135)">
            <ellipse cx="0" cy="-8" rx="18" ry="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <path d="M -18 -8 L -18 6 A 18 5 0 0 0 18 6 L 18 -8" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="800" fill="#065f46">S3 Bucket</text>
          </g>
        </svg>
      `,
  },
  ec2: {
    practicalExample:
      'Running an enterprise Java Spring Boot backend framework with custom network sockets and internal application caches that must remain active 24/7.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Traffic → ELB -->
          <path d="M 30 90 L 75 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2a/b/c. ELB → 3 EC2 instances -->
          <path d="M 125 90 Q 165 45 195 45" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 125 90 L 195 90" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 125 90 Q 165 135 195 135" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3a. EC2 #2 → RDS backend -->
          <path d="M 265 90 L 310 90" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 30 90 L 75 90" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 125 90 Q 165 45 195 45" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 125 90 L 195 90" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 125 90 Q 165 135 195 135" /></circle>
          <circle r="3.5" fill="#3b82f6"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 265 90 L 310 90" /></circle>

          <!-- NODES -->
          <!-- Client/Ingress -->
          <g transform="translate(20, 90)">
            <circle cx="0" cy="0" r="10" fill="none" stroke="#475569" stroke-width="1.8" />
            <text x="0" y="22" font-size="8" text-anchor="middle" font-weight="700" fill="#475569">Traffic</text>
          </g>

          <!-- ELB hub -->
          <g transform="translate(100, 90)">
            <circle cx="0" cy="0" r="18" fill="#eff6ff" stroke="#2563eb" stroke-width="2" />
            <line x1="-10" y1="-4" x2="10" y2="4" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
            <circle cx="-10" cy="-4" r="3.5" fill="#3b82f6" />
            <circle cx="10" cy="4" r="3.5" fill="#3b82f6" />
            <text x="0" y="30" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">ELB</text>
          </g>

          <!-- Auto-Scaling Group surround (dashed group) -->
          <rect x="185" y="20" width="80" height="140" rx="8" fill="none" stroke="#fb923c" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.6" />
          <text x="225" y="14" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">AUTO-SCALING GROUP</text>

          <!-- EC2 instance 1 -->
          <g transform="translate(225, 45)">
            <rect x="-26" y="-14" width="52" height="28" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-20" y="-9" width="8" height="6" fill="#fdba74" />
            <rect x="-9" y="-9" width="8" height="6" fill="#fdba74" />
            <text x="6" y="-4" font-size="7" font-weight="800" fill="#7c2d12">i-01a</text>
            <circle cx="-20" cy="6" r="2" fill="#22c55e" />
            <text x="-14" y="9" font-size="6" font-weight="700" fill="#065f46">RUNNING</text>
          </g>

          <!-- EC2 instance 2 -->
          <g transform="translate(225, 90)">
            <rect x="-26" y="-14" width="52" height="28" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-20" y="-9" width="8" height="6" fill="#fdba74" />
            <rect x="-9" y="-9" width="8" height="6" fill="#fdba74" />
            <text x="6" y="-4" font-size="7" font-weight="800" fill="#7c2d12">i-02b</text>
            <circle cx="-20" cy="6" r="2" fill="#22c55e" />
            <text x="-14" y="9" font-size="6" font-weight="700" fill="#065f46">RUNNING</text>
          </g>

          <!-- EC2 instance 3 (scaling in) -->
          <g transform="translate(225, 135)">
            <rect x="-26" y="-14" width="52" height="28" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" stroke-dasharray="3 2" />
            <rect x="-20" y="-9" width="8" height="6" fill="#fdba74" opacity="0.6" />
            <rect x="-9" y="-9" width="8" height="6" fill="#fdba74" opacity="0.6" />
            <text x="6" y="-4" font-size="7" font-weight="800" fill="#7c2d12">i-03c</text>
            <circle cx="-20" cy="6" r="2" fill="#f59e0b" class="ill-pulse" />
            <text x="-14" y="9" font-size="6" font-weight="700" fill="#92400e">BOOTING</text>
          </g>

          <!-- Backend: RDS -->
          <g transform="translate(340, 90)">
            <ellipse cx="0" cy="-12" rx="20" ry="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" />
            <path d="M -20 -12 L -20 10 A 20 5 0 0 0 20 10 L 20 -12" fill="none" stroke="#3b82f6" stroke-width="1.6" />
            <ellipse cx="0" cy="-2" rx="20" ry="4" fill="none" stroke="#3b82f6" stroke-dasharray="2 2" />
            <text x="0" y="26" font-size="8" text-anchor="middle" font-weight="800" fill="#1e3a8a">RDS</text>
          </g>
        </svg>
      `,
  },
  ecs: {
    practicalExample:
      'Packaging an API application inside a Docker container, deploying it as multiple task replicas on Fargate, and auto-scaling task capacity up or down based on CPU load metrics.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. ALB → ECS service -->
          <path d="M 55 90 L 95 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Service → 3 tasks -->
          <path d="M 135 90 L 215 50" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 135 90 L 215 90" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 135 90 L 215 130" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3. Tasks → backend (consolidated) -->
          <path d="M 275 50 Q 320 75 335 88" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="3 2" class="ill-flow-right" />
          <path d="M 275 90 L 335 90" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="3 2" class="ill-flow-right" />
          <path d="M 275 130 Q 320 105 335 92" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="3 2" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 55 90 L 95 90" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 135 90 L 215 50" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 135 90 L 215 90" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 135 90 L 215 130" /></circle>
          <circle r="3" fill="#0ea5e9"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 275 90 L 335 90" /></circle>

          <!-- NODES -->
          <!-- ALB -->
          <g transform="translate(35, 90)">
            <circle cx="0" cy="0" r="15" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8" />
            <line x1="-8" y1="-3" x2="8" y2="3" stroke="#2563eb" stroke-width="1.5" />
            <circle cx="-8" cy="-3" r="3" fill="#3b82f6" />
            <circle cx="8" cy="3" r="3" fill="#3b82f6" />
            <text x="0" y="26" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">ALB</text>
          </g>

          <!-- ECS Service controller -->
          <g transform="translate(115, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="4" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
            <path d="M -10 -8 L 0 -2 L -10 4" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="-10" y1="8" x2="8" y2="8" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" />
            <text x="0" y="28" font-size="8" text-anchor="middle" font-weight="800" fill="#c2410c">Service</text>
          </g>

          <!-- ECS Cluster boundary -->
          <rect x="195" y="20" width="80" height="140" rx="8" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6" />
          <text x="235" y="14" font-size="7" text-anchor="middle" font-weight="800" fill="#64748b">ECS CLUSTER</text>

          <!-- Task 1 -->
          <g transform="translate(235, 50)">
            <rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-18" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <rect x="-10" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <text x="6" y="-2" font-size="7" font-weight="800" fill="#7c2d12">task</text>
            <text x="6" y="6" font-size="6.5" font-family="monospace" fill="#9a3412">v2.1</text>
          </g>

          <!-- Task 2 -->
          <g transform="translate(235, 90)">
            <rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-18" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <rect x="-10" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <text x="6" y="-2" font-size="7" font-weight="800" fill="#7c2d12">task</text>
            <text x="6" y="6" font-size="6.5" font-family="monospace" fill="#9a3412">v2.1</text>
          </g>

          <!-- Task 3 -->
          <g transform="translate(235, 130)">
            <rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-18" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <rect x="-10" y="-8" width="6" height="6" rx="1" fill="#fdba74" />
            <text x="6" y="-2" font-size="7" font-weight="800" fill="#7c2d12">task</text>
            <text x="6" y="6" font-size="6.5" font-family="monospace" fill="#9a3412">v2.1</text>
          </g>

          <!-- Backend service -->
          <g transform="translate(360, 90)">
            <ellipse cx="0" cy="-10" rx="18" ry="5" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.6" />
            <path d="M -18 -10 L -18 8 A 18 5 0 0 0 18 8 L 18 -10" fill="none" stroke="#0ea5e9" stroke-width="1.6" />
            <text x="0" y="24" font-size="8" text-anchor="middle" font-weight="800" fill="#0369a1">Backend</text>
          </g>
        </svg>
      `,
  },
  s3: {
    practicalExample:
      'Storing millions of user-uploaded profile pictures and video clips securely, serving them globally through CloudFront edge caches.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Uploader → S3 bucket -->
          <path d="M 50 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Bucket → lifecycle tiers (3 classes) -->
          <path d="M 200 75 L 270 45" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 200 90 L 270 90" fill="none" stroke="#0ea5e9" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 200 105 L 270 135" fill="none" stroke="#64748b" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3. PUT event → SNS / Lambda -->
          <path d="M 200 90 Q 220 30 250 16" fill="none" stroke="#db2777" stroke-width="1.5" stroke-dasharray="3 2" />
          <text x="345" y="22" font-size="7.5" text-anchor="end" font-weight="800" fill="#be185d">s3:ObjectCreated → SNS / Lambda</text>

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 50 90 L 130 90" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 75 L 270 45" /></circle>
          <circle r="3.5" fill="#0ea5e9"><animateMotion dur="2.6s" repeatCount="indefinite" path="M 200 90 L 270 90" /></circle>
          <circle r="3.5" fill="#64748b"><animateMotion dur="3s" repeatCount="indefinite" path="M 200 105 L 270 135" /></circle>

          <!-- NODES -->
          <!-- Uploader -->
          <g transform="translate(30, 90)">
            <rect x="-15" y="-12" width="30" height="24" rx="3" fill="none" stroke="#475569" stroke-width="1.8" />
            <path d="M -6 0 L 0 -6 L 6 0 M 0 -6 L 0 6" fill="none" stroke="#475569" stroke-width="1.5" stroke-linecap="round" />
            <text x="0" y="24" font-size="8" text-anchor="middle" font-weight="700" fill="#475569">Uploader</text>
          </g>

          <!-- S3 bucket -->
          <g transform="translate(165, 90)">
            <ellipse cx="0" cy="-28" rx="32" ry="9" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
            <path d="M -32 -28 L -32 22 A 32 9 0 0 0 32 22 L 32 -28" fill="none" stroke="#10b981" stroke-width="2" />
            <ellipse cx="0" cy="-12" rx="32" ry="8" fill="none" stroke="#10b981" stroke-width="1.4" stroke-dasharray="3 2" />
            <ellipse cx="0" cy="6" rx="32" ry="8" fill="none" stroke="#10b981" stroke-width="1.4" stroke-dasharray="3 2" />
            <rect x="-12" y="-8" width="9" height="12" rx="1" fill="#a7f3d0" stroke="#047857" stroke-width="0.8" />
            <rect x="2" y="-4" width="9" height="12" rx="1" fill="#a7f3d0" stroke="#047857" stroke-width="0.8" />
            <text x="0" y="44" font-size="9" text-anchor="middle" font-weight="800" fill="#065f46">S3 Bucket</text>
          </g>

          <!-- Tier 1: Standard -->
          <g transform="translate(310, 45)">
            <rect x="-40" y="-13" width="80" height="26" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <text x="-30" y="-2" font-size="8" font-weight="800" fill="#065f46" text-anchor="start">Standard</text>
            <text x="-30" y="7" font-size="6.5" font-family="monospace" fill="#047857" text-anchor="start">$0.023/GB · hot</text>
          </g>

          <!-- Tier 2: Infrequent Access -->
          <g transform="translate(310, 90)">
            <rect x="-40" y="-13" width="80" height="26" rx="4" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.6" />
            <text x="-30" y="-2" font-size="8" font-weight="800" fill="#0c4a6e" text-anchor="start">Standard-IA</text>
            <text x="-30" y="7" font-size="6.5" font-family="monospace" fill="#0369a1" text-anchor="start">$0.0125/GB · warm</text>
          </g>

          <!-- Tier 3: Glacier -->
          <g transform="translate(310, 135)">
            <rect x="-40" y="-13" width="80" height="26" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.6" />
            <text x="-30" y="-2" font-size="8" font-weight="800" fill="#334155" text-anchor="start">Glacier</text>
            <text x="-30" y="7" font-size="6.5" font-family="monospace" fill="#475569" text-anchor="start">$0.004/GB · cold</text>
          </g>
        </svg>
      `,
  },
  rds: {
    practicalExample:
      'Storing client accounting balances, customer orders, and transaction ledgers, where data relationships and strict transaction accuracy are critical.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. App write path → Primary -->
          <path d="M 50 70 L 120 80" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 1b. App read path → Replicas -->
          <path d="M 50 110 L 270 110" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2a. Primary → Standby (sync replication) -->
          <path d="M 170 50 L 290 50" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="6 3" class="ill-flow-right" />
          <!-- 2b. Primary → Replica 1 (async) -->
          <path d="M 170 110 Q 220 130 270 138" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#ef4444"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 70 L 120 80" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 50 110 L 270 110" /></circle>
          <circle r="4" fill="#3b82f6"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 170 50 L 290 50" /></circle>

          <!-- Labels -->
          <text x="85" y="60" font-size="7.5" font-weight="800" fill="#b91c1c">WRITE</text>
          <text x="105" y="103" font-size="7.5" font-weight="800" fill="#047857">READ</text>
          <text x="226" y="42" font-size="7" font-weight="800" fill="#1d4ed8">SYNC REPLICATION</text>

          <!-- NODES -->
          <!-- App writer/reader -->
          <g transform="translate(30, 90)">
            <rect x="-15" y="-20" width="30" height="40" rx="3" fill="#fdf2f8" stroke="#db2777" stroke-width="1.8" />
            <path d="M -8 -10 L 8 -10 M -8 -2 L 8 -2 M -8 6 L 8 6 M -8 14 L 4 14" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" />
            <text x="0" y="32" font-size="8.5" text-anchor="middle" font-weight="800" fill="#be185d">App</text>
          </g>

          <!-- Multi-AZ boundary -->
          <rect x="115" y="20" width="180" height="65" rx="8" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
          <text x="205" y="14" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">MULTI-AZ HIGH AVAILABILITY</text>

          <!-- Primary (writeable) -->
          <g transform="translate(145, 50)">
            <ellipse cx="0" cy="-13" rx="22" ry="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <path d="M -22 -13 L -22 9 A 22 6 0 0 0 22 9 L 22 -13" fill="none" stroke="#3b82f6" stroke-width="2" />
            <ellipse cx="0" cy="-4" rx="22" ry="5" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="2 2" />
            <ellipse cx="0" cy="5" rx="22" ry="5" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="2 2" />
            <text x="0" y="24" font-size="7.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">PRIMARY (RW)</text>
          </g>

          <!-- Standby (HA) -->
          <g transform="translate(315, 50)">
            <ellipse cx="0" cy="-13" rx="22" ry="6" fill="#eff6ff" stroke="#60a5fa" stroke-width="1.6" stroke-dasharray="3 2" />
            <path d="M -22 -13 L -22 9 A 22 6 0 0 0 22 9 L 22 -13" fill="none" stroke="#60a5fa" stroke-width="1.6" stroke-dasharray="3 2" />
            <ellipse cx="0" cy="-4" rx="22" ry="5" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="2 2" />
            <ellipse cx="0" cy="5" rx="22" ry="5" fill="none" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="2 2" />
            <text x="0" y="24" font-size="7.5" text-anchor="middle" font-weight="800" fill="#2563eb">STANDBY (HA)</text>
          </g>

          <!-- Read replica 1 -->
          <g transform="translate(305, 110)">
            <ellipse cx="0" cy="-10" rx="18" ry="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.4" />
            <path d="M -18 -10 L -18 8 A 18 5 0 0 0 18 8 L 18 -10" fill="none" stroke="#94a3b8" stroke-width="1.4" />
            <ellipse cx="0" cy="-3" rx="18" ry="4" fill="none" stroke="#94a3b8" stroke-dasharray="2 2" />
            <text x="0" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">REPLICA 1</text>
          </g>

          <!-- Read replica 2 -->
          <g transform="translate(305, 150)">
            <ellipse cx="0" cy="-10" rx="18" ry="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.4" />
            <path d="M -18 -10 L -18 8 A 18 5 0 0 0 18 8 L 18 -10" fill="none" stroke="#94a3b8" stroke-width="1.4" />
            <ellipse cx="0" cy="-3" rx="18" ry="4" fill="none" stroke="#94a3b8" stroke-dasharray="2 2" />
            <text x="0" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">REPLICA 2</text>
          </g>
        </svg>
      `,
  },
  dynamoDb: {
    practicalExample:
      'Storing millions of active gaming session states or shopping cart list items that require immediate, high-frequency read/write operations.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. App → DynamoDB API -->
          <path d="M 50 90 L 105 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Hash → partitions (4 shards) -->
          <path d="M 140 75 L 195 30" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 140 85 L 195 70" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 140 95 L 195 110" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 140 105 L 195 150" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- 3. Streams → Lambda -->
          <path d="M 260 90 L 315 90" fill="none" stroke="#ff9900" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 90 L 105 90" /></circle>
          <circle r="3.5" fill="#3b82f6"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 140 85 L 195 70" /></circle>
          <circle r="3.5" fill="#3b82f6"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 140 95 L 195 110" /></circle>
          <circle r="4" fill="#ff9900"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 260 90 L 315 90" /></circle>

          <!-- NODES -->
          <!-- App -->
          <g transform="translate(30, 90)">
            <rect x="-15" y="-14" width="30" height="28" rx="3" fill="none" stroke="#475569" stroke-width="1.8" />
            <text x="0" y="-2" font-size="7" font-family="monospace" text-anchor="middle" fill="#475569">PUT</text>
            <text x="0" y="7" font-size="7" font-family="monospace" text-anchor="middle" fill="#475569">GET</text>
            <text x="0" y="26" font-size="8" text-anchor="middle" font-weight="800" fill="#475569">App</text>
          </g>

          <!-- DynamoDB router -->
          <g transform="translate(122, 90)">
            <rect x="-18" y="-22" width="36" height="44" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <path d="M -10 -12 L 10 -12 M -10 -4 L 10 -4 M -10 4 L 10 4 M -10 12 L 10 12" stroke="#1d4ed8" stroke-width="1.3" />
            <text x="0" y="34" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">Table</text>
          </g>

          <!-- Partitions (shards) -->
          <g transform="translate(215, 30)">
            <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">P1: 0-3F</text>
          </g>
          <g transform="translate(215, 70)">
            <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">P2: 40-7F</text>
          </g>
          <g transform="translate(215, 110)">
            <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">P3: 80-BF</text>
          </g>
          <g transform="translate(215, 150)">
            <rect x="-18" y="-10" width="36" height="20" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">P4: C0-FF</text>
          </g>

          <!-- Streams -->
          <g transform="translate(275, 90)">
            <rect x="-15" y="-14" width="30" height="28" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.8" />
            <path d="M -8 -6 L 8 -6 L 8 0 L -8 0 L -8 6 L 8 6" fill="none" stroke="#b45309" stroke-width="1.3" stroke-linecap="round" />
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#b45309">Streams</text>
          </g>

          <!-- Lambda -->
          <g transform="translate(340, 90)">
            <circle cx="0" cy="0" r="18" fill="#fffbeb" stroke="#ff9900" stroke-width="2" />
            <path d="M 3 -10 L -7 1 L 1 1 L -3 10 L 7 -2 L -1 -2 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" class="ill-pulse" />
            <text x="0" y="32" font-size="8" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text>
          </g>
        </svg>
      `,
  },
  elastiCache: {
    practicalExample:
      'Caching the checkout store\'s "Top 5 Hot Products" list on the homepage. Instead of running relational RDS SQL queries thousands of times per second, the server retrieves it instantly from Redis cache memory.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. App → Cache lookup -->
          <path d="M 50 90 L 110 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2a. Cache HIT → return to app (loop back) -->
          <path d="M 150 75 Q 100 30 50 75" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-left" />
          <!-- 2b. Cache MISS → DB query -->
          <path d="M 150 100 L 280 130" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 3. DB → populate cache (write back) -->
          <path d="M 285 115 Q 220 100 155 95" fill="none" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="3 2" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#6366f1"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 90 L 110 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.2s" repeatCount="indefinite" path="M 150 75 Q 100 30 50 75" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="2.6s" repeatCount="indefinite" path="M 150 100 L 280 130" /></circle>

          <!-- Latency labels -->
          <g transform="translate(100, 38)">
            <rect x="-32" y="-9" width="64" height="16" rx="8" fill="#f0fdf4" stroke="#10b981" stroke-width="1.2" />
            <text x="0" y="2" font-size="8" text-anchor="middle" font-weight="800" fill="#047857">HIT  ~0.5ms</text>
          </g>
          <g transform="translate(225, 120)">
            <rect x="-30" y="-8" width="60" height="14" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2" />
            <text x="0" y="2" font-size="7.5" text-anchor="middle" font-weight="800" fill="#b91c1c">MISS  ~45ms</text>
          </g>

          <!-- NODES -->
          <!-- App -->
          <g transform="translate(30, 90)">
            <rect x="-15" y="-16" width="30" height="32" rx="3" fill="none" stroke="#475569" stroke-width="1.8" />
            <line x1="-9" y1="-8" x2="9" y2="-8" stroke="#475569" stroke-width="1.2" />
            <line x1="-9" y1="-2" x2="9" y2="-2" stroke="#475569" stroke-width="1.2" />
            <line x1="-9" y1="4" x2="9" y2="4" stroke="#475569" stroke-width="1.2" />
            <text x="0" y="28" font-size="8" text-anchor="middle" font-weight="800" fill="#475569">App</text>
          </g>

          <!-- Redis cache (in-memory) -->
          <g transform="translate(130, 90)">
            <circle cx="0" cy="0" r="22" fill="#fef2f2" stroke="#dc2626" stroke-width="2" />
            <rect x="-12" y="-8" width="24" height="16" rx="2" fill="none" stroke="#dc2626" stroke-width="1.4" />
            <line x1="-9" y1="-4" x2="9" y2="-4" stroke="#dc2626" stroke-width="1" />
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#dc2626" stroke-width="1" />
            <line x1="-9" y1="4" x2="9" y2="4" stroke="#dc2626" stroke-width="1" />
            <text x="0" y="36" font-size="8.5" text-anchor="middle" font-weight="800" fill="#991b1b">ElastiCache</text>
          </g>

          <!-- DB (RDS) -->
          <g transform="translate(310, 130)">
            <ellipse cx="0" cy="-13" rx="22" ry="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" />
            <path d="M -22 -13 L -22 9 A 22 6 0 0 0 22 9 L 22 -13" fill="none" stroke="#3b82f6" stroke-width="1.6" />
            <ellipse cx="0" cy="-4" rx="22" ry="5" fill="none" stroke="#3b82f6" stroke-dasharray="2 2" />
            <text x="0" y="26" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">RDS Database</text>
          </g>
        </svg>
      `,
  },
  sqs: {
    practicalExample:
      'Buffering incoming payment orders in a queue. If the payment gateway API goes down temporarily, checkout messages remain safely in SQS and process automatically once the gateway recovers.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Producers → queue -->
          <path d="M 50 50 L 125 80" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 130 L 125 100" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Queue → consumers (long poll) -->
          <path d="M 275 80 L 340 50" fill="none" stroke="#8b5cf6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 275 100 L 340 130" fill="none" stroke="#8b5cf6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="3.5" fill="#a855f7"><animateMotion dur="2s" repeatCount="indefinite" path="M 50 50 L 125 80" /></circle>
          <circle r="3.5" fill="#a855f7"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 50 130 L 125 100" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 275 80 L 340 50" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 275 100 L 340 130" /></circle>

          <!-- NODES -->
          <!-- Producer 1 -->
          <g transform="translate(30, 50)">
            <rect x="-15" y="-12" width="30" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <path d="M -8 -2 L 0 -8 L 8 -2 M 0 -8 L 0 8" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Producer A</text>
          </g>

          <!-- Producer 2 -->
          <g transform="translate(30, 130)">
            <rect x="-15" y="-12" width="30" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <path d="M -8 -2 L 0 -8 L 8 -2 M 0 -8 L 0 8" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Producer B</text>
          </g>

          <!-- SQS Queue (tube with messages, FIFO order) -->
          <g transform="translate(200, 90)">
            <rect x="-75" y="-22" width="150" height="44" rx="6" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2.2" />
            <!-- 5 messages in FIFO order with arrow direction -->
            <rect x="-65" y="-14" width="22" height="28" rx="2" fill="#ddd6fe" stroke="#7c3aed" stroke-width="1.2" />
            <text x="-54" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#6b21a8">M1</text>
            <rect x="-38" y="-14" width="22" height="28" rx="2" fill="#ddd6fe" stroke="#7c3aed" stroke-width="1.2" />
            <text x="-27" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#6b21a8">M2</text>
            <rect x="-11" y="-14" width="22" height="28" rx="2" fill="#ddd6fe" stroke="#7c3aed" stroke-width="1.2" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#6b21a8">M3</text>
            <rect x="16" y="-14" width="22" height="28" rx="2" fill="#ddd6fe" stroke="#7c3aed" stroke-width="1.2" />
            <text x="27" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#6b21a8">M4</text>
            <rect x="43" y="-14" width="22" height="28" rx="2" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.2" stroke-dasharray="2 1" />
            <text x="54" y="3" font-size="7" text-anchor="middle" font-weight="700" fill="#7c3aed">M5</text>
            <text x="0" y="34" font-size="8" text-anchor="middle" font-weight="800" fill="#6b21a8">SQS Queue (FIFO)</text>
          </g>

          <!-- Consumer 1 (Lambda) -->
          <g transform="translate(360, 50)">
            <circle cx="0" cy="0" r="15" fill="#fffbeb" stroke="#ff9900" stroke-width="1.8" />
            <path d="M 3 -8 L -6 1 L 1 1 L -2 8 L 6 -1 L -1 -1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
            <text x="0" y="28" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text>
          </g>

          <!-- Consumer 2 (EC2 worker) -->
          <g transform="translate(360, 130)">
            <rect x="-15" y="-12" width="30" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <rect x="-10" y="-7" width="6" height="6" rx="1" fill="#fdba74" />
            <rect x="-2" y="-7" width="6" height="6" rx="1" fill="#fdba74" />
            <text x="0" y="6" font-size="6.5" font-family="monospace" text-anchor="middle" fill="#7c2d12">poll</text>
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 Worker</text>
          </g>
        </svg>
      `,
  },
  sns: {
    practicalExample:
      'Broadcasting an `OrderCompleted` event to trigger three separate actions: triggering SQS to prepare packing, running Lambda to email the client invoice, and alerting Cognito.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Publisher → SNS Topic -->
          <path d="M 55 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Topic → 4 subscriber types (fan-out) -->
          <path d="M 195 90 L 290 30" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" class="ill-flow-right" />
          <path d="M 195 90 L 290 70" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" class="ill-flow-right" />
          <path d="M 195 90 L 290 110" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" class="ill-flow-right" />
          <path d="M 195 90 L 290 150" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#a855f7"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 55 90 L 135 90" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 195 90 L 290 30" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 195 90 L 290 70" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 195 90 L 290 110" /></circle>
          <circle r="3.5" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 195 90 L 290 150" /></circle>

          <!-- NODES -->
          <!-- Publisher -->
          <g transform="translate(35, 90)">
            <rect x="-15" y="-14" width="30" height="28" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.8" />
            <path d="M -8 -4 L 0 -10 L 8 -4 M 0 -10 L 0 8" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="26" font-size="8" text-anchor="middle" font-weight="800" fill="#7c2d12">Publisher</text>
          </g>

          <!-- SNS Topic (megaphone hub) -->
          <g transform="translate(165, 90)">
            <circle cx="0" cy="0" r="26" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2.4" />
            <path d="M -12 -5 L -2 -5 L 8 -12 L 10 -12 L 10 12 L 8 12 L -2 5 L -12 5 Z" fill="#c084fc" stroke="#7c3aed" stroke-width="1.2" />
            <circle cx="12" cy="-8" r="2" fill="#7c3aed" opacity="0.5" class="ill-pulse" />
            <circle cx="14" cy="0" r="2.5" fill="#7c3aed" opacity="0.5" class="ill-pulse" />
            <circle cx="12" cy="8" r="2" fill="#7c3aed" opacity="0.5" class="ill-pulse" />
            <text x="0" y="42" font-size="9" text-anchor="middle" font-weight="800" fill="#6b21a8">SNS Topic</text>
          </g>

          <!-- Subscriber 1: SQS -->
          <g transform="translate(335, 30)">
            <rect x="-32" y="-11" width="64" height="22" rx="3" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.6" />
            <rect x="-25" y="-6" width="6" height="12" rx="1" fill="#c4b5fd" />
            <rect x="-17" y="-6" width="6" height="12" rx="1" fill="#c4b5fd" />
            <text x="8" y="3" font-size="8" font-weight="800" fill="#6b21a8">SQS Queue</text>
          </g>

          <!-- Subscriber 2: Lambda -->
          <g transform="translate(335, 70)">
            <rect x="-32" y="-11" width="64" height="22" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.6" />
            <path d="M -23 -5 L -28 4 L -24 4 L -26 8 L -21 1 L -25 1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
            <text x="6" y="3" font-size="8" font-weight="800" fill="#7c2d12">Lambda Fn</text>
          </g>

          <!-- Subscriber 3: Email/SMS -->
          <g transform="translate(335, 110)">
            <rect x="-32" y="-11" width="64" height="22" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <rect x="-26" y="-6" width="12" height="9" rx="1" fill="none" stroke="#047857" stroke-width="1" />
            <path d="M -26 -6 L -20 0 L -14 -6" fill="none" stroke="#047857" stroke-width="1" />
            <text x="6" y="3" font-size="8" font-weight="800" fill="#065f46">Email/SMS</text>
          </g>

          <!-- Subscriber 4: HTTPS endpoint -->
          <g transform="translate(335, 150)">
            <rect x="-32" y="-11" width="64" height="22" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" />
            <text x="-18" y="3" font-size="7" font-family="monospace" font-weight="800" fill="#1d4ed8">POST</text>
            <text x="10" y="3" font-size="7.5" font-weight="800" fill="#1e3a8a">Webhook</text>
          </g>
        </svg>
      `,
  },
  eventBridge: {
    practicalExample:
      'Routing system error events to a PagerDuty Lambda connector while sending standard operations events to a CloudWatch log stream.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Two sources → bus -->
          <path d="M 45 45 L 150 75" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 45 135 L 150 105" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Bus → rule matching → 2 targets -->
          <path d="M 250 75 Q 290 45 320 45" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 250 105 Q 290 135 320 135" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M 45 45 L 150 75" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 45 135 L 150 105" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 250 75 Q 290 45 320 45" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 250 105 Q 290 135 320 135" /></circle>

          <!-- NODES -->
          <!-- Source 1: S3 event -->
          <g transform="translate(25, 45)">
            <ellipse cx="0" cy="-7" rx="14" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <path d="M -14 -7 L -14 5 A 14 4 0 0 0 14 5 L 14 -7" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 Created</text>
          </g>

          <!-- Source 2: CloudWatch alarm -->
          <g transform="translate(25, 135)">
            <circle cx="0" cy="0" r="12" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -5 L 3 -5 L 1 0 L 3 5 L -3 5 L -1 0 Z" fill="#ef4444" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#991b1b">CW Alarm</text>
          </g>

          <!-- Event Bus + 2 rules -->
          <g transform="translate(200, 90)">
            <rect x="-50" y="-30" width="100" height="60" rx="8" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2.4" />
            <!-- Lane divider -->
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="2 2" opacity="0.6" />
            <!-- Rule A (top lane) -->
            <rect x="-40" y="-22" width="80" height="16" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1" />
            <text x="0" y="-10" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">Rule A · source=s3</text>
            <!-- Rule B (bottom lane) -->
            <rect x="-40" y="6" width="80" height="16" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1" />
            <text x="0" y="18" font-size="7" text-anchor="middle" font-weight="800" fill="#b91c1c">Rule B · severity=ERR</text>
            <text x="0" y="42" font-size="9" text-anchor="middle" font-weight="800" fill="#6b21a8">EventBridge Bus</text>
          </g>

          <!-- Target 1: Lambda (Rule A) -->
          <g transform="translate(355, 45)">
            <rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.6" />
            <path d="M -22 -5 L -27 4 L -23 4 L -25 8 L -20 1 L -24 1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
            <text x="3" y="3" font-size="8" font-weight="800" fill="#7c2d12">Lambda Fn</text>
          </g>

          <!-- Target 2: SNS (Rule B - PagerDuty) -->
          <g transform="translate(355, 135)">
            <rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1.6" />
            <path d="M -22 -3 L -16 -3 L -12 -7 L -10 -7 L -10 7 L -12 7 L -16 3 L -22 3 Z" fill="#fca5a5" stroke="#b91c1c" stroke-width="0.8" />
            <text x="4" y="3" font-size="8" font-weight="800" fill="#991b1b">SNS · Pager</text>
          </g>
        </svg>
      `,
  },
  stepFunctions: {
    practicalExample:
      'Managing payment checkout steps: (1) Charge bank card, (2) If bank approval succeeds, write order row to database, (3) If charging fails, trigger refund process and alert email.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <path d="M 50 90 L 90 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 130 90 L 170 90" fill="none" stroke="#ec4899" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- Choice branches -->
          <path d="M 210 90 L 270 45" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 210 90 L 270 135" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- Success terminal -->
          <path d="M 310 45 L 355 80" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- Failure retry loop back -->
          <path d="M 310 135 Q 240 165 175 110" fill="none" stroke="#f59e0b" stroke-width="1.4" stroke-dasharray="3 2" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#3b82f6"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 90 L 90 90" /></circle>
          <circle r="4" fill="#ec4899"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 130 90 L 170 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M 210 90 L 270 45" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="2s" repeatCount="indefinite" path="M 210 90 L 270 135" /></circle>

          <!-- Branch labels -->
          <text x="270" y="74" font-size="7" font-weight="800" fill="#047857">200 OK</text>
          <text x="270" y="113" font-size="7" font-weight="800" fill="#b91c1c">5xx ERR</text>
          <text x="225" y="178" font-size="7" font-weight="800" fill="#92400e">retry · max 3</text>

          <!-- NODES -->
          <!-- START -->
          <g transform="translate(30, 90)">
            <circle cx="0" cy="0" r="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <text x="0" y="3" font-size="7.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">START</text>
          </g>

          <!-- Task state: CHARGE -->
          <g transform="translate(110, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="3" fill="#fdf2f8" stroke="#ec4899" stroke-width="2.2" />
            <path d="M -10 -8 L 10 -8 M -10 -2 L 10 -2 M -10 4 L 6 4" stroke="#be185d" stroke-width="1.2" stroke-linecap="round" />
            <text x="0" y="28" font-size="7.5" text-anchor="middle" font-weight="800" fill="#be185d">Task</text>
            <text x="0" y="14" font-size="6.5" font-family="monospace" text-anchor="middle" fill="#9d174d">charge</text>
          </g>

          <!-- Choice diamond -->
          <g transform="translate(190, 90)">
            <path d="M 0 -18 L 20 0 L 0 18 L -20 0 Z" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#92400e">Choice</text>
            <text x="0" y="32" font-size="7" text-anchor="middle" font-weight="700" fill="#92400e">if status?</text>
          </g>

          <!-- Success task: write order -->
          <g transform="translate(290, 45)">
            <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.8" />
            <text x="0" y="-2" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">Write</text>
            <text x="0" y="7" font-size="6.5" font-family="monospace" text-anchor="middle" fill="#065f46">DDB</text>
          </g>

          <!-- Fail task: refund + alert -->
          <g transform="translate(290, 135)">
            <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8" />
            <text x="0" y="-2" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">Refund</text>
            <text x="0" y="7" font-size="6.5" font-family="monospace" text-anchor="middle" fill="#7f1d1d">+ alert</text>
          </g>

          <!-- END -->
          <g transform="translate(370, 90)">
            <circle cx="0" cy="0" r="14" fill="#e6f4ea" stroke="#10b981" stroke-width="2" />
            <circle cx="0" cy="0" r="9" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">END</text>
          </g>
        </svg>
      `,
  },
  cloudWatch: {
    practicalExample:
      'Monitoring server CPU levels. If average EC2 CPU pressure exceeds 75% for 3 minutes, CloudWatch triggers an Alarm calling the Auto Scaling policy to add another server.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. Services emit metrics/logs → CloudWatch -->
          <path d="M 45 45 L 130 80" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 45 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 45 135 L 130 100" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2. Alarm breach → SNS / Lambda -->
          <path d="M 240 80 Q 285 45 320 45" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 240 100 Q 285 135 320 135" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="3.5" fill="#3b82f6"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 45 45 L 130 80" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 45 90 L 130 90" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="2.7s" repeatCount="indefinite" path="M 45 135 L 130 100" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 240 80 Q 285 45 320 45" /></circle>
          <circle r="4" fill="#ef4444"><animateMotion dur="2s" repeatCount="indefinite" path="M 240 100 Q 285 135 320 135" /></circle>

          <!-- NODES -->
          <!-- Source 1: EC2 metrics -->
          <g transform="translate(25, 45)">
            <rect x="-15" y="-12" width="30" height="22" rx="2" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <rect x="-10" y="-7" width="6" height="5" fill="#fdba74" />
            <rect x="-2" y="-7" width="6" height="5" fill="#fdba74" />
            <rect x="-10" y="0" width="6" height="5" fill="#fdba74" />
            <rect x="-2" y="0" width="6" height="5" fill="#fdba74" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2</text>
          </g>

          <!-- Source 2: Lambda logs -->
          <g transform="translate(25, 90)">
            <circle cx="0" cy="0" r="13" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" />
            <path d="M 2 -7 L -5 1 L 1 1 L -2 7 L 5 -1 L -1 -1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
            <text x="0" y="24" font-size="7.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text>
          </g>

          <!-- Source 3: RDS metrics -->
          <g transform="translate(25, 135)">
            <ellipse cx="0" cy="-6" rx="14" ry="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <path d="M -14 -6 L -14 6 A 14 4 0 0 0 14 6 L 14 -6" fill="none" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">RDS</text>
          </g>

          <!-- CloudWatch dashboard (chart with threshold + alarm) -->
          <g transform="translate(185, 90)">
            <rect x="-55" y="-32" width="110" height="64" rx="6" fill="#f0fdf4" stroke="#10b981" stroke-width="2" />
            <!-- Graph base axes -->
            <line x1="-50" y1="20" x2="50" y2="20" stroke="#cbd5e1" stroke-width="1" />
            <!-- Threshold line -->
            <line x1="-50" y1="-12" x2="50" y2="-12" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3 2" />
            <text x="-48" y="-16" font-size="6.5" font-weight="800" fill="#ef4444">75% threshold</text>
            <!-- Sparkline -->
            <path d="M -50 12 L -30 6 L -10 14 L 10 -4 L 30 -18 L 50 -10" fill="none" stroke="#10b981" stroke-width="2" />
            <!-- Breach point -->
            <circle cx="30" cy="-18" r="3.5" fill="#ef4444" class="ill-pulse" />
            <text x="0" y="42" font-size="8" text-anchor="middle" font-weight="800" fill="#065f46">CloudWatch · CPUUtilization</text>
          </g>

          <!-- Alarm action 1: SNS -->
          <g transform="translate(350, 45)">
            <rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1.6" />
            <path d="M -22 -3 L -16 -3 L -12 -7 L -10 -7 L -10 7 L -12 7 L -16 3 L -22 3 Z" fill="#fca5a5" stroke="#b91c1c" stroke-width="0.8" />
            <text x="6" y="3" font-size="7.5" font-weight="800" fill="#991b1b">SNS · Pager</text>
          </g>

          <!-- Alarm action 2: Auto-scaling -->
          <g transform="translate(350, 135)">
            <rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.6" />
            <path d="M -22 0 L -18 -3 L -14 0 L -18 3 Z" fill="#fb923c" />
            <text x="6" y="3" font-size="7.5" font-weight="800" fill="#7c2d12">Scale Out</text>
          </g>
        </svg>
      `,
  },
  cognito: {
    practicalExample:
      'Allowing customers to sign up and authenticate using their email or Google credentials to fetch secure JSON Web Tokens (JWT) for API Authorization.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- 1. User → Cognito (auth request with credentials) -->
          <path d="M 50 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 2a. Cognito → Federated IdP check (optional) -->
          <path d="M 160 70 Q 200 35 240 35" fill="none" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="3 2" />
          <!-- 2b. Cognito returns JWT to user -->
          <path d="M 120 110 Q 100 130 80 105" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-left" />
          <!-- 3. User → API Gateway with JWT bearer -->
          <path d="M 60 90 L 80 105" fill="none" stroke="#10b981" stroke-width="0" />
          <path d="M 80 145 L 280 145" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- 4. API Gateway → backend after auth pass -->
          <path d="M 325 145 L 360 110" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 2" class="ill-flow-right" />

          <!-- ANIMATED PACKETS -->
          <circle r="4" fill="#ec4899"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 50 90 L 120 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 120 110 Q 100 130 80 105" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 80 145 L 280 145" /></circle>

          <!-- Auth labels -->
          <text x="78" y="78" font-size="7" font-weight="800" fill="#475569">credentials</text>
          <text x="110" y="135" font-size="7" font-weight="800" fill="#047857">JWT issued</text>

          <!-- NODES -->
          <!-- User -->
          <g transform="translate(30, 90)">
            <circle cx="0" cy="-7" r="8" fill="none" stroke="#475569" stroke-width="1.8" />
            <path d="M -12 12 A 12 10 0 0 1 12 12 Z" fill="none" stroke="#475569" stroke-width="1.8" />
            <text x="0" y="30" font-size="8" text-anchor="middle" font-weight="800" fill="#475569">User</text>
          </g>

          <!-- Cognito User Pool (shield with people) -->
          <g transform="translate(140, 90)">
            <circle cx="0" cy="0" r="22" fill="#fdf2f8" stroke="#ec4899" stroke-width="2.4" />
            <path d="M -9 -10 L 9 -10 L 9 -1 Q 9 8 0 14 Q -9 8 -9 -1 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="1.4" />
            <circle cx="0" cy="-2" r="2.5" fill="#db2777" />
            <path d="M -1 1 L 1 1 L 0.5 5 L -0.5 5 Z" fill="#db2777" />
            <text x="0" y="36" font-size="8" text-anchor="middle" font-weight="800" fill="#be185d">Cognito</text>
            <text x="0" y="46" font-size="7" text-anchor="middle" font-weight="700" fill="#9d174d">User Pool</text>
          </g>

          <!-- Federated IdP (Google) -->
          <g transform="translate(265, 35)">
            <rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.4" />
            <circle cx="-20" cy="0" r="6" fill="none" stroke="#475569" stroke-width="1.4" />
            <text x="6" y="3" font-size="7.5" font-weight="800" fill="#475569">Google IdP</text>
          </g>

          <!-- JWT badge floating on user side -->
          <g transform="translate(55, 145)">
            <rect x="-26" y="-12" width="52" height="22" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <path d="M -20 0 L -16 4 L -10 -3" fill="none" stroke="#047857" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="6" y="3" font-size="7.5" font-weight="800" fill="#065f46">JWT</text>
          </g>

          <!-- API Gateway -->
          <g transform="translate(305, 145)">
            <rect x="-20" y="-14" width="40" height="28" rx="4" fill="#fdf2f8" stroke="#db2777" stroke-width="1.8" />
            <path d="M -10 -6 H 10 M -10 0 H 10 M -10 6 H 10" stroke="#be185d" stroke-width="1.3" stroke-linecap="round" />
            <text x="0" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#be185d">API GW</text>
          </g>

          <!-- Backend -->
          <g transform="translate(375, 95)">
            <rect x="-18" y="-15" width="36" height="30" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">Backend</text>
          </g>
        </svg>
      `,
  },
  waf: {
    practicalExample:
      'Blocking requests coming from malicious blacklisted IP subnet ranges, or automatically blocking a client who fires more than 100 requests per second to the endpoint.',
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- FLOW PATHS -->
          <!-- Three traffic sources arriving at WAF -->
          <path d="M 50 45 L 175 80" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 90 L 175 90" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 135 L 175 100" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <!-- WAF → backend (cleared traffic) -->
          <path d="M 245 80 L 320 80" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- WAF → CAPTCHA challenge for suspicious -->
          <path d="M 245 100 L 320 110" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 2" class="ill-flow-right" />
          <!-- WAF blocks malicious (X marker) -->

          <!-- ANIMATED PACKETS -->
          <circle r="3.5" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 45 L 175 80" /></circle>
          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 50 90 L 175 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 245 80 L 320 80" /></circle>

          <!-- BLOCKED indicator (suppressed packet, X) -->
          <g transform="translate(175, 100) scale(0.9)">
            <circle cx="0" cy="0" r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round" />
          </g>
          <text x="135" y="155" font-size="7" font-weight="800" fill="#b91c1c">BLOCKED (403)</text>

          <!-- NODES -->
          <!-- Clean traffic -->
          <g transform="translate(30, 45)">
            <circle cx="0" cy="0" r="10" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <path d="M -4 0 L -1 3 L 4 -3" fill="none" stroke="#047857" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">Real User</text>
          </g>

          <!-- Bot scraper (suspicious) -->
          <g transform="translate(30, 90)">
            <circle cx="0" cy="0" r="10" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5" />
            <rect x="-4" y="-3" width="8" height="6" rx="1" fill="#94a3b8" />
            <text x="0" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">Bot</text>
          </g>

          <!-- Attacker (SQLi/DDoS) -->
          <g transform="translate(30, 135)">
            <circle cx="0" cy="0" r="10" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" class="ill-pulse" />
            <path d="M -3 -3 L 0 0 L 3 -3 M 0 0 L 0 5" fill="none" stroke="#b91c1c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">Attacker</text>
          </g>

          <!-- WAF firewall (shield with rules) -->
          <g transform="translate(210, 90)">
            <rect x="-32" y="-44" width="64" height="88" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="2.2" />
            <!-- Three rule rows -->
            <rect x="-26" y="-36" width="52" height="14" rx="2" fill="#fee2e2" stroke="#dc2626" stroke-width="0.8" />
            <text x="0" y="-26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#991b1b">IP rate limit</text>
            <rect x="-26" y="-18" width="52" height="14" rx="2" fill="#fee2e2" stroke="#dc2626" stroke-width="0.8" />
            <text x="0" y="-8" font-size="6.5" text-anchor="middle" font-weight="800" fill="#991b1b">SQLi rules</text>
            <rect x="-26" y="0" width="52" height="14" rx="2" fill="#fee2e2" stroke="#dc2626" stroke-width="0.8" />
            <text x="0" y="10" font-size="6.5" text-anchor="middle" font-weight="800" fill="#991b1b">Geo blocklist</text>
            <rect x="-26" y="18" width="52" height="14" rx="2" fill="#fee2e2" stroke="#dc2626" stroke-width="0.8" />
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#991b1b">XSS rules</text>
            <text x="0" y="58" font-size="8.5" text-anchor="middle" font-weight="800" fill="#991b1b">AWS WAF</text>
          </g>

          <!-- Backend application (cleared) -->
          <g transform="translate(350, 80)">
            <rect x="-26" y="-15" width="52" height="30" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.8" />
            <line x1="-20" y1="-7" x2="20" y2="-7" stroke="#047857" stroke-width="0.8" />
            <circle cx="-15" cy="-3" r="1.5" fill="#10b981" />
            <text x="0" y="6" font-size="7.5" text-anchor="middle" font-weight="800" fill="#065f46">Origin</text>
          </g>

          <!-- CAPTCHA challenge box -->
          <g transform="translate(355, 120)">
            <rect x="-22" y="-10" width="44" height="20" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#92400e">CAPTCHA</text>
          </g>
        </svg>
      `,
  },
  vpc: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Internet → IGW -->
          <path d="M 40 90 L 78 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- IGW → public subnet -->
          <path d="M 115 90 L 165 60" fill="none" stroke="#475569" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- public → private subnet -->
          <path d="M 230 60 L 290 120" fill="none" stroke="#475569" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 40 90 L 78 90" /></circle>
          <circle r="3.5" fill="#475569"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 115 90 L 165 60" /></circle>
          <circle r="3.5" fill="#475569"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 230 60 L 290 120" /></circle>

          <!-- Internet -->
          <g transform="translate(25, 90)">
            <circle cx="0" cy="0" r="11" fill="none" stroke="#475569" stroke-width="1.6" />
            <ellipse cx="0" cy="0" rx="5" ry="11" fill="none" stroke="#475569" stroke-width="1" />
            <line x1="-11" y1="0" x2="11" y2="0" stroke="#475569" stroke-width="1" />
            <text x="0" y="24" font-size="7.5" text-anchor="middle" font-weight="800" fill="#475569">Internet</text>
          </g>

          <!-- IGW -->
          <g transform="translate(96, 90)">
            <rect x="-18" y="-13" width="36" height="26" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.8" />
            <path d="M -8 0 L 8 0 M -8 0 L -4 -4 M -8 0 L -4 4 M 8 0 L 4 -4 M 8 0 L 4 4" stroke="#4f46e5" stroke-width="1.3" stroke-linecap="round" />
            <text x="0" y="24" font-size="7" text-anchor="middle" font-weight="800" fill="#4338ca">IGW</text>
          </g>

          <!-- VPC boundary -->
          <rect x="150" y="28" width="200" height="130" rx="10" fill="none" stroke="#7c3aed" stroke-width="1.6" stroke-dasharray="5 3" />
          <text x="250" y="22" font-size="8" text-anchor="middle" font-weight="800" fill="#6d28d9">VPC · 10.0.0.0/16</text>

          <!-- Public subnet -->
          <g transform="translate(197, 60)">
            <rect x="-40" y="-22" width="80" height="44" rx="5" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-9" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">PUBLIC SUBNET</text>
            <rect x="-14" y="-2" width="28" height="16" rx="2" fill="#dcfce7" stroke="#10b981" stroke-width="1" />
            <text x="0" y="9" font-size="6.5" text-anchor="middle" font-weight="700" fill="#065f46">Web · ELB</text>
          </g>

          <!-- Private subnet -->
          <g transform="translate(290, 120)">
            <rect x="-50" y="-26" width="100" height="52" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="-12" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">PRIVATE SUBNET</text>
            <rect x="-40" y="-4" width="34" height="18" rx="2" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
            <text x="-23" y="8" font-size="6.5" text-anchor="middle" font-weight="700" fill="#1e3a8a">App</text>
            <rect x="6" y="-4" width="34" height="18" rx="2" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
            <text x="23" y="8" font-size="6.5" text-anchor="middle" font-weight="700" fill="#1e3a8a">DB</text>
          </g>
        </svg>
      `,
  },
  natGateway: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- private instances → NAT -->
          <path d="M 70 60 L 150 85" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 120 L 150 95" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- NAT → Internet (outbound) -->
          <path d="M 215 90 L 300 90" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- return path (faded, inbound blocked) -->
          <path d="M 300 108 L 215 108" fill="none" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="3 3" />

          <circle r="3.5" fill="#3b82f6"><animateMotion dur="2s" repeatCount="indefinite" path="M 70 60 L 150 85" /></circle>
          <circle r="3.5" fill="#3b82f6"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 70 120 L 150 95" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 215 90 L 300 90" /></circle>

          <text x="255" y="82" font-size="7" font-weight="800" fill="#047857">outbound only</text>

          <!-- Private instance 1 -->
          <g transform="translate(50, 60)">
            <rect x="-22" y="-13" width="44" height="26" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <rect x="-16" y="-7" width="6" height="6" fill="#93c5fd" />
            <rect x="-8" y="-7" width="6" height="6" fill="#93c5fd" />
            <text x="4" y="-1" font-size="7" font-weight="800" fill="#1e3a8a">EC2</text>
            <text x="0" y="24" font-size="6.5" text-anchor="middle" font-weight="700" fill="#1d4ed8">Private subnet</text>
          </g>
          <!-- Private instance 2 -->
          <g transform="translate(50, 120)">
            <rect x="-22" y="-13" width="44" height="26" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <rect x="-16" y="-7" width="6" height="6" fill="#93c5fd" />
            <rect x="-8" y="-7" width="6" height="6" fill="#93c5fd" />
            <text x="4" y="-1" font-size="7" font-weight="800" fill="#1e3a8a">EC2</text>
          </g>

          <!-- NAT Gateway -->
          <g transform="translate(183, 90)">
            <circle cx="0" cy="0" r="26" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2.2" />
            <path d="M -10 6 L -3 -6 L 2 0 L 10 -8" fill="none" stroke="#6d28d9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M 6 -8 L 10 -8 L 10 -4" fill="none" stroke="#6d28d9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="40" font-size="8" text-anchor="middle" font-weight="800" fill="#6d28d9">NAT Gateway</text>
          </g>

          <!-- Internet -->
          <g transform="translate(325, 99)">
            <circle cx="0" cy="-9" r="13" fill="none" stroke="#475569" stroke-width="1.6" />
            <ellipse cx="0" cy="-9" rx="6" ry="13" fill="none" stroke="#475569" stroke-width="1" />
            <line x1="-13" y1="-9" x2="13" y2="-9" stroke="#475569" stroke-width="1" />
            <text x="0" y="14" font-size="7.5" text-anchor="middle" font-weight="800" fill="#475569">Internet</text>
          </g>
        </svg>
      `,
  },
  transitGateway: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- spokes → hub -->
          <path d="M 80 45 L 175 82" fill="none" stroke="#0ea5e9" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 80 135 L 175 98" fill="none" stroke="#0ea5e9" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 90 L 168 90" fill="none" stroke="#0ea5e9" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- hub → remaining spoke -->
          <path d="M 232 90 L 320 90" fill="none" stroke="#0ea5e9" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#0ea5e9"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 45 L 175 82" /></circle>
          <circle r="3.5" fill="#0ea5e9"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 70 90 L 168 90" /></circle>
          <circle r="3.5" fill="#0ea5e9"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 232 90 L 320 90" /></circle>

          <!-- VPC A -->
          <g transform="translate(50, 45)">
            <rect x="-26" y="-13" width="52" height="26" rx="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5" />
            <text x="0" y="3" font-size="7.5" text-anchor="middle" font-weight="800" fill="#6d28d9">VPC A</text>
          </g>
          <!-- VPC B -->
          <g transform="translate(45, 90)">
            <rect x="-26" y="-13" width="52" height="26" rx="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5" />
            <text x="0" y="3" font-size="7.5" text-anchor="middle" font-weight="800" fill="#6d28d9">VPC B</text>
          </g>
          <!-- On-prem -->
          <g transform="translate(50, 135)">
            <rect x="-26" y="-13" width="52" height="26" rx="4" fill="#f1f5f9" stroke="#475569" stroke-width="1.5" />
            <text x="0" y="3" font-size="7.5" text-anchor="middle" font-weight="800" fill="#334155">On-Prem</text>
          </g>

          <!-- Transit Gateway hub -->
          <g transform="translate(200, 90)">
            <circle cx="0" cy="0" r="28" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.4" />
            <circle cx="0" cy="0" r="6" fill="#0ea5e9" />
            <line x1="0" y1="-6" x2="0" y2="-18" stroke="#0284c7" stroke-width="1.6" />
            <line x1="0" y1="6" x2="0" y2="18" stroke="#0284c7" stroke-width="1.6" />
            <line x1="-6" y1="0" x2="-18" y2="0" stroke="#0284c7" stroke-width="1.6" />
            <line x1="6" y1="0" x2="18" y2="0" stroke="#0284c7" stroke-width="1.6" />
            <text x="0" y="42" font-size="8" text-anchor="middle" font-weight="800" fill="#0369a1">Transit Gateway</text>
          </g>

          <!-- VPC C -->
          <g transform="translate(350, 90)">
            <rect x="-26" y="-13" width="52" height="26" rx="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5" />
            <text x="0" y="3" font-size="7.5" text-anchor="middle" font-weight="800" fill="#6d28d9">VPC C</text>
          </g>
        </svg>
      `,
  },
  directConnect: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- on-prem → DX location -->
          <path d="M 75 90 L 140 90" fill="none" stroke="#475569" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- DX → AWS (dedicated fiber, solid double) -->
          <path d="M 205 84 L 290 84" fill="none" stroke="#f59e0b" stroke-width="2.2" class="ill-flow-right" />
          <path d="M 290 96 L 205 96" fill="none" stroke="#f59e0b" stroke-width="2.2" class="ill-flow-left" />

          <circle r="4" fill="#475569"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 75 90 L 140 90" /></circle>
          <circle r="4" fill="#f59e0b"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 205 84 L 290 84" /></circle>

          <text x="247" y="74" font-size="7" text-anchor="middle" font-weight="800" fill="#b45309">Private fiber · no internet</text>

          <!-- On-prem datacenter -->
          <g transform="translate(45, 90)">
            <rect x="-24" y="-22" width="48" height="44" rx="4" fill="#f1f5f9" stroke="#475569" stroke-width="1.8" />
            <rect x="-16" y="-15" width="32" height="7" rx="1" fill="#cbd5e1" />
            <rect x="-16" y="-5" width="32" height="7" rx="1" fill="#cbd5e1" />
            <rect x="-16" y="5" width="32" height="7" rx="1" fill="#cbd5e1" />
            <text x="0" y="34" font-size="7.5" text-anchor="middle" font-weight="800" fill="#334155">Data Center</text>
          </g>

          <!-- DX location -->
          <g transform="translate(172, 90)">
            <rect x="-26" y="-18" width="52" height="36" rx="5" fill="#fffbeb" stroke="#f59e0b" stroke-width="2" />
            <path d="M -10 0 L -3 0 M 3 0 L 10 0 M -3 -6 L -3 6 M 3 -6 L 3 6" stroke="#b45309" stroke-width="1.6" stroke-linecap="round" />
            <text x="0" y="32" font-size="7.5" text-anchor="middle" font-weight="800" fill="#b45309">DX Location</text>
          </g>

          <!-- AWS Region -->
          <g transform="translate(330, 90)">
            <rect x="-30" y="-24" width="60" height="48" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="1.8" />
            <text x="0" y="-6" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">AWS</text>
            <rect x="-20" y="2" width="40" height="14" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="1" />
            <text x="0" y="12" font-size="6.5" text-anchor="middle" font-weight="700" fill="#9a3412">VPC · VGW</text>
            <text x="0" y="36" font-size="7.5" text-anchor="middle" font-weight="800" fill="#c2410c">Region</text>
          </g>
        </svg>
      `,
  },
  globalAccelerator: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- users → anycast IP -->
          <path d="M 55 50 L 150 82" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 55 130 L 150 98" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- accelerator → regional endpoints via AWS backbone -->
          <path d="M 215 80 Q 270 45 315 50" fill="none" stroke="#0891b2" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 100 Q 270 135 315 130" fill="none" stroke="#0891b2" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2s" repeatCount="indefinite" path="M 55 50 L 150 82" /></circle>
          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 55 130 L 150 98" /></circle>
          <circle r="4" fill="#0891b2"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 215 80 Q 270 45 315 50" /></circle>
          <circle r="4" fill="#0891b2"><animateMotion dur="2s" repeatCount="indefinite" path="M 215 100 Q 270 135 315 130" /></circle>

          <text x="262" y="170" font-size="7" text-anchor="middle" font-weight="800" fill="#0e7490">AWS global backbone</text>

          <!-- User Asia -->
          <g transform="translate(35, 50)">
            <circle cx="0" cy="-6" r="7" fill="none" stroke="#475569" stroke-width="1.6" />
            <path d="M -10 9 A 10 8 0 0 1 10 9 Z" fill="none" stroke="#475569" stroke-width="1.6" />
            <text x="0" y="24" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">Asia</text>
          </g>
          <!-- User Europe -->
          <g transform="translate(35, 130)">
            <circle cx="0" cy="-6" r="7" fill="none" stroke="#475569" stroke-width="1.6" />
            <path d="M -10 9 A 10 8 0 0 1 10 9 Z" fill="none" stroke="#475569" stroke-width="1.6" />
            <text x="0" y="24" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">Europe</text>
          </g>

          <!-- Global Accelerator (anycast IP) -->
          <g transform="translate(183, 90)">
            <circle cx="0" cy="0" r="26" fill="#ecfeff" stroke="#0891b2" stroke-width="2.4" />
            <circle cx="0" cy="0" r="13" fill="none" stroke="#0e7490" stroke-width="1.4" />
            <ellipse cx="0" cy="0" rx="5" ry="13" fill="none" stroke="#0e7490" stroke-width="1" />
            <line x1="-13" y1="0" x2="13" y2="0" stroke="#0e7490" stroke-width="1" />
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0e7490">Global Accelerator</text>
            <text x="0" y="49" font-size="6.5" text-anchor="middle" font-weight="700" fill="#0891b2">2 static anycast IPs</text>
          </g>

          <!-- Endpoint us-east -->
          <g transform="translate(345, 50)">
            <rect x="-28" y="-13" width="56" height="26" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-1" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">us-east-1</text>
            <text x="0" y="8" font-size="6" text-anchor="middle" font-weight="700" fill="#065f46">ALB</text>
          </g>
          <!-- Endpoint eu-west -->
          <g transform="translate(345, 130)">
            <rect x="-28" y="-13" width="56" height="26" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-1" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">eu-west-1</text>
            <text x="0" y="8" font-size="6" text-anchor="middle" font-weight="700" fill="#065f46">ALB</text>
          </g>
        </svg>
      `,
  },
  privateLink: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- consumer app → endpoint -->
          <path d="M 70 90 L 140 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- endpoint → NLB (private, never internet) -->
          <path d="M 188 90 L 258 90" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 70 90 L 140 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 188 90 L 258 90" /></circle>

          <!-- Consumer VPC boundary -->
          <rect x="20" y="45" width="148" height="90" rx="8" fill="none" stroke="#7c3aed" stroke-width="1.4" stroke-dasharray="5 3" />
          <text x="94" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Consumer VPC</text>

          <!-- Provider VPC boundary -->
          <rect x="232" y="45" width="150" height="90" rx="8" fill="none" stroke="#f97316" stroke-width="1.4" stroke-dasharray="5 3" />
          <text x="307" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#c2410c">Provider VPC</text>

          <!-- Consumer app -->
          <g transform="translate(50, 90)">
            <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">App</text>
          </g>

          <!-- Interface endpoint (ENI) -->
          <g transform="translate(164, 90)">
            <circle cx="0" cy="0" r="20" fill="#f0fdf4" stroke="#10b981" stroke-width="2" />
            <path d="M -8 0 L 8 0 M -8 -6 L -8 6 M 8 -6 L 8 6 M 0 -6 L 0 6" stroke="#047857" stroke-width="1.4" stroke-linecap="round" />
            <text x="0" y="34" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Endpoint (ENI)</text>
          </g>

          <!-- Provider NLB -->
          <g transform="translate(282, 90)">
            <circle cx="0" cy="0" r="18" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
            <line x1="-8" y1="-3" x2="8" y2="3" stroke="#c2410c" stroke-width="1.6" />
            <circle cx="-8" cy="-3" r="3" fill="#fb923c" />
            <circle cx="8" cy="3" r="3" fill="#fb923c" />
            <text x="0" y="30" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">NLB</text>
          </g>

          <!-- Provider service -->
          <g transform="translate(350, 90)">
            <rect x="-18" y="-14" width="36" height="28" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#9a3412">SaaS</text>
          </g>
        </svg>
      `,
  },
  amplify: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- git push → amplify build -->
          <path d="M 60 90 L 140 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- amplify → hosting CDN -->
          <path d="M 190 90 L 260 90" fill="none" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- amplify → backend resources -->
          <path d="M 165 110 L 165 140" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-down" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 60 90 L 140 90" /></circle>
          <circle r="4" fill="#f43f5e"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 190 90 L 260 90" /></circle>
          <circle r="4" fill="#a855f7"><animateMotion dur="2.0s" repeatCount="indefinite" path="M 165 110 L 165 140" /></circle>

          <!-- Git Repo -->
          <g transform="translate(40, 90)">
            <circle cx="0" cy="0" r="16" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <path d="M -6 0 L 6 0 M -6 -6 L -6 6 M 6 -6 L 6 6" stroke="#1d4ed8" stroke-width="1.6" stroke-linecap="round" />
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">Git Push</text>
          </g>

          <!-- AWS Amplify Console -->
          <g transform="translate(165, 90)">
            <rect x="-24" y="-20" width="48" height="40" rx="5" fill="#fff1f2" stroke="#f43f5e" stroke-width="2" />
            <text x="0" y="-4" font-size="6.5" text-anchor="middle" font-weight="800" fill="#e11d48">Amplify</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#be123c">CI/CD Build</text>
          </g>

          <!-- Hosting CDN -->
          <g transform="translate(290, 90)">
            <rect x="-26" y="-14" width="52" height="28" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Global CDN</text>
            <text x="0" y="7" font-size="5.5" text-anchor="middle" font-weight="700" fill="#065f46">Hosting</text>
          </g>

          <!-- Backend Resources -->
          <g transform="translate(165, 155)">
            <rect x="-35" y="-10" width="70" height="20" rx="3" fill="#f3e8ff" stroke="#a855f7" stroke-width="1.5" />
            <text x="0" y="2" font-size="6" text-anchor="middle" font-weight="800" fill="#6b21a8">Cognito / S3 / DB</text>
          </g>
        </svg>
      `,
  },
  ses: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- app → SES → inbox; events → SNS -->
          <path d="M 70 75 L 145 75" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 75 L 300 75" fill="none" stroke="#0ea5e9" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 180 100 L 180 135" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-down" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 75 L 145 75" /></circle>
          <circle r="4" fill="#0ea5e9"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 215 75 L 300 75" /></circle>
          <circle r="3.5" fill="#f59e0b"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 180 100 L 180 135" /></circle>

          <!-- Sending app -->
          <g transform="translate(48, 75)">
            <rect x="-22" y="-14" width="44" height="28" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#4338ca">App / λ</text>
          </g>

          <!-- SES relay -->
          <g transform="translate(180, 75)">
            <rect x="-32" y="-22" width="64" height="44" rx="5" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="2" />
            <path d="M -18 -8 L 0 4 L 18 -8" fill="none" stroke="#0369a1" stroke-width="1.6" />
            <rect x="-18" y="-8" width="36" height="20" rx="2" fill="none" stroke="#0369a1" stroke-width="1.6" />
            <text x="0" y="-27" font-size="7" text-anchor="middle" font-weight="800" fill="#0369a1">SES Relay</text>
            <text x="0" y="18" font-size="5.5" text-anchor="middle" font-weight="700" fill="#075985">DKIM / SPF</text>
          </g>

          <!-- Recipient inbox -->
          <g transform="translate(330, 75)">
            <rect x="-26" y="-14" width="52" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Recipient</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#065f46">Inbox</text>
          </g>

          <!-- Bounce events -->
          <g transform="translate(180, 152)">
            <rect x="-42" y="-12" width="84" height="24" rx="3" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6" text-anchor="middle" font-weight="800" fill="#b45309">Bounces / Complaints</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#92400e">→ SNS / SQS</text>
          </g>
        </svg>
      `,
  },
  documentDb: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- services → instances → shared volume -->
          <path d="M 70 60 L 140 60" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 110 L 140 110" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 205 60 Q 250 60 275 82" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 205 110 Q 250 110 275 96" fill="none" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 70 60 L 140 60" /></circle>
          <circle r="4" fill="#6366f1"><animateMotion dur="2.0s" repeatCount="indefinite" path="M 70 110 L 140 110" /></circle>
          <circle r="4" fill="#8b5cf6"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 205 60 Q 250 60 275 82" /></circle>

          <!-- Microservices -->
          <g transform="translate(48, 60)">
            <rect x="-22" y="-12" width="44" height="24" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">ECS Task</text>
          </g>
          <g transform="translate(48, 110)">
            <rect x="-22" y="-12" width="44" height="24" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">Lambda</text>
          </g>

          <!-- Compute instances -->
          <g transform="translate(172, 60)">
            <rect x="-32" y="-14" width="64" height="28" rx="4" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Primary</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">writes</text>
          </g>
          <g transform="translate(172, 110)">
            <rect x="-32" y="-14" width="64" height="28" rx="4" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 2" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Replica ×15</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">reads</text>
          </g>

          <!-- Shared cluster volume -->
          <g transform="translate(320, 89)">
            <ellipse cx="0" cy="-16" rx="34" ry="8" fill="#ecfdf5" stroke="#10b981" stroke-width="1.6" />
            <path d="M -34 -16 L -34 16 A 34 8 0 0 0 34 16 L 34 -16" fill="#ecfdf5" stroke="#10b981" stroke-width="1.6" />
            <text x="0" y="4" font-size="6" text-anchor="middle" font-weight="800" fill="#047857">Cluster Volume</text>
            <text x="0" y="13" font-size="5.5" text-anchor="middle" font-weight="700" fill="#065f46">JSON · 64 TiB</text>
          </g>
        </svg>
      `,
  },
  neptune: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- app → neptune → graph -->
          <path d="M 75 90 L 145 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 75 90 L 145 90" /></circle>

          <!-- Query app -->
          <g transform="translate(50, 90)">
            <rect x="-24" y="-14" width="48" height="28" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">Gremlin /</text>
            <text x="0" y="8" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">SPARQL</text>
          </g>

          <!-- Neptune engine -->
          <g transform="translate(185, 90)">
            <rect x="-36" y="-24" width="72" height="48" rx="5" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2" />
            <text x="0" y="-10" font-size="7" text-anchor="middle" font-weight="800" fill="#6d28d9">Neptune</text>
            <text x="0" y="2" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">graph engine</text>
            <text x="0" y="14" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">buffer cache</text>
          </g>

          <!-- Graph: vertices and edges -->
          <g stroke="#a78bfa" stroke-width="1.4">
            <line x1="265" y1="60" x2="315" y2="45" />
            <line x1="265" y1="60" x2="320" y2="95" />
            <line x1="320" y1="95" x2="315" y2="45" />
            <line x1="320" y1="95" x2="290" y2="140" />
            <line x1="265" y1="60" x2="290" y2="140" />
            <line x1="320" y1="95" x2="365" y2="120" />
          </g>
          <circle cx="265" cy="60" r="9" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.6" class="ill-pulse" />
          <circle cx="315" cy="45" r="7" fill="#fdf2f8" stroke="#ec4899" stroke-width="1.5" />
          <circle cx="320" cy="95" r="11" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.6" />
          <circle cx="290" cy="140" r="7" fill="#fdf2f8" stroke="#ec4899" stroke-width="1.5" />
          <circle cx="365" cy="120" r="6" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
          <text x="318" y="162" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">vertices + edges</text>
        </svg>
      `,
  },
  timestream: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- sensors → memory tier → magnetic tier; queries from top -->
          <path d="M 70 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 285 90" fill="none" stroke="#0d9488" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <circle r="4" fill="#6366f1"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 70 90 L 135 90" /></circle>
          <circle r="4" fill="#0d9488"><animateMotion dur="2.6s" repeatCount="indefinite" path="M 225 90 L 285 90" /></circle>

          <!-- IoT sensors -->
          <g transform="translate(45, 90)">
            <circle cx="0" cy="-18" r="8" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <circle cx="-8" cy="6" r="8" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <circle cx="10" cy="20" r="8" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="42" font-size="7" text-anchor="middle" font-weight="800" fill="#4338ca">IoT / Kinesis</text>
          </g>

          <!-- Memory store -->
          <g transform="translate(180, 90)">
            <rect x="-42" y="-26" width="84" height="52" rx="5" fill="#fff1f2" stroke="#f43f5e" stroke-width="2" />
            <text x="0" y="-10" font-size="7" text-anchor="middle" font-weight="800" fill="#e11d48">Memory Store</text>
            <text x="0" y="2" font-size="5.5" text-anchor="middle" font-weight="700" fill="#be123c">recent data</text>
            <text x="0" y="13" font-size="5.5" text-anchor="middle" font-weight="700" fill="#be123c">ms queries</text>
          </g>

          <!-- Magnetic store -->
          <g transform="translate(330, 90)">
            <rect x="-42" y="-26" width="84" height="52" rx="5" fill="#f0fdfa" stroke="#0d9488" stroke-width="1.6" />
            <text x="0" y="-10" font-size="7" text-anchor="middle" font-weight="800" fill="#0f766e">Magnetic Store</text>
            <text x="0" y="2" font-size="5.5" text-anchor="middle" font-weight="700" fill="#115e59">history · $0.03/GB</text>
            <text x="0" y="13" font-size="5.5" text-anchor="middle" font-weight="700" fill="#115e59">auto-tiered</text>
          </g>

          <text x="255" y="78" font-size="5.5" text-anchor="middle" font-weight="700" fill="#0f766e">age-out</text>
        </svg>
      `,
  },
  appConfig: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- config → validate → gradual rollout to fleet -->
          <path d="M 75 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 285 55" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 285 90" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 285 125" fill="none" stroke="#cbd5e1" stroke-width="1.4" stroke-dasharray="4 3" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 75 90 L 135 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 225 90 L 285 55" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 225 90 L 285 90" /></circle>

          <!-- Config profile -->
          <g transform="translate(52, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="3" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <line x1="-14" y1="-7" x2="14" y2="-7" stroke="#6366f1" stroke-width="1.4" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#6366f1" stroke-width="1.4" />
            <line x1="-14" y1="7" x2="6" y2="7" stroke="#6366f1" stroke-width="1.4" />
            <text x="0" y="30" font-size="7" text-anchor="middle" font-weight="800" fill="#4338ca">Flag / Config</text>
          </g>

          <!-- AppConfig validate + deploy -->
          <g transform="translate(180, 90)">
            <rect x="-42" y="-24" width="84" height="48" rx="5" fill="#fef2f2" stroke="#9f1239" stroke-width="2" />
            <text x="0" y="-9" font-size="7" text-anchor="middle" font-weight="800" fill="#9f1239">AppConfig</text>
            <text x="0" y="3" font-size="5.5" text-anchor="middle" font-weight="700" fill="#881337">validate → deploy</text>
            <text x="0" y="14" font-size="5.5" text-anchor="middle" font-weight="700" fill="#881337">alarm = rollback</text>
          </g>

          <!-- Fleet -->
          <g transform="translate(320, 55)">
            <rect x="-28" y="-11" width="56" height="22" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#047857">Fleet 5% ✓</text>
          </g>
          <g transform="translate(320, 90)">
            <rect x="-28" y="-11" width="56" height="22" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#047857">Fleet 50%</text>
          </g>
          <g transform="translate(320, 125)">
            <rect x="-28" y="-11" width="56" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#64748b">waiting…</text>
          </g>
        </svg>
      `,
  },
  appMesh: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- control plane pushes routes down to sidecars; traffic flows between services -->
          <path d="M 200 48 L 120 88" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" />
          <path d="M 200 48 L 280 88" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" />
          <path d="M 152 112 L 248 112" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="5 3" class="ill-flow-right" />

          <circle r="3.5" fill="#64748b"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 48 L 120 88" /></circle>
          <circle r="3.5" fill="#64748b"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 48 L 280 88" /></circle>
          <circle r="4.5" fill="#f97316"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 152 112 L 248 112" /></circle>

          <!-- Control plane -->
          <g transform="translate(200, 38)">
            <rect x="-52" y="-16" width="104" height="32" rx="5" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
            <text x="0" y="-2" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">App Mesh Control Plane</text>
            <text x="0" y="9" font-size="5.5" text-anchor="middle" font-weight="700" fill="#9a3412">routing rules (free)</text>
          </g>

          <!-- Service A with envoy sidecar -->
          <g transform="translate(110, 112)">
            <rect x="-38" y="-24" width="76" height="48" rx="5" fill="#eef2ff" stroke="#6366f1" stroke-width="1.6" />
            <text x="0" y="-10" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">Service A</text>
            <rect x="16" y="-2" width="26" height="18" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="29" y="10" font-size="5" text-anchor="middle" font-weight="800" fill="#c2410c">envoy</text>
          </g>

          <!-- Service B with envoy sidecar -->
          <g transform="translate(290, 112)">
            <rect x="-38" y="-24" width="76" height="48" rx="5" fill="#eef2ff" stroke="#6366f1" stroke-width="1.6" />
            <text x="0" y="-10" font-size="6.5" text-anchor="middle" font-weight="800" fill="#4338ca">Service B</text>
            <rect x="-42" y="-2" width="26" height="18" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="-29" y="10" font-size="5" text-anchor="middle" font-weight="800" fill="#c2410c">envoy</text>
          </g>

          <text x="200" y="103" font-size="5.5" text-anchor="middle" font-weight="700" fill="#c2410c">mTLS · retries · weighted routes</text>
          <text x="200" y="168" font-size="6" text-anchor="middle" font-weight="700" fill="#64748b">sidecars keep routing from cached rules if the control plane is down</text>
        </svg>
      `,
  },
  cloudMap: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- register → registry ← discover -->
          <path d="M 90 60 L 160 82" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 90 120 L 160 98" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 310 90 L 245 90" fill="none" stroke="#6366f1" stroke-width="1.8" stroke-dasharray="4 3" />

          <circle r="4" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 90 60 L 160 82" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 90 120 L 160 98" /></circle>
          <circle r="4" fill="#6366f1"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 310 90 L 245 90" /></circle>

          <!-- Registering tasks -->
          <g transform="translate(62, 60)">
            <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#047857">task 10.0.1.5</text>
          </g>
          <g transform="translate(62, 120)">
            <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#047857">task 10.0.2.8</text>
          </g>
          <text x="112" y="52" font-size="5.5" text-anchor="middle" font-weight="700" fill="#047857">register</text>

          <!-- Registry -->
          <g transform="translate(202, 90)">
            <rect x="-42" y="-30" width="84" height="60" rx="5" fill="#f8fafc" stroke="#475569" stroke-width="2" />
            <text x="0" y="-16" font-size="7" text-anchor="middle" font-weight="800" fill="#334155">Cloud Map</text>
            <line x1="-30" y1="-8" x2="30" y2="-8" stroke="#94a3b8" stroke-width="1" />
            <text x="0" y="0" font-size="5.5" text-anchor="middle" font-weight="700" fill="#475569">inventory → 10.0.1.5</text>
            <text x="0" y="10" font-size="5.5" text-anchor="middle" font-weight="700" fill="#475569">inventory → 10.0.2.8</text>
            <text x="0" y="21" font-size="5" text-anchor="middle" font-weight="700" fill="#94a3b8">health-checked</text>
          </g>

          <!-- Consumer -->
          <g transform="translate(340, 90)">
            <rect x="-28" y="-14" width="56" height="28" rx="4" fill="#eef2ff" stroke="#6366f1" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6" text-anchor="middle" font-weight="800" fill="#4338ca">Consumer</text>
            <text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#4338ca">DNS / API</text>
          </g>
          <text x="278" y="80" font-size="5.5" text-anchor="middle" font-weight="700" fill="#4338ca">discover</text>
        </svg>
      `,
  },
  quickSight: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- sources → SPICE → dashboards -->
          <path d="M 85 60 L 145 82" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 85 120 L 145 98" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 235 90 L 295 90" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="5 3" class="ill-flow-right" />

          <circle r="4" fill="#0ea5e9"><animateMotion dur="2.0s" repeatCount="indefinite" path="M 85 60 L 145 82" /></circle>
          <circle r="4" fill="#0ea5e9"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 85 120 L 145 98" /></circle>
          <circle r="4.5" fill="#8b5cf6"><animateMotion dur="1.3s" repeatCount="indefinite" path="M 235 90 L 295 90" /></circle>

          <!-- Sources -->
          <g transform="translate(58, 60)">
            <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#0369a1">Redshift</text>
          </g>
          <g transform="translate(58, 120)">
            <rect x="-26" y="-12" width="52" height="24" rx="4" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#0369a1">S3 / Athena</text>
          </g>

          <!-- SPICE engine -->
          <g transform="translate(190, 90)">
            <rect x="-44" y="-26" width="88" height="52" rx="5" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="2" />
            <text x="0" y="-11" font-size="7" text-anchor="middle" font-weight="800" fill="#6d28d9">SPICE</text>
            <text x="0" y="1" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">in-memory engine</text>
            <text x="0" y="12" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">$0.38/GB-mo</text>
          </g>

          <!-- Dashboard -->
          <g transform="translate(335, 90)">
            <rect x="-38" y="-28" width="76" height="56" rx="4" fill="#fefce8" stroke="#ca8a04" stroke-width="1.6" />
            <rect x="-28" y="-16" width="12" height="30" fill="#fde047" />
            <rect x="-10" y="-6" width="12" height="20" fill="#facc15" />
            <rect x="8" y="-20" width="12" height="34" fill="#eab308" />
            <text x="0" y="24" font-size="6" text-anchor="middle" font-weight="800" fill="#a16207">Dashboards</text>
          </g>
        </svg>
      `,
  },
  lightsail: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- user → bundle; bundle contains compute + ssd + transfer -->
          <path d="M 70 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <circle r="4" fill="#ec4899"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 90 L 135 90" /></circle>

          <!-- User -->
          <g transform="translate(48, 90)">
            <circle cx="0" cy="-8" r="7" fill="none" stroke="#475569" stroke-width="1.8" />
            <path d="M -10 12 Q 0 2 10 12" fill="none" stroke="#475569" stroke-width="1.8" />
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">Visitors</text>
          </g>

          <!-- Flat-rate bundle -->
          <g transform="translate(245, 90)">
            <rect x="-100" y="-52" width="200" height="104" rx="8" fill="#fff1f2" stroke="#be123c" stroke-width="2" />
            <text x="0" y="-38" font-size="7.5" text-anchor="middle" font-weight="800" fill="#be123c">Lightsail Bundle, flat $12/mo</text>

            <g transform="translate(-60, 4)">
              <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#ffffff" stroke="#f43f5e" stroke-width="1.5" />
              <text x="0" y="-4" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">2 vCPU</text>
              <text x="0" y="7" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">2 GB RAM</text>
            </g>
            <g transform="translate(0, 4)">
              <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#ffffff" stroke="#f43f5e" stroke-width="1.5" />
              <text x="0" y="-4" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">60 GB</text>
              <text x="0" y="7" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">SSD</text>
            </g>
            <g transform="translate(60, 4)">
              <rect x="-26" y="-18" width="52" height="36" rx="4" fill="#ffffff" stroke="#f43f5e" stroke-width="1.5" />
              <text x="0" y="-4" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">3 TB</text>
              <text x="0" y="7" font-size="6" text-anchor="middle" font-weight="800" fill="#e11d48">transfer</text>
            </g>
            <text x="0" y="42" font-size="5.5" text-anchor="middle" font-weight="700" fill="#9f1239">burstable CPU, credits throttle to baseline</text>
          </g>
        </svg>
      `,
  },
  iam: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- principal → IAM eval -->
          <path d="M 65 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- IAM → Allow -->
          <path d="M 220 75 Q 265 45 305 45" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- IAM → Deny -->
          <path d="M 220 105 Q 265 135 305 135" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 65 90 L 130 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 220 75 Q 265 45 305 45" /></circle>

          <g transform="translate(265, 116) scale(0.85)">
            <circle cx="0" cy="0" r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round" />
          </g>

          <!-- Principal -->
          <g transform="translate(40, 90)">
            <circle cx="0" cy="-7" r="8" fill="none" stroke="#57534e" stroke-width="1.8" />
            <path d="M -12 11 A 12 9 0 0 1 12 11 Z" fill="none" stroke="#57534e" stroke-width="1.8" />
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#57534e">Role / User</text>
          </g>

          <!-- IAM policy evaluation -->
          <g transform="translate(175, 90)">
            <rect x="-42" y="-30" width="84" height="60" rx="6" fill="#f5f5f4" stroke="#57534e" stroke-width="2" />
            <rect x="-34" y="-22" width="68" height="13" rx="2" fill="#e7e5e4" stroke="#78716c" stroke-width="0.8" />
            <text x="0" y="-12" font-size="6.5" text-anchor="middle" font-weight="700" fill="#44403c">Effect: Allow</text>
            <rect x="-34" y="-6" width="68" height="13" rx="2" fill="#e7e5e4" stroke="#78716c" stroke-width="0.8" />
            <text x="0" y="4" font-size="6.5" text-anchor="middle" font-weight="700" fill="#44403c">Action: s3:Get*</text>
            <rect x="-34" y="10" width="68" height="13" rx="2" fill="#e7e5e4" stroke="#78716c" stroke-width="0.8" />
            <text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="700" fill="#44403c">Resource: arn:*</text>
            <text x="0" y="42" font-size="7.5" text-anchor="middle" font-weight="800" fill="#44403c">IAM Policy Eval</text>
          </g>

          <!-- Allow → resource -->
          <g transform="translate(335, 45)">
            <rect x="-28" y="-14" width="56" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <text x="0" y="-1" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">ALLOW</text>
            <text x="0" y="8" font-size="6.5" text-anchor="middle" font-weight="700" fill="#065f46">S3 access</text>
          </g>
          <!-- Deny -->
          <g transform="translate(335, 135)">
            <rect x="-28" y="-13" width="56" height="26" rx="4" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 2" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">DENY 403</text>
          </g>
        </svg>
      `,
  },
  securityGroup: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- inbound traffic → SG -->
          <path d="M 50 60 L 150 82" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 120 L 150 98" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- SG → instance (allowed) -->
          <path d="M 220 85 L 300 85" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 60 L 150 82" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 220 85 L 300 85" /></circle>

          <g transform="translate(150, 98) scale(0.85)">
            <circle cx="0" cy="0" r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round" />
          </g>

          <!-- Allowed port -->
          <g transform="translate(30, 60)">
            <circle cx="0" cy="0" r="9" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">443</text>
            <text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="700" fill="#047857">HTTPS</text>
          </g>
          <!-- Blocked port -->
          <g transform="translate(30, 120)">
            <circle cx="0" cy="0" r="9" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#991b1b">23</text>
            <text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="700" fill="#991b1b">Telnet</text>
          </g>

          <!-- Security group (stateful firewall ruleset) -->
          <g transform="translate(185, 90)">
            <rect x="-34" y="-32" width="68" height="64" rx="6" fill="#f5f5f4" stroke="#57534e" stroke-width="2.2" />
            <rect x="-27" y="-24" width="54" height="14" rx="2" fill="#dcfce7" stroke="#10b981" stroke-width="0.8" />
            <text x="0" y="-14" font-size="6" text-anchor="middle" font-weight="700" fill="#047857">IN 443 ✓</text>
            <rect x="-27" y="-7" width="54" height="14" rx="2" fill="#dcfce7" stroke="#10b981" stroke-width="0.8" />
            <text x="0" y="3" font-size="6" text-anchor="middle" font-weight="700" fill="#047857">IN 80 ✓</text>
            <rect x="-27" y="10" width="54" height="14" rx="2" fill="#fee2e2" stroke="#ef4444" stroke-width="0.8" />
            <text x="0" y="20" font-size="6" text-anchor="middle" font-weight="700" fill="#991b1b">deny all</text>
            <text x="0" y="44" font-size="7" text-anchor="middle" font-weight="800" fill="#44403c">Security Group</text>
          </g>

          <!-- Protected instance -->
          <g transform="translate(330, 85)">
            <rect x="-26" y="-16" width="52" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8" />
            <rect x="-18" y="-9" width="7" height="7" fill="#93c5fd" />
            <rect x="-9" y="-9" width="7" height="7" fill="#93c5fd" />
            <text x="6" y="-2" font-size="7" font-weight="800" fill="#1e3a8a">EC2</text>
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">Instance</text>
          </g>
        </svg>
      `,
  },
  secretsManager: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- app requests secret -->
          <path d="M 65 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- returns credential -->
          <path d="M 135 108 L 65 108" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-left" />
          <!-- rotation lambda -->
          <path d="M 200 60 L 200 28" fill="none" stroke="#ff9900" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- secret used to reach DB -->
          <path d="M 240 90 L 305 90" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 65 90 L 135 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 135 108 L 65 108" /></circle>

          <text x="100" y="82" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">GetSecretValue</text>
          <text x="100" y="124" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">credential</text>

          <!-- App -->
          <g transform="translate(40, 99)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" />
            <text x="0" y="2" font-size="7" text-anchor="middle" font-weight="800" fill="#1d4ed8">App</text>
          </g>

          <!-- Secrets Manager vault -->
          <g transform="translate(188, 90)">
            <rect x="-26" y="-26" width="52" height="52" rx="6" fill="#f5f5f4" stroke="#57534e" stroke-width="2.2" />
            <circle cx="0" cy="-2" r="12" fill="none" stroke="#44403c" stroke-width="1.6" />
            <circle cx="0" cy="-2" r="3" fill="#44403c" />
            <path d="M 0 1 L 0 8" stroke="#44403c" stroke-width="2" stroke-linecap="round" />
            <text x="0" y="38" font-size="7" text-anchor="middle" font-weight="800" fill="#44403c">Secrets Manager</text>
          </g>

          <!-- Rotation Lambda -->
          <g transform="translate(200, 16)">
            <circle cx="0" cy="0" r="13" fill="#fffbeb" stroke="#ff9900" stroke-width="1.6" />
            <path d="M 2 -7 L -5 1 L 1 1 L -2 7 L 5 -1 L -1 -1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
            <text x="32" y="3" font-size="7" text-anchor="middle" font-weight="700" fill="#7c2d12">rotate</text>
          </g>

          <!-- Target DB -->
          <g transform="translate(330, 90)">
            <ellipse cx="0" cy="-12" rx="20" ry="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" />
            <path d="M -20 -12 L -20 10 A 20 5 0 0 0 20 10 L 20 -12" fill="none" stroke="#3b82f6" stroke-width="1.6" />
            <text x="0" y="26" font-size="7.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">RDS</text>
          </g>
        </svg>
      `,
  },
  kms: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- plaintext → KMS -->
          <path d="M 65 90 L 140 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- KMS → ciphertext → store -->
          <path d="M 230 90 L 305 90" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 65 90 L 140 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 230 90 L 305 90" /></circle>

          <text x="102" y="82" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">plaintext</text>
          <text x="267" y="82" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">ciphertext</text>

          <!-- Source data -->
          <g transform="translate(40, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <line x1="-11" y1="-8" x2="11" y2="-8" stroke="#94a3b8" stroke-width="1" />
            <line x1="-11" y1="-2" x2="11" y2="-2" stroke="#94a3b8" stroke-width="1" />
            <line x1="-11" y1="4" x2="6" y2="4" stroke="#94a3b8" stroke-width="1" />
            <text x="0" y="28" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">Data</text>
          </g>

          <!-- KMS with CMK key -->
          <g transform="translate(185, 90)">
            <rect x="-30" y="-28" width="60" height="56" rx="6" fill="#f5f5f4" stroke="#57534e" stroke-width="2.2" />
            <circle cx="-4" cy="-4" r="9" fill="none" stroke="#d97706" stroke-width="2" />
            <path d="M 2 2 L 14 14 M 10 14 L 14 14 L 14 10" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#44403c">KMS · CMK</text>
          </g>

          <!-- Encrypted store -->
          <g transform="translate(335, 90)">
            <ellipse cx="0" cy="-12" rx="20" ry="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.6" />
            <path d="M -20 -12 L -20 10 A 20 5 0 0 0 20 10 L 20 -12" fill="none" stroke="#10b981" stroke-width="1.6" />
            <path d="M -5 -4 L 5 -4 L 5 -8 A 5 5 0 0 0 -5 -8 Z" fill="#10b981" />
            <rect x="-5" y="-4" width="10" height="8" rx="1" fill="#10b981" />
            <text x="0" y="26" font-size="7.5" text-anchor="middle" font-weight="800" fill="#065f46">Encrypted S3</text>
          </g>
        </svg>
      `,
  },
  shield: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- attack flood → shield -->
          <path d="M 50 50 L 150 80" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 90 L 150 90" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 130 L 150 100" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- clean traffic → protected -->
          <path d="M 235 90 L 305 90" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#ef4444"><animateMotion dur="1.3s" repeatCount="indefinite" path="M 50 50 L 150 80" /></circle>
          <circle r="3.5" fill="#ef4444"><animateMotion dur="1.1s" repeatCount="indefinite" path="M 50 90 L 150 90" /></circle>
          <circle r="3.5" fill="#ef4444"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 130 L 150 100" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 235 90 L 305 90" /></circle>

          <text x="95" y="155" font-size="7.5" text-anchor="middle" font-weight="800" fill="#991b1b">DDoS flood</text>

          <!-- Attack sources -->
          <g transform="translate(32, 50)"><circle r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.4" class="ill-pulse" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">!</text></g>
          <g transform="translate(32, 90)"><circle r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.4" class="ill-pulse" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">!</text></g>
          <g transform="translate(32, 130)"><circle r="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.4" class="ill-pulse" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#991b1b">!</text></g>

          <!-- Shield -->
          <g transform="translate(190, 90)">
            <path d="M 0 -34 L 30 -22 L 30 4 Q 30 28 0 40 Q -30 28 -30 4 L -30 -22 Z" fill="#f5f5f4" stroke="#57534e" stroke-width="2.4" />
            <path d="M -12 -2 L -3 8 L 14 -12" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="56" font-size="8" text-anchor="middle" font-weight="800" fill="#44403c">AWS Shield</text>
          </g>

          <!-- Protected resource -->
          <g transform="translate(335, 90)">
            <rect x="-24" y="-18" width="48" height="36" rx="5" fill="#f0fdf4" stroke="#10b981" stroke-width="1.8" />
            <ellipse cx="0" cy="-8" rx="10" ry="3" fill="none" stroke="#047857" stroke-width="1" />
            <path d="M -10 -8 L -10 4 A 10 3 0 0 0 10 4 L 10 -8" fill="none" stroke="#047857" stroke-width="1" />
            <text x="0" y="30" font-size="7" text-anchor="middle" font-weight="800" fill="#047857">CloudFront</text>
          </g>
        </svg>
      `,
  },
  certificateManager: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- ACM → validate via DNS -->
          <path d="M 130 70 L 130 38" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- ACM → issues cert → attaches to endpoints -->
          <path d="M 170 80 Q 230 45 285 45" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 170 100 Q 230 135 285 135" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#16a34a"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 170 80 Q 230 45 285 45" /></circle>
          <circle r="4" fill="#16a34a"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 170 100 Q 230 135 285 135" /></circle>

          <!-- DNS validation -->
          <g transform="translate(130, 22)">
            <rect x="-26" y="-12" width="52" height="22" rx="3" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#b45309">Route 53 DNS</text>
          </g>

          <!-- ACM (certificate authority) -->
          <g transform="translate(125, 90)">
            <rect x="-40" y="-28" width="80" height="56" rx="6" fill="#f5f5f4" stroke="#57534e" stroke-width="2.2" />
            <rect x="-30" y="-18" width="60" height="30" rx="3" fill="#ffffff" stroke="#a8a29e" stroke-width="1" />
            <path d="M -22 -10 L 18 -10 M -22 -3 L 18 -3 M -22 4 L 4 4" stroke="#d4d4d8" stroke-width="1.4" stroke-linecap="round" />
            <circle cx="16" cy="6" r="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" />
            <path d="M 16 9 L 13 16 L 16 14 L 19 16 Z" fill="#f59e0b" />
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#44403c">ACM Certificate</text>
          </g>

          <!-- Attached: CloudFront -->
          <g transform="translate(320, 45)">
            <rect x="-34" y="-14" width="68" height="28" rx="4" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.5" />
            <path d="M -24 0 L -18 0 M -21 -4 L -18 0 L -21 4" stroke="#7c3aed" stroke-width="1.2" stroke-linecap="round" />
            <text x="4" y="3" font-size="7" font-weight="800" fill="#6b21a8">CloudFront</text>
          </g>
          <!-- Attached: ALB -->
          <g transform="translate(320, 135)">
            <rect x="-34" y="-14" width="68" height="28" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <line x1="-24" y1="-2" x2="-14" y2="2" stroke="#2563eb" stroke-width="1.4" />
            <circle cx="-24" cy="-2" r="2.5" fill="#3b82f6" />
            <circle cx="-14" cy="2" r="2.5" fill="#3b82f6" />
            <text x="6" y="3" font-size="7" font-weight="800" fill="#1d4ed8">ALB · HTTPS</text>
          </g>
        </svg>
      `,
  },
  autoScalingGroup: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- CW metric → ASG -->
          <path d="M 65 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- ASG → launch instances -->
          <path d="M 165 90 L 240 50" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 165 90 L 240 90" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 165 90 L 240 130" fill="none" stroke="#f97316" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#ef4444"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 65 90 L 120 90" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2s" repeatCount="indefinite" path="M 165 90 L 240 50" /></circle>
          <circle r="3.5" fill="#f97316"><animateMotion dur="2.4s" repeatCount="indefinite" path="M 165 90 L 240 130" /></circle>

          <!-- CloudWatch alarm trigger -->
          <g transform="translate(40, 90)">
            <circle cx="0" cy="0" r="14" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" />
            <path d="M -7 4 L -2 -2 L 2 2 L 7 -6" fill="none" stroke="#047857" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">CPU &gt; 75%</text>
          </g>

          <!-- ASG controller -->
          <g transform="translate(142, 90)">
            <rect x="-20" y="-22" width="40" height="44" rx="5" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
            <path d="M 0 -14 L 0 -4 M -5 -9 L 0 -14 L 5 -9" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M 0 14 L 0 4 M -5 9 L 0 14 L 5 9" fill="none" stroke="#c2410c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="34" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">ASG</text>
            <text x="0" y="43" font-size="6" text-anchor="middle" font-weight="700" fill="#9a3412">min2·max6</text>
          </g>

          <!-- ASG boundary -->
          <rect x="232" y="22" width="150" height="136" rx="8" fill="none" stroke="#fb923c" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.6" />

          <!-- instances -->
          <g transform="translate(305, 50)">
            <rect x="-26" y="-14" width="52" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · AZ-a</text>
            <circle cx="-18" cy="6" r="2" fill="#22c55e" />
          </g>
          <g transform="translate(305, 90)">
            <rect x="-26" y="-14" width="52" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · AZ-b</text>
            <circle cx="-18" cy="6" r="2" fill="#22c55e" />
          </g>
          <g transform="translate(305, 130)">
            <rect x="-26" y="-14" width="52" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3 2" />
            <text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · new</text>
            <circle cx="-18" cy="6" r="2" fill="#f59e0b" class="ill-pulse" />
          </g>
        </svg>
      `,
  },
  batch: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- jobs submitted → queue -->
          <path d="M 55 90 L 110 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- queue → compute env -->
          <path d="M 165 90 L 215 90" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- compute → results to S3 -->
          <path d="M 295 90 L 345 90" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 55 90 L 110 90" /></circle>
          <circle r="4" fill="#f97316"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 165 90 L 215 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 295 90 L 345 90" /></circle>

          <!-- Job submitter -->
          <g transform="translate(35, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <text x="0" y="-2" font-size="6.5" text-anchor="middle" font-weight="700" fill="#475569">submit</text>
            <text x="0" y="7" font-size="6.5" text-anchor="middle" font-weight="700" fill="#475569">job</text>
          </g>

          <!-- Job queue -->
          <g transform="translate(138, 90)">
            <rect x="-28" y="-18" width="56" height="36" rx="4" fill="#fff7ed" stroke="#f97316" stroke-width="1.8" />
            <rect x="-22" y="-10" width="9" height="20" rx="1" fill="#fdba74" />
            <rect x="-11" y="-10" width="9" height="20" rx="1" fill="#fdba74" />
            <rect x="0" y="-10" width="9" height="20" rx="1" fill="#fed7aa" />
            <text x="0" y="30" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">Job Queue</text>
          </g>

          <!-- Compute environment -->
          <g transform="translate(255, 90)">
            <rect x="-40" y="-26" width="80" height="52" rx="6" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
            <rect x="-32" y="-18" width="18" height="16" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="1" />
            <rect x="-9" y="-18" width="18" height="16" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="1" />
            <rect x="14" y="-18" width="18" height="16" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="1" />
            <text x="0" y="14" font-size="6.5" text-anchor="middle" font-weight="700" fill="#9a3412">Fargate / EC2 containers</text>
            <text x="0" y="38" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">Compute Env</text>
          </g>

          <!-- Results S3 -->
          <g transform="translate(368, 90)">
            <ellipse cx="0" cy="-10" rx="16" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <path d="M -16 -10 L -16 8 A 16 4 0 0 0 16 8 L 16 -10" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="24" font-size="7" text-anchor="middle" font-weight="800" fill="#065f46">S3</text>
          </g>
        </svg>
      `,
  },
  appRunner: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- source → app runner -->
          <path d="M 60 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- app runner auto-scales containers -->
          <path d="M 215 90 L 280 60" fill="none" stroke="#be123c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 90 L 280 120" fill="none" stroke="#be123c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- HTTPS endpoint out -->
          <path d="M 215 90 L 290 90" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-left" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 130 90" /></circle>
          <circle r="3.5" fill="#be123c"><animateMotion dur="2s" repeatCount="indefinite" path="M 215 90 L 280 60" /></circle>
          <circle r="3.5" fill="#be123c"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 215 90 L 280 120" /></circle>

          <!-- Source (ECR / repo) -->
          <g transform="translate(38, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <rect x="-13" y="-9" width="26" height="6" rx="1" fill="#cbd5e1" />
            <rect x="-13" y="0" width="26" height="6" rx="1" fill="#cbd5e1" />
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#475569">Image/Repo</text>
          </g>

          <!-- App Runner -->
          <g transform="translate(172, 90)">
            <rect x="-40" y="-26" width="80" height="52" rx="6" fill="#fff1f2" stroke="#be123c" stroke-width="2.2" />
            <path d="M -16 6 L -8 -6 L -2 0 L 8 -10 L 14 -10 L 14 -4" fill="none" stroke="#be123c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="20" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">managed · auto-scale</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#be123c">App Runner</text>
          </g>

          <!-- containers -->
          <g transform="translate(300, 60)"><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#9f1239">inst 1</text></g>
          <g transform="translate(300, 120)"><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.5" stroke-dasharray="3 2" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#9f1239">inst 2</text></g>

          <!-- HTTPS endpoint -->
          <g transform="translate(355, 90)">
            <rect x="-22" y="-12" width="44" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="-1" font-size="6" text-anchor="middle" font-weight="700" fill="#047857">HTTPS</text>
            <text x="0" y="7" font-size="5.5" font-family="monospace" text-anchor="middle" fill="#065f46">*.run.app</text>
          </g>
        </svg>
      `,
  },
  elasticBeanstalk: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- code upload → beanstalk -->
          <path d="M 60 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- beanstalk provisions env -->
          <path d="M 165 90 L 215 90" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 120 90" /></circle>
          <circle r="4" fill="#16a34a"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 165 90 L 215 90" /></circle>

          <!-- Code zip -->
          <g transform="translate(38, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -2 -16 L -2 16 M -5 -10 L 1 -10 M -5 -4 L 1 -4 M -5 2 L 1 2" stroke="#94a3b8" stroke-width="1" />
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#475569">app.zip</text>
          </g>

          <!-- Beanstalk -->
          <g transform="translate(142, 90)">
            <circle cx="0" cy="-2" r="20" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.2" />
            <path d="M 0 8 Q -8 -2 0 -12 Q 8 -2 0 8 Z" fill="#86efac" stroke="#16a34a" stroke-width="1.2" />
            <path d="M 0 8 L 0 14" stroke="#16a34a" stroke-width="1.6" stroke-linecap="round" />
            <text x="0" y="34" font-size="7" text-anchor="middle" font-weight="800" fill="#15803d">Beanstalk</text>
          </g>

          <!-- Provisioned environment boundary -->
          <rect x="208" y="28" width="178" height="128" rx="8" fill="none" stroke="#16a34a" stroke-width="1.3" stroke-dasharray="5 3" />
          <text x="297" y="22" font-size="7.5" text-anchor="middle" font-weight="800" fill="#15803d">Managed Environment</text>

          <!-- ELB -->
          <g transform="translate(245, 70)">
            <circle cx="0" cy="0" r="14" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6" />
            <line x1="-7" y1="-3" x2="7" y2="3" stroke="#2563eb" stroke-width="1.4" />
            <circle cx="-7" cy="-3" r="2.5" fill="#3b82f6" /><circle cx="7" cy="3" r="2.5" fill="#3b82f6" />
            <text x="0" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">ELB</text>
          </g>
          <!-- EC2 fleet -->
          <g transform="translate(330, 70)">
            <rect x="-24" y="-13" width="48" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · ASG</text>
          </g>
          <!-- RDS -->
          <g transform="translate(297, 128)">
            <ellipse cx="0" cy="-8" rx="16" ry="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
            <path d="M -16 -8 L -16 6 A 16 4 0 0 0 16 6 L 16 -8" fill="none" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">RDS</text>
          </g>
        </svg>
      `,
  },
  eks: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- ingress → control plane -->
          <path d="M 55 90 L 105 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- control plane → worker pods -->
          <path d="M 150 90 L 215 55" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 150 90 L 215 90" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 150 90 L 215 125" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 55 90 L 105 90" /></circle>
          <circle r="3.5" fill="#0369a1"><animateMotion dur="2s" repeatCount="indefinite" path="M 150 90 L 215 55" /></circle>
          <circle r="3.5" fill="#0369a1"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 150 90 L 215 125" /></circle>

          <!-- Ingress -->
          <g transform="translate(35, 90)">
            <circle cx="0" cy="0" r="13" fill="#eff6ff" stroke="#2563eb" stroke-width="1.6" />
            <line x1="-6" y1="-3" x2="6" y2="3" stroke="#2563eb" stroke-width="1.4" />
            <text x="0" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">Ingress</text>
          </g>

          <!-- EKS control plane -->
          <g transform="translate(128, 90)">
            <rect x="-22" y="-22" width="44" height="44" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.2" />
            <!-- helm wheel -->
            <circle cx="0" cy="0" r="11" fill="none" stroke="#0369a1" stroke-width="1.6" />
            <circle cx="0" cy="0" r="3" fill="#0284c7" />
            <line x1="0" y1="-11" x2="0" y2="-15" stroke="#0369a1" stroke-width="1.6" />
            <line x1="0" y1="11" x2="0" y2="15" stroke="#0369a1" stroke-width="1.6" />
            <line x1="-11" y1="0" x2="-15" y2="0" stroke="#0369a1" stroke-width="1.6" />
            <line x1="11" y1="0" x2="15" y2="0" stroke="#0369a1" stroke-width="1.6" />
            <text x="0" y="34" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">Control Plane</text>
          </g>

          <!-- Worker node group boundary -->
          <rect x="205" y="30" width="180" height="125" rx="8" fill="none" stroke="#0284c7" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.6" />
          <text x="295" y="24" font-size="7" text-anchor="middle" font-weight="800" fill="#0369a1">WORKER NODE GROUP</text>

          <!-- Pods -->
          <g transform="translate(265, 55)"><rect x="-30" y="-14" width="60" height="28" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><circle cx="-18" cy="0" r="6" fill="none" stroke="#0369a1" stroke-width="1.4" /><text x="6" y="3" font-size="6.5" font-weight="800" fill="#0369a1">pod · svc</text></g>
          <g transform="translate(265, 90)"><rect x="-30" y="-14" width="60" height="28" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><circle cx="-18" cy="0" r="6" fill="none" stroke="#0369a1" stroke-width="1.4" /><text x="6" y="3" font-size="6.5" font-weight="800" fill="#0369a1">pod · api</text></g>
          <g transform="translate(265, 125)"><rect x="-30" y="-14" width="60" height="28" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><circle cx="-18" cy="0" r="6" fill="none" stroke="#0369a1" stroke-width="1.4" /><text x="6" y="3" font-size="6.5" font-weight="800" fill="#0369a1">pod · job</text></g>
        </svg>
      `,
  },
  ecr: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- docker push → ECR -->
          <path d="M 60 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- ECR pull → compute targets -->
          <path d="M 220 75 Q 270 50 310 50" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 220 90 L 310 90" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 220 105 Q 270 130 310 130" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 130 90" /></circle>
          <circle r="3.5" fill="#0369a1"><animateMotion dur="2s" repeatCount="indefinite" path="M 220 75 Q 270 50 310 50" /></circle>
          <circle r="3.5" fill="#0369a1"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 220 105 Q 270 130 310 130" /></circle>

          <text x="95" y="82" font-size="7" text-anchor="middle" font-weight="800" fill="#475569">docker push</text>

          <!-- CI build -->
          <g transform="translate(38, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -8 -4 L -2 2 L -8 8 M 0 8 L 8 8" stroke="#475569" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="-6" font-size="6" text-anchor="middle" font-weight="700" fill="#475569">build</text>
          </g>

          <!-- ECR registry -->
          <g transform="translate(175, 90)">
            <rect x="-40" y="-28" width="80" height="56" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.2" />
            <rect x="-30" y="-18" width="60" height="11" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="0.8" />
            <text x="0" y="-9" font-size="6" text-anchor="middle" font-weight="700" fill="#0369a1">app:v2.1</text>
            <rect x="-30" y="-4" width="60" height="11" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="0.8" />
            <text x="0" y="5" font-size="6" text-anchor="middle" font-weight="700" fill="#0369a1">app:v2.0</text>
            <rect x="-30" y="10" width="60" height="11" rx="2" fill="#e0f2fe" stroke="#0284c7" stroke-width="0.8" />
            <text x="0" y="19" font-size="6" text-anchor="middle" font-weight="700" fill="#0369a1">app:latest</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0369a1">ECR Registry</text>
          </g>

          <!-- pull targets -->
          <g transform="translate(340, 50)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#0369a1">ECS / EKS</text></g>
          <g transform="translate(340, 90)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2</text></g>
          <g transform="translate(340, 130)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text></g>
        </svg>
      `,
  },
  aurora: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- app write → writer endpoint -->
          <path d="M 50 70 L 115 70" fill="none" stroke="#ef4444" stroke-width="1.7" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- app read → reader endpoint -->
          <path d="M 50 110 L 115 110" fill="none" stroke="#10b981" stroke-width="1.7" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- writer + reader → shared storage -->
          <path d="M 155 70 L 250 80" fill="none" stroke="#6d28d9" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 155 110 L 250 100" fill="none" stroke="#6d28d9" stroke-width="1.5" stroke-dasharray="3 2" />

          <circle r="4" fill="#ef4444"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 70 L 115 70" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M 50 110 L 115 110" /></circle>

          <text x="82" y="62" font-size="6.5" font-weight="800" fill="#b91c1c">WRITE</text>
          <text x="80" y="124" font-size="6.5" font-weight="800" fill="#047857">READ</text>

          <!-- App -->
          <g transform="translate(30, 90)">
            <rect x="-16" y="-20" width="32" height="40" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.6" />
            <text x="0" y="3" font-size="7" text-anchor="middle" font-weight="800" fill="#6d28d9">App</text>
          </g>

          <!-- Writer instance -->
          <g transform="translate(135, 70)">
            <ellipse cx="0" cy="-9" rx="18" ry="5" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.8" />
            <path d="M -18 -9 L -18 5 A 18 5 0 0 0 18 5 L 18 -9" fill="none" stroke="#7c3aed" stroke-width="1.8" />
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="800" fill="#6d28d9">Writer</text>
          </g>
          <!-- Reader instance -->
          <g transform="translate(135, 110)">
            <ellipse cx="0" cy="-9" rx="18" ry="5" fill="#f5f3ff" stroke="#a78bfa" stroke-width="1.6" />
            <path d="M -18 -9 L -18 5 A 18 5 0 0 0 18 5 L 18 -9" fill="none" stroke="#a78bfa" stroke-width="1.6" />
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="800" fill="#7c3aed">Reader</text>
          </g>

          <!-- Shared distributed storage (6 copies / 3 AZ) -->
          <g transform="translate(305, 90)">
            <rect x="-58" y="-40" width="116" height="80" rx="8" fill="#faf5ff" stroke="#7c3aed" stroke-width="2" />
            <text x="0" y="-28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Shared Storage · 6 copies / 3 AZ</text>
            <g transform="translate(0,2)">
              <ellipse cx="-34" cy="-8" rx="13" ry="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1" /><path d="M -47 -8 L -47 8 A 13 4 0 0 0 -21 8 L -21 -8" fill="none" stroke="#7c3aed" stroke-width="1" />
              <ellipse cx="0" cy="-8" rx="13" ry="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1" /><path d="M -13 -8 L -13 8 A 13 4 0 0 0 13 8 L 13 -8" fill="none" stroke="#7c3aed" stroke-width="1" />
              <ellipse cx="34" cy="-8" rx="13" ry="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="1" /><path d="M 21 -8 L 21 8 A 13 4 0 0 0 47 8 L 47 -8" fill="none" stroke="#7c3aed" stroke-width="1" />
            </g>
            <text x="0" y="34" font-size="6" text-anchor="middle" font-weight="700" fill="#6d28d9">AZ-a · AZ-b · AZ-c</text>
          </g>
        </svg>
      `,
  },
  openSearch: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- ingest → cluster -->
          <path d="M 55 60 L 130 82" fill="none" stroke="#7c3aed" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- query → cluster -->
          <path d="M 55 120 L 130 98" fill="none" stroke="#0891b2" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- cluster → dashboards -->
          <path d="M 215 90 L 300 90" fill="none" stroke="#0891b2" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#7c3aed"><animateMotion dur="2s" repeatCount="indefinite" path="M 55 60 L 130 82" /></circle>
          <circle r="3.5" fill="#0891b2"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 55 120 L 130 98" /></circle>
          <circle r="4" fill="#0891b2"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 215 90 L 300 90" /></circle>

          <!-- Ingest -->
          <g transform="translate(35, 60)">
            <rect x="-18" y="-12" width="36" height="22" rx="3" fill="#f5f3ff" stroke="#7c3aed" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Logs</text>
          </g>
          <!-- Query -->
          <g transform="translate(35, 120)">
            <circle cx="2" cy="-2" r="7" fill="none" stroke="#0891b2" stroke-width="1.6" />
            <line x1="7" y1="3" x2="13" y2="9" stroke="#0891b2" stroke-width="1.8" stroke-linecap="round" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0e7490">Search</text>
          </g>

          <!-- OpenSearch cluster (nodes/shards) -->
          <g transform="translate(172, 90)">
            <rect x="-42" y="-30" width="84" height="60" rx="6" fill="#ecfeff" stroke="#0891b2" stroke-width="2.2" />
            <rect x="-34" y="-20" width="20" height="16" rx="2" fill="#cffafe" stroke="#0e7490" stroke-width="1" /><text x="-24" y="-9" font-size="6" text-anchor="middle" font-weight="700" fill="#0e7490">N1</text>
            <rect x="-10" y="-20" width="20" height="16" rx="2" fill="#cffafe" stroke="#0e7490" stroke-width="1" /><text x="0" y="-9" font-size="6" text-anchor="middle" font-weight="700" fill="#0e7490">N2</text>
            <rect x="14" y="-20" width="20" height="16" rx="2" fill="#cffafe" stroke="#0e7490" stroke-width="1" /><text x="24" y="-9" font-size="6" text-anchor="middle" font-weight="700" fill="#0e7490">N3</text>
            <text x="0" y="10" font-size="6" text-anchor="middle" font-weight="700" fill="#0e7490">inverted index · shards</text>
            <text x="0" y="42" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0e7490">OpenSearch Cluster</text>
          </g>

          <!-- Dashboards -->
          <g transform="translate(335, 90)">
            <rect x="-28" y="-18" width="56" height="36" rx="4" fill="#ecfeff" stroke="#0891b2" stroke-width="1.6" />
            <rect x="-20" y="-10" width="16" height="20" rx="1" fill="#67e8f9" />
            <rect x="-2" y="-2" width="16" height="12" rx="1" fill="#22d3ee" />
            <text x="0" y="30" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0e7490">Dashboards</text>
          </g>
        </svg>
      `,
  },
  redshift: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- data load → leader -->
          <path d="M 55 90 L 115 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- leader → compute nodes -->
          <path d="M 160 90 L 225 55" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 160 90 L 225 90" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 160 90 L 225 125" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- BI query out -->
          <path d="M 285 90 L 345 90" fill="none" stroke="#0891b2" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-left" />

          <circle r="4" fill="#16a34a"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 55 90 L 115 90" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="2s" repeatCount="indefinite" path="M 160 90 L 225 55" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 160 90 L 225 125" /></circle>

          <!-- Data load (COPY from S3) -->
          <g transform="translate(35, 90)">
            <ellipse cx="0" cy="-8" rx="15" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
            <path d="M -15 -8 L -15 6 A 15 4 0 0 0 15 6 L 15 -8" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 COPY</text>
          </g>

          <!-- Leader node -->
          <g transform="translate(138, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="4" fill="#ede9fe" stroke="#7c3aed" stroke-width="2" />
            <path d="M -8 -6 L 8 -6 M -8 0 L 8 0 M -8 6 L 4 6" stroke="#6d28d9" stroke-width="1.3" stroke-linecap="round" />
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Leader</text>
          </g>

          <!-- Compute nodes (MPP) boundary -->
          <rect x="215" y="32" width="78" height="116" rx="6" fill="none" stroke="#7c3aed" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6" />
          <text x="254" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">COMPUTE (MPP)</text>
          <g transform="translate(254, 55)"><rect x="-28" y="-12" width="56" height="24" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">node · slice</text></g>
          <g transform="translate(254, 90)"><rect x="-28" y="-12" width="56" height="24" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">node · slice</text></g>
          <g transform="translate(254, 125)"><rect x="-28" y="-12" width="56" height="24" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">node · slice</text></g>

          <!-- BI tool -->
          <g transform="translate(368, 90)">
            <rect x="-18" y="-14" width="36" height="28" rx="3" fill="#ecfeff" stroke="#0891b2" stroke-width="1.5" />
            <rect x="-11" y="-2" width="5" height="10" fill="#67e8f9" /><rect x="-3" y="-7" width="5" height="15" fill="#22d3ee" /><rect x="5" y="-4" width="5" height="12" fill="#67e8f9" />
            <text x="0" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0e7490">BI</text>
          </g>
        </svg>
      `,
  },
  kinesis: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- producers → stream -->
          <path d="M 50 55 L 120 82" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 125 L 120 98" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- stream → consumers -->
          <path d="M 235 75 Q 280 50 315 50" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 235 105 Q 280 130 315 130" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 50 55 L 120 82" /></circle>
          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2s" repeatCount="indefinite" path="M 50 125 L 120 98" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 235 75 Q 280 50 315 50" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 235 105 Q 280 130 315 130" /></circle>

          <!-- Producers -->
          <g transform="translate(32, 55)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">IoT</text></g>
          <g transform="translate(32, 125)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Clicks</text></g>

          <!-- Kinesis stream (shards) -->
          <g transform="translate(178, 90)">
            <rect x="-56" y="-26" width="112" height="52" rx="6" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2.2" />
            <!-- shard lanes with records -->
            <line x1="-48" y1="-10" x2="48" y2="-10" stroke="#c4b5fd" stroke-width="1" />
            <line x1="-48" y1="2" x2="48" y2="2" stroke="#c4b5fd" stroke-width="1" />
            <rect x="-44" y="-15" width="8" height="9" fill="#a78bfa" /><rect x="-32" y="-15" width="8" height="9" fill="#a78bfa" /><rect x="-20" y="-15" width="8" height="9" fill="#c4b5fd" />
            <rect x="-44" y="-3" width="8" height="9" fill="#a78bfa" /><rect x="-32" y="-3" width="8" height="9" fill="#c4b5fd" />
            <text x="20" y="-7" font-size="5.5" font-weight="700" fill="#5b21b6">shard 1</text>
            <text x="20" y="5" font-size="5.5" font-weight="700" fill="#5b21b6">shard 2</text>
            <text x="0" y="20" font-size="6" text-anchor="middle" font-weight="700" fill="#5b21b6">24h retention</text>
            <text x="0" y="38" font-size="7.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Kinesis Data Stream</text>
          </g>

          <!-- Consumers -->
          <g transform="translate(345, 50)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text></g>
          <g transform="translate(345, 130)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#f5f3ff" stroke="#5b21b6" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Firehose</text></g>
        </svg>
      `,
  },
  msk: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- producers → brokers -->
          <path d="M 50 60 L 125 82" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 120 L 125 98" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- brokers → consumer groups -->
          <path d="M 240 75 L 315 55" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 240 105 L 315 125" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 60 L 125 82" /></circle>
          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2s" repeatCount="indefinite" path="M 50 120 L 125 98" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 240 75 L 315 55" /></circle>
          <circle r="3.5" fill="#7c3aed"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 240 105 L 315 125" /></circle>

          <!-- Producers -->
          <g transform="translate(32, 60)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Prod A</text></g>
          <g transform="translate(32, 120)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Prod B</text></g>

          <!-- MSK brokers (kafka) -->
          <g transform="translate(182, 90)">
            <rect x="-50" y="-30" width="100" height="60" rx="6" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2.2" />
            <rect x="-42" y="-22" width="26" height="18" rx="2" fill="#ede9fe" stroke="#6d28d9" stroke-width="1" /><text x="-29" y="-10" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">B1</text>
            <rect x="-13" y="-22" width="26" height="18" rx="2" fill="#ede9fe" stroke="#6d28d9" stroke-width="1" /><text x="0" y="-10" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">B2</text>
            <rect x="16" y="-22" width="26" height="18" rx="2" fill="#ede9fe" stroke="#6d28d9" stroke-width="1" /><text x="29" y="-10" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">B3</text>
            <text x="0" y="10" font-size="6" text-anchor="middle" font-weight="700" fill="#5b21b6">topics · partitions · replicated</text>
            <text x="0" y="42" font-size="7.5" text-anchor="middle" font-weight="800" fill="#5b21b6">MSK (Kafka)</text>
          </g>

          <!-- Consumer groups -->
          <g transform="translate(345, 55)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Consumer A</text></g>
          <g transform="translate(345, 125)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text></g>
        </svg>
      `,
  },
  athena: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- SQL query → athena -->
          <path d="M 60 90 L 130 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- athena scans S3 -->
          <path d="M 200 75 Q 240 45 280 45" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- athena → results -->
          <path d="M 200 105 Q 240 135 280 135" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 130 90" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 75 Q 240 45 280 45" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 200 105 Q 240 135 280 135" /></circle>

          <!-- SQL query -->
          <g transform="translate(38, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <text x="0" y="-4" font-size="6" font-family="monospace" text-anchor="middle" fill="#475569">SELECT</text>
            <text x="0" y="4" font-size="6" font-family="monospace" text-anchor="middle" fill="#475569">* FROM</text>
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#475569">SQL</text>
          </g>

          <!-- Athena engine (Presto) -->
          <g transform="translate(165, 90)">
            <rect x="-30" y="-26" width="60" height="52" rx="6" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2.2" />
            <circle cx="0" cy="-4" r="11" fill="none" stroke="#6d28d9" stroke-width="1.6" />
            <path d="M -4 -4 L -1 -1 L 5 -8" fill="none" stroke="#6d28d9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="14" font-size="5.5" text-anchor="middle" font-weight="700" fill="#5b21b6">serverless · Presto</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Athena</text>
          </g>

          <!-- S3 data lake -->
          <g transform="translate(310, 45)">
            <ellipse cx="0" cy="-10" rx="18" ry="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.6" />
            <path d="M -18 -10 L -18 8 A 18 5 0 0 0 18 8 L 18 -10" fill="none" stroke="#10b981" stroke-width="1.6" />
            <text x="0" y="24" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 Data Lake</text>
          </g>

          <!-- Results -->
          <g transform="translate(310, 135)">
            <rect x="-24" y="-14" width="48" height="28" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" />
            <line x1="-16" y1="-6" x2="16" y2="-6" stroke="#86efac" stroke-width="1" /><line x1="-16" y1="0" x2="16" y2="0" stroke="#86efac" stroke-width="1" /><line x1="-16" y1="6" x2="16" y2="6" stroke="#86efac" stroke-width="1" />
            <text x="0" y="26" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Result Set</text>
          </g>
        </svg>
      `,
  },
  glue: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- source → crawler → catalog -->
          <path d="M 50 90 L 100 90" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 145 90 L 180 90" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- catalog → ETL job -->
          <path d="M 230 90 L 270 90" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- ETL → target -->
          <path d="M 315 90 L 350 90" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 90 L 100 90" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 230 90 L 270 90" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 315 90 L 350 90" /></circle>

          <!-- Source -->
          <g transform="translate(32, 90)">
            <ellipse cx="0" cy="-8" rx="14" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.4" />
            <path d="M -14 -8 L -14 6 A 14 4 0 0 0 14 6 L 14 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 raw</text>
          </g>

          <!-- Crawler -->
          <g transform="translate(122, 90)">
            <rect x="-20" y="-15" width="40" height="30" rx="4" fill="#f5f3ff" stroke="#5b21b6" stroke-width="1.8" />
            <circle cx="-3" cy="-2" r="5" fill="none" stroke="#6d28d9" stroke-width="1.4" /><line x1="1" y1="2" x2="5" y2="6" stroke="#6d28d9" stroke-width="1.6" stroke-linecap="round" />
            <text x="0" y="26" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">Crawler</text>
          </g>

          <!-- Data Catalog -->
          <g transform="translate(205, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="4" fill="#ede9fe" stroke="#5b21b6" stroke-width="2" />
            <path d="M -10 -8 L 10 -8 M -10 -2 L 10 -2 M -10 4 L 6 4" stroke="#6d28d9" stroke-width="1.3" stroke-linecap="round" />
            <text x="0" y="28" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">Catalog</text>
          </g>

          <!-- ETL job -->
          <g transform="translate(292, 90)">
            <rect x="-20" y="-15" width="40" height="30" rx="4" fill="#f5f3ff" stroke="#5b21b6" stroke-width="1.8" />
            <path d="M -8 -5 L 0 -5 L 0 -9 L 6 -2 L 0 5 L 0 1 L -8 1 Z" fill="#a78bfa" stroke="#6d28d9" stroke-width="0.8" />
            <text x="0" y="26" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">ETL</text>
          </g>

          <!-- Target -->
          <g transform="translate(370, 90)">
            <ellipse cx="0" cy="-8" rx="14" ry="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" />
            <path d="M -14 -8 L -14 6 A 14 4 0 0 0 14 6 L 14 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="800" fill="#065f46">Redshift</text>
          </g>
        </svg>
      `,
  },
  emr: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- S3 data → EMR -->
          <path d="M 50 90 L 110 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- master → core/task -->
          <path d="M 200 75 L 250 55" fill="none" stroke="#5b21b6" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 200 90 L 250 95" fill="none" stroke="#5b21b6" stroke-width="1.5" stroke-dasharray="3 2" />
          <path d="M 200 105 L 250 130" fill="none" stroke="#5b21b6" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- EMR → output -->
          <path d="M 320 90 L 360 90" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#16a34a"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 90 L 110 90" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 75 L 250 55" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 320 90 L 360 90" /></circle>

          <!-- Input S3 -->
          <g transform="translate(32, 90)">
            <ellipse cx="0" cy="-8" rx="14" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.4" />
            <path d="M -14 -8 L -14 6 A 14 4 0 0 0 14 6 L 14 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3</text>
          </g>

          <!-- Master node -->
          <g transform="translate(160, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="4" fill="#ede9fe" stroke="#5b21b6" stroke-width="2" />
            <path d="M 0 -8 L 6 -2 L 0 4 L -6 -2 Z" fill="#a78bfa" stroke="#6d28d9" stroke-width="0.8" />
            <text x="0" y="28" font-size="6.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Master</text>
          </g>

          <!-- Core/task node boundary -->
          <rect x="240" y="32" width="78" height="116" rx="6" fill="none" stroke="#5b21b6" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.6" />
          <text x="279" y="26" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">CORE / TASK</text>
          <g transform="translate(279, 55)"><rect x="-26" y="-12" width="52" height="22" rx="3" fill="#ede9fe" stroke="#5b21b6" stroke-width="1.4" /><text x="0" y="2" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">Spark exec</text></g>
          <g transform="translate(279, 92)"><rect x="-26" y="-12" width="52" height="22" rx="3" fill="#ede9fe" stroke="#5b21b6" stroke-width="1.4" /><text x="0" y="2" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">Spark exec</text></g>
          <g transform="translate(279, 129)"><rect x="-26" y="-12" width="52" height="22" rx="3" fill="#ede9fe" stroke="#5b21b6" stroke-width="1.4" /><text x="0" y="2" font-size="6" text-anchor="middle" font-weight="800" fill="#5b21b6">Spark exec</text></g>

          <!-- Output -->
          <g transform="translate(378, 90)">
            <ellipse cx="0" cy="-8" rx="13" ry="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" />
            <path d="M -13 -8 L -13 6 A 13 4 0 0 0 13 6 L 13 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="800" fill="#065f46">out</text>
          </g>
        </svg>
      `,
  },
  kinesisFirehose: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- source → firehose -->
          <path d="M 50 90 L 105 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- firehose → lambda transform (up) -->
          <path d="M 150 65 L 150 35" fill="none" stroke="#ff9900" stroke-width="1.5" stroke-dasharray="3 2" />
          <!-- firehose → destinations -->
          <path d="M 200 75 Q 250 50 295 50" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 200 90 L 295 90" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 200 105 Q 250 130 295 130" fill="none" stroke="#5b21b6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#94a3b8"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 50 90 L 105 90" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 75 Q 250 50 295 50" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 200 90 L 295 90" /></circle>
          <circle r="3.5" fill="#5b21b6"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 105 Q 250 130 295 130" /></circle>

          <!-- Source stream -->
          <g transform="translate(32, 90)">
            <rect x="-18" y="-13" width="36" height="26" rx="3" fill="#f5f3ff" stroke="#5b21b6" stroke-width="1.5" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Stream</text>
          </g>

          <!-- Transform Lambda -->
          <g transform="translate(150, 22)">
            <circle cx="0" cy="0" r="13" fill="#fffbeb" stroke="#ff9900" stroke-width="1.6" />
            <path d="M 2 -7 L -5 1 L 1 1 L -2 7 L 5 -1 L -1 -1 Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
            <text x="34" y="3" font-size="6.5" text-anchor="middle" font-weight="700" fill="#7c2d12">transform</text>
          </g>

          <!-- Firehose (delivery funnel) -->
          <g transform="translate(165, 90)">
            <path d="M -32 -22 L 32 -22 L 18 8 L 18 24 L -18 24 L -18 8 Z" fill="#f5f3ff" stroke="#5b21b6" stroke-width="2.2" />
            <line x1="-22" y1="-12" x2="22" y2="-12" stroke="#c4b5fd" stroke-width="1" />
            <text x="0" y="38" font-size="7" text-anchor="middle" font-weight="800" fill="#5b21b6">Firehose</text>
          </g>

          <!-- Destinations -->
          <g transform="translate(325, 50)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3</text></g>
          <g transform="translate(325, 90)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6d28d9">Redshift</text></g>
          <g transform="translate(325, 130)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ecfeff" stroke="#0891b2" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0e7490">OpenSearch</text></g>
        </svg>
      `,
  },
  efs: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- instances → mount targets → EFS -->
          <path d="M 70 50 L 185 82" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 90 L 185 90" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 130 L 185 98" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 70 50 L 185 82" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 90 L 185 90" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 70 130 L 185 98" /></circle>

          <text x="125" y="160" font-size="7" text-anchor="middle" font-weight="800" fill="#0f766e">NFS mount · shared concurrent</text>

          <!-- EC2 clients -->
          <g transform="translate(48, 50)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · AZ-a</text></g>
          <g transform="translate(48, 90)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 · AZ-b</text></g>
          <g transform="translate(48, 130)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text></g>

          <!-- EFS elastic file system -->
          <g transform="translate(265, 90)">
            <rect x="-60" y="-40" width="120" height="80" rx="8" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.2" />
            <!-- folder tree -->
            <path d="M -38 -20 L -38 16 M -38 -20 L -20 -20 L -16 -14 L 8 -14" fill="none" stroke="#0d9488" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="-12" y="-18" width="40" height="9" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="0.8" />
            <rect x="-12" y="-4" width="40" height="9" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="0.8" />
            <rect x="-12" y="10" width="28" height="9" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="0.8" />
            <text x="0" y="34" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0f766e">EFS · elastic NFS</text>
          </g>
        </svg>
      `,
  },
  fsx: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- compute clients → FSx -->
          <path d="M 70 60 L 175 85" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 70 120 L 175 95" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- FSx ↔ S3 (lustre tiering) -->
          <path d="M 245 110 L 320 130" fill="none" stroke="#10b981" stroke-width="1.4" stroke-dasharray="3 2" />

          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 70 60 L 175 85" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 70 120 L 175 95" /></circle>

          <!-- HPC clients -->
          <g transform="translate(48, 60)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#7c2d12">HPC node</text></g>
          <g transform="translate(48, 120)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#7c2d12">HPC node</text></g>

          <!-- FSx file system -->
          <g transform="translate(210, 90)">
            <rect x="-40" y="-30" width="80" height="60" rx="8" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.2" />
            <path d="M -22 -16 L 22 -16 M -22 -8 L 22 -8 M -22 0 L 22 0 M -22 8 L 10 8" stroke="#0d9488" stroke-width="1.4" stroke-linecap="round" />
            <text x="0" y="24" font-size="5.5" text-anchor="middle" font-weight="700" fill="#0f766e">Lustre · sub-ms</text>
            <text x="0" y="42" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0f766e">FSx</text>
          </g>

          <!-- S3 tier -->
          <g transform="translate(345, 130)">
            <ellipse cx="0" cy="-8" rx="15" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.4" />
            <path d="M -15 -8 L -15 6 A 15 4 0 0 0 15 6 L 15 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 tier</text>
          </g>
        </svg>
      `,
  },
  backup: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- resources → backup -->
          <path d="M 60 50 L 155 82" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 60 90 L 155 90" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 60 130 L 155 98" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- backup → vault -->
          <path d="M 245 90 L 305 90" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#0f766e"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 50 L 155 82" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 155 90" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 60 130 L 155 98" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 245 90 L 305 90" /></circle>

          <!-- Resources -->
          <g transform="translate(40, 50)"><ellipse cx="0" cy="-7" rx="13" ry="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.4" /><path d="M -13 -7 L -13 6 A 13 4 0 0 0 13 6 L 13 -7" fill="none" stroke="#3b82f6" stroke-width="1.4" /><text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">RDS</text></g>
          <g transform="translate(40, 90)"><rect x="-15" y="-10" width="30" height="20" rx="2" fill="#fff7ed" stroke="#f97316" stroke-width="1.4" /><text x="0" y="4" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EBS</text></g>
          <g transform="translate(40, 130)"><rect x="-15" y="-10" width="30" height="20" rx="2" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.4" /><text x="0" y="4" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0f766e">EFS</text></g>

          <!-- AWS Backup scheduler -->
          <g transform="translate(200, 90)">
            <rect x="-44" y="-28" width="88" height="56" rx="6" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.2" />
            <circle cx="-16" cy="-2" r="10" fill="none" stroke="#0d9488" stroke-width="1.6" />
            <path d="M -16 -8 L -16 -2 L -11 1" fill="none" stroke="#0d9488" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="14" y="-4" font-size="6" text-anchor="middle" font-weight="700" fill="#0f766e">daily</text>
            <text x="14" y="5" font-size="6" text-anchor="middle" font-weight="700" fill="#0f766e">policy</text>
            <text x="0" y="42" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0f766e">AWS Backup</text>
          </g>

          <!-- Backup vault -->
          <g transform="translate(335, 90)">
            <rect x="-26" y="-22" width="52" height="44" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
            <circle cx="0" cy="-2" r="9" fill="none" stroke="#047857" stroke-width="1.6" />
            <circle cx="0" cy="-2" r="2.5" fill="#047857" />
            <path d="M 0 0 L 0 5" stroke="#047857" stroke-width="1.6" stroke-linecap="round" />
            <text x="0" y="34" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Vault</text>
          </g>
        </svg>
      `,
  },
  mq: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- producers → broker -->
          <path d="M 50 60 L 130 82" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 120 L 130 98" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- broker → consumers -->
          <path d="M 240 75 L 320 55" fill="none" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 240 105 L 320 125" fill="none" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 60 L 130 82" /></circle>
          <circle r="3.5" fill="#94a3b8"><animateMotion dur="2s" repeatCount="indefinite" path="M 50 120 L 130 98" /></circle>
          <circle r="3.5" fill="#c2410c"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 240 75 L 320 55" /></circle>
          <circle r="3.5" fill="#c2410c"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 240 105 L 320 125" /></circle>

          <text x="185" y="160" font-size="7" text-anchor="middle" font-weight="800" fill="#c2410c">JMS · AMQP · MQTT (managed)</text>

          <!-- Producers -->
          <g transform="translate(32, 60)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#475569">Legacy</text></g>
          <g transform="translate(32, 120)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#475569">App</text></g>

          <!-- MQ broker -->
          <g transform="translate(185, 90)">
            <rect x="-50" y="-28" width="100" height="56" rx="6" fill="#fff7ed" stroke="#c2410c" stroke-width="2.2" />
            <rect x="-42" y="-18" width="40" height="14" rx="2" fill="#ffedd5" stroke="#ea580c" stroke-width="0.8" />
            <text x="-22" y="-8" font-size="6" text-anchor="middle" font-weight="700" fill="#9a3412">queue</text>
            <rect x="2" y="-18" width="40" height="14" rx="2" fill="#ffedd5" stroke="#ea580c" stroke-width="0.8" />
            <text x="22" y="-8" font-size="6" text-anchor="middle" font-weight="700" fill="#9a3412">topic</text>
            <text x="0" y="10" font-size="6" text-anchor="middle" font-weight="700" fill="#9a3412">ActiveMQ / RabbitMQ</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#c2410c">Amazon MQ Broker</text>
          </g>

          <!-- Consumers -->
          <g transform="translate(350, 55)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2 worker</text></g>
          <g transform="translate(350, 125)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">ECS task</text></g>
        </svg>
      `,
  },
  organizations: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- management → OUs -->
          <path d="M 130 75 L 130 50" fill="none" stroke="#9f1239" stroke-width="0" />
          <path d="M 95 90 L 200 55" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 95 90 L 200 125" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- OUs → accounts -->
          <path d="M 245 55 L 310 40" fill="none" stroke="#9f1239" stroke-width="1.4" stroke-dasharray="3 2" />
          <path d="M 245 55 L 310 70" fill="none" stroke="#9f1239" stroke-width="1.4" stroke-dasharray="3 2" />
          <path d="M 245 125 L 310 110" fill="none" stroke="#9f1239" stroke-width="1.4" stroke-dasharray="3 2" />
          <path d="M 245 125 L 310 140" fill="none" stroke="#9f1239" stroke-width="1.4" stroke-dasharray="3 2" />

          <circle r="3.5" fill="#9f1239"><animateMotion dur="2s" repeatCount="indefinite" path="M 95 90 L 200 55" /></circle>
          <circle r="3.5" fill="#9f1239"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 95 90 L 200 125" /></circle>

          <!-- Management account -->
          <g transform="translate(60, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="6" fill="#fff1f2" stroke="#9f1239" stroke-width="2.2" />
            <path d="M 0 -12 L 6 -6 L 0 0 L -6 -6 Z" fill="#fb7185" stroke="#9f1239" stroke-width="0.8" />
            <text x="0" y="14" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">SCPs</text>
            <text x="0" y="34" font-size="6.5" text-anchor="middle" font-weight="800" fill="#9f1239">Mgmt Acct</text>
          </g>

          <!-- OU: Prod -->
          <g transform="translate(222, 55)"><rect x="-24" y="-13" width="48" height="26" rx="4" fill="#ffe4e6" stroke="#9f1239" stroke-width="1.6" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#9f1239">OU · Prod</text></g>
          <!-- OU: Dev -->
          <g transform="translate(222, 125)"><rect x="-24" y="-13" width="48" height="26" rx="4" fill="#ffe4e6" stroke="#9f1239" stroke-width="1.6" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#9f1239">OU · Dev</text></g>

          <!-- Member accounts -->
          <g transform="translate(335, 40)"><rect x="-24" y="-10" width="48" height="20" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.3" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">acct A</text></g>
          <g transform="translate(335, 70)"><rect x="-24" y="-10" width="48" height="20" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.3" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">acct B</text></g>
          <g transform="translate(335, 110)"><rect x="-24" y="-10" width="48" height="20" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.3" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">acct C</text></g>
          <g transform="translate(335, 140)"><rect x="-24" y="-10" width="48" height="20" rx="3" fill="#fff1f2" stroke="#be123c" stroke-width="1.3" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">acct D</text></g>
        </svg>
      `,
  },
  cloudTrail: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- API calls → CloudTrail -->
          <path d="M 50 60 L 130 82" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 120 L 130 98" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- CloudTrail → S3 + CloudWatch + EventBridge -->
          <path d="M 230 75 Q 275 45 310 45" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 230 90 L 310 90" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 230 105 Q 275 135 310 135" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#94a3b8"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 50 60 L 130 82" /></circle>
          <circle r="3.5" fill="#9f1239"><animateMotion dur="2s" repeatCount="indefinite" path="M 230 75 Q 275 45 310 45" /></circle>
          <circle r="3.5" fill="#9f1239"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 230 90 L 310 90" /></circle>

          <!-- API sources -->
          <g transform="translate(32, 60)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">Console</text></g>
          <g transform="translate(32, 120)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">SDK/CLI</text></g>

          <!-- CloudTrail (audit ledger) -->
          <g transform="translate(180, 90)">
            <rect x="-44" y="-28" width="88" height="56" rx="6" fill="#fff1f2" stroke="#9f1239" stroke-width="2.2" />
            <rect x="-34" y="-18" width="68" height="10" rx="1" fill="#ffe4e6" stroke="#be123c" stroke-width="0.7" />
            <text x="0" y="-10" font-size="5.5" font-family="monospace" text-anchor="middle" fill="#9f1239">DeleteBucket · user1</text>
            <rect x="-34" y="-5" width="68" height="10" rx="1" fill="#ffe4e6" stroke="#be123c" stroke-width="0.7" />
            <text x="0" y="3" font-size="5.5" font-family="monospace" text-anchor="middle" fill="#9f1239">RunInstances · role2</text>
            <rect x="-34" y="8" width="68" height="10" rx="1" fill="#ffe4e6" stroke="#be123c" stroke-width="0.7" />
            <text x="0" y="16" font-size="5.5" font-family="monospace" text-anchor="middle" fill="#9f1239">AssumeRole · svc</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#9f1239">CloudTrail · audit log</text>
          </g>

          <!-- Destinations -->
          <g transform="translate(340, 45)"><rect x="-28" y="-13" width="56" height="26" rx="3" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3</text></g>
          <g transform="translate(340, 90)"><rect x="-28" y="-13" width="56" height="26" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">CloudWatch</text></g>
          <g transform="translate(340, 135)"><rect x="-28" y="-13" width="56" height="26" rx="3" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#6b21a8">EventBridge</text></g>
        </svg>
      `,
  },
  systemsManager: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- SSM → managed fleet -->
          <path d="M 145 75 L 235 50" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 150 90 L 235 90" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 145 105 L 235 130" fill="none" stroke="#9f1239" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- parameter store feeds in -->
          <path d="M 90 55 L 90 75" fill="none" stroke="#f59e0b" stroke-width="1.4" stroke-dasharray="3 2" />

          <circle r="3.5" fill="#9f1239"><animateMotion dur="2s" repeatCount="indefinite" path="M 145 75 L 235 50" /></circle>
          <circle r="3.5" fill="#9f1239"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 150 90 L 235 90" /></circle>
          <circle r="3.5" fill="#9f1239"><animateMotion dur="2.3s" repeatCount="indefinite" path="M 145 105 L 235 130" /></circle>

          <!-- Parameter Store -->
          <g transform="translate(90, 40)">
            <rect x="-26" y="-12" width="52" height="22" rx="3" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#b45309">Param Store</text>
          </g>

          <!-- SSM control -->
          <g transform="translate(95, 90)">
            <rect x="-42" y="-26" width="84" height="52" rx="6" fill="#fff1f2" stroke="#9f1239" stroke-width="2.2" />
            <circle cx="-14" cy="-2" r="9" fill="none" stroke="#be123c" stroke-width="1.6" />
            <path d="M -14 -8 L -14 -2 L -9 1 M -20 -2 a 6 6 0 1 1 1 3" fill="none" stroke="#be123c" stroke-width="1.4" stroke-linecap="round" />
            <text x="14" y="-4" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">Run Cmd</text>
            <text x="14" y="5" font-size="6" text-anchor="middle" font-weight="700" fill="#9f1239">Patch</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#9f1239">Systems Manager</text>
          </g>

          <!-- Managed fleet boundary -->
          <rect x="228" y="28" width="158" height="128" rx="8" fill="none" stroke="#9f1239" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55" />
          <text x="307" y="22" font-size="7" text-anchor="middle" font-weight="800" fill="#9f1239">MANAGED FLEET (SSM Agent)</text>
          <g transform="translate(300, 50)"><rect x="-26" y="-13" width="52" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2</text></g>
          <g transform="translate(300, 90)"><rect x="-26" y="-13" width="52" height="26" rx="3" fill="#fff7ed" stroke="#f97316" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">EC2</text></g>
          <g transform="translate(300, 130)"><rect x="-26" y="-13" width="52" height="26" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">ECS</text></g>
        </svg>
      `,
  },
  appSync: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- client graphql → appsync -->
          <path d="M 55 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- appsync resolvers → data sources -->
          <path d="M 215 75 Q 260 48 300 48" fill="none" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 90 L 300 90" fill="none" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 105 Q 260 132 300 132" fill="none" stroke="#c2410c" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 55 90 L 120 90" /></circle>
          <circle r="3.5" fill="#c2410c"><animateMotion dur="2s" repeatCount="indefinite" path="M 215 75 Q 260 48 300 48" /></circle>
          <circle r="3.5" fill="#c2410c"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 215 90 L 300 90" /></circle>
          <circle r="3.5" fill="#c2410c"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 215 105 Q 260 132 300 132" /></circle>

          <!-- Client (GraphQL query) -->
          <g transform="translate(35, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M 0 -8 L 6 -4 L 6 4 L 0 8 L -6 4 L -6 -4 Z" fill="none" stroke="#475569" stroke-width="1.2" />
            <text x="0" y="28" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">GraphQL</text>
          </g>

          <!-- AppSync resolver hub -->
          <g transform="translate(168, 90)">
            <rect x="-42" y="-28" width="84" height="56" rx="6" fill="#fff7ed" stroke="#c2410c" stroke-width="2.2" />
            <path d="M 0 -16 L 9 -10 L 9 2 L 0 8 L -9 2 L -9 -10 Z" fill="none" stroke="#9a3412" stroke-width="1.4" />
            <circle cx="0" cy="-4" r="2.5" fill="#ea580c" />
            <text x="0" y="20" font-size="5.5" text-anchor="middle" font-weight="700" fill="#9a3412">single endpoint · resolvers</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#c2410c">AppSync</text>
          </g>

          <!-- Data sources -->
          <g transform="translate(330, 48)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">DynamoDB</text></g>
          <g transform="translate(330, 90)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#7c2d12">Lambda</text></g>
          <g transform="translate(330, 132)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ecfeff" stroke="#0891b2" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0e7490">OpenSearch</text></g>
        </svg>
      `,
  },
  iotCore: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- devices → IoT Core -->
          <path d="M 50 55 L 130 82" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 90 L 130 90" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 50 125 L 130 98" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- rules engine → targets -->
          <path d="M 235 75 Q 280 50 315 50" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 235 105 Q 280 130 315 130" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 50 55 L 130 82" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 50 90 L 130 90" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 50 125 L 130 98" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 235 75 Q 280 50 315 50" /></circle>
          <circle r="3.5" fill="#0f766e"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 235 105 Q 280 130 315 130" /></circle>

          <text x="90" y="155" font-size="7" text-anchor="middle" font-weight="800" fill="#0f766e">MQTT</text>

          <!-- Devices -->
          <g transform="translate(32, 55)"><rect x="-15" y="-10" width="30" height="20" rx="3" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.4" /><circle cx="0" cy="0" r="3" fill="#14b8a6" class="ill-pulse" /><text x="0" y="18" font-size="6" text-anchor="middle" font-weight="700" fill="#0f766e">sensor</text></g>
          <g transform="translate(32, 90)"><rect x="-15" y="-10" width="30" height="20" rx="3" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.4" /><circle cx="0" cy="0" r="3" fill="#14b8a6" class="ill-pulse" /></g>
          <g transform="translate(32, 125)"><rect x="-15" y="-10" width="30" height="20" rx="3" fill="#f0fdfa" stroke="#0f766e" stroke-width="1.4" /><circle cx="0" cy="0" r="3" fill="#14b8a6" class="ill-pulse" /></g>

          <!-- IoT Core (broker + rules) -->
          <g transform="translate(180, 90)">
            <rect x="-48" y="-28" width="96" height="56" rx="6" fill="#f0fdfa" stroke="#0f766e" stroke-width="2.2" />
            <rect x="-40" y="-18" width="76" height="13" rx="2" fill="#ccfbf1" stroke="#0d9488" stroke-width="0.8" />
            <text x="-2" y="-8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#0f766e">MQTT message broker</text>
            <rect x="-40" y="-2" width="76" height="13" rx="2" fill="#ccfbf1" stroke="#0d9488" stroke-width="0.8" />
            <text x="-2" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#0f766e">rules engine · SQL</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0f766e">IoT Core</text>
          </g>

          <!-- Targets -->
          <g transform="translate(345, 50)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">DynamoDB</text></g>
          <g transform="translate(345, 130)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#f5f3ff" stroke="#5b21b6" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#5b21b6">Kinesis</text></g>
        </svg>
      `,
  },
  xray: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- traced request flows across services -->
          <path d="M 45 90 L 95 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 135 90 L 185 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 275 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- segments emit to X-Ray -->
          <path d="M 115 105 L 160 145" fill="none" stroke="#0369a1" stroke-width="1.2" stroke-dasharray="3 2" />
          <path d="M 205 105 L 175 145" fill="none" stroke="#0369a1" stroke-width="1.2" stroke-dasharray="3 2" />

          <circle r="4" fill="#0284c7"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 45 90 L 95 90" /></circle>
          <circle r="4" fill="#0284c7"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 135 90 L 185 90" /></circle>
          <circle r="4" fill="#0284c7"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 225 90 L 275 90" /></circle>

          <!-- Traced service chain -->
          <g transform="translate(28, 90)"><circle r="13" fill="#fdf2f8" stroke="#db2777" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#be185d">API</text></g>
          <g transform="translate(115, 90)"><circle r="13" fill="#fffbeb" stroke="#ff9900" stroke-width="1.5" /><text x="0" y="3" font-size="5.5" text-anchor="middle" font-weight="800" fill="#7c2d12">λ</text></g>
          <g transform="translate(205, 90)"><circle r="13" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#1d4ed8">DB</text></g>
          <g transform="translate(290, 90)"><circle r="13" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" /><text x="0" y="3" font-size="6" text-anchor="middle" font-weight="800" fill="#065f46">S3</text></g>

          <!-- X-Ray trace timeline -->
          <g transform="translate(200, 150)">
            <rect x="-90" y="-18" width="180" height="32" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8" />
            <text x="-84" y="-8" font-size="6" font-weight="800" fill="#0369a1">X-Ray Trace · 142ms</text>
            <rect x="-84" y="-2" width="50" height="5" rx="1" fill="#db2777" />
            <rect x="-32" y="-2" width="44" height="5" rx="1" fill="#ff9900" />
            <rect x="14" y="-2" width="30" height="5" rx="1" fill="#3b82f6" />
            <rect x="46" y="-2" width="20" height="5" rx="1" fill="#10b981" />
            <rect x="-84" y="5" width="40" height="4" rx="1" fill="#fca5a5" />
          </g>
        </svg>
      `,
  },
  codePipeline: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- stage chain -->
          <path d="M 78 90 L 108 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 162 90 L 192 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 246 90 L 276 90" fill="none" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#0284c7"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 78 90 L 108 90" /></circle>
          <circle r="4" fill="#0284c7"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 162 90 L 192 90" /></circle>
          <circle r="4" fill="#0284c7"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 246 90 L 276 90" /></circle>

          <!-- Source -->
          <g transform="translate(45, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8" />
            <circle cx="0" cy="-4" r="7" fill="none" stroke="#0369a1" stroke-width="1.5" /><line x1="0" y1="3" x2="0" y2="9" stroke="#0369a1" stroke-width="1.5" />
            <text x="0" y="18" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">Source</text>
          </g>
          <!-- Build -->
          <g transform="translate(135, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8" />
            <path d="M -8 -8 L -2 -2 L -8 4 M 0 4 L 8 4" stroke="#0369a1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="18" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">Build</text>
          </g>
          <!-- Test -->
          <g transform="translate(219, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8" />
            <path d="M -7 -8 L -1 -2 L 8 -10" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="18" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">Test</text>
          </g>
          <!-- Deploy -->
          <g transform="translate(310, 90)">
            <rect x="-30" y="-22" width="60" height="44" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
            <path d="M 0 -10 L 0 2 M -5 -5 L 0 -10 L 5 -5" fill="none" stroke="#047857" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="18" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Deploy</text>
          </g>
          <text x="200" y="148" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0369a1">CodePipeline · continuous delivery</text>
        </svg>
      `,
  },
  codeBuild: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- source → build env -->
          <path d="M 60 90 L 125 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- build → artifacts (S3 + ECR) -->
          <path d="M 215 75 Q 260 48 300 48" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 215 105 Q 260 132 300 132" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 125 90" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M 215 75 Q 260 48 300 48" /></circle>
          <circle r="3.5" fill="#0369a1"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 215 105 Q 260 132 300 132" /></circle>

          <!-- Source -->
          <g transform="translate(38, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -8 -6 L -2 0 L -8 6 M 0 6 L 8 6" stroke="#475569" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="28" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">buildspec</text>
          </g>

          <!-- Build environment -->
          <g transform="translate(170, 90)">
            <rect x="-42" y="-28" width="84" height="56" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.2" />
            <rect x="-32" y="-18" width="64" height="26" rx="3" fill="#0f172a" />
            <text x="-26" y="-9" font-size="5.5" font-family="monospace" fill="#22c55e">$ npm build</text>
            <text x="-26" y="-1" font-size="5.5" font-family="monospace" fill="#86efac">✓ compiled</text>
            <text x="-26" y="6" font-size="5.5" font-family="monospace" fill="#67e8f9">$ docker build</text>
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="700" fill="#0369a1">ephemeral container</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0369a1">CodeBuild</text>
          </g>

          <!-- Artifacts -->
          <g transform="translate(330, 48)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">S3 artifact</text></g>
          <g transform="translate(330, 132)"><rect x="-30" y="-13" width="60" height="26" rx="3" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#0369a1">ECR image</text></g>
        </svg>
      `,
  },
  codeDeploy: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- artifact → codedeploy -->
          <path d="M 55 90 L 115 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- deploy → blue (live) + green (new) -->
          <path d="M 205 75 Q 250 48 290 48" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 205 105 Q 250 132 290 132" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- traffic shift arrow -->
          <path d="M 340 60 L 340 118" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 2" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 55 90 L 115 90" /></circle>
          <circle r="3.5" fill="#10b981"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 205 105 Q 250 132 290 132" /></circle>

          <text x="340" y="95" font-size="6.5" text-anchor="middle" font-weight="800" fill="#b45309">shift</text>

          <!-- Artifact -->
          <g transform="translate(35, 90)">
            <rect x="-18" y="-16" width="36" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -6 -8 L 6 -8 L 6 8 L -6 8 Z M -6 -2 L 6 -2" stroke="#94a3b8" stroke-width="1" fill="none" />
            <text x="0" y="28" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">revision</text>
          </g>

          <!-- CodeDeploy -->
          <g transform="translate(160, 90)">
            <rect x="-42" y="-26" width="84" height="52" rx="6" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.2" />
            <path d="M -10 0 L -3 0 M 3 0 L 10 0 M -3 -6 L 3 0 L -3 6" fill="none" stroke="#0369a1" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="18" font-size="5.5" text-anchor="middle" font-weight="700" fill="#0369a1">blue / green</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#0369a1">CodeDeploy</text>
          </g>

          <!-- Blue (live) -->
          <g transform="translate(320, 48)"><rect x="-30" y="-14" width="60" height="28" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.6" /><text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#1d4ed8">BLUE v1</text><text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#1e3a8a">live</text></g>
          <!-- Green (new) -->
          <g transform="translate(320, 132)"><rect x="-30" y="-14" width="60" height="28" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.6" /><text x="0" y="-1" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">GREEN v2</text><text x="0" y="8" font-size="5.5" text-anchor="middle" font-weight="700" fill="#065f46">new</text></g>
        </svg>
      `,
  },
  bedrock: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- prompt → bedrock -->
          <path d="M 60 90 L 125 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- bedrock → model choices -->
          <path d="M 215 70 L 290 45" fill="none" stroke="#047857" stroke-width="1.4" stroke-dasharray="3 2" />
          <path d="M 218 90 L 290 90" fill="none" stroke="#047857" stroke-width="1.4" stroke-dasharray="3 2" />
          <path d="M 215 110 L 290 135" fill="none" stroke="#047857" stroke-width="1.4" stroke-dasharray="3 2" />
          <!-- response back -->
          <path d="M 125 108 L 60 108" fill="none" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-left" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 60 90 L 125 90" /></circle>
          <circle r="4" fill="#10b981"><animateMotion dur="1.7s" repeatCount="indefinite" path="M 125 108 L 60 108" /></circle>

          <text x="92" y="124" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">completion</text>

          <!-- Prompt -->
          <g transform="translate(38, 99)">
            <rect x="-18" y="-18" width="36" height="36" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -10 -8 L 10 -8 M -10 -2 L 10 -2 M -10 4 L 4 4" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
            <text x="0" y="14" font-size="5.5" text-anchor="middle" font-weight="700" fill="#475569">prompt</text>
          </g>

          <!-- Bedrock -->
          <g transform="translate(170, 90)">
            <rect x="-42" y="-26" width="84" height="52" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="2.2" />
            <path d="M -14 -2 L -7 -10 L 0 -2 L 7 -10 L 14 -2 L 7 8 L -7 8 Z" fill="#6ee7b7" stroke="#047857" stroke-width="1.2" />
            <text x="0" y="20" font-size="5.5" text-anchor="middle" font-weight="700" fill="#047857">serverless GenAI</text>
            <text x="0" y="40" font-size="7.5" text-anchor="middle" font-weight="800" fill="#047857">Bedrock</text>
          </g>

          <!-- Foundation models -->
          <g transform="translate(322, 45)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Claude</text></g>
          <g transform="translate(322, 90)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Nova</text></g>
          <g transform="translate(322, 135)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Llama</text></g>
          <text x="322" y="163" font-size="5.5" text-anchor="middle" font-weight="700" fill="#065f46">+ 12 more providers</text>
        </svg>
      `,
  },
  sageMaker: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- training data → training job -->
          <path d="M 55 90 L 105 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- training → model artifact -->
          <path d="M 150 90 L 195 90" fill="none" stroke="#047857" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- model → endpoint -->
          <path d="M 240 90 L 285 90" fill="none" stroke="#047857" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- inference -->
          <path d="M 330 75 L 330 45" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 2" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 55 90 L 105 90" /></circle>
          <circle r="4" fill="#047857"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 150 90 L 195 90" /></circle>
          <circle r="4" fill="#047857"><animateMotion dur="1.4s" repeatCount="indefinite" path="M 240 90 L 285 90" /></circle>

          <!-- Training data -->
          <g transform="translate(35, 90)">
            <ellipse cx="0" cy="-8" rx="14" ry="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1.4" />
            <path d="M -14 -8 L -14 6 A 14 4 0 0 0 14 6 L 14 -8" fill="none" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="22" font-size="6" text-anchor="middle" font-weight="800" fill="#065f46">dataset</text>
          </g>

          <!-- Training job -->
          <g transform="translate(127, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="4" fill="#ecfdf5" stroke="#047857" stroke-width="2" />
            <circle cx="-4" cy="-2" r="3" fill="#047857" /><circle cx="6" cy="-6" r="2.5" fill="#10b981" /><circle cx="6" cy="3" r="2.5" fill="#10b981" />
            <line x1="-4" y1="-2" x2="6" y2="-6" stroke="#047857" stroke-width="0.8" /><line x1="-4" y1="-2" x2="6" y2="3" stroke="#047857" stroke-width="0.8" />
            <text x="0" y="27" font-size="5.5" text-anchor="middle" font-weight="800" fill="#047857">train</text>
          </g>

          <!-- Model artifact -->
          <g transform="translate(217, 90)">
            <rect x="-20" y="-16" width="40" height="32" rx="4" fill="#f0fdf4" stroke="#10b981" stroke-width="1.8" />
            <path d="M -6 -6 L 0 -10 L 6 -6 L 6 4 L 0 8 L -6 4 Z" fill="#6ee7b7" stroke="#047857" stroke-width="0.8" />
            <text x="0" y="27" font-size="5.5" text-anchor="middle" font-weight="800" fill="#047857">model</text>
          </g>

          <!-- Endpoint -->
          <g transform="translate(310, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="4" fill="#ecfdf5" stroke="#047857" stroke-width="2" />
            <path d="M -10 0 L 10 0 M 6 -4 L 10 0 L 6 4" stroke="#047857" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <text x="0" y="27" font-size="5.5" text-anchor="middle" font-weight="800" fill="#047857">endpoint</text>
          </g>

          <!-- Inference client -->
          <g transform="translate(330, 30)">
            <rect x="-26" y="-12" width="52" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" />
            <text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Inference</text>
          </g>
        </svg>
      `,
  },
  rekognition: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- image → rekognition -->
          <path d="M 70 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- rekognition → detections -->
          <path d="M 225 70 Q 270 45 305 45" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 305 90" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 110 Q 270 135 305 135" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 90 L 135 90" /></circle>
          <circle r="3.5" fill="#047857"><animateMotion dur="2s" repeatCount="indefinite" path="M 225 70 Q 270 45 305 45" /></circle>
          <circle r="3.5" fill="#047857"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 225 90 L 305 90" /></circle>

          <!-- Input image -->
          <g transform="translate(45, 90)">
            <rect x="-24" y="-18" width="48" height="36" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <circle cx="-8" cy="-6" r="4" fill="#fbbf24" />
            <path d="M -20 12 L -8 -2 L 0 6 L 8 -4 L 20 12 Z" fill="#86efac" stroke="#475569" stroke-width="0.8" />
            <text x="0" y="30" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">image</text>
          </g>

          <!-- Rekognition (vision with bounding boxes) -->
          <g transform="translate(180, 90)">
            <rect x="-42" y="-28" width="84" height="56" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="2.2" />
            <circle cx="0" cy="-4" r="13" fill="none" stroke="#047857" stroke-width="1.6" />
            <circle cx="0" cy="-4" r="5" fill="#6ee7b7" stroke="#047857" stroke-width="1" />
            <rect x="-10" y="-14" width="20" height="20" rx="1" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 1" />
            <text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Rekognition</text>
          </g>

          <!-- Detections -->
          <g transform="translate(340, 45)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Face 99%</text></g>
          <g transform="translate(340, 90)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Object: car</text></g>
          <g transform="translate(340, 135)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Text / OCR</text></g>
        </svg>
      `,
  },
  textract: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- document → textract -->
          <path d="M 70 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- textract → extracted structures -->
          <path d="M 225 70 Q 270 45 305 45" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 305 90" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 110 Q 270 135 305 135" fill="none" stroke="#047857" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 90 L 135 90" /></circle>
          <circle r="3.5" fill="#047857"><animateMotion dur="1.9s" repeatCount="indefinite" path="M 225 90 L 305 90" /></circle>

          <!-- Document (PDF) -->
          <g transform="translate(45, 90)">
            <rect x="-20" y="-22" width="40" height="44" rx="2" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -12 -14 L 12 -14 M -12 -8 L 12 -8 M -12 -2 L 12 -2 M -12 4 L 6 4 M -12 10 L 12 10 M -12 16 L 8 16" stroke="#cbd5e1" stroke-width="1.2" stroke-linecap="round" />
            <text x="0" y="34" font-size="6" text-anchor="middle" font-weight="800" fill="#475569">PDF/scan</text>
          </g>

          <!-- Textract (OCR engine) -->
          <g transform="translate(180, 90)">
            <rect x="-42" y="-28" width="84" height="56" rx="6" fill="#ecfdf5" stroke="#047857" stroke-width="2.2" />
            <path d="M -16 -12 L 16 -12 M -16 -5 L 16 -5 M -16 2 L 8 2" stroke="#047857" stroke-width="1.4" stroke-linecap="round" />
            <rect x="-18" y="-16" width="14" height="22" rx="1" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="2 1" />
            <text x="0" y="20" font-size="6.5" text-anchor="middle" font-weight="800" fill="#047857">Textract</text>
          </g>

          <!-- Extracted -->
          <g transform="translate(340, 45)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Raw text</text></g>
          <g transform="translate(340, 90)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Forms (K/V)</text></g>
          <g transform="translate(340, 135)"><rect x="-32" y="-12" width="64" height="24" rx="3" fill="#f0fdf4" stroke="#10b981" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#065f46">Tables</text></g>
        </svg>
      `,
  },
  mediaConvert: {
    illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- input video → mediaconvert -->
          <path d="M 70 90 L 135 90" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3" class="ill-flow-right" />
          <!-- mediaconvert → output renditions -->
          <path d="M 225 65 Q 270 40 305 40" fill="none" stroke="#b45309" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 90 L 305 90" fill="none" stroke="#b45309" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />
          <path d="M 225 115 Q 270 140 305 140" fill="none" stroke="#b45309" stroke-width="1.6" stroke-dasharray="4 3" class="ill-flow-right" />

          <circle r="4" fill="#6366f1"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 70 90 L 135 90" /></circle>
          <circle r="3.5" fill="#b45309"><animateMotion dur="2s" repeatCount="indefinite" path="M 225 65 Q 270 40 305 40" /></circle>
          <circle r="3.5" fill="#b45309"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 225 90 L 305 90" /></circle>
          <circle r="3.5" fill="#b45309"><animateMotion dur="2.2s" repeatCount="indefinite" path="M 225 115 Q 270 140 305 140" /></circle>

          <!-- Input master video -->
          <g transform="translate(45, 90)">
            <rect x="-22" y="-16" width="44" height="32" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.6" />
            <path d="M -6 -6 L 8 0 L -6 6 Z" fill="#475569" />
            <text x="0" y="28" font-size="5.5" text-anchor="middle" font-weight="800" fill="#475569">master 4K</text>
          </g>

          <!-- MediaConvert -->
          <g transform="translate(180, 90)">
            <rect x="-42" y="-28" width="84" height="56" rx="6" fill="#fffbeb" stroke="#b45309" stroke-width="2.2" />
            <circle cx="-8" cy="-2" r="10" fill="none" stroke="#92400e" stroke-width="1.6" />
            <path d="M -8 -10 L -8 -2 L -2 2" fill="none" stroke="#92400e" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M 4 -8 L 12 -8 L 12 8 L 4 8" fill="none" stroke="#92400e" stroke-width="1.2" />
            <text x="0" y="20" font-size="5.5" text-anchor="middle" font-weight="700" fill="#92400e">transcode · ABR</text>
            <text x="0" y="40" font-size="7" text-anchor="middle" font-weight="800" fill="#b45309">MediaConvert</text>
          </g>

          <!-- Output renditions -->
          <g transform="translate(338, 40)"><rect x="-30" y="-11" width="60" height="22" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#92400e">1080p HLS</text></g>
          <g transform="translate(338, 90)"><rect x="-30" y="-11" width="60" height="22" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#92400e">720p DASH</text></g>
          <g transform="translate(338, 140)"><rect x="-30" y="-11" width="60" height="22" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.4" /><text x="0" y="3" font-size="6.5" text-anchor="middle" font-weight="800" fill="#92400e">480p MP4</text></g>
        </svg>
      `,
  },
};

/** Version history shown on the Release Notes tab. */
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '1.3.1',
    current: true,
    title: 'Expanded AWS Catalog, Accurate Cost Models & Security Hardening',
    summary:
      'Added 10 new AWS services, overhauled cost calculators for realistic billing, refactored codebase structure with Vitest unit tests, and resolved security vulnerabilities.',
    items: [
      {
        icon: 'fas fa-cubes',
        text: '10 New AWS Services: Added Amplify, SES, DocumentDB, Neptune, Timestream, AppConfig, AppMesh, CloudMap, QuickSight, and Lightsail to the service palette.',
      },
      {
        icon: 'fas fa-calculator',
        text: 'Enhanced Cost Accuracy: Granular pricing overrides and secondary configuration parameters for Aurora, Rekognition, MediaConvert, OpenSearch, EMR, MQ, Bedrock, Kinesis, MSK, DynamoDB, RDS, ElastiCache, Lambda, and EC2.',
      },
      {
        icon: 'fas fa-code',
        text: 'Repository Refactoring: Restructured core canvas and graph utilities into clean modules, and introduced comprehensive Vitest unit test suites for all services and utilities.',
      },
      {
        icon: 'fas fa-shield-halved',
        text: 'Security Hardening: Integrated constant-time token verification to prevent timing attacks, strict origin CORS validation, and clamped vote delta ranges on API requests.',
      },
      {
        icon: 'fas fa-bug-slash',
        text: 'Minor Bug Fixes: Implemented resizable canvas sidebars, improved viewport mobile responsiveness, and enhanced unsaved changes warning dialogs.',
      },
    ],
  },
  {
    version: '1.3.0',
    title: 'Themes, Dashboards & System Design Challenges',
    summary:
      'Light and dark themes, an Architect dashboard, refined challenges, and polish throughout.',
    items: [
      {
        icon: 'fas fa-circle-half-stroke',
        text: 'Light & Dark Themes: a polished theme toggle across the whole app',
      },
      {
        icon: 'fas fa-gauge-high',
        text: 'Architect Dashboard: your whole design cost summarized at a glance',
      },
      {
        icon: 'fas fa-graduation-cap',
        text: 'System Design Challenges: Introduced common interview challanges for practice',
      },
      {
        icon: 'fas fa-ranking-star',
        text: 'Rubix Engine: evaluates and scores your system design against best practices',
      },
      {
        icon: 'fas fa-arrows-left-right',
        text: 'Quick Mode Switch: a dropdown to jump between Developer and Architect modes',
      },
      {
        icon: 'fas fa-keyboard',
        text: 'Keyboard Shortcuts: a dedicated panel plus new canvas hotkeys',
      },
      {
        icon: 'fas fa-shield-halved',
        text: 'Exit Warning: never lose an unsaved architecture by accident',
      },
      {
        icon: 'fas fa-users',
        text: 'Top Contributors: recognition for the people shaping the project',
      },
      {
        icon: 'fas fa-magnifying-glass-chart',
        text: 'SEO & GEO: better discoverability across search and AI engines',
      },
      {
        icon: 'fas fa-lock',
        text: 'Security & Community Standards: hardened security and full open source docs',
      },
      { icon: 'fas fa-bug-slash', text: 'Bug fixes and code quality improvements' },
    ],
  },
  {
    version: '1.2',
    title: 'Playground & Real-Time Cost',
    date: '2026-06-15',
    summary:
      'A developer- and architect-focused playground with 70+ services and live AWS pricing.',
    items: [
      {
        icon: 'fas fa-layer-group',
        text: 'Expanded AWS Service Catalog: Model architectures with 70+ hand-crafted AWS services, each with custom properties, input/output port definitions, and visual flow mappings',
      },
      {
        icon: 'fas fa-gamepad',
        text: 'Dual-Mode Workspace: Transition seamlessly between Developer Mode (simplified sandbox for learning cloud concepts) and Architect Mode (professional designer with detailed hardware classes and pricing options)',
      },
      {
        icon: 'fas fa-book-open',
        text: 'Interactive Documentation: Comprehensive, in-app guides for all 64 services detailing Conceptual Models, animated Architectural Workings, Recommended Practices, and common Failure Modes',
      },
      {
        icon: 'fas fa-sack-dollar',
        text: 'Live AWS Cost Estimation: Accurate monthly cost updates driven by real AWS pricing rates fetched weekly from the live AWS Pricing API and updated on the fly',
      },
      {
        icon: 'fas fa-clone',
        text: 'Multi-Canvas Configuration Support: Create, manage, and design multiple independent cloud architectures side-by-side using tabs',
      },
      {
        icon: 'fas fa-wave-square',
        text: 'Variable Traffic Modeling: Model realistic user traffic behavior by configuring minimum/maximum traffic bounds with live, randomized fluctuations',
      },
      {
        icon: 'fas fa-code-branch',
        text: 'Traffic Distribution Manager: Route and manage traffic flows between multiple downstream nodes with custom routing weights or percentages',
      },
      {
        icon: 'fas fa-keyboard',
        text: 'Canvas Keyboard Hotkeys: Accelerate design iterations with shortcuts (e.g., Ctrl+Z/Ctrl+Y for Undo/Redo, Ctrl+S to save, and Delete/Backspace to remove elements)',
      },
      {
        icon: 'fas fa-triangle-exclamation',
        text: 'Realistic Bottleneck Modeling: Advanced multi-factor resource-bound modeling (evaluating queue depths, CPU pressure, and concurrent execution limits) featuring load-shedding and server collapse',
      },
      { icon: 'fas fa-bug-slash', text: 'Minor bug fixes' },
    ],
  },
  {
    version: '1.1',
    date: '2026-05-21',
    title: 'Cost Transparency',
    summary: 'Deeper, more transparent cost modeling and a responsive stats layout.',
    items: [
      { icon: 'fas fa-sliders', text: 'Added in-depth cost calculation parameters' },
      { icon: 'fas fa-magnifying-glass-dollar', text: 'Added cost calculation transparency' },
      {
        icon: 'fas fa-mobile-screen',
        text: 'Compact, responsive run stats for all screen sizes',
      },
      { icon: 'fas fa-circle-info', text: 'Restructured and expanded the About section' },
      { icon: 'fas fa-bug-slash', text: 'Minor bug fixes' },
    ],
  },
  {
    version: '1.0',
    date: 'Initial release',
    title: 'Foundation',
    summary:
      'The first release: drag-and-drop design backed by a deterministic traffic & cost engine.',
    items: [
      {
        icon: 'fas fa-diagram-project',
        text: 'Drag-and-drop AWS architecture design on a live canvas',
      },
      { icon: 'fas fa-bolt', text: 'Real-time deterministic traffic simulation' },
      {
        icon: 'fas fa-gauge-high',
        text: 'Per-node latency, throughput, error-rate & utilization metrics',
      },
      { icon: 'fas fa-coins', text: 'Monthly cost estimation from simulated load' },
      { icon: 'fas fa-circle-check', text: 'Built-in AWS connectivity validation' },
    ],
  },
];

/** Long-form documentation articles grouped by category. */
export const ARTICLES: DocArticle[] = [
  // --- OVERVIEW ---
  {
    id: 'ov-intro',
    title: 'What is Sr. Architect?',
    category: 'overview',
    icon: 'fas fa-info-circle',
    summary:
      'A high-fidelity system design simulator that brings static cloud architecture diagrams to life.',
    content: [
      'Sr. Architect is an interactive, visual system design sandbox that lets you <span class="text-purple">model and simulate AWS cloud architectures</span> in real time without provisioning resources.',
      'Simply drag-and-drop components (like servers, queues, databases, API gateways), connect them, and watch simulated traffic flow through your conduits like glowing packets.',
      'It translates abstract architectural principles into interactive visuals, letting you adjust sliders for traffic load, instance configurations, and replica rates to instantly observe how your topology responds to stress.',
    ],
    tips: [
      'Tap the play button to start generating real-time traffic, and watch the Sandbox Console for transaction logs.',
    ],
  },
  {
    id: 'ov-pulseflow',
    title: 'PulseFlow: Reactive Traffic Simulation Engine',
    category: 'engines',
    icon: 'fas fa-heart-pulse',
    summary:
      'The deterministic heartbeat of Sr. Architect that powers real-time traffic flow, queues, and latency degradation.',
    content: [
      'At the core of the simulator is <span class="text-purple"><strong>PulseFlow</strong></span>, our custom-built, reactive simulation engine. PulseFlow resolves the entire system state about five times a second, translating simple diagram lines into live, dynamic networks.',
      '<div class="engine-svg-wrapper" style="margin: 16px 0; max-width: 100%; overflow: hidden; border-radius: 12px;">' +
      '  <svg viewBox="0 0 560 180" class="engine-illustration-svg" style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; width: 100%; display: block;">' +
      '    <defs>' +
      '      <linearGradient id="pulseflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">' +
      '        <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.8" />' +
      '        <stop offset="100%" stop-color="#ec4899" stop-opacity="0.8" />' +
      '      </linearGradient>' +
      '      <filter id="glow-pf" x="-20%" y="-20%" width="140%" height="140%">' +
      '        <feGaussianBlur stdDeviation="3" result="blur" />' +
      '        <feMerge>' +
      '          <feMergeNode in="blur" />' +
      '          <feMergeNode in="SourceGraphic" />' +
      '        </feMerge>' +
      '      </filter>' +
      '    </defs>' +
      '    <path d="M 60 90 L 220 50" fill="none" stroke="url(#pulseflowGrad)" stroke-width="2.2" stroke-dasharray="4 3" />' +
      '    <path d="M 60 90 L 220 130" fill="none" stroke="url(#pulseflowGrad)" stroke-width="2.2" stroke-dasharray="4 3" />' +
      '    <path d="M 280 50 L 440 90" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5" />' +
      '    <path d="M 280 130 L 440 90" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5" />' +
      '    <circle r="4.5" fill="#ec4899" filter="url(#glow-pf)">' +
      '      <animateMotion dur="2.2s" repeatCount="indefinite" path="M 60 90 L 220 50" />' +
      '    </circle>' +
      '    <circle r="4.5" fill="#a78bfa" filter="url(#glow-pf)">' +
      '      <animateMotion dur="2.8s" repeatCount="indefinite" path="M 60 90 L 220 130" />' +
      '    </circle>' +
      '    <circle r="3.5" fill="#94a3b8" opacity="0.6">' +
      '      <animateMotion dur="2.2s" repeatCount="indefinite" path="M 280 50 L 440 90" />' +
      '    </circle>' +
      '    <g transform="translate(60, 90)">' +
      '      <circle r="22" fill="#1e1b4b" stroke="#a78bfa" stroke-width="1.5" />' +
      '      <text y="4" text-anchor="middle" font-size="10" font-weight="800" fill="#a78bfa" font-family="monospace">USERS</text>' +
      '    </g>' +
      '    <g transform="translate(250, 50)">' +
      '      <rect x="-30" y="-18" width="60" height="36" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="1.5" />' +
      '      <text y="4" text-anchor="middle" font-size="9" font-weight="700" fill="#22c55e" font-family="monospace">EC2: OK</text>' +
      '    </g>' +
      '    <g transform="translate(250, 130)">' +
      '      <rect x="-30" y="-18" width="60" height="36" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />' +
      '      <circle cx="-20" cy="-10" r="3" fill="#ef4444">' +
      '        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />' +
      '      </circle>' +
      '      <text y="4" text-anchor="middle" font-size="9" font-weight="700" fill="#ef4444" font-family="monospace">EC2: 150%</text>' +
      '      <rect x="-24" y="8" width="48" height="4" rx="2" fill="#ef4444" />' +
      '    </g>' +
      '    <g transform="translate(470, 90)">' +
      '      <circle r="22" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />' +
      '      <text y="4" text-anchor="middle" font-size="10" font-weight="800" fill="#3b82f6" font-family="monospace">RDS</text>' +
      '    </g>' +
      '  </svg>' +
      '</div>',
      '<ul>' +
      '<li><span class="text-purple"><strong>Reactive 180ms Tick Loop:</strong></span> Driven by RxJS stream flows, PulseFlow traverses your canvas topology in logical flow order, ensuring that upstream request loads and bottleneck pressures cascade accurately down to child nodes.</li>' +
      '<li><span class="text-blue"><strong>Compounding Latency & Backlogs:</strong></span> Rather than simple static averages, PulseFlow calculates request queues over time. If a service experiences traffic past its capacity, latency compounds exponentially tick-by-tick, simulating realistic system degradation.</li>' +
      '<li><span class="text-red"><strong>Hard Server Collapses:</strong></span> Models physical compute failure thresholds (EC2, ECS, RDS). If load exceeds 150% of capacity for over 1 second, PulseFlow shuts down the server into a terminal offline state, forcing user intervention.</li>' +
      '<li><span class="text-emerald"><strong>Visual Flow Telemetry:</strong></span> Translates mathematical saturation rates into color-coded SVG packets that represent data throughput on the canvas.</li>' +
      '</ul>',
      '<h3>Realism Modeling & Mathematical Assumptions</h3>' +
      '<p>To simulate actual cloud hardware limits, the PulseFlow engine uses several mathematical constants and behaviors:</p>' +
      '<ul>' +
      '<li><span class="text-purple"><strong>Dynamic Workloads (Random Walk):</strong></span> Client nodes simulate user traffic noise by sampling and varying request rates every 1.08 seconds (6 ticks @ 180ms). Cost metrics adapt to this downstream dynamic rate.</li>' +
      '<li><span class="text-red"><strong>Sustained Pressure Collapses:</strong></span> Compute resources tolerate short, transient load spikes. However, sustained overload past 1.1s (<code>OFFLINE_SUSTAIN_TICKS = 6</code>) crashes the resource into an offline state.</li>' +
      '<li><span class="text-emerald"><strong>Auto Scaling Provisioning Delay:</strong></span> Provisioning replacement instances takes time. A collapsed node remains in a booting loop and only recovers if incoming demand is below 72% capacity (<code>RECOVERY_HEADROOM = 0.72</code>) for at least 1.8 seconds (<code>RECOVERY_TICKS = 10</code>).</li>' +
      '<li><span class="text-orange"><strong>M/M/1 Queue Backlog Bounds:</strong></span> Queues buffer spikes but clamp backlog sizes to 8 ticks-worth of capacity (<code>MAX_QUEUE_TICKS = 8</code>) to prevent infinite queue growth. Once relieved, backlog queues decay exponentially at a 0.6 multiplier per tick (~40% decay rate per 180ms tick).</li>' +
      '</ul>',
    ],
    tips: [
      'Toggle the Pause button on the canvas toolbar to freeze PulseFlow mid-tick and trace precise bottlenecks.',
    ],
  },
  {
    id: 'ov-rubix',
    title: 'Rubix: Automated Architecture Rubric Engine',
    category: 'engines',
    icon: 'fas fa-cubes',
    summary:
      'The declarative verification engine that grades system designs, checks connection legality, and tracks milestone progress.',
    content: [
      '<span class="text-orange"><strong>Rubix</strong></span> is our custom-designed, declarative validation and grading engine. It reads your visual canvas and evaluates the architectural structural design against complex engineering constraints.',
      '<div class="engine-svg-wrapper" style="margin: 16px 0; max-width: 100%; overflow: hidden; border-radius: 12px;">' +
      '  <svg viewBox="0 0 560 180" class="engine-illustration-svg" style="background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; width: 100%; display: block;">' +
      '    <defs>' +
      '      <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">' +
      '        <feGaussianBlur stdDeviation="3" result="blur" />' +
      '        <feMerge>' +
      '          <feMergeNode in="blur" />' +
      '          <feMergeNode in="SourceGraphic" />' +
      '        </feMerge>' +
      '      </filter>' +
      '    </defs>' +
      '    <line x1="280" y1="90" x2="100" y2="40" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6" />' +
      '    <line x1="280" y1="90" x2="100" y2="90" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6" />' +
      '    <line x1="280" y1="90" x2="100" y2="140" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6" />' +
      '    <line x1="280" y1="90" x2="460" y2="90" stroke="#3b82f6" stroke-width="2" />' +
      '    <g transform="translate(280, 90)">' +
      '      <circle r="30" fill="#1e1e38" stroke="#a78bfa" stroke-width="2" />' +
      '      <polygon points="0,-18 16,-6 10,12 -10,12 -16,-6" fill="none" stroke="#a78bfa" stroke-width="1.5">' +
      '        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />' +
      '      </polygon>' +
      '      <text y="4" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" font-family="monospace">RUBIX</text>' +
      '    </g>' +
      '    <g transform="translate(100, 40)">' +
      '      <rect x="-55" y="-12" width="110" height="24" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="1.2" />' +
      '      <path d="M -45 -3 L -39 3 M -39 -3 L -45 3" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />' +
      '      <text x="12" y="3" text-anchor="middle" font-size="8.5" font-weight="700" fill="#ef4444" font-family="monospace">hasService (APIGW)</text>' +
      '    </g>' +
      '    <g transform="translate(100, 90)">' +
      '      <rect x="-55" y="-12" width="110" height="24" rx="12" fill="#0f172a" stroke="#22c55e" stroke-width="1.2" />' +
      '      <path d="M -45 -1 L -43 2 L -39 -3" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" />' +
      '      <text x="12" y="3" text-anchor="middle" font-size="8.5" font-weight="700" fill="#22c55e" font-family="monospace">hasEdge (ELB->EC2)</text>' +
      '    </g>' +
      '    <g transform="translate(100, 140)">' +
      '      <rect x="-55" y="-12" width="110" height="24" rx="12" fill="#0f172a" stroke="#22c55e" stroke-width="1.2" />' +
      '      <path d="M -45 -1 L -43 2 L -39 -3" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" />' +
      '      <text x="12" y="3" text-anchor="middle" font-size="8.5" font-weight="700" fill="#22c55e" font-family="monospace">countAtLeast (EC2>=2)</text>' +
      '    </g>' +
      '    <g transform="translate(460, 90)">' +
      '      <rect x="-40" y="-25" width="80" height="50" rx="8" fill="#111827" stroke="#3b82f6" stroke-width="1.5" />' +
      '      <text y="-8" text-anchor="middle" font-size="8" font-weight="800" fill="#94a3b8" font-family="sans-serif">GRADE REPORT</text>' +
      '      <text y="15" text-anchor="middle" font-size="20" font-weight="950" fill="#3b82f6" font-family="monospace" filter="url(#glow-orange)">85/100</text>' +
      '    </g>' +
      '  </svg>' +
      '</div>',
      '<ul>' +
      '<li><span class="text-orange"><strong>Declarative Rule Grammar:</strong></span> Rubix parses a custom JSON rule language (supporting <code>hasService</code>, <code>hasEdge</code>, <code>configAtLeast</code>, <code>countAtLeast</code>, and <code>noOverload</code>) to validate designs without any procedural code modifications.</li>' +
      '<li><span class="text-purple"><strong>Automated Live Grading:</strong></span> Instantly computes a 0-100 score based on weighted check criteria, automatically isolating bonus points (such as configuring read replicas) and applying score penalties for overloaded components.</li>' +
      '<li><span class="text-blue"><strong>Milestone Tracking:</strong></span> Evaluates progress against ordered checkpoints in real time as you draw, providing immediate hints and guidance to lead the user toward optimal design goals.</li>' +
      '<li><span class="text-emerald"><strong>Connection Legality Checker:</strong></span> Rubix scans your active connections against AWS service specifications (defined in <code>aws-services.json</code>) to immediately flag illegal port connections (like wiring a public client directly to an internal DB).</li>' +
      '</ul>',
    ],
    tips: [
      'Run `npm run validate:challenges` in the frontend directory to run the Rubix engine locally and verify all design challenges.',
    ],
  },
  {
    id: 'ov-gaps',
    title: 'Problems Solved & Gaps Filled',
    category: 'overview',
    icon: 'fas fa-puzzle-piece',
    summary:
      'Fills the massive gap between static draw boards and expensive live deployment testing.',
    content: [
      '<ul>' +
      '<li><span class="text-purple"><strong>Static Diagrams vs. Dynamic Reality</strong></span><br>' +
      'Traditional tools like Draw.io create nice pictures, but they cannot tell you when a server will crash, when a database queue will bottleneck, or how much latency your users will experience. Sr. Architect solves this by running a custom tick-based traffic engine that dynamically calculates bottlenecks, drop rates, and server overload state in real time.</li>' +
      '<li><span class="text-orange"><strong>The Cost and Complexity of Testing</strong></span><br>' +
      'Provisioning real AWS environments to run load tests is incredibly slow, expensive, and risky. Sr. Architect fills this gap by giving you a zero-cost sandbox to experiment instantly. Validate failure-recovery scenarios (like SQS decoupling or RDS replica scaling) in seconds, with absolutely zero AWS bills.</li>' +
      '<li><span class="text-blue"><strong>Hidden Billing Surprises</strong></span><br>' +
      'Traditional tools do not connect drawing with financial realities. Sr. Architect integrates live cost estimators that factor in instance classes, database EBS IOPS, and serverless invocations with real-world regional modifiers, protecting developers from costly architecture designs.</li>' +
      '</ul>',
    ],
  },
  {
    id: 'ov-roadmap',
    title: 'Upcoming Features & Future Roadmap',
    category: 'overview',
    icon: 'fas fa-rocket',
    summary: 'A sneak peek into our game-changing upcoming updates and next-gen capabilities.',
    content: [
      'We are building revolutionary capabilities to close the gap between drawing architectures, validating cost, and finding the most optimized solution for your organization. Here is a sneak peek at what is coming:',
      '<ul>' +
      '<li><span class="text-purple"><strong>1. Terraform State Imports (Coming Soon)</strong></span><br>' +
      'What it offers: Upload any <code>.tf</code> configuration or <code>terraform.tfstate</code> file, and watch Sr. Architect automatically parse, map, and draw the entire AWS infrastructure onto the canvas instantly. No manual dragging required get a fully composed, stress-testable simulation environment in under 5 seconds!</li>' +
      '<li><span class="text-orange"><strong>2. AI-Powered Architecture Suggestions (Game Changer!)</strong></span><br>' +
      'What it offers: Input your personalized business usecase, and our integrated AI agent will analyze your visual canvas topology. It provides tailored cost-performance optimizations such as recommending Lambda serverless transitions, adjusting database IOPS queues, or scaling ECS container replica thresholds to fit your usecase perfectly.</li>' +
      '<li><span class="text-blue"><strong>3. AI Multi-Cloud Builder & Comparative Benchmarking</strong></span><br>' +
      'What it offers: Ever wondered if GCP or Azure would be better for your usecase? Our AI engine translates your active AWS blueprint into exact equivalent architectures on <code>Google Cloud Platform (GCP)</code> and <code>Microsoft Azure</code>. It runs side-by-side cost and performance comparisons, advising you which cloud provider delivers the absolute best value and scalability for your business.</li>' +
      '</ul>',
    ],
  },
  // --- GETTING STARTED ---
  {
    id: 'gs-builder',
    title: 'Guided Visual Builder',
    category: 'start',
    icon: 'fas fa-project-diagram',
    summary: 'Learn how to compose architectures easily using drag-and-drop mechanics.',
    content: [
      'Welcome to Sr. Architect! Building AWS architectures starts with the <strong>Left Service Palette</strong>.',
      'To build your first topology, follow these simple steps:',
      '<ul>' +
      '<li><strong>Drag and Drop:</strong> Pull any available AWS service onto the high-tech 2D visual canvas to instantiate it.</li>' +
      '<li><strong>Make Connections:</strong> Each service has input and output ports. Hover over an output port (colored circle) and drag a link directly to an input port on another service.</li>' +
      '<li><strong>Validation Check:</strong> The builder automatically runs architectural validation rules. If a link or service configuration is invalid, a red health card will warn you exactly what is wrong.</li>' +
      '<li><strong>Delete Elements:</strong> To delete a service or link, simply select it and press the <code>Backspace</code> or <code>Delete</code> key.</li>' +
      '</ul>',
    ],
    tips: [
      'Pressing the Ctrl / Command key allows you to multi-select nodes on the canvas.',
      'You can double-click on empty canvas space to place custom annotations/sticky notes.',
    ],
  },
  {
    id: 'gs-modes',
    title: 'Developer vs. Architect Modes',
    category: 'start',
    icon: 'fas fa-user-gear',
    summary:
      'Understand the difference between the beginner-friendly Developer mode and the advanced Architect mode.',
    content: [
      'Sr. Architect supports two experience modes tailored for different experience levels:',
      '<ul>' +
      '<li><span class="text-emerald"><strong>Developer Mode:</strong></span> Focused on system design learning. It simplifies the palette to 24+ core AWS services, simplifies configuration sliders, and disables granular billing complexity. Ideal for learning system behaviors and traffic flow dynamics.</li>' +
      '<li><span class="text-purple"><strong>Architect Mode:</strong></span> Focused on professional production-scale design. It exposes 65+ AWS services, adds deep configuration fields (LCU factors, compute classes, EBS types), and opens full cost breakdowns.</li>' +
      '</ul>',
      'Toggle modes on the launch dashboard. Your progress is synced and saved in your browser storage so you never lose your designs.',
    ],
  },
  {
    id: 'gs-hotkeys',
    title: 'Keyboard Shortcuts',
    category: 'start',
    icon: 'fas fa-keyboard',
    summary:
      'Work faster on the canvas with undo/redo, quick save, multi-select, and deletion hotkeys.',
    content: [
      'The simulator canvas supports keyboard shortcuts for the most common actions. On macOS, use <code>⌘ Cmd</code> wherever <code>Ctrl</code> is listed.',
      '<table class="hotkey-table">' +
      '<thead><tr><th>Shortcut</th><th>Action</th></tr></thead>' +
      '<tbody>' +
      '<tr><td><kbd>Ctrl</kbd> + <kbd>Z</kbd></td><td>Undo the last change (add, delete, connect, move, rename, or config edit)</td></tr>' +
      '<tr><td><kbd>Ctrl</kbd> + <kbd>Y</kbd> <span class="hk-or">or</span> <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></td><td>Redo the change you just undid</td></tr>' +
      '<tr><td><kbd>Ctrl</kbd> + <kbd>S</kbd></td><td>Save the current architecture to browser storage</td></tr>' +
      '<tr><td><kbd>Delete</kbd> <span class="hk-or">or</span> <kbd>Backspace</kbd></td><td>Delete the selected service(s), connection(s), or note(s)</td></tr>' +
      '<tr><td><kbd>Ctrl</kbd> / <kbd>Shift</kbd> + drag</td><td>Draw a selection box to multi-select nodes and links</td></tr>' +
      '<tr><td>Scroll / pinch</td><td>Zoom the canvas in and out</td></tr>' +
      '<tr><td>Double-click a canvas tab</td><td>Rename that canvas; <kbd>Enter</kbd> confirms, <kbd>Esc</kbd> cancels</td></tr>' +
      '</tbody></table>',
      'Undo history holds the last 60 changes per canvas and is cleared when you switch tabs or load a different project. Rapid edits (like dragging a slider or moving a node) collapse into a single undo step. Undo and redo are paused while a simulation is running; stop the run first.',
    ],
    tips: [
      'While typing in a text field or note, <kbd>Ctrl</kbd> + <kbd>Z</kbd> performs normal text undo instead of canvas undo.',
      'The circular undo/redo arrows in the top toolbar do the same thing and show when actions are available.',
    ],
  },

  // --- SIMULATOR CORE ---
  {
    id: 'sim-flow',
    title: 'Real-Time Traffic flow',
    category: 'sim',
    icon: 'fas fa-wave-square',
    summary: 'Understand how request packets move through your architecture in real time.',
    content: [
      'Once you click the Run play button, the Users node starts generating active data packets.',
      '<ul>' +
      "<li><strong>Glowing Packets:</strong> Traffic flows down visual paths as glowing packets. The rate of requests is determined by the Users node's <code>Request Rate</code> slider.</li>" +
      '<li><strong>Simulation Ticks:</strong> The engine updates at a steady 60 FPS, resolving queues, packet transfers, and database queries dynamically.</li>' +
      "<li><strong>Degradation:</strong> If a server gets overloaded (exceeding its capacity limit), you'll watch packets stack up, latency climb, or requests fail and drop on the live dashboard.</li>" +
      '</ul>',
    ],
    tips: [
      'Toggle the Pause button to freeze the data packets mid-conduit for fine-grained tracing.',
      'Watch the sparkline graph in the telemetry overlay to see real-time latency fluctuations.',
    ],
  },
  {
    id: 'sim-telemetry',
    title: 'Sandbox Consoles & Logs',
    category: 'sim',
    icon: 'fas fa-terminal',
    summary: 'Utilize active console logs and telemetry dials to diagnose backend bottlenecks.',
    content: [
      'The Sandbox Console logs all operational transactions in real time at the bottom-left.',
      '<ul>' +
      '<li><span class="text-emerald">Success Logs (Green):</span> Indicate healthy <code>HTTP 200</code> transactions reaching databases or consumers.</li>' +
      '<li><span class="text-orange">Error Logs (Red):</span> Display overload failures, connection timeouts, or service integration faults.</li>' +
      '<li><span class="text-purple">Telemetry Feed (Top-Right):</span> Acts as your real-time cloud dashboard. It charts Latency, Requests Per Second (RPS), and total Error count across your cloud blueprint.</li>' +
      '</ul>',
    ],
  },
  {
    id: 'sim-bottlenecks',
    title: 'Bottlenecks & Collapses',
    category: 'sim',
    icon: 'fas fa-skull-crossbones',
    summary:
      'Understand the multi-factor bottleneck simulation, load shedding, and failure modes.',
    content: [
      'Rather than checking raw Requests-per-Second (RPS) thresholds, Sr. Architect simulates resource bottlenecks based on actual hardware limits and architecture behavior:',
      '<ul>' +
      '<li><span class="text-purple"><strong>Multi-Factor Saturation:</strong></span> Nodes saturate when concurrent query queues, CPU pressure, or physical limits (like DB parallel queries, EC2 vCPU threads, or Lambda reserved concurrency) are exceeded.</li>' +
      '<li><span class="text-orange"><strong>Load Shedding & Throttling:</strong></span> Fully managed or serverless services (such as API Gateway, SQS, or DynamoDB) shed excess load. They return transient <code>HTTP 429 Too Many Requests</code> or <code>503 Service Unavailable</code> errors but remain online and recover immediately when traffic drops.</li>' +
      '<li><span class="text-red"><strong>Hard Collapse (Offline States):</strong></span> Compute-bound resources (like EC2 instances, ECS container tasks, or RDS database connections) model physical failure. If sustained overload exceeds 150% capacity for over 1 second (6 simulation ticks), the node collapses into a terminal <code>offline</code> state (e.g. CPU exhaustion, connection pool exhaustion) and must be stopped and restarted.</li>' +
      '<li><span class="text-blue"><strong>Cascading Failures:</strong></span> When an upstream service goes offline or is overloaded, its failed state propagates downstream. Any dependent microservices will lose incoming traffic, visualizing a realistic system-wide collapse.</li>' +
      '</ul>',
    ],
  },

  // --- FORMULAS & CALCULATIONS ---
  {
    id: 'formula-engine',
    title: 'The 180ms Heartbeat',
    category: 'formulas',
    icon: 'fas fa-heart-pulse',
    summary: 'How the engine recalculates your entire system about five times a second.',
    content: [
      'Every architecture you draw runs on one simple loop. Roughly every <code>180ms</code>, about five times a second, the engine wakes up, walks your whole graph, and recomputes traffic, latency, pressure and cost for every node. Each pass is called a <strong>tick</strong>.',
      '<ul>' +
      '<li><span class="text-purple"><strong>Producers before consumers:</strong></span> each tick visits nodes in <em>flow order</em> (a topological sort), so a node always sees its full upstream traffic before it runs. Fan-outs and fan-ins stay accurate.</li>' +
      '<li><span class="text-blue"><strong>Fresh each tick, but with memory:</strong></span> incoming traffic is recomputed from scratch every tick, yet two things deliberately carry over: each node\'s request <strong>queue</strong> and its accumulated <strong>overload latency</strong>. That memory is what makes congestion build and then drain over time.</li>' +
      '<li><span class="text-emerald"><strong>Nothing is hand-set:</strong></span> during a run no number is faked. Capacity, demand, latency, CPU and cost are all <em>derived</em> from the formulas in this section.</li>' +
      '</ul>',
    ],
    tips: ['Hit Pause to freeze a single tick and read the exact numbers each node resolved.'],
  },
  {
    id: 'formula-capacity',
    title: 'Capacity: How Much Can a Node Take?',
    category: 'formulas',
    icon: 'fas fa-gauge-high',
    summary:
      'The ceiling each service can serve before it struggles, and why it is rarely just "RPS".',
    content: [
      'Picture every node as a <strong>kitchen</strong>: capacity is how many orders its cooks can plate per second. Push more than that and orders pile up. Capacity is computed differently per service, because real services bottleneck on different resources:',
      '<ul>' +
      '<li><span class="text-purple"><strong>Lambda (concurrency-bound):</strong></span> <code>capacity = reserved concurrency ÷ execution time(s)</code>. A 200ms function with 100 concurrency serves ~500 rps.</li>' +
      '<li><span class="text-orange"><strong>EC2 / ECS (compute-bound):</strong></span> <code>capacity = tasks × vCPU × concurrency-per-vCPU ÷ request time(s)</code>.</li>' +
      '<li><span class="text-blue"><strong>RDS (connection-bound):</strong></span> <code>capacity = parallel queries ÷ query time(s)</code>. Parallel queries are capped by CPU cores (not raw max-connections) and lifted by read replicas.</li>' +
      '<li><span class="text-emerald"><strong>ElastiCache / OpenSearch:</strong></span> scale with <code>node count × per-node op/query rate</code>.</li>' +
      '<li><strong>S3:</strong> effectively unbounded, so it is never the bottleneck.</li>' +
      '</ul>',
      'This is why a slow 500ms function saturates at a far lower request rate than a fast 10ms one, even with identical concurrency. The cooks are simply tied up longer per order.',
    ],
  },
  {
    id: 'formula-demand',
    title: 'Demand, Queue & the Overload Ratio',
    category: 'formulas',
    icon: 'fas fa-arrow-trend-up',
    summary:
      'How incoming traffic, backlog and capacity combine into one "how cooked is this node?" number.',
    content: [
      'Each tick a node works out how much it is facing versus how much it can clear:',
      '<ul>' +
      '<li><code>total demand = incoming rps + leftover queue</code>: new orders plus the existing backlog.</li>' +
      '<li><code>processed = min(total demand, capacity)</code>: you can only plate as fast as the cooks allow.</li>' +
      '<li><code>queue = total demand − processed</code>: whatever could not be served waits in line.</li>' +
      '<li><span class="text-orange"><code>overload ratio = total demand ÷ capacity</code></span> is the single most important number. <code>1.0</code> = exactly full; <code>2.0</code> = twice what the node can handle.</li>' +
      '</ul>',
      'When a node fans out to several children, each edge carries a share set by its <strong>traffic weight</strong>: <code>load = processed × (weight ÷ 100)</code>. That is how you model a 90/10 canary or a 70/30 pool split.',
      "The queue is deliberately <strong>capped</strong> at a few seconds' worth of capacity. Without a cap, a node that briefly overloaded would hoard an impossible backlog and never look healthy again. The cap lets it recover the instant traffic eases.",
    ],
  },
  {
    id: 'formula-latency',
    title: 'Latency: Why Milliseconds Climb to Minutes',
    category: 'formulas',
    icon: 'fas fa-stopwatch',
    summary: 'The exact formula behind the ms / s / min ticking up on an overloaded node.',
    content: [
      'Latency is the headline number on every node, and it is just a sum of intuitive parts:',
      '<code>latency = base + queue-wait + load-penalty + overload-climb − cache-savings</code>',
      '<ul>' +
      "<li><strong>Base:</strong> the node's own processing time at rest (its <code>Base Latency</code> param).</li>" +
      '<li><strong>Queue-wait</strong> <code>= min(500, queue × 0.5)</code> is time spent waiting in line, capped so it never dominates on its own.</li>' +
      '<li><span class="text-orange"><strong>Load-penalty</strong> <code>= overload ratio × 18</code></span> is a steady tax for running hot.</li>' +
      '<li><span class="text-emerald"><strong>Cache-savings:</strong></span> CloudFront / ElastiCache / API Gateway subtract <code>cache hit rate × 0.28</code>.</li>' +
      '</ul>',
      'The <strong>overload-climb</strong> is the part that makes a stuck node feel real. While a node stays past capacity, this penalty <em>compounds</em> every tick: <code>next = (previous + (overload ratio − 1) × 12) × 1.12</code>. So latency does not plateau. It escalates milliseconds → seconds → minutes the longer overload lasts. The moment load drops back under capacity it decays ~40% per tick and the node visibly recovers.',
      'It cannot climb forever. It is capped at the <strong>request timeout</strong> (default 60s). Hitting that means requests are timing out, which sheds the backlog and, for real hardware, tips the node offline (see the next article).',
      '<em>Example:</em> a 50ms node held at <code>2×</code> overload starts around a few hundred ms, then compounds upward through seconds toward the 60s timeout if the pressure is sustained.',
    ],
    tips: [
      'These multipliers (× 0.5, × 18, × 1.12) are tuned for a readable, realistic feel on a 180ms tick. They are a behavioural model, not measured AWS numbers.',
    ],
  },
  {
    id: 'formula-health',
    title: 'Health States & the Point of Collapse',
    category: 'formulas',
    icon: 'fas fa-heart-crack',
    summary:
      'The thresholds that turn a node green → amber → red, and when it goes dark for good.',
    content: [
      "A node's colour is decided purely by the numbers above, mainly the overload ratio and CPU pressure:",
      '<ul>' +
      '<li><span class="text-emerald"><strong>Normal:</strong></span> overload ratio below ~0.78, comfortable headroom.</li>' +
      '<li><span class="text-orange"><strong>Busy:</strong></span> ratio above ~0.78 (or CPU > 66%). <em>Exactly at capacity (ratio = 1.0) a node is Busy, not Overloaded.</em></li>' +
      '<li><span class="text-red"><strong>Overloaded:</strong></span> ratio above ~1.12 (or CPU > 84%), shedding load with latency climbing.</li>' +
      '<li><span class="text-red"><strong>Offline:</strong></span> sustained collapse, the node goes dark.</li>' +
      '</ul>',
      'Pressure gauges have their own formulas: <code>CPU = baseline × 0.45 + overload ratio × 58</code>, while memory rises with the queue (for Lambda it is concurrency utilisation instead).',
      "Whether a node can actually go <strong>offline</strong> depends on its class, the same split shown in every service's <strong>Bottleneck &amp; Capacity</strong> card:",
      '<ul>' +
      '<li><span class="text-orange"><strong>Throttle services</strong></span> (Lambda, API Gateway, SQS, DynamoDB…) shed excess as <code>HTTP 429/503</code> and <strong>stay up</strong>. They return errors and recover, never going dark.</li>' +
      '<li><span class="text-red"><strong>Resource-bound services</strong></span> (EC2, ECS, RDS…) model real hardware. Stay past the offline threshold for ~1 second (6 ticks), <em>or</em> pin latency at the request timeout, and they <strong>collapse offline</strong>, cascading to everything downstream.</li>' +
      '</ul>',
    ],
  },
  {
    id: 'formula-cost',
    title: 'Cost: The Live Monthly Bill',
    category: 'formulas',
    icon: 'fas fa-coins',
    summary: 'How the side panel turns your design into real dollars using live AWS rates.',
    content: [
      'While traffic flows, the same loop prices your architecture from <strong>real AWS Price List API rates</strong> (refreshed weekly). Every service has its own formula; a few favourites:',
      '<ul>' +
      '<li><span class="text-purple"><strong>Lambda:</strong></span> <code>(invocations × $/M requests) + (GB-seconds × $/GB-s)</code>, where <code>GB-seconds = invocations × duration(s) × memory(GB)</code>.</li>' +
      '<li><span class="text-orange"><strong>EC2:</strong></span> <code>instances × hourly rate × 730 hrs</code> (+ EBS storage + data transfer).</li>' +
      '<li><span class="text-blue"><strong>Requests (API Gateway, etc.):</strong></span> tiered <code>$ per million requests</code>.</li>' +
      '<li><span class="text-emerald"><strong>Storage:</strong></span> <code>GB × $/GB-month</code>, by storage class.</li>' +
      '</ul>',
      'Free-tier allowances are subtracted and shown as a separate green badge, so you can see exactly what you are saving. Switch on <strong>Variable Traffic</strong> and the panel reports both the <em>average</em> and the <em>peak</em> monthly cost.',
    ],
  },

  // --- COST DYNAMICS ---
  {
    id: 'cost-estimation',
    title: 'Regional Costs & Multipliers',
    category: 'cost',
    icon: 'fas fa-money-bill-wave',
    summary: 'Understand AWS regional multipliers, cost breakdowns, and currency conversions.',
    content: [
      'The cost simulator maps real AWS billing pricing tables with dynamic geographic adjustments.',
      '<ul>' +
      '<li><strong>Fine-Grained Regional Multipliers:</strong> Cloud costs differ heavily based on geography and service type. Instead of a single multiplier, Sr. Architect loads a dedicated JSON configuration file for each region (e.g. <code>us-west-1.json</code>).</li>' +
      '<li><strong>Per-Service, Per-Parameter Flexibility:</strong> Each region JSON specifies multipliers for all 64+ AWS services and their individual cost-impacting parameters (like requests, CPU cores, GB storage, and data transfer). This allows you to customize and track cost structures with absolute precision.</li>' +
      '<li><strong>Default Adjustments:</strong> By default, service parameters inherit standard regional multipliers (e.g., <code>us-east-1</code> at 1.0x, <code>us-west-1</code> at 1.10x, <code>sa-east-1</code> at 1.38x).</li>' +
      '<li><strong>Currency Switching:</strong> Tap currency conversions live (USD, EUR, INR, GBP, JPY) to see local pricing equivalents instantly in the telemetry footer.</li>' +
      '</ul>',
    ],
  },
];
