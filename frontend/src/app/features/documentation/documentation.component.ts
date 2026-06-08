import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AwsCatalogService } from '../../core/services/aws-catalog.service';
import { AwsServiceDefinition, AwsServiceType } from '../../core/models/architecture.model';
import awsServicesConfig from '../../core/config/aws-services.json';
import serviceDocsData from '../../core/data/service-documentation.json';

interface DocArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string[];
  tips?: string[];
}

interface ServiceDoc {
  whyNeeded: string;
  beginnerExplanation: string;
  whenToUse: string;
  whenNotToUse: string;
  practicalExample: string;
  keyCapabilities: string[];
  useCases: string[];
  illustrationSvg: SafeHtml;
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit, AfterViewChecked, OnDestroy {
  searchQuery = '';
  activeCategoryId = 'overview';

  readonly categories = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-eye' },
    { id: 'start', name: 'Getting Started', icon: 'fas fa-play' },
    { id: 'services', name: 'Services', icon: 'fas fa-layer-group' },
    { id: 'sim', name: 'Simulator Core', icon: 'fas fa-bolt' },
    { id: 'compute', name: 'Compute', icon: 'fas fa-server' },
    { id: 'storage', name: 'Storage & DB', icon: 'fas fa-database' },
    { id: 'integration', name: 'Integration', icon: 'fas fa-network-wired' },
    { id: 'cost', name: 'Cost Dynamics', icon: 'fas fa-coins' }
  ];

