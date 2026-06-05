import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FMoveNodesEvent,
  FSelectionChangeEvent
} from '@foblex/flow';
import { Subscription } from 'rxjs';
import {
  ArchitectureConnection,
  ArchitectureNode,
  ArchitectureProject,
  Annotation,
  AwsServiceDefinition,
  AwsServiceType,
  DataPacket,
  HealthStatus,
  ServiceConfig,
  ServicePort,
  ValidationResult,
  SimulationMode
} from '../../core/models/architecture.model';
import { ArchitectureFactoryService } from '../../core/services/architecture-factory.service';
import { AwsCatalogService } from '../../core/services/aws-catalog.service';
import { PresetService } from '../../core/services/preset.service';
import { ProjectStorageService } from '../../core/services/project-storage.service';
import { SimulationService } from '../../core/services/simulation.service';
import { ValidationRuleService } from '../../core/services/validation-rule.service';
import { CostService, CostBreakdown } from '../../core/services/cost.service';
import { Currency } from '../../core/models/architecture.model';
import serviceCostModelData from '../../core/data/service-cost-model.json';

interface PortSelection {
  node: ArchitectureNode;
  port: ServicePort;
}

export interface CanvasTab {
  id: string;
  name: string;
  projectName: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  annotations: Annotation[];
  packets: DataPacket[];
  selectedNodeIds: string[];
  selectedConnectionIds: string[];
  zoom: number;
  pan: { x: number; y: number };
  globalCurrency: Currency;
  globalRegion: string;
  simulationMode: SimulationMode;
  totals: { processed: number; dropped: number; avgLatency: number };
  tick: number;
}

interface ConfigField {
  key: keyof ServiceConfig;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  description?: string;
  affectsCost?: boolean;
}

