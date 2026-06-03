import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DocArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string[];
  tips?: string[];
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit, AfterViewChecked {
  searchQuery = '';
  activeCategoryId = 'overview';

  readonly categories = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-eye' },
    { id: 'start', name: 'Getting Started', icon: 'fas fa-play' },
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
        '<li><strong>Desired Tasks:</strong> Replicates the active containers. ALB connects to ECS tasks to balance incoming HTTP requests.</li>' +
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
        'The cost simulator maps real AWS billing pricing tables.',
        '<ul>' +
        '<li><strong>Regional Multipliers:</strong> Cloud costs differ heavily based on geography. Sr. Architect applies custom regional modifiers:</li>' +
        '<li><code>us-east-1</code> (N. Virginia): 1.0x (Standard Baseline)</li>' +
        '<li><code>eu-west-1</code> (Ireland): 1.1x</li>' +
        '<li><code>ap-south-1</code> (Mumbai): 1.15x</li>' +
        '<li><code>us-west-2</code> (Oregon): 1.05x</li>' +
        '<li><strong>Currency Switching:</strong> Tap currency conversions live (USD, EUR, INR, GBP, JPY) to see local pricing equivalents instantly in the Dynamic Island footer.</li>' +
        '</ul>'
      ]
    }
  ];

  navScrolled = false;
  isManualScrolling = false;
  indicatorStyle: any = { opacity: '0' };

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
      return this.getArticlesByCategory(cat.id).length > 0;
    });
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
    this.activeCategoryId = id;
    this.isManualScrolling = true;

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
  }

  goBack(): void {
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  }
}