  readonly articles: DocArticle[] = [
    // --- OVERVIEW ---
    {
      id: 'ov-intro',
      title: 'What is Sr. Architect?',
      category: 'overview',
      icon: 'fas fa-info-circle',
      summary: 'A high-fidelity system design simulator that brings static cloud architecture diagrams to life.',
      content: [
        'Sr. Architect is an interactive, visual system design sandbox that lets you <span class="text-purple">model and simulate AWS cloud architectures</span> in real time without provisioning resources.',
        'Simply drag-and-drop components (like servers, queues, databases, API gateways), connect them, and watch simulated traffic flow through your conduits like glowing packets.',
        'It translates abstract architectural principles into interactive visuals, letting you adjust sliders for traffic load, instance configurations, and replica rates to instantly observe how your topology responds to stress.'
      ],
      tips: [
        'Tap the play button to start generating real-time traffic, and watch the Sandbox Console for transaction logs.'
      ]
    },
    {
      id: 'ov-gaps',
      title: 'Problems Solved & Gaps Filled',
      category: 'overview',
      icon: 'fas fa-puzzle-piece',
      summary: 'Fills the massive gap between static draw boards and expensive live deployment testing.',
      content: [
        '<ul>' +
        '<li><span class="text-purple"><strong>Static Diagrams vs. Dynamic Reality</strong></span><br>' +
        'Traditional tools like Draw.io create nice pictures, but they cannot tell you when a server will crash, when a database queue will bottleneck, or how much latency your users will experience. Sr. Architect solves this by running a custom tick-based traffic engine that dynamically calculates bottlenecks, drop rates, and server overload state in real time.</li>' +
        '<li><span class="text-orange"><strong>The Cost and Complexity of Testing</strong></span><br>' +
        'Provisioning real AWS environments to run load tests is incredibly slow, expensive, and risky. Sr. Architect fills this gap by giving you a zero-cost sandbox to experiment instantly. Validate failure-recovery scenarios (like SQS decoupling or RDS replica scaling) in seconds, with absolutely zero AWS bills.</li>' +
        '<li><span class="text-blue"><strong>Hidden Billing Surprises</strong></span><br>' +
        'Traditional tools do not connect drawing with financial realities. Sr. Architect integrates live cost estimators that factor in instance classes, database EBS IOPS, and serverless invocations with real-world regional modifiers, protecting developers from costly architecture designs.</li>' +
        '</ul>'
      ]
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
        '</ul>'
      ]
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
        '</ul>'
      ],
      tips: [
        'Pressing the Ctrl / Command key allows you to multi-select nodes on the canvas.',
        'You can double-click on empty canvas space to place custom annotations/sticky notes.'
      ]
    },
    {
      id: 'gs-modes',
      title: 'Developer vs. Architect Modes',
      category: 'start',
      icon: 'fas fa-user-gear',
      summary: 'Understand the difference between the beginner-friendly Developer mode and the advanced Architect mode.',
      content: [
        'Sr. Architect supports two experience modes tailored for different experience levels:',
        '<ul>' +
        '<li><span class="text-emerald"><strong>Developer Mode:</strong></span> Focused on system design learning. It simplifies the palette to 24+ core AWS services, simplifies configuration sliders, and disables granular billing complexity. Ideal for learning system behaviors and traffic flow dynamics.</li>' +
        '<li><span class="text-purple"><strong>Architect Mode:</strong></span> Focused on professional production-scale design. It exposes 65+ AWS services, adds deep configuration fields (LCU factors, compute classes, EBS types), and opens full cost breakdowns.</li>' +
        '</ul>',
        'Toggle modes on the launch dashboard. Your progress is synced and saved in your browser storage so you never lose your designs.'
      ]
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
        '<li><strong>Glowing Packets:</strong> Traffic flows down visual paths as glowing packets. The rate of requests is determined by the Users node\'s <code>Request Rate</code> slider.</li>' +
        '<li><strong>Simulation Ticks:</strong> The engine updates at a steady 60 FPS, resolving queues, packet transfers, and database queries dynamically.</li>' +
        '<li><strong>Degradation:</strong> If a server gets overloaded (exceeding its capacity limit), you\'ll watch packets stack up, latency climb, or requests fail and drop on the live dashboard.</li>' +
        '</ul>'
      ],
      tips: [
        'Toggle the Pause button to freeze the data packets mid-conduit for fine-grained tracing.',
        'Watch the sparkline graph in the telemetry overlay to see real-time latency fluctuations.'
      ]
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
        '</ul>'
      ]
    },

    // --- COMPUTE ---
    {
      id: 'comp-ec2',
      title: 'EC2 Virtual Servers',
      category: 'compute',
      icon: 'fas fa-cubes',
      summary: 'Scale compute capacity with virtual machine instance tiers.',
      content: [
        'EC2 nodes simulate standard virtual machine instances running in an AWS Region.',
        '<ul>' +
        '<li><strong>Instance Sizing:</strong> Configure instance size starting from <code>nano</code> (~$4/mo) up to <code>4xlarge</code> (~$544/mo). Higher tiers dramatically increase the node capacity (throughput limit).</li>' +
        '<li><strong>CPU & Memory:</strong> Slide baseline utilization scales. High baseline workloads reduce the head-room for sudden traffic spikes, triggering error rates earlier.</li>' +
        '<li><strong>Replication:</strong> Bumps the instance count directly, scaling the compute throughput limit multiplicatively.</li>' +
        '</ul>'
      ]
    },
    {
      id: 'comp-lambda',
      title: 'Lambda Serverless',
      category: 'compute',
      icon: 'fas fa-bolt-lightning',
      summary: 'Execute lightweight, pay-per-request serverless functions.',
      content: [
        'Lambda nodes simulate event-driven, serverless execution scales.',
        '<ul>' +
        '<li><strong>Memory Allocation:</strong> Memory settings (128MB to 10GB) directly determine the proportional CPU scale and runtime speed.</li>' +
        '<li><strong>Cold Starts:</strong> If Lambda isn\'t warmed or active, the first few packets will experience higher base latency.</li>' +
        '<li><strong>Reserved Concurrency:</strong> Caps the simultaneous executions. If traffic spikes exceed the reserved limit, Lambda will throttle requests, throwing <code>HTTP 429</code> warnings.</li>' +
        '</ul>'
      ],
      tips: [
        'Lambda billing is calculated using (Invocations × $0.20/M) + (GB-Seconds executed). Keep latency low to minimize serverless costs!'
      ]
    },
    {
      id: 'comp-ecs',
      title: 'ECS Container Clusters',
      category: 'compute',
      icon: 'fas fa-box-archive',
      summary: 'Deploy highly scalable microservices on AWS Fargate container tasks.',
      content: [
        'Elastic Container Service (ECS) Fargate nodes run container tasks without provisioning servers.',
        '<ul>' +
        '<li><strong>Task Configuration:</strong> Configure the task CPU and memory parameters directly. Cost scales linearly with Fargate allocation rates.</li>' +
        '<li><strong>Desired Tasks:</strong> Replicates the active containers. ELB connects to ECS tasks to balance incoming HTTP requests.</li>' +
        '</ul>'
      ]
    },

    // --- STORAGE & DB ---
    {
      id: 'store-s3',
      title: 'S3 Object Storage',
      category: 'storage',
      icon: 'fas fa-folder-open',
      summary: 'Store files in durable buckets with variable storage tiers.',
      content: [
        'Simple Storage Service (S3) stores static files, website assets, and backups.',
        '<ul>' +
        '<li><strong>Storage Classes:</strong> Choose from <code>Standard</code> ($0.023/GB), <code>Infrequent Access</code> ($0.0125/GB), or <code>Glacier</code> ($0.004/GB) depending on retrieval needs.</li>' +
        '<li><strong>Read/Write Rates:</strong> Billed per GET/PUT API calls. Keep frequent cacheable hits fronted by <code>CloudFront CDN</code> to save significant S3 API costs.</li>' +
        '</ul>'
      ]
    },
    {
      id: 'db-rds',
      title: 'RDS / Aurora Databases',
      category: 'storage',
      icon: 'fas fa-database',
      summary: 'Deploy transactional relational database clusters.',
      content: [
        'Relational Database Service (RDS) simulates PostgreSQL/MySQL storage nodes.',
        '<ul>' +
        '<li><strong>Instances:</strong> Configure cluster replica count. Replicas act as read-targets, increasing overall query throughput.</li>' +
        '<li><strong>EBS Storage:</strong> Slide <code>gp3</code> or <code>io1</code> storage volume gigabytes. gp3 storage baseline provides balanced performance, while io1 scales up IOPS capacity for database bottlenecks.</li>' +
        '</ul>'
      ]
    },
    {
      id: 'db-dynamo',
      title: 'DynamoDB NoSQL',
      category: 'storage',
      icon: 'fas fa-table',
      summary: 'Deploy ultra-fast, single-digit millisecond key-value databases.',
      content: [
        'DynamoDB simulates serverless, globally distributed NoSQL database scales.',
        '<ul>' +
        '<li><strong>Read/Write Capacity Units (RCUs & WCUs):</strong> Set capacity limits. High WCUs and RCUs support massive concurrent querying.</li>' +
        '<li><strong>Auto-scaling Target:</strong> Sliders trigger database throughput expansions when concurrent requests exceed baseline scales.</li>' +
        '</ul>'
      ]
    },

    // --- INTEGRATION ---
    {
      id: 'int-apigw',
      title: 'API Gateway Triggers',
      category: 'integration',
      icon: 'fas fa-route',
      summary: 'Expose secure REST APIs and balance requests downstream.',
      content: [
        'API Gateway acts as the entry door for backend cloud services.',
        '<ul>' +
        '<li><strong>Timeout Limits:</strong> Configure integration timeouts (default 29s). If backend Lambda or EC2 nodes take longer, the API Gateway returns <code>HTTP 504 Gateway Timeouts</code>.</li>' +
        '<li><strong>Retries:</strong> Auto-triggers failed user queries to retry upstream, helping resolve transient backend server failures.</li>' +
        '<li><strong>Tiered Request Cost Segregation:</strong> Billing is evaluated dynamically based on capacity RPS, converting to Millions of Requests/Month (using a standard 2.628 multiplier) and applying cumulative tiered rates by API type:<br>' +
        '- <strong>HTTP API:</strong> First 300 million at $1.00/M, 300M+ at $0.90/M.<br>' +
        '- <strong>REST API:</strong> First 333 million at $3.50/M, next 667 million at $2.80/M, next 19 billion at $2.38/M, over 20 billion at $1.51/M.<br>' +
        '- <strong>WebSocket API:</strong> First 1 billion messages at $1.00/M, over 1 billion at $0.80/M.</li>' +
        '</ul>'
      ]
    },
    {
      id: 'int-sqs',
      title: 'SQS Message Queues',
      category: 'integration',
      icon: 'fas fa-list-ol',
      summary: 'Decouple services using durable, asynchronous message queues.',
      content: [
        'Simple Queue Service (SQS) decouples backend components by buffering spikes in traffic.',
        '<ul>' +
        '<li><strong>Queue Depth:</strong> Message backlogs pile up during server overloads. Once capacity is restored, consumers (like Lambda or EC2) poll and empty the queue.</li>' +
        '<li><strong>Batch Size:</strong> Configure how many messages consumer queries grab per poll. High batch sizes reduce the number of invocations, saving serverless bills.</li>' +
        '</ul>'
      ]
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
        '</ul>'
      ]
    }
  ];

  navScrolled = false;
  isManualScrolling = false;
  indicatorStyle: any = { opacity: '0' };

  selectedServiceType: AwsServiceType | null = null;
  inboundNodes: any[] = [];
  outboundNodes: any[] = [];
  rules: any[] = [];

  readonly serviceDocs: Record<string, Partial<Omit<ServiceDoc, 'illustrationSvg'>> & { illustrationSvg?: string }> = {
    client: {
      practicalExample: 'Simulating 5,000 global shoppers accessing your ecommerce website concurrently during a Black Friday flash sale event.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <defs>
            <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
          </defs>
          <!-- Client Device Wireframe (Laptop/Phone) -->
          <g transform="translate(60, 90)">
            <rect x="-35" y="-22" width="70" height="40" rx="6" fill="none" stroke="#4b5563" stroke-width="2" />
            <line x1="-42" y1="20" x2="42" y2="20" stroke="#4b5563" stroke-width="3" stroke-linecap="round" />
            <line x1="-15" y1="23" x2="15" y2="23" stroke="#9ca3af" stroke-width="2" />
            <circle cx="0" cy="-14" r="1.5" fill="#9ca3af" />
            <rect x="-28" y="-16" width="56" height="28" fill="#e0e7ff" opacity="0.3" />
            <!-- Glowing status -->
            <circle cx="0" cy="0" r="4" fill="#ec4899" class="ill-pulse" />
            <text x="0" y="38" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">USER/CLIENT</text>
          </g>

          <!-- Flow Conduit -->
          <path d="M 145 90 Q 200 60 255 90" fill="none" stroke="url(#clientGrad)" stroke-width="2" stroke-dasharray="6 4" class="ill-flow-right" />
          <path d="M 145 90 Q 200 120 255 90" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3" />
          <!-- Animated Traffic Packet -->
          <circle r="4.5" fill="#ec4899" filter="url(#glow-soft)">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 145 90 Q 200 60 255 90" />
          </circle>

          <!-- Server/Gateway Wireframe -->
          <g transform="translate(330, 90)">
            <rect x="-25" y="-30" width="50" height="60" rx="8" fill="none" stroke="#6366f1" stroke-width="2" />
            <line x1="-25" y1="-10" x2="25" y2="-10" stroke="#e2e8f0" stroke-width="1" />
            <line x1="-25" y1="10" x2="25" y2="10" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="-12" cy="-20" r="3" fill="#10b981" />
            <circle cx="12" cy="-20" r="2" fill="#6366f1" />
            <rect x="-15" y="-2" width="30" height="6" rx="2" fill="#818cf8" opacity="0.4" />
            <rect x="-15" y="16" width="30" height="6" rx="2" fill="#818cf8" opacity="0.4" />
            <text x="0" y="44" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">ENDPOINT</text>
          </g>
        </svg>
      `
    },
    route53: {
      practicalExample: 'Resolving `api.shop.com` to a localized Application Load Balancer IP address dynamically, routing users to their nearest server cluster.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Globe/DNS Network wireframe -->
          <g transform="translate(60, 90)">
            <circle cx="0" cy="0" r="28" fill="none" stroke="#f59e0b" stroke-width="2" />
            <ellipse cx="0" cy="0" rx="10" ry="28" fill="none" stroke="#fbbf24" stroke-width="1.5" />
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#fbbf24" stroke-width="1.5" />
            <text x="0" y="42" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">myapp.com</text>
          </g>

          <!-- Resolving Flow -->
          <path d="M 100 90 L 250 90" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4" class="ill-flow-right" />
          <circle r="4.5" fill="#f59e0b" filter="url(#glow-soft)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 100 90 L 250 90" />
          </circle>

          <!-- Resolved Target -->
          <g transform="translate(310, 90)">
            <rect x="-40" y="-32" width="80" height="50" rx="6" fill="none" stroke="#10b981" stroke-width="2" />
            <text x="0" y="-8" font-size="9" text-anchor="middle" font-weight="800" fill="#047857">IP ADDRESS</text>
            <rect x="-32" y="4" width="64" height="18" rx="3" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" />
            <text x="0" y="16" font-size="10" font-family="monospace" text-anchor="middle" font-weight="700" fill="#065f46">192.0.2.145</text>
            <text x="0" y="32" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">ELB / CDN</text>
          </g>
        </svg>
      `
    },
    cloudfront: {
      practicalExample: 'Serving cached product catalog images instantly from an edge location in London to a local UK buyer, bypassing the origin server located in Oregon.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Central Origin -->
          <g transform="translate(70, 90)">
            <rect x="-24" y="-24" width="48" height="48" rx="8" fill="none" stroke="#6366f1" stroke-width="2" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="3 3" class="ill-rotate" />
            <text x="0" y="38" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">ORIGIN (S3)</text>
          </g>

          <!-- Distributed Edge Caches -->
          <g transform="translate(260, 45)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#8b5cf6" stroke-width="2" />
            <circle cx="0" cy="0" r="8" fill="#a78bfa" opacity="0.5" />
            <text x="32" y="4" font-size="9" font-weight="700" fill="#7c3aed">Edge Node A (Hit)</text>
          </g>
          
          <g transform="translate(280, 90)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#8b5cf6" stroke-width="2" />
            <circle cx="0" cy="0" r="8" fill="#a78bfa" opacity="0.5" />
            <text x="32" y="4" font-size="9" font-weight="700" fill="#7c3aed">Edge Node B (Hit)</text>
          </g>

          <g transform="translate(260, 135)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#8b5cf6" stroke-width="2" />
            <circle cx="0" cy="0" r="8" fill="#a78bfa" opacity="0.5" />
            <text x="32" y="4" font-size="9" font-weight="700" fill="#7c3aed">Edge Node C (Miss)</text>
          </g>

          <!-- Edge Cache pull links -->
          <path d="M 100 90 L 240 45" fill="none" stroke="#cbd5e1" stroke-width="1.5" />
          <path d="M 100 90 L 260 90" fill="none" stroke="#cbd5e1" stroke-width="1.5" />
          <path d="M 100 90 L 240 135" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" class="ill-flow-right" />
          
          <!-- Animated Pull Packet (Miss) -->
          <circle r="4" fill="#8b5cf6">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 100 90 L 240 135" />
          </circle>
        </svg>
      `
    },
    apiGateway: {
      practicalExample: 'Receiving requests on `/checkout` and verifying the user\'s Cognito authentication token before routing the request downstream to the Checkout microservice.',
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
      `
    },
    elb: {
      practicalExample: 'Distributing incoming checkout traffic across a pool of 5 EC2 instances. If instance #3 crashes, the ELB automatically detects the health check failure and reroutes new payments to the remaining 4 instances.',
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
      `
    },
    lambda: {
      practicalExample: 'A microservice that activates the instant a customer uploads a profile image to S3, resizing the image into standard sizes and generating database thumbnail URLs.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Event Trigger -->
          <g transform="translate(60, 90)">
            <rect x="-30" y="-20" width="60" height="40" rx="5" fill="none" stroke="#94a3b8" stroke-width="1.5" />
            <circle cx="0" cy="0" r="6" fill="#f59e0b" />
            <text x="0" y="34" font-size="9" text-anchor="middle" font-weight="700" fill="#64748b">Event Trigger</text>
          </g>

          <!-- Execution Path -->
          <path d="M 100 90 L 240 90" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6 4" class="ill-flow-right" />
          <circle r="5.5" fill="#f59e0b" filter="url(#glow-soft)">
            <animateMotion dur="1.5s" repeatCount="indefinite" path="M 100 90 L 240 90" />
          </circle>

          <!-- Lambda Lightning Node -->
          <g transform="translate(290, 90)">
            <circle cx="0" cy="0" r="30" fill="none" stroke="#f59e0b" stroke-width="2.5" />
            <!-- Lightning Path -->
            <path d="M 5 -18 L -12 2 L 2 2 L -5 18 L 12 -2 L -2 -2 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" class="ill-pulse" />
            <text x="0" y="46" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">LAMBDA FUNCTION</text>
          </g>
        </svg>
      `
    },
    ec2: {
      practicalExample: 'Running an enterprise Java Spring Boot backend framework with custom network sockets and internal application caches that must remain active 24/7.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Server chassis wireframe -->
          <g transform="translate(200, 90)">
            <!-- Rack 1 -->
            <rect x="-70" y="-36" width="140" height="20" rx="3" fill="none" stroke="#f97316" stroke-width="2" />
            <circle cx="-50" cy="-26" r="3.5" fill="#10b981" />
            <circle cx="-38" cy="-26" r="2" fill="#10b981" />
            <line x1="-20" x1="-20" x2="50" y2="-26" stroke="#f97316" stroke-width="1.5" stroke-dasharray="2 2" />
            <!-- Rack 2 -->
            <rect x="-70" y="-10" width="140" height="20" rx="3" fill="none" stroke="#f97316" stroke-width="2" />
            <circle cx="-50" cy="0" r="3.5" fill="#10b981" />
            <circle cx="-38" cy="0" r="2" fill="#ef4444" class="ill-pulse" />
            <!-- Rack 3 -->
            <rect x="-70" y="16" width="140" height="20" rx="3" fill="none" stroke="#f97316" stroke-width="2" />
            <circle cx="-50" cy="26" r="3.5" fill="#10b981" />
            <circle cx="-38" cy="26" r="2" fill="#10b981" />

            <text x="0" y="52" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">EC2 VIRTUAL SERVERS</text>
          </g>
        </svg>
      `
    },
    ecs: {
      practicalExample: 'Packaging an API application inside a Docker container, deploying it as multiple task replicas on Fargate, and auto-scaling task capacity up or down based on CPU load metrics.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Host node -->
          <g transform="translate(100, 90)">
            <rect x="-40" y="-40" width="80" height="80" rx="8" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3" />
            <text x="0" y="54" font-size="9" text-anchor="middle" font-weight="700" fill="#64748b">ECS CLUSTER</text>
          </g>

          <!-- Inside Containers (Docker Boxes) -->
          <g transform="translate(100, 90)">
            <!-- Box 1 -->
            <rect x="-24" y="-24" width="20" height="20" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="2" class="ill-pulse" />
            <line x1="-24" y1="-14" x2="-4" y2="-14" stroke="#fdba74" />
            <!-- Box 2 -->
            <rect x="4" y="-24" width="20" height="20" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="2" />
            <!-- Box 3 -->
            <rect x="-24" y="4" width="20" height="20" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="2" />
            <!-- Box 4 -->
            <rect x="4" y="4" width="20" height="20" rx="2" fill="#ffedd5" stroke="#f97316" stroke-width="2" class="ill-pulse" />
          </g>

          <!-- Scaling Task replicates -->
          <path d="M 150 90 L 230 90" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="4 2" class="ill-flow-right" />
          
          <g transform="translate(290, 90)">
            <rect x="-30" y="-30" width="60" height="60" rx="6" fill="none" stroke="#f97316" stroke-width="1.5" />
            <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="800" fill="#f97316">TASK REPLICA</text>
            <text x="0" y="42" font-size="9" text-anchor="middle" font-weight="700" fill="#64748b">Fargate Task</text>
          </g>
        </svg>
      `
    },
    s3: {
      practicalExample: 'Storing millions of user-uploaded profile pictures and video clips securely, serving them globally through CloudFront edge caches.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- S3 Bucket Cylinder -->
          <g transform="translate(200, 85)">
            <!-- Top Lip -->
            <ellipse cx="0" cy="-35" rx="38" ry="12" fill="#e6f4ea" stroke="#10b981" stroke-width="2" />
            
            <!-- Body -->
            <path d="M -38 -35 L -38 25 A 38 12 0 0 0 38 25 L 38 -35 Z" fill="none" stroke="#10b981" stroke-width="2" />
            <ellipse cx="0" cy="-15" rx="38" ry="10" fill="none" stroke="#10b981" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="5" rx="38" ry="10" fill="none" stroke="#10b981" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="25" rx="38" ry="12" fill="#e6f4ea" stroke="#10b981" stroke-width="2" />

            <!-- Document files inside bucket representation -->
            <rect x="-18" y="-12" width="14" height="18" rx="1" fill="#a7f3d0" stroke="#047857" stroke-width="1" />
            <line x1="-14" y1="-8" x2="-8" y2="-8" stroke="#047857" stroke-width="1" />
            <line x1="-14" y1="-4" x2="-6" y2="-4" stroke="#047857" stroke-width="1" />
            
            <rect x="4" y="-8" width="14" height="18" rx="1" fill="#a7f3d0" stroke="#047857" stroke-width="1" />
            
            <text x="0" y="54" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">S3 STORAGE BUCKET</text>
          </g>
        </svg>
      `
    },
    rds: {
      practicalExample: 'Storing client accounting balances, customer orders, and transaction ledgers, where data relationships and strict transaction accuracy are critical.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Primary Write Database -->
          <g transform="translate(100, 85)">
            <path d="M -26 -20 L -26 20 A 26 8 0 0 0 26 20 L 26 -20 Z" fill="none" stroke="#3b82f6" stroke-width="2" />
            <ellipse cx="0" cy="-20" rx="26" ry="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <ellipse cx="0" cy="-6" rx="26" ry="6" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="8" rx="26" ry="6" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="20" rx="26" ry="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <text x="0" y="40" font-size="10" text-anchor="middle" font-weight="700" fill="#2563eb">PRIMARY (W)</text>
          </g>

          <!-- Sync Sync Replication Line -->
          <path d="M 135 85 L 235 85" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6 3" class="ill-flow-right" />
          
          <g transform="translate(185, 80)">
            <path d="M -8 -8 L 8 0 L -8 8 Z" fill="#3b82f6" />
          </g>

          <!-- Read Replica Database -->
          <g transform="translate(270, 85)">
            <path d="M -22 -16 L -22 16 A 22 7 0 0 0 22 16 L 22 -16 Z" fill="none" stroke="#94a3b8" stroke-width="1.5" />
            <ellipse cx="0" cy="-16" rx="22" ry="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
            <ellipse cx="0" cy="-4" rx="22" ry="5" fill="none" stroke="#94a3b8" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="8" rx="22" ry="5" fill="none" stroke="#94a3b8" stroke-dasharray="3 3" />
            <ellipse cx="0" cy="16" rx="22" ry="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
            <text x="0" y="36" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">REPLICA (R)</text>
          </g>
        </svg>
      `
    },
    dynamoDb: {
      practicalExample: 'Storing millions of active gaming session states or shopping cart list items that require immediate, high-frequency read/write operations.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Key Value Matrix -->
          <g transform="translate(200, 90)">
            <!-- Outer grid container -->
            <rect x="-70" y="-35" width="140" height="70" rx="6" fill="none" stroke="#3b82f6" stroke-width="2" />
            <!-- Row dividers -->
            <line x1="-70" y1="-12" x2="70" y2="-12" stroke="#dbeafe" stroke-width="1" />
            <line x1="-70" y1="12" x2="70" y2="12" stroke="#dbeafe" stroke-width="1" />
            <!-- Column divider -->
            <line x1="-20" y1="-35" x2="-20" y2="35" stroke="#dbeafe" stroke-width="1.5" />
            
            <!-- Keys (Indexed) -->
            <text x="-45" y="-20" font-size="9" font-weight="800" fill="#3b82f6">ID_901</text>
            <text x="-45" y="4" font-size="9" font-weight="800" fill="#3b82f6">ID_902</text>
            <text x="-45" y="26" font-size="9" font-weight="800" fill="#3b82f6">ID_903</text>
            
            <!-- Values -->
            <text x="-10" y="-20" font-size="9" font-family="monospace" fill="#475569">{"cart": 2}</text>
            <text x="-10" y="4" font-size="9" font-family="monospace" fill="#475569">{"cart": 0}</text>
            <text x="-10" y="26" font-size="9" font-family="monospace" fill="#475569">{"cart": 5}</text>

            <text x="0" y="52" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">NOSQL KEY-VALUE TABLE</text>
          </g>
        </svg>
      `
    },
    elastiCache: {
      practicalExample: 'Caching the checkout store\'s "Top 5 Hot Products" list on the homepage. Instead of running relational RDS SQL queries thousands of times per second, the server retrieves it instantly from Redis cache memory.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Server Node -->
          <g transform="translate(60, 90)">
            <rect x="-24" y="-24" width="48" height="48" rx="6" fill="none" stroke="#4b5563" stroke-width="2" />
            <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="700" fill="#1f2937">APP SERVER</text>
          </g>

          <!-- Cache Hit (Fast Memory Read) -->
          <path d="M 90 75 Q 170 30 250 45" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2" class="ill-flow-right" />
          <circle r="4" fill="#ef4444">
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M 90 75 Q 170 30 250 45" />
          </circle>
          
          <g transform="translate(280, 45)">
            <rect x="-30" y="-16" width="60" height="32" rx="4" fill="none" stroke="#ef4444" stroke-width="2" />
            <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="800" fill="#b91c1c">RAM CACHE</text>
            <text x="0" y="-22" font-size="9" font-weight="800" fill="#b91c1c">CACHE HIT (0.5ms)</text>
          </g>

          <!-- Cache Miss (Slow DB query) -->
          <path d="M 90 105 Q 170 150 250 135" fill="none" stroke="#94a3b8" stroke-width="1.5" />
          
          <g transform="translate(280, 135)">
            <rect x="-30" y="-16" width="60" height="32" rx="4" fill="none" stroke="#94a3b8" stroke-width="1.5" />
            <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="700" fill="#64748b">DISK DB</text>
            <text x="0" y="28" font-size="9" font-weight="700" fill="#64748b">CACHE MISS (45ms)</text>
          </g>
        </svg>
      `
    },
    sqs: {
      practicalExample: 'Buffering incoming payment orders in a queue. If the payment gateway API goes down temporarily, checkout messages remain safely in SQS and process automatically once the gateway recovers.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Queue Tube Container -->
          <g transform="translate(200, 90)">
            <rect x="-80" y="-20" width="160" height="40" rx="6" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
            <line x1="-80" y1="20" x2="80" y2="20" stroke="#8b5cf6" stroke-width="2" />
            
            <!-- Queued messages -->
            <rect x="-65" y="-12" width="26" height="24" rx="2" fill="#f5f3ff" stroke="#c084fc" stroke-width="1.5" />
            <text x="-52" y="4" font-size="9" font-weight="800" fill="#6b21a8">MSG A</text>

            <rect x="-30" y="-12" width="26" height="24" rx="2" fill="#f5f3ff" stroke="#c084fc" stroke-width="1.5" />
            <text x="-17" y="4" font-size="9" font-weight="800" fill="#6b21a8">MSG B</text>

            <rect x="5" y="-12" width="26" height="24" rx="2" fill="#f5f3ff" stroke="#c084fc" stroke-width="1.5" />
            <text x="18" y="4" font-size="9" font-weight="800" fill="#6b21a8">MSG C</text>

            <rect x="40" y="-12" width="26" height="24" rx="2" fill="#f5f3ff" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="2 1" />
            
            <text x="0" y="38" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">SQS MESSAGE BUFFER QUEUE</text>
          </g>

          <!-- Input/Output Arrows -->
          <path d="M 70 90 L 110 90" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" class="ill-flow-right" />
          <path d="M 290 90 L 330 90" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" class="ill-flow-right" />
        </svg>
      `
    },
    sns: {
      practicalExample: 'Broadcasting an `OrderCompleted` event to trigger three separate actions: triggering SQS to prepare packing, running Lambda to email the client invoice, and alerting Cognito.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Publisher -->
          <g transform="translate(60, 90)">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#94a3b8" stroke-width="1.5" />
            <text x="0" y="4" font-size="8" text-anchor="middle" font-weight="700" fill="#475569">PUBLISH</text>
          </g>

          <!-- SNS Topic (Megaphone/Broadcast) -->
          <g transform="translate(160, 90)">
            <circle cx="0" cy="0" r="24" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
            <!-- Megaphone icon vector -->
            <path d="M -10 -4 L -2 -4 L 6 -10 L 8 -10 L 8 10 L 6 10 L -2 4 L -10 4 Z" fill="#c084fc" />
            <text x="0" y="38" font-size="10" text-anchor="middle" font-weight="800" fill="#6b21a8">SNS TOPIC</text>
          </g>

          <!-- Fan-out routing paths -->
          <path d="M 190 90 L 270 45" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" />
          <path d="M 190 90 L 270 90" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" />
          <path d="M 190 90 L 270 135" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 2" />

          <!-- Multi-packets -->
          <circle r="4" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 190 90 L 270 45" /></circle>
          <circle r="4" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 190 90 L 270 90" /></circle>
          <circle r="4" fill="#8b5cf6"><animateMotion dur="2s" repeatCount="indefinite" path="M 190 90 L 270 135" /></circle>

          <!-- Subscribers -->
          <g transform="translate(310, 45)">
            <rect x="-30" y="-12" width="60" height="24" rx="3" fill="none" stroke="#10b981" stroke-width="1.5" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="700" fill="#047857">Lambda Sub</text>
          </g>
          <g transform="translate(310, 90)">
            <rect x="-30" y="-12" width="60" height="24" rx="3" fill="none" stroke="#f59e0b" stroke-width="1.5" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="700" fill="#d97706">SQS Sub</text>
          </g>
          <g transform="translate(310, 135)">
            <rect x="-30" y="-12" width="60" height="24" rx="3" fill="none" stroke="#3b82f6" stroke-width="1.5" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="700" fill="#1d4ed8">HTTPS Endpoint</text>
          </g>
        </svg>
      `
    },
    eventBridge: {
      practicalExample: 'Routing system error events to a PagerDuty Lambda connector while sending standard operations events to a CloudWatch log stream.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Event bus lanes -->
          <g transform="translate(180, 90)">
            <rect x="-50" y="-30" width="100" height="60" rx="8" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
            <line x1="-50" y1="0" x2="50" y2="0" stroke="#ddd" stroke-width="1.5" stroke-dasharray="3 3" />
            <text x="0" y="38" font-size="10" text-anchor="middle" font-weight="800" fill="#6b21a8">EVENT BUS</text>
          </g>

          <!-- Incoming mixed events -->
          <path d="M 40 90 L 120 90" fill="none" stroke="#94a3b8" stroke-width="2" />
          <circle cx="60" cy="90" r="5" fill="#ef4444" class="ill-pulse" />
          <circle cx="95" cy="90" r="5" fill="#10b981" />

          <!-- Route filters -->
          <path d="M 240 70 L 300 45" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 2" />
          <path d="M 240 110 L 300 135" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2" />

          <circle r="4.5" fill="#10b981"><animateMotion dur="2.1s" repeatCount="indefinite" path="M 240 70 L 300 45" /></circle>
          <circle r="4.5" fill="#ef4444"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 240 110 L 300 135" /></circle>

          <!-- Filter targets -->
          <text x="340" y="48" font-size="9" font-weight="700" fill="#047857">Lambda Rule A</text>
          <text x="340" y="138" font-size="9" font-weight="700" fill="#b91c1c">SNS Rule B</text>
        </svg>
      `
    },
    stepFunctions: {
      practicalExample: 'Managing payment checkout steps: (1) Charge bank card, (2) If bank approval succeeds, write order row to database, (3) If charging fails, trigger refund process and alert email.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Flow of nodes -->
          <g transform="translate(60, 90)">
            <circle cx="0" cy="0" r="14" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">START</text>
          </g>

          <path d="M 74 90 L 130 90" fill="none" stroke="#3b82f6" stroke-width="1.5" />
          
          <!-- State 1 -->
          <g transform="translate(160, 90)">
            <rect x="-25" y="-15" width="50" height="30" rx="3" fill="none" stroke="#ec4899" stroke-width="2.5" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="800" fill="#be185d">CHARGE</text>
          </g>

          <!-- Branching paths -->
          <path d="M 185 90 L 235 55" fill="none" stroke="#10b981" stroke-width="1.5" />
          <path d="M 185 90 L 235 125" fill="none" stroke="#ef4444" stroke-width="1.5" />

          <!-- Success state -->
          <g transform="translate(270, 55)">
            <circle cx="0" cy="0" r="14" fill="#e6f4ea" stroke="#10b981" stroke-width="2" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="800" fill="#047857">OK</text>
          </g>

          <!-- Failure state -->
          <g transform="translate(270, 125)">
            <circle cx="0" cy="0" r="14" fill="#fdf2f2" stroke="#ef4444" stroke-width="2" />
            <text x="0" y="3" font-size="8" text-anchor="middle" font-weight="800" fill="#b91c1c">FAIL</text>
          </g>
        </svg>
      `
    },
    cloudWatch: {
      practicalExample: 'Monitoring server CPU levels. If average EC2 CPU pressure exceeds 75% for 3 minutes, CloudWatch triggers an Alarm calling the Auto Scaling policy to add another server.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Observatory dashboard chart -->
          <g transform="translate(180, 90)">
            <rect x="-80" y="-35" width="160" height="70" rx="6" fill="none" stroke="#10b981" stroke-width="2" />
            
            <!-- Graph background grids -->
            <line x1="-80" y1="0" x2="80" y2="0" stroke="#f1f5f9" stroke-width="1" />
            <!-- Threshold Line (Alert level) -->
            <line x1="-80" y1="-15" x2="80" y2="-15" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 2" />
            <text x="-75" y="-20" font-size="8" font-weight="800" fill="#ef4444">ALARM THRESHOLD</text>

            <!-- Plot sparkline -->
            <path d="M -80 20 L -50 10 L -20 22 L 10 -8 L 40 -26 L 80 -20" fill="none" stroke="#10b981" stroke-width="2.5" />
            
            <!-- Intersect point (Cross threshold alarm!) -->
            <circle cx="40" cy="-26" r="4.5" fill="#ef4444" class="ill-pulse" />
            <text x="40" y="-34" font-size="8" font-weight="800" fill="#b91c1c">ALERT</text>

            <text x="0" y="52" font-size="10" text-anchor="middle" font-weight="700" fill="#64748b">MONITORING Telemetry</text>
          </g>
        </svg>
      `
    },
    cognito: {
      practicalExample: 'Allowing customers to sign up and authenticate using their email or Google credentials to fetch secure JSON Web Tokens (JWT) for API Authorization.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- User -->
          <g transform="translate(60, 90)">
            <circle cx="0" cy="-8" r="10" fill="none" stroke="#4b5563" stroke-width="2" />
            <path d="M -15 16 A 15 12 0 0 1 15 16 Z" fill="none" stroke="#4b5563" stroke-width="2" />
          </g>

          <!-- Auth Request -->
          <path d="M 90 90 L 195 90" fill="none" stroke="#ec4899" stroke-width="2" stroke-dasharray="5 3" class="ill-flow-right" />

          <!-- Cognito Shield lock -->
          <g transform="translate(230, 90)">
            <circle cx="0" cy="0" r="26" fill="none" stroke="#ec4899" stroke-width="2.5" />
            <!-- Shield Path -->
            <path d="M -10 -12 L 10 -12 L 10 -2 Q 10 10 0 16 Q -10 10 -10 -2 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="1.5" />
            <!-- Keyhole -->
            <circle cx="0" cy="0" r="3" fill="#db2777" />
            <path d="M -1.5 3 L 1.5 3 L 1 7 L -1 7 Z" fill="#db2777" />
            <text x="0" y="40" font-size="10" text-anchor="middle" font-weight="800" fill="#be185d">COGNITO Auth</text>
          </g>

          <!-- JWT Token -->
          <g transform="translate(340, 90)">
            <rect x="-24" y="-16" width="48" height="32" rx="3" fill="#ecfdf5" stroke="#10b981" stroke-width="2" class="ill-pulse" />
            <text x="0" y="-2" font-size="8" text-anchor="middle" font-weight="950" fill="#047857">JWT</text>
            <text x="0" y="8" font-size="7" text-anchor="middle" fill="#047857">TOKEN</text>
          </g>
        </svg>
      `
    },
    waf: {
      practicalExample: 'Blocking requests coming from malicious blacklisted IP subnet ranges, or automatically blocking a client who fires more than 100 requests per second to the endpoint.',
      illustrationSvg: `
        <svg viewBox="0 0 400 180" class="illustration-svg">
          <!-- Ingress Traffic (Good and Bad) -->
          <g transform="translate(60, 45)">
            <circle cx="0" cy="0" r="8" fill="#10b981" />
            <text x="0" y="18" font-size="8" text-anchor="middle" font-weight="700" fill="#047857">Clean Traffic</text>
          </g>
          
          <g transform="translate(60, 135)">
            <circle cx="0" cy="0" r="8" fill="#ef4444" class="ill-pulse" />
            <text x="0" y="18" font-size="8" text-anchor="middle" font-weight="700" fill="#b91c1c">SQL Injection (DDoS)</text>
          </g>

          <!-- WAF Filter Wall -->
          <g transform="translate(200, 90)">
            <!-- Brick wall grid -->
            <rect x="-15" y="-50" width="30" height="100" rx="4" fill="#fecaca" stroke="#ef4444" stroke-width="2" />
            <line x1="-15" y1="-25" x2="15" y2="-25" stroke="#ef4444" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#ef4444" stroke-width="1.5" />
            <line x1="-15" y1="25" x2="15" y2="25" stroke="#ef4444" />
            <text x="0" y="62" font-size="10" text-anchor="middle" font-weight="800" fill="#b91c1c">WAF SHIELD</text>
          </g>

          <!-- Good Flow through wall -->
          <path d="M 80 45 L 185 45 Q 240 45 280 80" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2" class="ill-flow-right" />
          <circle r="4.5" fill="#10b981"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 45 L 185 45 Q 240 45 280 80" /></circle>

          <!-- Bad block at wall -->
          <path d="M 80 135 L 182 135" fill="none" stroke="#ef4444" stroke-width="2" />
          <path d="M 182 135 L 170 125 M 182 135 L 170 145" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
          <circle cx="182" cy="135" r="4.5" fill="#ef4444" />
          <text x="160" y="118" font-size="9" font-weight="800" fill="#b91c1c">BLOCKED</text>

          <!-- Protected server -->
          <g transform="translate(320, 90)">
            <rect x="-24" y="-24" width="48" height="48" rx="6" fill="none" stroke="#10b981" stroke-width="2" />
            <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="800" fill="#047857">SAFE SITE</text>
          </g>
        </svg>
      `
    }
  };

  private onPop = () => {
    this.checkQueryParam();
  };

  constructor(
    private el: ElementRef,
    public awsCatalog: AwsCatalogService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.checkQueryParam();
    window.addEventListener('popstate', this.onPop);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.onPop);
  }

  checkQueryParam(): void {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam && this.awsCatalog.services.some(service => service.type === serviceParam)) {
        this.selectedServiceType = serviceParam as AwsServiceType;
        this.updateConnectivityMap(serviceParam);
        this.activeCategoryId = '';
      } else {
        this.selectedServiceType = null;
      }
    }
  }

  getServiceDoc(type: string): ServiceDoc {
    const defaultInfo = this.awsCatalog.getByType(type as AwsServiceType);
    const custom = this.serviceDocs[type];
    const docData = (serviceDocsData as any)[type] || {};

    const rawService = this.getRawService(type as AwsServiceType);
    const rules = rawService?.rules || [];
    const connectedTargets = rules.slice(0, 4).map((rule: any) => {
      try {
        return this.awsCatalog.getByType(rule.target as AwsServiceType).name;
      } catch {
        return rule.target;
      }
    });

    const rawSvg = custom?.illustrationSvg || this.buildServiceIllustration(defaultInfo, connectedTargets);

    return {
      whyNeeded: docData.overview || defaultInfo.description,
      beginnerExplanation: docData.conceptualModel || '',
      whenToUse: docData.recommendedUsing || '',
      whenNotToUse: docData.recommendedAvoiding || '',
      practicalExample: docData.practicalScenario || '',
      keyCapabilities: docData.keyCharacteristics || [],
      useCases: docData.commonIntegrationPatterns || [],
      illustrationSvg: this.sanitizer.bypassSecurityTrustHtml(rawSvg)
    };
  }

  private buildServiceIllustration(service: AwsServiceDefinition, connectedTargets: string[]): string {
    const color = this.serviceColor(service.type);
    const safeName = this.escapeSvgText(service.name);
    const safeCategory = this.escapeSvgText(service.category);
    const targetA = this.escapeSvgText(connectedTargets[0] || 'Target service');
    const targetB = this.escapeSvgText(connectedTargets[1] || 'Monitoring');

    return `
      <svg viewBox="0 0 400 180" class="illustration-svg" role="img" aria-label="${safeName} architecture flow">
        <defs>
          <linearGradient id="svc-${service.type}-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b" stop-opacity="0.7" />
            <stop offset="50%" stop-color="${color}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.75" />
          </linearGradient>
        </defs>

        <g transform="translate(58, 90)">
          <rect x="-36" y="-26" width="72" height="52" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
          <text x="0" y="-3" font-size="9" text-anchor="middle" font-weight="800" fill="#475569">REQUEST</text>
          <text x="0" y="11" font-size="8" text-anchor="middle" fill="#64748b">input</text>
        </g>

        <path d="M 96 90 C 135 48, 180 48, 220 90" fill="none" stroke="url(#svc-${service.type}-flow)" stroke-width="2.5" stroke-dasharray="7 5" class="ill-flow-right" />
        <path d="M 96 90 C 135 132, 180 132, 220 90" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />
        <circle r="5" fill="${color}">
          <animateMotion dur="2.1s" repeatCount="indefinite" path="M 96 90 C 135 48, 180 48, 220 90" />
        </circle>

        <g transform="translate(250, 90)">
          <circle r="34" fill="${color}1f" stroke="${color}" stroke-width="2.5" />
          <circle r="18" fill="#ffffff" stroke="${color}" stroke-width="2" />
          <text x="0" y="4" font-size="9" text-anchor="middle" font-weight="900" fill="#0f172a">${safeName}</text>
          <text x="0" y="50" font-size="8" text-anchor="middle" font-weight="700" fill="#64748b">${safeCategory}</text>
        </g>

        <path d="M 286 76 L 344 48" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 3" />
        <path d="M 286 104 L 344 132" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 3" />

        <g transform="translate(354, 48)">
          <rect x="-36" y="-15" width="72" height="30" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5" />
          <text x="0" y="4" font-size="8" text-anchor="middle" font-weight="800" fill="#047857">${targetA}</text>
        </g>
        <g transform="translate(354, 132)">
          <rect x="-36" y="-15" width="72" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
          <text x="0" y="4" font-size="8" text-anchor="middle" font-weight="800" fill="#1d4ed8">${targetB}</text>
        </g>
      </svg>
    `;
  }

  private humanizePort(port: string): string {
    return port.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').toLowerCase();
  }

  private escapeSvgText(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private getRawServices(): any[] {
    const rawData: any = awsServicesConfig;
    return rawData.services || (rawData.default && rawData.default.services) || [];
  }

  private getRawService(type: AwsServiceType): any {
    return this.getRawServices().find((service: any) => service.type === type);
  }

  serviceColor(type: string | null): string {
    if (!type) return '#94a3b8';
    return this.awsCatalog.categoryColor(this.awsCatalog.getByType(type as any).category);
  }

  closeDeepDive(): void {
    this.selectedServiceType = null;
    window.history.pushState(null, '', '/docs');
  }

  updateConnectivityMap(type: string): void {
    const rawData: any = awsServicesConfig;
    const services = rawData.services || (rawData.default && rawData.default.services) || [];

    // Find this service rules
    const thisService = services.find((s: any) => s.type === type);
    this.rules = thisService?.rules?.map((r: any) => {
      const targetDef = this.awsCatalog.getByType(r.target);
      return {
        target: r.target,
        targetName: targetDef.name,
        type: r.type,
        description: r.description
      };
    }) || [];

    // Find outbound services
    const allowedTargets = thisService?.rules?.map((r: any) => r.target) || [];
    const outboundList = services.filter((s: any) => allowedTargets.includes(s.type)).map((s: any) => {
      const def = this.awsCatalog.getByType(s.type);
      return { name: def.name, iconUrl: def.iconUrl };
    }).slice(0, 4);

    // Find inbound services
    const inboundList = services.filter((s: any) => {
      return s.rules?.some((r: any) => r.target === type);
    }).map((s: any) => {
      const def = this.awsCatalog.getByType(s.type);
      return { name: def.name, iconUrl: def.iconUrl };
    }).slice(0, 4);

    this.inboundNodes = this.getNodesWithY(inboundList);
    this.outboundNodes = this.getNodesWithY(outboundList);
  }

  getNodesWithY(nodesList: any[], startY = 40, endY = 260): any[] {
    const count = nodesList.length;
    if (count === 0) return [];
    if (count === 1) return [{ name: nodesList[0].name, iconUrl: nodesList[0].iconUrl, y: 150 }];

    const step = (endY - startY) / (count - 1);
    return nodesList.map((node, i) => ({
      name: node.name,
      iconUrl: node.iconUrl,
      y: startY + i * step
    }));
  }

  ngAfterViewChecked(): void {
    this.updateIndicator();
  }

  updateIndicator(): void {
    const activeBtn = this.el.nativeElement.querySelector('.category-btn.active');
    if (activeBtn) {
      const parent = activeBtn.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const rect = activeBtn.getBoundingClientRect();
        const left = rect.left - parentRect.left;
        const top = rect.top - parentRect.top;

        const newStyle = {
          transform: `translate3d(${left}px, ${top}px, 0)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          opacity: '1'
        };

        if (
          this.indicatorStyle.transform !== newStyle.transform ||
          this.indicatorStyle.width !== newStyle.width ||
          this.indicatorStyle.height !== newStyle.height ||
          this.indicatorStyle.opacity !== newStyle.opacity
        ) {
          Promise.resolve().then(() => {
            this.indicatorStyle = newStyle;
          });
        }
      }
    } else {
      if (this.indicatorStyle.opacity !== '0') {
        Promise.resolve().then(() => {
          this.indicatorStyle = { opacity: '0' };
        });
      }
    }
  }

  get displayedCategories() {
    return this.categories.filter(cat => {
      if (cat.id === 'services') {
        return this.filteredServices.length > 0;
      }
      return this.getArticlesByCategory(cat.id).length > 0;
    });
  }

  get filteredServices(): AwsServiceDefinition[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.awsCatalog.services;
    }

    return this.awsCatalog.services.filter(service => {
      const doc = this.getServiceDoc(service.type);
      return (
        service.name.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        doc.whyNeeded.toLowerCase().includes(query) ||
        doc.practicalExample.toLowerCase().includes(query)
      );
    });
  }

  get serviceDirectoryGroups(): Array<{ category: string; services: AwsServiceDefinition[] }> {
    const groups = new Map<string, AwsServiceDefinition[]>();
    for (const service of this.filteredServices) {
      const list = groups.get(service.category) || [];
      list.push(service);
      groups.set(service.category, list);
    }

    return [...groups.entries()].map(([category, services]) => ({ category, services }));
  }

  getArticlesByCategory(categoryId: string): DocArticle[] {
    const query = this.searchQuery.trim().toLowerCase();
    let list = this.articles.filter(a => a.category === categoryId);

    if (query) {
      list = list.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.content.some(c => c.toLowerCase().includes(query))
      );
    }
    return list;
  }

  openServiceDoc(type: string): void {
    if (!this.awsCatalog.services.some(service => service.type === type)) {
      return;
    }

    this.selectedServiceType = type as AwsServiceType;
    this.updateConnectivityMap(type);
    window.history.pushState(null, '', `/docs?service=${type}`);
    this.activeCategoryId = '';

    const shell = this.el.nativeElement.querySelector('.docs-shell');
    shell?.scrollTo({ top: 0, behavior: 'smooth' });
  }


  onScroll(event: Event): void {
    const shell = event.target as HTMLElement;
    this.navScrolled = shell.scrollTop > 60;

    if (this.isManualScrolling) return;

    const sections = shell.querySelectorAll('.docs-category-section');
    let currentActiveId = 'overview';
    const threshold = 160;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold + 40) {
        const id = section.id.replace('section-', '');
        currentActiveId = id;
      }
    }

    if (shell.scrollTop < 100) {
      currentActiveId = 'overview';
    }

    if (this.activeCategoryId !== currentActiveId) {
      this.activeCategoryId = currentActiveId;
    }
  }

  selectCategory(id: string): void {
    const wasServiceOpen = this.selectedServiceType !== null;
    if (wasServiceOpen) {
      this.selectedServiceType = null;
      window.history.pushState(null, '', '/docs');
    }
    this.activeCategoryId = id;
    this.isManualScrolling = true;

    const performScroll = () => {
      const shell = this.el.nativeElement.querySelector('.docs-shell');
      if (id === 'overview') {
        shell.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.isManualScrolling = false, 800);
      } else {
        const targetSection = this.el.nativeElement.querySelector(`#section-${id}`);
        if (targetSection && shell) {
          const shellRect = shell.getBoundingClientRect();
          const targetRect = targetSection.getBoundingClientRect();
          const scrollTop = shell.scrollTop;
          const targetTop = targetRect.top + scrollTop - shellRect.top - 88;

          shell.scrollTo({ top: targetTop, behavior: 'smooth' });
          setTimeout(() => this.isManualScrolling = false, 800);
        } else {
          this.isManualScrolling = false;
        }
      }
    };

    if (wasServiceOpen) {
      setTimeout(performScroll, 50);
    } else {
      performScroll();
    }
  }

  backToServices(): void {
    this.selectCategory('services');
  }

  goBack(): void {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }
}