interface SelectField {
  key: keyof ServiceConfig;
  label: string;
  options: Array<{ label: string; value: string }>;
  description?: string;
  affectsCost?: boolean;
}

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, FFlowModule, FormsModule],
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('flowCanvas') flowCanvas?: FCanvasComponent;

  readonly catalog = this.awsCatalog.services;
  readonly commonConfigFields: ConfigField[] = [
    { key: 'throughput', label: 'Capacity', min: 1, max: 3000, step: 10, suffix: 'rps', description: 'Max rps before degradation. Acts as cost fallback if no request rate is set.', affectsCost: true },
    { key: 'latency', label: 'Base latency', min: 1, max: 1000, step: 5, suffix: 'ms', description: 'Processing delay per request. Affects Lambda GB-second billing.', affectsCost: false },
    { key: 'failureThreshold', label: 'Failure threshold', min: 50, max: 100, step: 1, suffix: '%', description: 'Utilization % where traffic starts dropping.' }
  ];

  readonly serviceConfigFields: Partial<Record<AwsServiceType, ConfigField[]>> = {
    client: [{ key: 'requestRate', label: 'Request rate', min: 0, max: 1000, step: 10, suffix: 'rps', description: 'Traffic volume entering your architecture.' }],
    route53: [],
    cloudfront: [
      { key: 'cacheHitRate', label: 'Cache hit rate', min: 0, max: 100, step: 1, suffix: '%', description: '% served from edge. Higher = less origin load.' },
      { key: 'dataTransferOut', label: 'Data transfer out', min: 0, max: 10000, step: 10, suffix: 'GB/mo', description: '$0.085/GB delivered to users.', affectsCost: true },
      { key: 'requestRate', label: 'Request rate', min: 0, max: 50000, step: 100, suffix: 'rps', description: '$1.00 per million HTTP requests.', affectsCost: true },
      { key: 'replication', label: 'Edge coverage', min: 1, max: 20, step: 1, description: 'Number of edge regions for content.' }
    ],
    apiGateway: [
      { key: 'requestRate', label: 'Request rate', min: 0, max: 50000, step: 100, suffix: 'rps', description: '$3.50 per million API calls.', affectsCost: true },
      { key: 'timeoutMs', label: 'Integration timeout', min: 100, max: 30000, step: 100, suffix: 'ms', description: 'Max wait for backend response.' },
      { key: 'retryPolicy', label: 'Retries', min: 0, max: 5, step: 1, description: 'Auto-retry attempts on backend failure.' }
    ],
    alb: [
      { key: 'connectionLimit', label: 'Connection limit', min: 10, max: 20000, step: 100, description: 'Max concurrent TCP connections.' },
      { key: 'dataTransferOut', label: 'Data processed', min: 0, max: 10000, step: 10, suffix: 'GB/mo', description: '$0.008/GB processed (LCU billing).', affectsCost: true },
      { key: 'timeoutMs', label: 'Idle timeout', min: 1, max: 4000, step: 10, suffix: 's', description: 'Idle time before connection close.' }
    ],
    ec2: [
      { key: 'cpu', label: 'CPU baseline', min: 1, max: 100, step: 1, suffix: '%', description: 'Steady-state CPU usage. High = less burst room.' },
      { key: 'memory', label: 'Memory baseline', min: 1, max: 100, step: 1, suffix: '%', description: 'RAM usage. 100% = OOM risk.' },
      { key: 'replication', label: 'Instance count', min: 1, max: 100, step: 1, description: 'Multiplies instance cost directly.', affectsCost: true },
      { key: 'connectionLimit', label: 'Connection limit', min: 10, max: 10000, step: 50, description: 'Max concurrent connections.' }
    ],
    ecs: [
      { key: 'cpu', label: 'Task vCPU', min: 25, max: 400, step: 25, suffix: '% (of 4 vCPU)', description: '$29.55/mo per vCPU (100%=1 vCPU).', affectsCost: true },
      { key: 'memory', label: 'Task memory', min: 50, max: 3000, step: 50, suffix: '% (of 1 GB)', description: '$3.25/mo per GB (100%=1 GB).', affectsCost: true },
      { key: 'replication', label: 'Desired tasks', min: 1, max: 100, step: 1, description: 'Number of tasks. Multiplies per-task cost.', affectsCost: true }
    ],
    autoScalingGroup: [
      { key: 'replication', label: 'Desired instances', min: 1, max: 100, step: 1, description: 'Starting EC2 count in the group.' },
      { key: 'autoscalingThreshold', label: 'Scale-out CPU', min: 30, max: 95, step: 1, suffix: '%', description: 'CPU target that triggers scale-out.' }
    ],
    lambda: [
      { key: 'memory', label: 'Memory allocation', min: 128, max: 10240, step: 128, suffix: 'MB', description: 'CPU scales with memory. $0.0000166667/GB-sec.', affectsCost: true },
      { key: 'requestRate', label: 'Invocation rate', min: 0, max: 50000, step: 50, suffix: 'rps', description: '$0.20 per million invocations.', affectsCost: true },
      { key: 'concurrency', label: 'Reserved concurrency', min: 1, max: 5000, step: 10, description: 'Max simultaneous executions.' },
      { key: 'timeoutMs', label: 'Timeout', min: 100, max: 900000, step: 1000, suffix: 'ms', description: 'Max runtime before kill (up to 15 min).' },
      { key: 'retryPolicy', label: 'Async retries', min: 0, max: 5, step: 1, description: 'Retry count for async invocations.' }
    ],
    sqs: [
      { key: 'requestRate', label: 'Message rate', min: 0, max: 100000, step: 100, suffix: 'msg/s', description: '$0.40 per million messages.', affectsCost: true },
      { key: 'queueDepth', label: 'Queue depth limit', min: 0, max: 100000, step: 100, description: 'Max backlog before rejection.' },
      { key: 'batchSize', label: 'Consumer batch size', min: 1, max: 100, step: 1, description: 'Messages per consumer poll.' }
    ],
    sns: [
      { key: 'requestRate', label: 'Publish rate', min: 0, max: 100000, step: 100, suffix: 'msg/s', description: '$0.50 per million publishes.', affectsCost: true },
      { key: 'retryPolicy', label: 'Delivery retries', min: 0, max: 10, step: 1, description: 'Retry attempts per subscriber.' }
    ],
    s3: [
      { key: 'storageSize', label: 'Storage size', min: 1, max: 5000, step: 10, suffix: 'GB', description: 'Billed per GB/mo by storage class.', affectsCost: true },
      { key: 'requestRate', label: 'Read/write rate', min: 0, max: 10000, step: 50, suffix: 'rps', description: '$0.005 per million GET/PUT.', affectsCost: true },
      { key: 'dataTransferOut', label: 'Data transfer out', min: 0, max: 10000, step: 10, suffix: 'GB/mo', description: '$0.09/GB egress.', affectsCost: true }
    ],
    rds: [
      { key: 'replication', label: 'Instances', min: 1, max: 16, step: 1, description: 'Primary + replicas. Each billed at instance size.', affectsCost: true },
      { key: 'storageSize', label: 'Storage volume', min: 20, max: 10000, step: 10, suffix: 'GB', description: '$0.115/GB/mo for gp3 EBS.', affectsCost: true },
      { key: 'connectionLimit', label: 'Max connections', min: 10, max: 20000, step: 50, description: 'Concurrent DB connections allowed.' }
    ],
    elastiCache: [
      { key: 'replication', label: 'Node count', min: 1, max: 16, step: 1, description: 'Nodes × instance size = total cost.', affectsCost: true },
      { key: 'cacheHitRate', label: 'Cache hit rate', min: 0, max: 100, step: 1, suffix: '%', description: '% served from cache vs database.' },
      { key: 'memory', label: 'Memory pressure', min: 1, max: 100, step: 1, suffix: '%', description: 'Current RAM usage of the cluster.' }
    ],
    dynamoDb: [
      { key: 'requestRate', label: 'Read/write units', min: 1, max: 20000, step: 50, description: 'WCU $0.65 + RCU $0.13 per unit.', affectsCost: true },
      { key: 'storageSize', label: 'Table storage', min: 0, max: 5000, step: 10, suffix: 'GB', description: '$0.25/GB/month.', affectsCost: true },
      { key: 'autoscalingThreshold', label: 'Auto scaling target', min: 30, max: 95, step: 1, suffix: '%', description: 'Target utilization for auto-scaling.' }
    ],
    natGateway: [
      { key: 'dataTransferOut', label: 'Data transfer out', min: 0, max: 10000, step: 10, suffix: 'GB/mo', description: '$32.40 base + $0.045/GB processed.', affectsCost: true }
    ],
    stepFunctions: [
      { key: 'requestRate', label: 'Transition rate', min: 0, max: 10000, step: 50, suffix: '/s', description: '$25 per million state transitions.', affectsCost: true },
      { key: 'retryPolicy', label: 'State retries', min: 0, max: 10, step: 1, description: 'Retry count for failed states.' },
      { key: 'timeoutMs', label: 'State timeout', min: 100, max: 300000, step: 1000, suffix: 'ms', description: 'Max duration per state execution.' }
    ],
    cloudWatch: [
      { key: 'storageSize', label: 'Log ingestion', min: 0, max: 5000, step: 10, suffix: 'GB/mo', description: '$0.50/GB ingested.', affectsCost: true },
      { key: 'batchSize', label: 'Log batch size', min: 1, max: 1000, step: 10, description: 'Events grouped per transmission.' }
    ],
    batch: [
      { key: 'requestRate', label: 'Job frequency', min: 0, max: 1000, step: 1, suffix: 'jobs/s', description: 'Rate at which new jobs are submitted.', affectsCost: true },
      { key: 'cpu', label: 'vCPU per job', min: 25, max: 400, step: 25, suffix: '% (of 4 vCPU)', description: '$29.55/mo per vCPU baseline.', affectsCost: true },
      { key: 'memory', label: 'Memory per job', min: 512, max: 30720, step: 512, suffix: 'MB', description: '$3.25/mo per GB baseline.', affectsCost: true },
      { key: 'latency', label: 'Job duration', min: 1000, max: 3600000, step: 5000, suffix: 'ms', description: 'How long each job runs on average.', affectsCost: true },
      { key: 'replication', label: 'Max concurrency', min: 1, max: 1000, step: 10, description: 'Max number of jobs that can run in parallel.' }
    ]
  };

  readonly serviceSelectFields: Partial<Record<AwsServiceType, SelectField[]>> = {
    client: [
      {
        key: 'requestRegion', label: 'Request Region',
        description: 'Select the region from where you are receiving maximum traffic',
        options: [
          { label: 'Global (Mixed)', value: 'global' },
          { label: 'us-east-1 - US East (N. Virginia)', value: 'us-east-1' },
          { label: 'us-east-2 - US East (Ohio)', value: 'us-east-2' },
          { label: 'us-west-1 - US West (N. California)', value: 'us-west-1' },
          { label: 'us-west-2 - US West (Oregon)', value: 'us-west-2' },
          { label: 'ca-central-1 - Canada (Central)', value: 'ca-central-1' },
          { label: 'eu-west-1 - Europe (Ireland)', value: 'eu-west-1' },
          { label: 'eu-west-2 - Europe (London)', value: 'eu-west-2' },
          { label: 'eu-west-3 - Europe (Paris)', value: 'eu-west-3' },
          { label: 'eu-central-1 - Europe (Frankfurt)', value: 'eu-central-1' },
          { label: 'eu-central-2 - Europe (Zurich)', value: 'eu-central-2' },
          { label: 'eu-north-1 - Europe (Stockholm)', value: 'eu-north-1' },
          { label: 'eu-south-1 - Europe (Milan)', value: 'eu-south-1' },
          { label: 'eu-south-2 - Europe (Spain)', value: 'eu-south-2' },
          { label: 'ap-east-1 - Asia Pacific (Hong Kong)', value: 'ap-east-1' },
          { label: 'ap-south-1 - Asia Pacific (Mumbai)', value: 'ap-south-1' },
          { label: 'ap-south-2 - Asia Pacific (Hyderabad)', value: 'ap-south-2' },
          { label: 'ap-northeast-1 - Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
          { label: 'ap-northeast-2 - Asia Pacific (Seoul)', value: 'ap-northeast-2' },
          { label: 'ap-northeast-3 - Asia Pacific (Osaka)', value: 'ap-northeast-3' },
          { label: 'ap-southeast-1 - Asia Pacific (Singapore)', value: 'ap-southeast-1' },
          { label: 'ap-southeast-2 - Asia Pacific (Sydney)', value: 'ap-southeast-2' },
          { label: 'ap-southeast-3 - Asia Pacific (Jakarta)', value: 'ap-southeast-3' },
          { label: 'ap-southeast-4 - Asia Pacific (Melbourne)', value: 'ap-southeast-4' },
          { label: 'me-south-1 - Middle East (Bahrain)', value: 'me-south-1' },
          { label: 'me-central-1 - Middle East (UAE)', value: 'me-central-1' },
          { label: 'sa-east-1 - South America (São Paulo)', value: 'sa-east-1' },
          { label: 'af-south-1 - Africa (Cape Town)', value: 'af-south-1' }
        ]
      }
    ],
    ec2: [
      {
        key: 'instanceSize', label: 'Instance Size', affectsCost: true,
        description: 'Nano=$4 → 4XL=$544/mo.',
        options: [
          { label: 'Nano (~$4/mo)', value: 'nano' },
          { label: 'Micro (~$8.50/mo)', value: 'micro' },
          { label: 'Small (~$17/mo)', value: 'small' },
          { label: 'Medium (~$34/mo)', value: 'medium' },
          { label: 'Large (~$68/mo)', value: 'large' },
          { label: 'XLarge (~$136/mo)', value: 'xlarge' },
          { label: '2XLarge (~$272/mo)', value: '2xlarge' },
          { label: '4XLarge (~$544/mo)', value: '4xlarge' }
        ]
      },
      {
        key: 'instanceType', label: 'Instance Family',
        description: 't3=burstable, c6g=compute, r6g=memory.',
        options: [
          { label: 'General Purpose (T3)', value: 't3' },
          { label: 'Compute Optimized (C6g)', value: 'c6g' },
          { label: 'Memory Optimized (R6g)', value: 'r6g' }
        ]
      }
    ],
    rds: [
      {
        key: 'instanceSize', label: 'Instance Size', affectsCost: true,
        description: 'DB class. Micro=$8.50 → 2XL=$272/mo.',
        options: [
          { label: 'Micro (~$8.50/mo)', value: 'micro' },
          { label: 'Small (~$17/mo)', value: 'small' },
          { label: 'Medium (~$34/mo)', value: 'medium' },
          { label: 'Large (~$68/mo)', value: 'large' },
          { label: 'XLarge (~$136/mo)', value: 'xlarge' },
          { label: '2XLarge (~$272/mo)', value: '2xlarge' }
        ]
      },
      {
        key: 'storageType', label: 'Storage Class',
        description: 'gp3=balanced, io1=high IOPS.',
        options: [
          { label: 'General Purpose (gp3)', value: 'gp3' },
          { label: 'Provisioned IOPS (io1)', value: 'io1' }
        ]
      }
    ],
    elastiCache: [
      {
        key: 'instanceSize', label: 'Node Size', affectsCost: true,
        description: 'Micro=$8.50 → XL=$136/mo per node.',
        options: [
          { label: 'Micro (~$8.50/mo)', value: 'micro' },
          { label: 'Small (~$17/mo)', value: 'small' },
          { label: 'Medium (~$34/mo)', value: 'medium' },
          { label: 'Large (~$68/mo)', value: 'large' },
          { label: 'XLarge (~$136/mo)', value: 'xlarge' }
        ]
      }
    ],
    s3: [
      {
        key: 'storageClass', label: 'Storage Class', affectsCost: true,
        description: 'Standard=$0.023, IA=$0.0125, Glacier=$0.004/GB.',
        options: [
          { label: 'Standard ($0.023/GB)', value: 'standard' },
          { label: 'Infrequent Access ($0.0125/GB)', value: 'infrequent-access' },
          { label: 'Glacier ($0.004/GB)', value: 'glacier' }
        ]
      }
    ]
  };

  tabs: CanvasTab[] = [];
  activeTabIndex = 0;
  editingTabIndex: number | null = null;
  showSaveLoader = false;
  showSaveSuccess = false;
  roleMode: 'developer' | 'architect' = 'architect';

  projectName = 'Untitled AWS Architecture';
  globalCurrency: Currency = 'USD';
  globalRegion: string = 'us-east-1';
  showAllServices: boolean = false;
  paletteSearch = '';
  leftCollapsed = false;
  rightCollapsed = false;
  collapsedCategories = new Set<string>();
  nodes: ArchitectureNode[] = [];
  connections: ArchitectureConnection[] = [];
  annotations: Annotation[] = [];
  packets: DataPacket[] = [];
  selectedNodeIds: string[] = [];
  selectedConnectionIds: string[] = [];
  ctrlPressed = false;
  advancedConfigExpanded = false;
  costEvaluationExpanded = false;
  public selectionTrigger = (event: any): boolean => {
    // Support for Chrome, Edge, and Mac (Meta)
    const e = event.originalEvent || event;
    return !!(e.ctrlKey || e.metaKey || e.shiftKey);
  };
  validationMessage = 'Drag AWS services onto the canvas, then connect output ports to input ports.';
  validationTone: 'neutral' | 'success' | 'error' = 'neutral';
  zoom = 1;
  pan = { x: 0, y: 0 };
  readonly minimapMinSize = 1400;
  isMobileViewport = false;
  minimapVisible = false;
  runStatsExpanded = false;
  mode = 'idle';

  showMobileWarning = true;
  mobileWarningDismissed = false;
  totals = { processed: 0, dropped: 0, avgLatency: 0 };

  private activePort?: PortSelection;
  private snapshotSubscription?: Subscription;
  private minimapHideTimer?: ReturnType<typeof setTimeout>;
  private mobileMediaQuery?: MediaQueryList;
  private wasMobileViewport = false;
  private readonly onMobileViewportChange = (): void => this.updateMobileViewport();


  constructor(
    readonly awsCatalog: AwsCatalogService,
    private readonly factory: ArchitectureFactoryService,
    private readonly validation: ValidationRuleService,
    private readonly simulation: SimulationService,
    private readonly presets: PresetService,
    private readonly storage: ProjectStorageService,
    public readonly costService: CostService,
    private readonly elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'developer' || modeParam === 'architect') {
        this.roleMode = modeParam;
      }
    }

    this.updateMobileViewport();
    this.mobileMediaQuery = window.matchMedia(SimulatorComponent.mobileMediaQueryList);
    this.mobileMediaQuery.addEventListener('change', this.onMobileViewportChange);

    const local = this.storage.loadLocal();
    // If we have a local project and it's NOT the default preset, load it.
    // Otherwise, always load the latest preset code.
    if (local && local.id !== 'preset-ecommerce-serverless') {
      this.applyProject(local);
    } else {
      this.applyProject(this.presets.ecommercePreset());
    }

    this.snapshotSubscription = this.simulation.snapshot$.subscribe((snapshot) => {
      this.mode = snapshot.mode;
      this.totals = snapshot.totals;
      this.packets = snapshot.packets;
      if (snapshot.nodes.length > 0) {
        this.nodes = snapshot.nodes.map((node) => ({ ...node, selected: this.selectedNodeIds.includes(node.id) }));
        this.connections = snapshot.connections;
      }
    });
  }

  addAnnotation(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const point = this.toCanvasPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      x = point.x - 110;
      y = point.y - 60;
    }

    const id = `anno-${Date.now()}`;
    const annotation: Annotation = {
      id,
      text: 'New Note',
      x,
      y,
      width: 220,
      height: 120,
      fontSize: 16,
      fontWeight: 'normal',
      selected: true
    };
    this.annotations = [...this.annotations, annotation];
    this.selectAnnotation(id);
  }

  addService(type: AwsServiceType, x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const point = this.toCanvasPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      x = point.x - 82;
      y = point.y - 42;
    }
    const node = this.factory.createNode(type, x, y);
    this.nodes = [...this.nodes, node];
    this.selectNode(node.id);
    this.revealMinimap();
    this.setMessage(`${node.name} added to the architecture.`, 'success');
  }

  selectAnnotation(id: string): void {
    this.selectedNodeIds = [];
    this.selectedConnectionIds = [];
    this.annotations = this.annotations.map(a => ({ ...a, selected: a.id === id }));
    this.nodes = this.nodes.map(n => ({ ...n, selected: false }));
  }

  updateAnnotationText(id: string, event: Event): void {
    const text = (event.target as HTMLElement).innerText;
    // We only update the model to sync state, but avoid triggering logic that might re-render the div
    const anno = this.annotations.find(a => a.id === id);
    if (anno && anno.text !== text) {
      anno.text = text;
    }
  }

  deleteAnnotation(id: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.annotations = this.annotations.filter(a => a.id !== id);
    this.setMessage('Annotation deleted.', 'neutral');
  }

  toggleAnnotationBold(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.annotations = this.annotations.map(a =>
      a.id === id ? { ...a, fontWeight: a.fontWeight === 'bold' ? 'normal' : 'bold' } : a
    );
  }

  changeAnnotationFontSize(id: string, delta: number, event: MouseEvent): void {
    event.stopPropagation();
    this.annotations = this.annotations.map(a =>
      a.id === id ? { ...a, fontSize: Math.max(8, Math.min(72, a.fontSize + delta)) } : a
    );
  }

  startResizingAnnotation(id: string, event: PointerEvent): void {
    event.stopPropagation();
    event.preventDefault();
    const anno = this.annotations.find(a => a.id === id);
    if (!anno) return;

    const startW = anno.width;
    const startH = anno.height;
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / this.zoom;
      const dy = (moveEvent.clientY - startY) / this.zoom;
      this.annotations = this.annotations.map(a =>
        a.id === id ? {
          ...a,
          width: Math.max(100, startW + dx),
          height: Math.max(40, startH + dy)
        } : a
      );
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  ngAfterViewInit(): void {
    // Ensure the initial project is correctly synced with the flow canvas once it's available
    if (this.flowCanvas) {
      this.flowCanvas.setScale(this.zoom);
      this.flowCanvas._setPosition(this.pan);
      this.flowCanvas.redraw();
    }

    // Direct event isolation on the toolbar container.
    // By stopping touch events from bubbling up to the document level,
    // we bypass f-flow's global touch event interceptors, allowing
    // Android Chrome and other browsers to use native momentum scrolling.
    const toolbarActions = this.elementRef.nativeElement.querySelector('.toolbar-actions');
    if (toolbarActions) {
      const stopTouch = (e: TouchEvent) => {
        e.stopPropagation();
      };
      toolbarActions.addEventListener('touchstart', stopTouch, { passive: true });
      toolbarActions.addEventListener('touchmove', stopTouch, { passive: true });
      toolbarActions.addEventListener('touchend', stopTouch, { passive: true });
    }
  }

  ngOnDestroy(): void {
    this.snapshotSubscription?.unsubscribe();
    this.mobileMediaQuery?.removeEventListener('change', this.onMobileViewportChange);
    this.clearMinimapHideTimer();
    this.simulation.stop();
  }
  private calculateNodeHealth(node: ArchitectureNode): { tone: 'success' | 'warning' | 'error' | 'neutral', message: string } {
    const inputs = this.connections.filter(c => c.targetNodeId === node.id).length;
    const outputs = this.connections.filter(c => c.sourceNodeId === node.id).length;
    const total = inputs + outputs;

    if (total === 0) {
      return { tone: 'neutral', message: 'Connect the input or output nodes to get the health status.' };
    }

    const definition = this.awsCatalog.getByType(node.type);
    const { mandatoryInput, mandatoryOutput, allowFanIn, allowFanOut } = definition.behavior;

    // MANDATORY INPUT CHECK
    if (mandatoryInput && inputs === 0) {
      return { tone: 'error', message: `Integration error: ${node.name} must have at least one input connection.` };
    }

    // MANDATORY OUTPUT CHECK
    if (mandatoryOutput && outputs === 0) {
      return { tone: 'error', message: `Integration error: ${node.name} must have an output connection to continue the flow.` };
    }

    // FAN-IN CHECK
    if (!allowFanIn && inputs > 1) {
      return { tone: 'error', message: `Architecture error: ${node.name} does not support multiple incoming connections (Fan-in prohibited).` };
    }

    // FAN-OUT CHECK
    if (!allowFanOut && outputs > 1) {
      return { tone: 'error', message: `Architecture error: ${node.name} does not support multiple outgoing connections (Fan-out prohibited).` };
    }

    // Dynamic checks
    if (this.mode === 'running') {
      if (node.status === 'offline' || node.status === 'failing') {
        return { tone: 'error', message: `Operational Failure: ${node.name} is ${node.status}. Traffic is being dropped.` };
      }
      if (node.status === 'overloaded' || node.status === 'busy') {
        return { tone: 'warning', message: `Performance Warning: ${node.name} is ${node.status}. Latency is increasing.` };
      }
    }

    return { tone: 'success', message: `${node.name} is correctly integrated and ready for traffic.` };
  }

  get inspectorHealth(): { tone: 'success' | 'warning' | 'error' | 'neutral', message: string } {
    if (this.selectedNode) {
      return this.calculateNodeHealth(this.selectedNode);
    }

    // Check if any node is in an error state
    const nodesWithErrors = this.nodes.filter(n => this.calculateNodeHealth(n).tone === 'error');
    if (nodesWithErrors.length > 0) {
      return {
        tone: 'error',
        message: `Architecture issues detected. ${nodesWithErrors.length} service(s) report critical errors or offline status.`
      };
    }

    // Check if any node is in a warning state
    const nodesWithWarnings = this.nodes.filter(n => this.calculateNodeHealth(n).tone === 'warning');
    if (nodesWithWarnings.length > 0) {
      return {
        tone: 'warning',
        message: `Performance warning. ${nodesWithWarnings.length} service(s) are currently busy or overloaded.`
      };
    }

    if (this.nodes.length > 0) {
      return {
        tone: 'success',
        message: 'Architecture is healthy. All services are correctly integrated and operational.'
      };
    }

    return { tone: 'neutral', message: 'Drag AWS services onto the canvas and connect them to build your architecture.' };
  }

  get isSimulationDisabled(): boolean {
    // If any node has an 'error' health, we could disable it. 
    // But the user specifically asked to disable it when health is red.
    return this.nodes.some(n => this.calculateNodeHealth(n).tone === 'error');
  }

  get erroredNodes(): ArchitectureNode[] {
    return this.nodes.filter(n => this.calculateNodeHealth(n).tone === 'error');
  }

  get selectedNode(): ArchitectureNode | undefined {
    return this.nodes.find((node) => node.id === (this.selectedNodeIds[0] ?? ''));
  }

  get selectedDefinition(): AwsServiceDefinition | undefined {
    return this.selectedNode ? this.awsCatalog.getByType(this.selectedNode.type) : undefined;
  }

  openDocsForService(type: string): void {
    const docsUrl = `${window.location.origin}/docs?service=${type}`;
    window.open(docsUrl, '_blank', 'noopener,noreferrer');
  }

  get selectedConfigFields(): ConfigField[] {
    if (!this.selectedNode) {
      return [];
    }
    const specific = this.serviceConfigFields[this.selectedNode.type] ?? [];
    const merged = [...this.commonConfigFields, ...specific];
    return merged.filter((field, index) => merged.findIndex((candidate) => candidate.key === field.key) === index);
  }

  get selectedSelectFields(): SelectField[] {
    return this.selectedNode ? this.serviceSelectFields[this.selectedNode.type] ?? [] : [];
  }

  get hasJsonModel(): boolean {
    if (!this.selectedNode) return false;
    return !!(serviceCostModelData.serviceCostModel as any)[this.selectedNode.type];
  }

  get selectedPrimaryParams(): any[] {
    if (!this.selectedNode) return [];
    const model = (serviceCostModelData.serviceCostModel as any)[this.selectedNode.type];
    return model?.primaryParams || [];
  }

  get selectedAdvancedParams(): any[] {
    if (!this.selectedNode) return [];
    const model = (serviceCostModelData.serviceCostModel as any)[this.selectedNode.type];
    return model?.advancedTune || [];
  }

  get selectedCostParams(): any[] {
    if (!this.selectedNode) return [];
    const model = (serviceCostModelData.serviceCostModel as any)[this.selectedNode.type];
    return model?.costParams || [];
  }

  get selectedCostEvaluation(): any {
    if (!this.selectedNode) return null;
    const model = (serviceCostModelData.serviceCostModel as any)[this.selectedNode.type];
    return model?.costEvaluation || null;
  }

  get costBreakdown(): CostBreakdown | null {
    if (!this.selectedNode) return null;
    return this.costService.getCostBreakdown(this.selectedNode, this.globalRegion);
  }

  get selectedConnection(): ArchitectureConnection | undefined {
    return this.connections.find((connection) => connection.id === (this.selectedConnectionIds[0] ?? ''));
  }

  get selectedConnectionSummary(): string {
    const connection = this.selectedConnection;
    if (!connection) {
      return '';
    }
    const source = this.nodes.find((node) => node.id === connection.sourceNodeId)?.name ?? 'Unknown';
    const target = this.nodes.find((node) => node.id === connection.targetNodeId)?.name ?? 'Unknown';
    return `${source} -> ${target}`;
  }

  get filteredCatalog(): AwsServiceDefinition[] {
    const query = this.paletteSearch.trim().toLowerCase();
    let services = this.catalog;

    const devServices = new Set([
      'client', 'route53', 'cloudfront', 'apiGateway', 'alb', 'lambda',
      'ec2', 'ecs', 'eks', 'appRunner', 's3', 'efs', 'rds', 'aurora',
      'dynamoDb', 'elastiCache', 'sqs', 'sns', 'eventBridge', 'stepFunctions',
      'cloudWatch', 'xray', 'cognito', 'appSync', 'bedrock'
    ]);

    if (this.roleMode === 'developer') {
      services = services.filter(s => devServices.has(s.type));
    } else {
      // Architect Mode
      if (!this.showAllServices) {
        services = services.filter(s => devServices.has(s.type));
      } else {
        // Exclude governance/security services from being primary draggable blocks
        const primaryExclusions = new Set([
          'iam', 'kms', 'securityGroup', 'certificateManager', 'backup', 'cloudTrail'
        ]);
        services = services.filter(s => !primaryExclusions.has(s.type));
      }
    }

    if (!query) {
      return services;
    }
    return services.filter((service) =>
      service.name.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query) ||
      service.type.toLowerCase().includes(query)
    );
  }

  get catalogCategories(): Array<{ name: string; services: AwsServiceDefinition[] }> {
    const categories = new Map<string, AwsServiceDefinition[]>();
    for (const service of this.filteredCatalog) {
      const list = categories.get(service.category) ?? [];
      list.push(service);
      categories.set(service.category, list);
    }
    return [...categories.entries()].map(([name, services]) => ({ name, services }));
  }

  get totalCost(): number {
    return this.costService.calculateTotalMonthlyCost(this.nodes, this.globalCurrency, this.globalRegion);
  }

  get totalCostFormatted(): string {
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);
    return `${symbol}${this.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get mobileSidebarOpen(): boolean {
    return !this.leftCollapsed || !this.rightCollapsed;
  }

  get hasSelection(): boolean {
    return this.selectedNodeIds.length > 0 ||
      this.selectedConnectionIds.length > 0 ||
      this.annotations.some(a => a.selected);
  }

  getNodeCostFormatted(node: ArchitectureNode): string {
    const cost = this.costService.calculateNodeCostUsd(node, this.globalRegion) * (this.globalCurrency === 'USD' ? 1 : this.costService['conversionRates'][this.globalCurrency]);
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);
    return `${symbol}${cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  setCurrency(currency: Currency): void {
    this.globalCurrency = currency;
  }

  setRegion(region: string): void {
    this.globalRegion = region;
    this.onConfigChange();
  }

  goHome(): void {
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new Event("popstate"));
  }

  goDocs(): void {
    window.history.pushState(null, "", "/docs");
    window.dispatchEvent(new Event("popstate"));
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const isSaveHotkey = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
    if (isSaveHotkey) {
      event.preventDefault();
      this.triggerSaveWithLoader();
      return;
    }

    if (event.key === 'Control' || event.key === 'Meta' || event.key === 'Shift') {
      this.ctrlPressed = true;
      return;
    }

    if (event.key !== 'Delete' && event.key !== 'Backspace') {
      return;
    }
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.contentEditable === 'true') {
      return;
    }
    if (this.hasSelection) {
      event.preventDefault();
      this.deleteSelected();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent): void {
    if (event.key === 'Control' || event.key === 'Meta' || event.key === 'Shift') {
      this.ctrlPressed = false;
    }
  }

  onPaletteDragStart(event: DragEvent, type: AwsServiceType): void {
    event.dataTransfer?.setData('application/aws-service', type);
  }

  onAnnotationDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('application/annotation', 'true');
  }

  connectorId(nodeId: string, portId: string): string {
    return `${nodeId}:${portId}`;
  }

  inputPorts(node: ArchitectureNode): ServicePort[] {
    return node.ports.filter((port) => port.direction === 'input');
  }

  outputPorts(node: ArchitectureNode): ServicePort[] {
    return node.ports.filter((port) => port.direction === 'output');
  }


  onCanvasPointerDown(event: PointerEvent): void {
    if (this.isFlowInteractiveTarget(event.target)) {
      return;
    }
    // Library handles panning via fZoom directive
  }

  onCanvasPointerMove(event: PointerEvent): void {
    // Library handles panning via fZoom directive
  }

  onCanvasPointerUp(event: PointerEvent): void {
    if (this.canvasRef.nativeElement.hasPointerCapture(event.pointerId)) {
      this.canvasRef.nativeElement.releasePointerCapture(event.pointerId);
    }
  }

  onCanvasTouchStart(event: TouchEvent): void {
    // Handled by library
  }

  private isFlowInteractiveTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
      return false;
    }
    return !!target.closest(
      '.node-card, .annotation-node, .port, .f-connection, .mini-map, button, a, input, select, textarea, [contenteditable="true"]'
    );
  }

  private cancelCanvasPan(): void {
    // Native library panning doesn't need manual cancellation here
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const point = this.toCanvasPoint(event.clientX, event.clientY);

    // Handle AWS Service Drop
    const type = event.dataTransfer?.getData('application/aws-service') as AwsServiceType;
    if (type) {
      const node = this.factory.createNode(type, point.x - 82, point.y - 42);
      this.nodes = [...this.nodes, node];
      this.selectNode(node.id);
      this.revealMinimap();
      this.setMessage(`${node.name} added to the architecture.`, 'success');
      return;
    }

    // Handle Annotation Drop
    const isAnnotation = event.dataTransfer?.getData('application/annotation') === 'true';
    if (isAnnotation) {
      this.addAnnotation(point.x - 110, point.y - 60);
      this.setMessage('Note added to the architecture.', 'success');
    }
  }

  onFoblexMoveNodes(event: FMoveNodesEvent): void {
    this.nodes = this.nodes.map((node) => {
      const moved = event.nodes.find((item) => item.id === node.id);
      return moved ? { ...node, x: moved.position.x, y: moved.position.y } : node;
    });
    this.annotations = this.annotations.map((anno) => {
      const moved = event.nodes.find((item) => item.id === anno.id);
      return moved ? { ...anno, x: moved.position.x, y: moved.position.y } : anno;
    });
    this.revealMinimap();
  }

  onNodePositionChange(nodeId: string, position: { x: number; y: number }): void {
    this.nodes = this.nodes.map((node) => node.id === nodeId ? { ...node, x: position.x, y: position.y } : node);
  }

  onFoblexSelection(event: FSelectionChangeEvent): void {
    this.selectedNodeIds = event.nodeIds.filter(id => this.nodes.some(n => n.id === id));
    const selectedAnnoIds = event.nodeIds.filter(id => this.annotations.some(a => a.id === id));
    this.selectedConnectionIds = event.connectionIds;

    if (this.selectedNodeIds.length > 0 || this.selectedConnectionIds.length > 0 || selectedAnnoIds.length > 0) {
      // No automatic expansion as per user request
    }

    // Update the selected flag on nodes for UI feedback
    this.nodes = this.nodes.map(node => ({
      ...node,
      selected: this.selectedNodeIds.includes(node.id)
    }));

    // Update the selected flag on annotations
    this.annotations = this.annotations.map(anno => ({
      ...anno,
      selected: selectedAnnoIds.includes(anno.id)
    }));
  }

  serviceColor(type: AwsServiceType): string {
    return this.awsCatalog.getByType(type).color;
  }

  onFoblexCanvasChange(event: FCanvasChangeEvent): void {
    this.pan = { x: event.position.x, y: event.position.y };
    this.zoom = Number(event.scale.toFixed(2));
    this.revealMinimap();
  }

  onMinimapInteract(event: Event): void {
    event.stopPropagation();
    this.revealMinimap();
  }

  onFoblexCreateConnection(event: FCreateConnectionEvent): void {
    const source = this.findPortSelection(event.sourceId);
    const target = this.findPortSelection(event.targetId ?? '');
    if (!source || !target) {
      this.setMessage('Drop the connection onto a compatible AWS input port.', 'error');
      return;
    }
    this.tryCreateConnection(source.node, source.port, target.node, target.port);
  }

  onPortClick(event: MouseEvent, node: ArchitectureNode, port: ServicePort): void {
    event.stopPropagation();
    if (port.direction === 'output') {
      this.activePort = { node, port };
      this.setMessage(`Connect ${node.name} ${port.label} to a compatible input port.`, 'neutral');
      return;
    }

    if (!this.activePort) {
      this.setMessage('Start from an output port, then choose a compatible input port.', 'error');
      return;
    }

    const sourceDef = this.awsCatalog.getByType(this.activePort.node.type);
    if (sourceDef.behavior.allowedTargets.length > 0 && !sourceDef.behavior.allowedTargets.includes(node.type)) {
      this.setMessage(`${sourceDef.name} cannot be connected directly to ${node.name}. Follow AWS integration patterns.`, 'error');
      this.activePort = undefined;
      return;
    }

    this.tryCreateConnection(this.activePort.node, this.activePort.port, node, port);
    this.activePort = undefined;
  }

  tryCreateConnection(sourceNode: ArchitectureNode, sourcePort: ServicePort, targetNode: ArchitectureNode, targetPort: ServicePort): void {
    let finalSourcePort = sourcePort;
    let finalTargetPort = targetPort;
    let result = this.validation.validate(sourceNode, sourcePort, targetNode, targetPort, this.connections);

    // If exact port match fails, auto-correct by finding ANY valid port combination between these two nodes
    if (!result.allowed) {
      const allOutputs = sourceNode.ports.filter(p => p.direction === 'output');
      const allInputs = targetNode.ports.filter(p => p.direction === 'input');

      let foundAlternative = false;
      for (const sp of allOutputs) {
        for (const tp of allInputs) {
          const altResult = this.validation.validate(sourceNode, sp, targetNode, tp, this.connections);
          if (altResult.allowed) {
            finalSourcePort = sp;
            finalTargetPort = tp;
            result = altResult;
            foundAlternative = true;
            break;
          }
        }
        if (foundAlternative) break;
      }
    }

    if (!result.allowed) {
      this.setMessage(result.message, 'error');
      return;
    }

    const connection = this.factory.createConnection(
      sourceNode.id,
      finalSourcePort.id,
      targetNode.id,
      finalTargetPort.id,
      this.validation.connectionTypeFor(result.ruleId, finalSourcePort.type),
      result.message
    );
    this.connections = [...this.connections, connection];
    this.setMessage(result.message, 'success');
  }

  selectNode(id: string): void {
    this.selectedNodeIds = [id];
    this.selectedConnectionIds = [];
    this.nodes = this.nodes.map((node) => ({ ...node, selected: node.id === id }));
    this.advancedConfigExpanded = false;
    this.costEvaluationExpanded = false;
  }

  selectConnection(id: string): void {
    this.selectedConnectionIds = [id];
    this.selectedNodeIds = [];
    this.nodes = this.nodes.map((node) => ({ ...node, selected: false }));
    this.annotations = this.annotations.map(a => ({ ...a, selected: false }));
  }

  clearSelection(): void {
    this.selectedNodeIds = [];
    this.selectedConnectionIds = [];
    this.nodes = this.nodes.map((node) => ({ ...node, selected: false }));
    this.annotations = this.annotations.map(a => ({ ...a, selected: false }));
  }

  deleteSelected(): void {
    const nodeCount = this.selectedNodeIds.length;
    const connectionCount = this.selectedConnectionIds.length;
    const selectedAnnoIds = this.annotations.filter(a => a.selected).map(a => a.id);
    const annoCount = selectedAnnoIds.length;

    if (nodeCount === 0 && connectionCount === 0 && annoCount === 0) return;

    // 1. Delete selected connections
    if (connectionCount > 0) {
      this.connections = this.connections.filter(c => !this.selectedConnectionIds.includes(c.id));
    }

    // 2. Delete selected nodes and their associated connections
    if (nodeCount > 0) {
      this.connections = this.connections.filter(c =>
        !this.selectedNodeIds.includes(c.sourceNodeId) &&
        !this.selectedNodeIds.includes(c.targetNodeId)
      );
      this.nodes = this.nodes.filter(n => !this.selectedNodeIds.includes(n.id));
    }

    // 3. Delete selected annotations
    if (annoCount > 0) {
      this.annotations = this.annotations.filter(a => !selectedAnnoIds.includes(a.id));
    }

    const msg = nodeCount > 0
      ? `Deleted ${nodeCount} service(s) and their links.`
      : annoCount > 0 ? `Deleted ${annoCount} annotation(s).`
        : `Deleted ${connectionCount} link(s).`;

    this.clearSelection();
    this.setMessage(msg, 'neutral');
  }

  deleteNode(event: MouseEvent, nodeId: string): void {
    event.stopPropagation();
    this.selectNode(nodeId);
    this.deleteSelected();
  }

  deleteConnection(event: MouseEvent, connectionId: string): void {
    event.stopPropagation();
    this.selectConnection(connectionId);
    this.deleteSelected();
  }

  startSimulation(): void {
    if (this.isSimulationDisabled) {
      this.setMessage('Fix integration errors (red health cards) before running the simulation.', 'error');
      return;
    }
    this.simulation.start(this.nodes, this.connections);
    this.setMessage('Simulation started. Real-time traffic is flowing.', 'success');
  }

  pauseSimulation(): void {
    this.mode === 'paused' ? this.simulation.resume() : this.simulation.pause();
  }

  stopSimulation(): void {
    this.simulation.stop();
    this.packets = [];
    this.setMessage('Simulation stopped.', 'neutral');
  }

  openDocs(): void {
    this.simulation.stop();
    window.history.pushState(null, '', '/docs');
    window.dispatchEvent(new Event('popstate'));
  }



  dismissMobileWarning(): void {
    this.mobileWarningDismissed = true;
    setTimeout(() => {
      this.showMobileWarning = false;
    }, 500);
  }

  triggerSaveWithLoader(): void {
    this.saveActiveTabState();
    this.showSaveLoader = true;
    setTimeout(() => {
      this.showSaveLoader = false;
      this.showSaveSuccess = true;
      const project = this.currentProject();
      this.storage.save(project).subscribe();
      this.setMessage('Architecture saved successfully.', 'success');
      setTimeout(() => {
        this.showSaveSuccess = false;
      }, 2000);
    }, 850);
  }

  saveProject(): void {
    this.triggerSaveWithLoader();
  }

  downloadProject(): void {
    const project = this.currentProject();
    const tabName = this.tabs[this.activeTabIndex]?.name || 'hld-architecture';
    const safeName = tabName.replace(/[/\\?%*:|"<> ]/g, '-').replace(/-+/g, '-').trim().toLowerCase();
    const fileName = `${safeName || 'architecture'}.json`;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    this.setMessage(`Project exported as ${fileName}.`, 'success');
  }

  importProject(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string) as ArchitectureProject;
        this.simulation.stop();
        this.applyProject(project);
        this.setMessage('Project imported successfully.', 'success');
      } catch (err) {
        this.setMessage('Invalid project file format.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  loadPreset(): void {
    this.simulation.stop();
    this.applyProject(this.presets.ecommercePreset());
    this.setMessage('Loaded the serverless commerce preset.', 'success');
  }

  resetCanvas(): void {
    this.simulation.stop();
    this.nodes = [];
    this.connections = [];
    this.packets = [];
    this.clearSelection();
    this.setMessage('Canvas reset.', 'neutral');
  }

  setZoom(delta: number): void {
    const next = Math.min(1.8, Math.max(0.45, Number((this.zoom + delta).toFixed(2))));
    this.flowCanvas?.setScale(next);
    this.revealMinimap();
  }

  toggleRunStats(): void {
    this.runStatsExpanded = !this.runStatsExpanded;
  }

  onRunStatsMouseLeave(): void {
    const selects = document.querySelectorAll('.run-stats select');
    selects.forEach((select) => (select as HTMLElement).blur());
  }

  onPanelClick(event: MouseEvent): void {
    if (!this.isMobileViewport) return;
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('select') ||
      target.closest('.region-select-wrapper')
    ) {
      return;
    }
    this.toggleRunStats();
  }

  closeMobileSidebars(): void {
    this.leftCollapsed = true;
    this.rightCollapsed = true;
  }

  toggleLeftSidebar(): void {
    const opening = this.leftCollapsed;
    this.leftCollapsed = !this.leftCollapsed;
    if (this.isMobileViewport && opening) {
      this.rightCollapsed = true;
    }
  }

  toggleRightSidebar(): void {
    const opening = this.rightCollapsed;
    this.rightCollapsed = !this.rightCollapsed;
    if (this.isMobileViewport && opening) {
      this.leftCollapsed = true;
    }
  }

  toggleCategory(category: string): void {
    const next = new Set(this.collapsedCategories);
    next.has(category) ? next.delete(category) : next.add(category);
    this.collapsedCategories = next;
  }

  isCategoryCollapsed(category: string): boolean {
    return this.collapsedCategories.has(category);
  }

  updateConfig(key: any, value: number): void {
    if (!this.selectedNode) {
      return;
    }
    this.nodes = this.nodes.map((node) =>
      this.selectedNodeIds.includes(node.id) ? { ...node, config: { ...node.config, [key]: Number(value) } } : node
    );
    this.onConfigChange();
  }

  updateSelectConfig(key: any, value: any): void {
    if (!this.selectedNode) {
      return;
    }
    this.nodes = this.nodes.map((node) =>
      this.selectedNodeIds.includes(node.id) ? { ...node, config: { ...node.config, [key]: value } } : node
    );
    this.onConfigChange();
  }

  updateNodeName(value: string): void {
    const targetId = this.selectedNodeIds[0];
    if (!targetId) {
      return;
    }
    this.nodes = this.nodes.map((node) =>
      node.id === targetId ? { ...node, name: value } : node
    );
  }

  onConfigChange(): void {
    // Sync local changes to the simulation service so they take effect immediately
    this.simulation.updateNodes(this.nodes, this.connections);
  }

  nodeStyle(node: ArchitectureNode): Record<string, string> {
    return {
      transform: `translate(${node.x}px, ${node.y}px)`,
      borderColor: this.statusColor(node.status)
    };
  }

  edgePath(connection: ArchitectureConnection): string {
    const source = this.nodes.find((node) => node.id === connection.sourceNodeId);
    const target = this.nodes.find((node) => node.id === connection.targetNodeId);
    if (!source || !target) {
      return '';
    }
    const start = this.portPoint(source, 'output');
    const end = this.portPoint(target, 'input');
    const curve = Math.max(80, Math.abs(end.x - start.x) * 0.45);
    return `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
  }

  packetPoint(packet: DataPacket): { x: number; y: number } {
    const connection = this.connections.find((candidate) => candidate.id === packet.connectionId);
    if (!connection) {
      return { x: 0, y: 0 };
    }
    const source = this.nodes.find((node) => node.id === connection.sourceNodeId);
    const target = this.nodes.find((node) => node.id === connection.targetNodeId);
    if (!source || !target) {
      return { x: 0, y: 0 };
    }
    const start = this.portPoint(source, 'output');
    const end = this.portPoint(target, 'input');
    return {
      x: start.x + (end.x - start.x) * packet.progress,
      y: start.y + (end.y - start.y) * packet.progress
    };
  }

  connectionMidpoint(connection: ArchitectureConnection): { x: number; y: number } {
    const source = this.nodes.find((node) => node.id === connection.sourceNodeId);
    const target = this.nodes.find((node) => node.id === connection.targetNodeId);
    if (!source || !target) {
      return { x: 0, y: 0 };
    }
    const start = this.portPoint(source, 'output');
    const end = this.portPoint(target, 'input');
    return {
      x: start.x + (end.x - start.x) * 0.5,
      y: start.y + (end.y - start.y) * 0.5
    };
  }

  statusColor(status: HealthStatus): string {
    const colors: Record<HealthStatus, string> = {
      normal: '#16a34a',
      busy: '#d97706',
      overloaded: '#ea580c',
      failing: '#dc2626',
      offline: '#dc2626' // red when stopped/offline
    };
    return colors[status];
  }

  connectionColor(connection: ArchitectureConnection): string {
    if (connection.traffic.errorRate > 10) {
      return '#dc2626'; // red when stopped/failing
    }
    if (connection.traffic.intensity > 0.7) {
      return '#eab308'; // yellow when busy
    }
    return '#111827'; // default
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  isPortSelected(nodeId: string, portId: string): boolean {
    return this.activePort?.node.id === nodeId && this.activePort?.port.id === portId;
  }

  trackByService(_: number, item: any): string {
    return item.type;
  }

  trackByCategory(_: number, item: { name: string }): string {
    return item.name;
  }

  private applyProject(project: ArchitectureProject): void {
    this.projectName = project.name;
    this.globalCurrency = project.currency || 'USD';
    this.globalRegion = project.region || 'us-east-1';
    this.nodes = project.nodes;
    this.connections = project.connections;
    this.annotations = project.annotations || [];
    this.packets = [];
    this.clearSelection();

    // Reset view to make the project visible
    this.zoom = this.isMobileViewport ? 0.65 : 0.85;
    this.pan = { x: 40, y: 40 };

    if (this.flowCanvas) {
      this.flowCanvas.setScale(this.zoom);
      this.flowCanvas._setPosition(this.pan);
      this.flowCanvas.redraw();
    }

    this.revealMinimap();

    if (this.tabs.length === 0) {
      this.tabs = [{
        id: `tab-${Date.now()}`,
        name: project.name || 'Canvas 1',
        projectName: project.name || 'Untitled AWS Architecture',
        nodes: [...this.nodes],
        connections: [...this.connections],
        annotations: [...this.annotations],
        packets: [],
        selectedNodeIds: [],
        selectedConnectionIds: [],
        zoom: this.zoom,
        pan: { ...this.pan },
        globalCurrency: this.globalCurrency,
        globalRegion: this.globalRegion,
        simulationMode: 'idle',
        totals: { processed: 0, dropped: 0, avgLatency: 0 },
        tick: 0
      }];
      this.activeTabIndex = 0;
    } else {
      const tab = this.tabs[this.activeTabIndex];
      tab.name = project.name || `Canvas ${this.activeTabIndex + 1}`;
      tab.projectName = project.name || 'Untitled AWS Architecture';
      tab.nodes = [...this.nodes];
      tab.connections = [...this.connections];
      tab.annotations = [...this.annotations];
      tab.packets = [];
      tab.selectedNodeIds = [];
      tab.selectedConnectionIds = [];
      tab.zoom = this.zoom;
      tab.pan = { ...this.pan };
      tab.globalCurrency = this.globalCurrency;
      tab.globalRegion = this.globalRegion;
      tab.simulationMode = 'idle';
      tab.totals = { processed: 0, dropped: 0, avgLatency: 0 };
      tab.tick = 0;
    }
  }

  saveActiveTabState(): void {
    if (this.activeTabIndex < 0 || this.activeTabIndex >= this.tabs.length) return;
    const tab = this.tabs[this.activeTabIndex];
    tab.projectName = this.projectName;
    tab.nodes = [...this.nodes];
    tab.connections = [...this.connections];
    tab.annotations = [...this.annotations];
    tab.packets = [...this.packets];
    tab.selectedNodeIds = [...this.selectedNodeIds];
    tab.selectedConnectionIds = [...this.selectedConnectionIds];
    tab.zoom = this.zoom;
    tab.pan = { ...this.pan };
    tab.globalCurrency = this.globalCurrency;
    tab.globalRegion = this.globalRegion;
    tab.simulationMode = this.mode as SimulationMode;
    tab.totals = { ...this.totals };
    tab.tick = this.simulation.tick;
  }

  loadTabState(index: number): void {
    this.activeTabIndex = index;
    const tab = this.tabs[index];
    this.projectName = tab.projectName;
    this.nodes = [...tab.nodes];
    this.connections = [...tab.connections];
    this.annotations = [...tab.annotations];
    this.packets = [...tab.packets];
    this.selectedNodeIds = [...tab.selectedNodeIds];
    this.selectedConnectionIds = [...tab.selectedConnectionIds];
    this.zoom = tab.zoom;
    this.pan = { ...tab.pan };
    this.globalCurrency = tab.globalCurrency;
    this.globalRegion = tab.globalRegion;
    this.mode = tab.simulationMode;
    this.totals = { ...tab.totals };

    if (this.flowCanvas) {
      this.flowCanvas.setScale(this.zoom);
      this.flowCanvas._setPosition(this.pan);
      this.flowCanvas.redraw();
    }

    this.simulation.switchTab(
      this.nodes,
      this.connections,
      this.packets,
      tab.tick,
      tab.simulationMode
    );
  }

  switchCanvasTab(index: number): void {
    if (index === this.activeTabIndex || index < 0 || index >= this.tabs.length) return;
    this.saveActiveTabState();
    this.loadTabState(index);
  }

  addNewTab(): void {
    this.saveActiveTabState();
    const tabIndex = this.tabs.length;
    const newTab: CanvasTab = {
      id: `tab-${Date.now()}`,
      name: `Canvas ${tabIndex + 1}`,
      projectName: `Untitled AWS Architecture ${tabIndex + 1}`,
      nodes: [],
      connections: [],
      annotations: [],
      packets: [],
      selectedNodeIds: [],
      selectedConnectionIds: [],
      zoom: this.isMobileViewport ? 0.65 : 0.85,
      pan: { x: 40, y: 40 },
      globalCurrency: 'USD',
      globalRegion: 'us-east-1',
      simulationMode: 'idle',
      totals: { processed: 0, dropped: 0, avgLatency: 0 },
      tick: 0
    };
    this.tabs.push(newTab);
    this.loadTabState(tabIndex);
    this.setMessage('New canvas tab added.', 'success');
  }

  closeTab(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.tabs.length <= 1) {
      this.setMessage('Cannot close the only remaining canvas.', 'error');
      return;
    }
    this.tabs.splice(index, 1);
    if (index === this.activeTabIndex) {
      const nextIndex = Math.min(index, this.tabs.length - 1);
      this.loadTabState(nextIndex);
    } else if (index < this.activeTabIndex) {
      this.activeTabIndex--;
    }
    this.setMessage('Canvas tab closed.', 'neutral');
  }

  startRenameTab(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.editingTabIndex = index;
  }

  finishRenameTab(index: number, newName: string): void {
    if (newName.trim()) {
      this.tabs[index].name = newName.trim();
    }
    this.editingTabIndex = null;
  }

  private currentProject(): ArchitectureProject {
    return {
      id: 'local-project',
      name: this.projectName,
      nodes: this.nodes,
      connections: this.connections,
      annotations: this.annotations,
      currency: this.globalCurrency,
      region: this.globalRegion,
      updatedAt: new Date().toISOString()
    };
  }

  private setMessage(message: string, tone: 'neutral' | 'success' | 'error'): void {
    this.validationMessage = message;
    this.validationTone = tone;
  }

  private findPortSelection(connectorId: string): PortSelection | undefined {
    const [nodeId, portId] = connectorId.split(':');
    const node = this.nodes.find((candidate) => candidate.id === nodeId);
    const port = node?.ports.find((candidate) => candidate.id === portId);
    return node && port ? { node, port } : undefined;
  }

  private toCanvasPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.pan.x) / this.zoom,
      y: (clientY - rect.top - this.pan.y) / this.zoom
    };
  }

  private portPoint(node: ArchitectureNode, direction: 'input' | 'output'): { x: number; y: number } {
    return {
      x: node.x + (direction === 'input' ? 0 : 184),
      y: node.y + 62
    };
  }

  // --- Sidebar Highlights Expansion Logic ---
  private expandedHighlights = new Set<string>();

  isHighlightExpanded(id: string): boolean {
    return this.expandedHighlights.has(id);
  }

  toggleHighlight(id: string): void {
    if (this.expandedHighlights.has(id)) {
      this.expandedHighlights.delete(id);
    } else {
      this.expandedHighlights.add(id);
    }
  }

  private static readonly mobileMediaQueryList = '(max-width: 900px), (hover: none) and (pointer: coarse)';

  private updateMobileViewport(): void {
    const isMobile = window.matchMedia(SimulatorComponent.mobileMediaQueryList).matches;
    if (isMobile && !this.wasMobileViewport) {
      this.leftCollapsed = true;
      this.rightCollapsed = true;
    }
    this.wasMobileViewport = isMobile;
    this.isMobileViewport = isMobile;
    if (!isMobile) {
      this.minimapVisible = false;
      this.runStatsExpanded = false;
      this.clearMinimapHideTimer();
    }
  }

  private revealMinimap(): void {
    this.minimapVisible = true;
    this.clearMinimapHideTimer();
    this.minimapHideTimer = setTimeout(() => {
      this.minimapVisible = false;
      this.minimapHideTimer = undefined;
    }, 2500);
  }

  private clearMinimapHideTimer(): void {
    if (this.minimapHideTimer !== undefined) {
      clearTimeout(this.minimapHideTimer);
      this.minimapHideTimer = undefined;
    }
  }

  private mouseMoveRAF: number | null = null;
  onMouseMove(event: MouseEvent): void {
    if (this.mouseMoveRAF) return;

    const target = event.currentTarget as HTMLElement;
    const { clientX, clientY } = event;

    this.mouseMoveRAF = requestAnimationFrame(() => {
      this.mouseMoveRAF = null;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }
}
