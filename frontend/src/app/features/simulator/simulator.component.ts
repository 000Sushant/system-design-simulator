import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  FCanvasChangeEvent,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FMoveNodesEvent,
  FSelectionChangeEvent,
} from "@foblex/flow";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
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
  SimulationMode,
} from "../../core/models/architecture.model";
import { ArchitectureFactoryService } from "../../core/services/architecture-factory.service";
import { AwsCatalogService } from "../../core/services/aws-catalog.service";
import { PresetService } from "../../core/services/preset.service";
import {
  ProjectStorageService,
  PersistedWorkspace,
} from "../../core/services/project-storage.service";
import { SimulationService } from "../../core/services/simulation.service";
import { ValidationRuleService } from "../../core/services/validation-rule.service";
import { CostService, CostBreakdown } from "../../core/services/cost.service";
import { Currency } from "../../core/models/architecture.model";
import serviceCostModelData from "../../core/data/service-cost-model.json";
import { ThemeService } from "../../core/services/theme.service";
import serviceDocumentationData from "../../core/data/service-documentation.json";
import { ChallengeService } from "../../core/services/challenge.service";
import { OnboardingService } from "../../core/services/onboarding.service";
import { GraphBuilderService } from "../../core/services/graph-builder.service";
import { Challenge } from "../../core/models/challenge.model";
import { ChallengePanelComponent } from "./challenge/challenge-panel.component";
import { OnboardingOverlayComponent } from "./challenge/onboarding-overlay.component";

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
  /** True when the canvas has unsaved changes (orange dot); false once saved (green dot). */
  dirty: boolean;
}

/** Deep-cloned canvas state captured for undo/redo. */
interface CanvasSnapshot {
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
  annotations: Annotation[];
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
  selector: "app-simulator",
  standalone: true,
  imports: [CommonModule, FFlowModule, FormsModule, ChallengePanelComponent, OnboardingOverlayComponent],
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.css"],
})
export class SimulatorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvas", { static: true }) canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild("flowCanvas") flowCanvas?: FCanvasComponent;

  readonly catalog = this.awsCatalog.services;
  readonly commonConfigFields: ConfigField[] = [
    {
      key: "throughput",
      label: "Capacity",
      min: 1,
      max: 3000,
      step: 10,
      suffix: "rps",
      description:
        "Max rps before degradation. Acts as cost fallback if no request rate is set.",
      affectsCost: true,
    },
    {
      key: "latency",
      label: "Base latency",
      min: 1,
      max: 1000,
      step: 5,
      suffix: "ms",
      description:
        "Processing delay per request. Affects Lambda GB-second billing.",
      affectsCost: false,
    },
    {
      key: "failureThreshold",
      label: "Failure threshold",
      min: 50,
      max: 100,
      step: 1,
      suffix: "%",
      description: "Utilization % where traffic starts dropping.",
    },
  ];

  readonly serviceConfigFields: Partial<Record<AwsServiceType, ConfigField[]>> =
    {
      client: [
        {
          key: "requestRate",
          label: "Request rate",
          min: 0,
          max: 1000,
          step: 10,
          suffix: "rps",
          description: "Traffic volume entering your architecture.",
        },
        {
          key: "packageSize",
          label: "Average Package Size",
          min: 1,
          max: 10240,
          step: 10,
          suffix: "KB",
          description: "Size of request packages sent from client.",
        },
      ],
      route53: [],
      cloudfront: [
        {
          key: "cacheHitRate",
          label: "Cache hit rate",
          min: 0,
          max: 100,
          step: 1,
          suffix: "%",
          description: "% served from edge. Higher = less origin load.",
        },
        {
          key: "dataTransferOut",
          label: "Data transfer out",
          min: 0,
          max: 10000,
          step: 10,
          suffix: "GB/mo",
          description: "$0.085/GB delivered to users.",
          affectsCost: true,
        },
        {
          key: "requestRate",
          label: "Request rate",
          min: 0,
          max: 50000,
          step: 100,
          suffix: "rps",
          description: "$1.00 per million HTTP requests.",
          affectsCost: true,
        },
        {
          key: "replication",
          label: "Edge coverage",
          min: 1,
          max: 20,
          step: 1,
          description: "Number of edge regions for content.",
        },
      ],
      apiGateway: [
        {
          key: "requestRate",
          label: "Request rate",
          min: 0,
          max: 50000,
          step: 100,
          suffix: "rps",
          description: "$3.50 per million API calls.",
          affectsCost: true,
        },
        {
          key: "timeoutMs",
          label: "Integration timeout",
          min: 100,
          max: 30000,
          step: 100,
          suffix: "ms",
          description: "Max wait for backend response.",
        },
      ],
      elb: [
        {
          key: "connectionLimit",
          label: "Connection limit",
          min: 10,
          max: 20000,
          step: 100,
          description: "Max concurrent TCP connections.",
        },
        {
          key: "dataTransferOut",
          label: "Data processed",
          min: 0,
          max: 10000,
          step: 10,
          suffix: "GB/mo",
          description: "$0.008/GB processed (LCU billing).",
          affectsCost: true,
        },
        {
          key: "timeoutMs",
          label: "Idle timeout",
          min: 1,
          max: 4000,
          step: 10,
          suffix: "s",
          description: "Idle time before connection close.",
        },
      ],
      ec2: [
        {
          key: "cpu",
          label: "CPU baseline",
          min: 1,
          max: 100,
          step: 1,
          suffix: "%",
          description: "Steady-state CPU usage. High = less burst room.",
        },
        {
          key: "memory",
          label: "Memory baseline",
          min: 1,
          max: 100,
          step: 1,
          suffix: "%",
          description: "RAM usage. 100% = OOM risk.",
        },
        {
          key: "replication",
          label: "Instance count",
          min: 1,
          max: 100,
          step: 1,
          description: "Multiplies instance cost directly.",
          affectsCost: true,
        },
        {
          key: "connectionLimit",
          label: "Connection limit",
          min: 10,
          max: 10000,
          step: 50,
          description: "Max concurrent connections.",
        },
      ],
      ecs: [
        {
          key: "cpu",
          label: "Task vCPU",
          min: 25,
          max: 400,
          step: 25,
          suffix: "% (of 4 vCPU)",
          description: "$29.55/mo per vCPU (100%=1 vCPU).",
          affectsCost: true,
        },
        {
          key: "memory",
          label: "Task memory",
          min: 50,
          max: 3000,
          step: 50,
          suffix: "% (of 1 GB)",
          description: "$3.25/mo per GB (100%=1 GB).",
          affectsCost: true,
        },
        {
          key: "replication",
          label: "Desired tasks",
          min: 1,
          max: 100,
          step: 1,
          description: "Number of tasks. Multiplies per-task cost.",
          affectsCost: true,
        },
      ],
      autoScalingGroup: [
        {
          key: "replication",
          label: "Desired instances",
          min: 1,
          max: 100,
          step: 1,
          description: "Starting EC2 count in the group.",
        },
        {
          key: "autoscalingThreshold",
          label: "Scale-out CPU",
          min: 30,
          max: 95,
          step: 1,
          suffix: "%",
          description: "CPU target that triggers scale-out.",
        },
      ],
      lambda: [
        {
          key: "memory",
          label: "Memory allocation",
          min: 128,
          max: 10240,
          step: 128,
          suffix: "MB",
          description: "CPU scales with memory. $0.0000166667/GB-sec.",
          affectsCost: true,
        },
        {
          key: "requestRate",
          label: "Invocation rate",
          min: 0,
          max: 50000,
          step: 50,
          suffix: "rps",
          description: "$0.20 per million invocations.",
          affectsCost: true,
        },
        {
          key: "concurrency",
          label: "Reserved concurrency",
          min: 1,
          max: 5000,
          step: 10,
          description: "Max simultaneous executions.",
        },
        {
          key: "timeoutMs",
          label: "Timeout",
          min: 100,
          max: 900000,
          step: 1000,
          suffix: "ms",
          description: "Max runtime before kill (up to 15 min).",
        },
        {
          key: "retryPolicy",
          label: "Async retries",
          min: 0,
          max: 5,
          step: 1,
          description: "Retry count for async invocations.",
        },
      ],
      sqs: [
        {
          key: "requestRate",
          label: "Message rate",
          min: 0,
          max: 100000,
          step: 100,
          suffix: "msg/s",
          description: "$0.40 per million messages.",
          affectsCost: true,
        },
        {
          key: "queueDepth",
          label: "Queue depth limit",
          min: 0,
          max: 100000,
          step: 100,
          description: "Max backlog before rejection.",
        },
        {
          key: "batchSize",
          label: "Consumer batch size",
          min: 1,
          max: 100,
          step: 1,
          description: "Messages per consumer poll.",
        },
      ],
      sns: [
        {
          key: "requestRate",
          label: "Publish rate",
          min: 0,
          max: 100000,
          step: 100,
          suffix: "msg/s",
          description: "$0.50 per million publishes.",
          affectsCost: true,
        },
        {
          key: "retryPolicy",
          label: "Delivery retries",
          min: 0,
          max: 10,
          step: 1,
          description: "Retry attempts per subscriber.",
        },
      ],
      s3: [
        {
          key: "storageSize",
          label: "Storage size",
          min: 1,
          max: 5000,
          step: 10,
          suffix: "GB",
          description: "Billed per GB/mo by storage class.",
          affectsCost: true,
        },
        {
          key: "requestRate",
          label: "Read/write rate",
          min: 0,
          max: 10000,
          step: 50,
          suffix: "rps",
          description: "$0.005 per million GET/PUT.",
          affectsCost: true,
        },
        {
          key: "dataTransferOut",
          label: "Data transfer out",
          min: 0,
          max: 10000,
          step: 10,
          suffix: "GB/mo",
          description: "$0.09/GB egress.",
          affectsCost: true,
        },
      ],
      rds: [
        {
          key: "replication",
          label: "Instances",
          min: 1,
          max: 16,
          step: 1,
          description: "Primary + replicas. Each billed at instance size.",
          affectsCost: true,
        },
        {
          key: "storageSize",
          label: "Storage volume",
          min: 20,
          max: 10000,
          step: 10,
          suffix: "GB",
          description: "$0.115/GB/mo for gp3 EBS.",
          affectsCost: true,
        },
        {
          key: "connectionLimit",
          label: "Max connections",
          min: 10,
          max: 20000,
          step: 50,
          description: "Concurrent DB connections allowed.",
        },
      ],
      elastiCache: [
        {
          key: "replication",
          label: "Node count",
          min: 1,
          max: 16,
          step: 1,
          description: "Nodes × instance size = total cost.",
          affectsCost: true,
        },
        {
          key: "cacheHitRate",
          label: "Cache hit rate",
          min: 0,
          max: 100,
          step: 1,
          suffix: "%",
          description: "% served from cache vs database.",
        },
        {
          key: "memory",
          label: "Memory pressure",
          min: 1,
          max: 100,
          step: 1,
          suffix: "%",
          description: "Current RAM usage of the cluster.",
        },
      ],
      dynamoDb: [
        {
          key: "requestRate",
          label: "Read/write units",
          min: 1,
          max: 20000,
          step: 50,
          description: "WCU $0.65 + RCU $0.13 per unit.",
          affectsCost: true,
        },
        {
          key: "storageSize",
          label: "Table storage",
          min: 0,
          max: 5000,
          step: 10,
          suffix: "GB",
          description: "$0.25/GB/month.",
          affectsCost: true,
        },
        {
          key: "autoscalingThreshold",
          label: "Auto scaling target",
          min: 30,
          max: 95,
          step: 1,
          suffix: "%",
          description: "Target utilization for auto-scaling.",
        },
      ],
      natGateway: [
        {
          key: "dataTransferOut",
          label: "Data transfer out",
          min: 0,
          max: 10000,
          step: 10,
          suffix: "GB/mo",
          description: "$32.40 base + $0.045/GB processed.",
          affectsCost: true,
        },
      ],
      stepFunctions: [
        {
          key: "requestRate",
          label: "Transition rate",
          min: 0,
          max: 10000,
          step: 50,
          suffix: "/s",
          description: "$25 per million state transitions.",
          affectsCost: true,
        },
        {
          key: "retryPolicy",
          label: "State retries",
          min: 0,
          max: 10,
          step: 1,
          description: "Retry count for failed states.",
        },
        {
          key: "timeoutMs",
          label: "State timeout",
          min: 100,
          max: 300000,
          step: 1000,
          suffix: "ms",
          description: "Max duration per state execution.",
        },
      ],
      cloudWatch: [
        {
          key: "storageSize",
          label: "Log ingestion",
          min: 0,
          max: 5000,
          step: 10,
          suffix: "GB/mo",
          description: "$0.50/GB ingested.",
          affectsCost: true,
        },
        {
          key: "batchSize",
          label: "Log batch size",
          min: 1,
          max: 1000,
          step: 10,
          description: "Events grouped per transmission.",
        },
      ],
      batch: [
        {
          key: "requestRate",
          label: "Job frequency",
          min: 0,
          max: 1000,
          step: 1,
          suffix: "jobs/s",
          description: "Rate at which new jobs are submitted.",
          affectsCost: true,
        },
        {
          key: "cpu",
          label: "vCPU per job",
          min: 25,
          max: 400,
          step: 25,
          suffix: "% (of 4 vCPU)",
          description: "$29.55/mo per vCPU baseline.",
          affectsCost: true,
        },
        {
          key: "memory",
          label: "Memory per job",
          min: 512,
          max: 30720,
          step: 512,
          suffix: "MB",
          description: "$3.25/mo per GB baseline.",
          affectsCost: true,
        },
        {
          key: "latency",
          label: "Job duration",
          min: 1000,
          max: 3600000,
          step: 5000,
          suffix: "ms",
          description: "How long each job runs on average.",
          affectsCost: true,
        },
        {
          key: "replication",
          label: "Max concurrency",
          min: 1,
          max: 1000,
          step: 10,
          description: "Max number of jobs that can run in parallel.",
        },
      ],
    };

  readonly serviceSelectFields: Partial<Record<AwsServiceType, SelectField[]>> =
    {
      client: [
        {
          key: "requestRegion",
          label: "Request Region",
          description:
            "Select the region from where you are receiving maximum traffic",
          options: [
            { label: "Global (Mixed)", value: "global" },
            { label: "us-east-1 - US East (N. Virginia)", value: "us-east-1" },
            { label: "us-east-2 - US East (Ohio)", value: "us-east-2" },
            {
              label: "us-west-1 - US West (N. California)",
              value: "us-west-1",
            },
            { label: "us-west-2 - US West (Oregon)", value: "us-west-2" },
            { label: "ca-central-1 - Canada (Central)", value: "ca-central-1" },
            { label: "eu-west-1 - Europe (Ireland)", value: "eu-west-1" },
            { label: "eu-west-2 - Europe (London)", value: "eu-west-2" },
            { label: "eu-west-3 - Europe (Paris)", value: "eu-west-3" },
            {
              label: "eu-central-1 - Europe (Frankfurt)",
              value: "eu-central-1",
            },
            { label: "eu-central-2 - Europe (Zurich)", value: "eu-central-2" },
            { label: "eu-north-1 - Europe (Stockholm)", value: "eu-north-1" },
            { label: "eu-south-1 - Europe (Milan)", value: "eu-south-1" },
            { label: "eu-south-2 - Europe (Spain)", value: "eu-south-2" },
            {
              label: "ap-east-1 - Asia Pacific (Hong Kong)",
              value: "ap-east-1",
            },
            {
              label: "ap-south-1 - Asia Pacific (Mumbai)",
              value: "ap-south-1",
            },
            {
              label: "ap-south-2 - Asia Pacific (Hyderabad)",
              value: "ap-south-2",
            },
            {
              label: "ap-northeast-1 - Asia Pacific (Tokyo)",
              value: "ap-northeast-1",
            },
            {
              label: "ap-northeast-2 - Asia Pacific (Seoul)",
              value: "ap-northeast-2",
            },
            {
              label: "ap-northeast-3 - Asia Pacific (Osaka)",
              value: "ap-northeast-3",
            },
            {
              label: "ap-southeast-1 - Asia Pacific (Singapore)",
              value: "ap-southeast-1",
            },
            {
              label: "ap-southeast-2 - Asia Pacific (Sydney)",
              value: "ap-southeast-2",
            },
            {
              label: "ap-southeast-3 - Asia Pacific (Jakarta)",
              value: "ap-southeast-3",
            },
            {
              label: "ap-southeast-4 - Asia Pacific (Melbourne)",
              value: "ap-southeast-4",
            },
            {
              label: "me-south-1 - Middle East (Bahrain)",
              value: "me-south-1",
            },
            {
              label: "me-central-1 - Middle East (UAE)",
              value: "me-central-1",
            },
            {
              label: "sa-east-1 - South America (São Paulo)",
              value: "sa-east-1",
            },
            { label: "af-south-1 - Africa (Cape Town)", value: "af-south-1" },
          ],
        },
      ],
      ec2: [
        {
          key: "instanceSize",
          label: "Instance Size",
          affectsCost: true,
          description: "Nano=$4 → 4XL=$544/mo.",
          options: [
            { label: "Nano (~$4/mo)", value: "nano" },
            { label: "Micro (~$8.50/mo)", value: "micro" },
            { label: "Small (~$17/mo)", value: "small" },
            { label: "Medium (~$34/mo)", value: "medium" },
            { label: "Large (~$68/mo)", value: "large" },
            { label: "XLarge (~$136/mo)", value: "xlarge" },
            { label: "2XLarge (~$272/mo)", value: "2xlarge" },
            { label: "4XLarge (~$544/mo)", value: "4xlarge" },
          ],
        },
        {
          key: "instanceType",
          label: "Instance Family",
          description: "t3=burstable, c6g=compute, r6g=memory.",
          options: [
            { label: "General Purpose (T3)", value: "t3" },
            { label: "Compute Optimized (C6g)", value: "c6g" },
            { label: "Memory Optimized (R6g)", value: "r6g" },
          ],
        },
      ],
      rds: [
        {
          key: "instanceSize",
          label: "Instance Size",
          affectsCost: true,
          description: "DB class. Micro=$8.50 → 2XL=$272/mo.",
          options: [
            { label: "Micro (~$8.50/mo)", value: "micro" },
            { label: "Small (~$17/mo)", value: "small" },
            { label: "Medium (~$34/mo)", value: "medium" },
            { label: "Large (~$68/mo)", value: "large" },
            { label: "XLarge (~$136/mo)", value: "xlarge" },
            { label: "2XLarge (~$272/mo)", value: "2xlarge" },
          ],
        },
        {
          key: "storageType",
          label: "Storage Class",
          description: "gp3=balanced, io1=high IOPS.",
          options: [
            { label: "General Purpose (gp3)", value: "gp3" },
            { label: "Provisioned IOPS (io1)", value: "io1" },
          ],
        },
      ],
      elastiCache: [
        {
          key: "instanceSize",
          label: "Node Size",
          affectsCost: true,
          description: "Micro=$8.50 → XL=$136/mo per node.",
          options: [
            { label: "Micro (~$8.50/mo)", value: "micro" },
            { label: "Small (~$17/mo)", value: "small" },
            { label: "Medium (~$34/mo)", value: "medium" },
            { label: "Large (~$68/mo)", value: "large" },
            { label: "XLarge (~$136/mo)", value: "xlarge" },
          ],
        },
      ],
      s3: [
        {
          key: "storageClass",
          label: "Storage Class",
          affectsCost: true,
          description: "Standard=$0.023, IA=$0.0125, Glacier=$0.004/GB.",
          options: [
            { label: "Standard ($0.023/GB)", value: "standard" },
            {
              label: "Infrequent Access ($0.0125/GB)",
              value: "infrequent-access",
            },
            { label: "Glacier ($0.004/GB)", value: "glacier" },
          ],
        },
      ],
    };

  tabs: CanvasTab[] = [];
  activeTabIndex = 0;
  editingTabIndex: number | null = null;
  showSaveLoader = false;
  showSaveSuccess = false;
  roleMode: "developer" | "architect" = "architect";
  /** Whether the navbar role-switcher dropdown is open. */
  roleMenuOpen = false;

  /** Unsaved-work guard popup. Shown when leaving a non-empty canvas via a
   *  mode switch, going to the homepage, or closing a tab. */
  leaveGuard: {
    action: "switch" | "home" | "closeTab";
    title: string;
    message: string;
    mode?: "developer" | "architect";
    tabIndex?: number;
  } | null = null;

  projectName = "Untitled AWS Architecture";
  globalCurrency: Currency = "USD";
  globalRegion: string = "us-east-1";
  loadingRegionCost = false;
  showAllServices: boolean = false;
  paletteSearch = "";
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

  // Keyboard-shortcuts panel. Auto-shown once for new visitors, reopenable via
  // the "?" key or the thinking-cat button at any time.
  showHotkeys = false;
  private static readonly HOTKEYS_SEEN_KEY = "sds.hotkeysSeen";
  readonly hotkeyGroups: {
    title: string;
    items: { keys: string[]; label: string }[];
  }[] = [
      {
        title: "Editing",
        items: [
          { keys: ["Ctrl", "C"], label: "Copy selected service(s)" },
          { keys: ["Ctrl", "V"], label: "Paste copied service(s)" },
          { keys: ["Ctrl", "D"], label: "Duplicate selected service(s)" },
          { keys: ["Del"], label: "Delete selection" },
        ],
      },
      {
        title: "History",
        items: [
          { keys: ["Ctrl", "Z"], label: "Undo" },
          { keys: ["Ctrl", "Y"], label: "Redo" },
          { keys: ["Ctrl", "S"], label: "Save to this browser" },
        ],
      },
      {
        title: "Canvas",
        items: [
          { keys: ["Ctrl", "Click"], label: "Add to multi-selection" },
          { keys: ["?"], label: "Open this shortcuts panel" },
          { keys: ["Esc"], label: "Close panel / clear selection" },
        ],
      },
    ];

  // Copy / paste buffer. Holds deep clones so later canvas edits never mutate it.
  private clipboard: {
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  } | null = null;
  private pasteCount = 0;

  // Undo / redo history (per active canvas). Snapshots are captured *before* a
  // mutation, so undo restores the prior state. Rapid edits (slider drags, node
  // drags) coalesce into one entry via a short time window + matching key.
  private undoStack: CanvasSnapshot[] = [];
  private redoStack: CanvasSnapshot[] = [];
  private readonly historyLimit = 60;
  private lastHistoryKey = "";
  private lastHistoryTime = 0;
  advancedConfigExpanded = false;
  costEvaluationExpanded = false;
  public selectionTrigger = (event: any): boolean => {
    // Support for Chrome, Edge, and Mac (Meta)
    const e = event.originalEvent || event;
    return !!(e.ctrlKey || e.metaKey || e.shiftKey);
  };
  validationMessage =
    "Drag AWS services onto the canvas, then connect output ports to input ports.";
  validationTone: "neutral" | "success" | "error" = "neutral";
  zoom = 1;
  pan = { x: 0, y: 0 };
  readonly minimapMinSize = 1400;
  isMobileViewport = false;
  minimapVisible = false;
  runStatsExpanded = false;
  mode = "idle";

  showMobileWarning = true;
  mobileWarningDismissed = false;
  totals = { processed: 0, dropped: 0, avgLatency: 0 };

  private activePort?: PortSelection;
  private snapshotSubscription?: Subscription;
  private unsupportedRegionSubscription?: Subscription;
  private minimapHideTimer?: ReturnType<typeof setTimeout>;
  private mobileMediaQuery?: MediaQueryList;
  private wasMobileViewport = false;
  private readonly onMobileViewportChange = (): void =>
    this.updateMobileViewport();

  /** Region code that was active before the user switched to an unsupported region */
  previousRegion = "us-east-1";
  /** Controls visibility of the unsupported region popup */
  showUnsupportedRegion = false;
  /** The unsupported region code to display in the popup */
  unsupportedRegionCode = "";

  constructor(
    readonly awsCatalog: AwsCatalogService,
    private readonly factory: ArchitectureFactoryService,
    private readonly validation: ValidationRuleService,
    private readonly simulation: SimulationService,
    private readonly presets: PresetService,
    private readonly storage: ProjectStorageService,
    public readonly costService: CostService,
    private readonly elementRef: ElementRef,
    readonly challengeService: ChallengeService,
    readonly onboarding: OnboardingService,
    private readonly graphBuilder: GraphBuilderService,
    private readonly themeService: ThemeService,
  ) { }

  get isDarkMode(): boolean {
    return this.themeService.isDark;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private challengeSubscription?: Subscription;

  /** Transient "milestone reached" celebration popup. */
  milestonePopup: { number: number; total: number; label: string; isHidden?: boolean } | null = null;
  private milestonePopupTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    if (typeof window !== "undefined" && window.location) {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      if (modeParam === "developer" || modeParam === "architect") {
        this.roleMode = modeParam;
      }
    }

    this.updateMobileViewport();
    this.mobileMediaQuery = window.matchMedia(
      SimulatorComponent.mobileMediaQueryList,
    );
    this.mobileMediaQuery.addEventListener(
      "change",
      this.onMobileViewportChange,
    );

    const workspace = this.storage.loadWorkspace();
    const hasWorkspaceContent =
      !!workspace &&
      Array.isArray(workspace.tabs) &&
      workspace.tabs.some((t) => (t.nodes?.length ?? 0) > 0);

    const local = this.storage.loadLocal();
    // Prefer the full multi-tab workspace so every saved canvas is restored.
    // Fall back to the single saved project, then to the preset/dev blank.
    if (hasWorkspaceContent) {
      this.restoreWorkspace(workspace!);
    } else if (
      local &&
      local.id !== "preset-ecommerce-serverless" &&
      local.id !== "preset-messaging-realtime"
    ) {
      this.applyProject(local);
      // Restored straight from saved storage: nothing unsaved yet (green dot).
      const restored = this.tabs[this.activeTabIndex];
      if (restored) restored.dirty = false;
    } else if (this.roleMode === "developer") {
      // Developer Mode opens to the Challenge hub on a clean canvas; the
      // onboarding tour runs on first visit. "Free practice" loads the preset.
      this.applyProject(this.blankDeveloperProject());
      this.onboarding.start();
    } else {
      this.applyProject(this.presets.messagingPreset());
    }

    // Toast each milestone the moment it is first reached.
    this.challengeSubscription = this.challengeService.milestoneReached$.subscribe(
      ({ milestone, number, total, isHidden }) => this.showMilestonePopup(number, total, milestone.label, isHidden),
    );

    this.snapshotSubscription = this.simulation.snapshot$.subscribe(
      (snapshot) => {
        this.mode = snapshot.mode;
        this.totals = snapshot.totals;
        this.packets = snapshot.packets;
        if (snapshot.nodes.length > 0) {
          this.nodes = snapshot.nodes.map((node) => {
            const existing = this.nodes.find((n) => n.id === node.id);
            return {
              ...node,
              x: existing ? existing.x : node.x,
              y: existing ? existing.y : node.y,
              selected: this.selectedNodeIds.includes(node.id),
            };
          });
          this.connections = snapshot.connections;
        }
        this.refreshHealthHold();
      },
    );

    // Subscribe to unsupported region events from the cost service
    this.unsupportedRegionSubscription = this.costService.unsupportedRegion$
      .pipe(filter((code) => code !== null))
      .subscribe((code) => {
        this.unsupportedRegionCode = code!;
        this.showUnsupportedRegion = true;
        // Revert to the previous valid region silently (without re-fetching)
        this.globalRegion = this.previousRegion;
      });

    // First visit: surface the keyboard shortcuts once. Desktop only (shortcuts
    // are irrelevant on touch). Defer if the guided tour is running.
    if (
      !this.hotkeysSeen() &&
      !this.onboarding.isRunning &&
      !this.isMobileViewport
    ) {
      this.showHotkeys = true;
    }
  }

  addAnnotation(x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const point = this.toCanvasPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      x = point.x - 110;
      y = point.y - 60;
    }

    this.pushHistory();
    const id = `anno-${Date.now()}`;
    const annotation: Annotation = {
      id,
      text: "New Note",
      x,
      y,
      width: 220,
      height: 120,
      fontSize: 16,
      fontWeight: "normal",
      selected: true,
    };
    this.annotations = [...this.annotations, annotation];
    this.selectAnnotation(id);
  }

  addService(type: AwsServiceType, x?: number, y?: number): void {
    if (x === undefined || y === undefined) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const point = this.toCanvasPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      x = point.x - 74;
      y = point.y - 47;
    }
    this.pushHistory();
    const node = this.factory.createNode(type, x, y);
    this.nodes = [...this.nodes, node];
    this.selectNode(node.id);
    this.revealMinimap();
    this.setMessage(`${node.name} added to the architecture.`, "success");
    this.onboarding.notify("nodeAdded");
    this.afterGraphMutated();
  }

  selectAnnotation(id: string): void {
    this.selectedNodeIds = [];
    this.selectedConnectionIds = [];
    this.annotations = this.annotations.map((a) => ({
      ...a,
      selected: a.id === id,
    }));
    this.nodes = this.nodes.map((n) => ({ ...n, selected: false }));
  }

  updateAnnotationText(id: string, event: Event): void {
    const text = (event.target as HTMLElement).innerText;
    // We only update the model to sync state, but avoid triggering logic that might re-render the div
    const anno = this.annotations.find((a) => a.id === id);
    if (anno && anno.text !== text) {
      this.pushHistory(`annotext:${id}`);
      anno.text = text;
    }
  }

  deleteAnnotation(id: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.pushHistory();
    this.annotations = this.annotations.filter((a) => a.id !== id);
    this.setMessage("Annotation deleted.", "neutral");
  }

  toggleAnnotationBold(id: string, event: MouseEvent): void {
    event.stopPropagation();
    this.pushHistory();
    this.annotations = this.annotations.map((a) =>
      a.id === id
        ? { ...a, fontWeight: a.fontWeight === "bold" ? "normal" : "bold" }
        : a,
    );
  }

  changeAnnotationFontSize(id: string, delta: number, event: MouseEvent): void {
    event.stopPropagation();
    this.annotations = this.annotations.map((a) =>
      a.id === id
        ? { ...a, fontSize: Math.max(8, Math.min(72, a.fontSize + delta)) }
        : a,
    );
  }

  startResizingAnnotation(id: string, event: PointerEvent): void {
    event.stopPropagation();
    event.preventDefault();
    const anno = this.annotations.find((a) => a.id === id);
    if (!anno) return;

    const startW = anno.width;
    const startH = anno.height;
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - startX) / this.zoom;
      const dy = (moveEvent.clientY - startY) / this.zoom;
      this.annotations = this.annotations.map((a) =>
        a.id === id
          ? {
            ...a,
            width: Math.max(100, startW + dx),
            height: Math.max(40, startH + dy),
          }
          : a,
      );
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
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
    const toolbarActions =
      this.elementRef.nativeElement.querySelector(".toolbar-actions");
    if (toolbarActions) {
      const stopTouch = (e: TouchEvent) => {
        e.stopPropagation();
      };
      toolbarActions.addEventListener("touchstart", stopTouch, {
        passive: true,
      });
      toolbarActions.addEventListener("touchmove", stopTouch, {
        passive: true,
      });
      toolbarActions.addEventListener("touchend", stopTouch, { passive: true });
    }
  }

  ngOnDestroy(): void {
    this.snapshotSubscription?.unsubscribe();
    this.unsupportedRegionSubscription?.unsubscribe();
    this.challengeSubscription?.unsubscribe();
    if (this.milestonePopupTimer) clearTimeout(this.milestonePopupTimer);
    this.mobileMediaQuery?.removeEventListener(
      "change",
      this.onMobileViewportChange,
    );
    this.clearMinimapHideTimer();
    this.simulation.stop();
  }
  private calculateNodeHealth(node: ArchitectureNode): {
    tone: "success" | "warning" | "error" | "neutral";
    message: string;
    short?: string;
    blocksRun?: boolean;
  } {
    // Parameter-level validation before connectivity checks
    if (node.type === "elb") {
      const count = node.config?.["count"];
      const numCount =
        count !== undefined && count !== null && count !== ""
          ? Number(count)
          : 1;
      if (isNaN(numCount) || numCount < 1) {
        return {
          tone: "error",
          blocksRun: true,
          message:
            'Parameter error: at least 1 load balancer is required. Set "Number of Load Balancers" to 1 or more.',
        };
      }
    }

    const inputs = this.connections.filter(
      (c) => c.targetNodeId === node.id,
    ).length;
    const outputs = this.connections.filter(
      (c) => c.sourceNodeId === node.id,
    ).length;

    const definition = this.awsCatalog.getByType(node.type);
    const { mandatoryInput, mandatoryOutput, allowFanIn, allowFanOut } =
      definition.behavior;

    // MANDATORY INPUT CHECK
    if (mandatoryInput && inputs === 0) {
      return {
        tone: "error",
        blocksRun: true,
        short: "Integration required",
        message: `Integration error: ${node.name} must have at least one input connection.`,
      };
    }

    // MANDATORY OUTPUT CHECK
    if (mandatoryOutput && outputs === 0) {
      return {
        tone: "error",
        blocksRun: true,
        short: "Integration required",
        message: `Integration error: ${node.name} must have an output connection to continue the flow.`,
      };
    }

    // Fully isolated node where neither side is mandatory (e.g. IAM/KMS placed
    // standalone): surface a soft warning instead of letting it pass silently.
    if (inputs === 0 && outputs === 0) {
      return {
        tone: "warning",
        short: "Not connected",
        message: `${node.name} is on the canvas but not connected to any other service.`,
      };
    }

    // FAN-IN CHECK
    if (!allowFanIn && inputs > 1) {
      return {
        tone: "error",
        blocksRun: true,
        message: `Architecture error: ${node.name} does not support multiple incoming connections (Fan-in prohibited).`,
      };
    }

    // FAN-OUT CHECK
    if (!allowFanOut && outputs > 1) {
      return {
        tone: "error",
        blocksRun: true,
        message: `Architecture error: ${node.name} does not support multiple outgoing connections (Fan-out prohibited).`,
      };
    }

    // Dynamic checks — driven by the runtime status a node carries. Statuses
    // persist after the run stops (no reset on stop), so these errors/warnings
    // stay exactly as they were during the run instead of being downgraded.
    // They are NOT marked blocksRun, so the user can still re-run to tune.
    if (node.status === "offline" || node.status === "failing") {
      return {
        tone: "error",
        short: "Over capacity",
        message: `Operational Failure: ${node.name} is ${node.status}. Traffic is being dropped.`,
      };
    }
    // Overload = demand past capacity. Treated as an error (not a soft warning):
    // requests are being throttled/dropped even though the node is still up.
    if (node.status === "overloaded") {
      return {
        tone: "error",
        short: "Overloaded",
        message: `Overloaded: ${node.name} is past its capacity — excess requests are being throttled or dropped.`,
      };
    }
    if (node.status === "busy") {
      return {
        tone: "warning",
        short: "High load",
        message: `Performance Warning: ${node.name} is busy and nearing capacity. Latency is increasing.`,
      };
    }

    return {
      tone: "success",
      message: `${node.name} is correctly integrated and ready for traffic.`,
    };
  }

  get inspectorHealth(): {
    tone: "success" | "warning" | "error" | "neutral";
    message: string;
  } {
    if (this.selectedNode) {
      return this.calculateNodeHealth(this.selectedNode);
    }

    // Check if any node is in an error state
    const nodesWithErrors = this.nodes.filter(
      (n) => this.calculateNodeHealth(n).tone === "error",
    );
    if (nodesWithErrors.length > 0) {
      return {
        tone: "error",
        message: `Architecture issues detected. ${nodesWithErrors.length} service(s) are overloaded, failing, or offline.`,
      };
    }

    // Check if any node is in a warning state
    const nodesWithWarnings = this.nodes.filter(
      (n) => this.calculateNodeHealth(n).tone === "warning",
    );
    if (nodesWithWarnings.length > 0) {
      return {
        tone: "warning",
        message: `Performance warning. ${nodesWithWarnings.length} service(s) are busy and nearing capacity.`,
      };
    }

    if (this.nodes.length > 0) {
      return {
        tone: "success",
        message:
          "Architecture is healthy. All services are correctly integrated and operational.",
      };
    }

    return {
      tone: "neutral",
      message:
        "Drag AWS services onto the canvas and connect them to build your architecture.",
    };
  }

  get isSimulationDisabled(): boolean {
    // Only integration/config errors (missing connections, fan-in/out, bad
    // params) should block running. Runtime capacity errors from a prior run
    // persist for display but must not prevent re-running to tune the design.
    return this.nodes.some((n) => {
      const health = this.calculateNodeHealth(n);
      return health.tone === "error" && health.blocksRun === true;
    });
  }

  get erroredNodes(): ArchitectureNode[] {
    // The Users node is a pure traffic source and carries no health state.
    return this.nodes.filter(
      (n) => n.type !== "client" && this.stickyHealthTone(n) === "error",
    );
  }

  get warnedNodes(): ArchitectureNode[] {
    return this.nodes.filter(
      (n) => n.type !== "client" && this.stickyHealthTone(n) === "warning",
    );
  }

  /** Stable trackBy so error/warning pills aren't torn down between sim ticks. */
  trackByNodeId(_index: number, node: ArchitectureNode): string {
    return node.id;
  }

  /**
   * During a run a node's transient status flips between normal/busy/overloaded
   * every tick, which would make its summary pill appear and disappear (and break
   * hover). We keep a node in its error/warning bucket for a short grace window
   * after it last qualified, so the list stays stable. When idle the hold map is
   * empty, so this returns the live tone immediately.
   */
  private readonly healthHold = new Map<
    string,
    { tone: "error" | "warning"; until: number }
  >();
  private static readonly healthHoldMs = 1500;

  private stickyHealthTone(
    node: ArchitectureNode,
  ): "error" | "warning" | "other" {
    const current = this.calculateNodeHealth(node).tone;
    // Grace hold only applies during an active run; when idle, report live tone.
    const sticky = this.mode === "running" || this.mode === "paused";
    const held = sticky ? this.healthHold.get(node.id)?.tone : undefined;
    if (current === "error" || held === "error") return "error";
    if (current === "warning" || held === "warning") return "warning";
    return "other";
  }

  /** Refresh the grace-period hold map from the latest snapshot statuses. */
  private refreshHealthHold(): void {
    if (this.mode !== "running" && this.mode !== "paused") {
      this.healthHold.clear();
      return;
    }
    const now = performance.now();
    for (const node of this.nodes) {
      const tone = this.calculateNodeHealth(node).tone;
      if (tone === "error" || tone === "warning") {
        this.healthHold.set(node.id, {
          tone,
          until: now + SimulatorComponent.healthHoldMs,
        });
      }
    }
    for (const [id, hold] of this.healthHold) {
      if (hold.until <= now) {
        this.healthHold.delete(id);
      }
    }
  }

  nodeHealthShort(node: ArchitectureNode): string {
    return this.calculateNodeHealth(node).short || "Integration required";
  }

  /**
   * CPU is only a meaningful metric for services where the user controls or
   * pays for compute capacity. Fully managed/serverless services (DNS, queues,
   * object storage, CDN, etc.) hide the CPU stat in the inspector.
   */
  private static readonly cpuRelevantTypes = new Set<string>([
    "ec2",
    "ecs",
    "eks",
    "lambda",
    "autoScalingGroup",
    "batch",
    "appRunner",
    "elasticBeanstalk",
    "rds",
    "aurora",
    "elastiCache",
    "openSearch",
    "redshift",
    "emr",
    "msk",
    "mq",
    "sageMaker",
    "codeBuild",
  ]);

  hasCpuMetric(node: ArchitectureNode): boolean {
    return SimulatorComponent.cpuRelevantTypes.has(node.type);
  }

  /**
   * A field is locked if the JSON marks it readonly, OR it is the throughput
   * (Capacity RPS) field on a node currently synced to a client's RPS Sync.
   * The sync handshake stamps `_designThroughput` on every downstream node, so
   * we use that as the run-time signal.
   */
  isFieldLocked(node: ArchitectureNode, field: any): boolean {
    if (field?.readonly) return true;
    if (
      field?.key === "throughput" &&
      node.config?.["_designThroughput"] !== undefined
    ) {
      return true;
    }
    return false;
  }

  fieldLockTooltip(node: ArchitectureNode, field: any): string {
    if (
      field?.key === "throughput" &&
      node.config?.["_designThroughput"] !== undefined
    ) {
      return 'Requests/Second is synced from the Users node. Disable "Sync RPS to all connected services" on the Users node to edit.';
    }
    return (
      "Synced from: " +
      (field?.syncSource || "Client (Users) node") +
      ". Change the value on the source node."
    );
  }

  get selectedNode(): ArchitectureNode | undefined {
    return this.nodes.find(
      (node) => node.id === (this.selectedNodeIds[0] ?? ""),
    );
  }

  get selectedDefinition(): AwsServiceDefinition | undefined {
    return this.selectedNode
      ? this.awsCatalog.getByType(this.selectedNode.type)
      : undefined;
  }

  openDocsForService(type: string): void {
    const docsUrl = `${window.location.origin}/docs?service=${type}`;
    window.open(docsUrl, "_blank", "noopener,noreferrer");
  }

  get selectedConfigFields(): ConfigField[] {
    if (!this.selectedNode) {
      return [];
    }
    const specific = this.serviceConfigFields[this.selectedNode.type] ?? [];
    const merged = [...this.commonConfigFields, ...specific];
    return merged.filter(
      (field, index) =>
        merged.findIndex((candidate) => candidate.key === field.key) === index,
    );
  }

  get selectedSelectFields(): SelectField[] {
    return this.selectedNode
      ? (this.serviceSelectFields[this.selectedNode.type] ?? [])
      : [];
  }

  get hasJsonModel(): boolean {
    if (!this.selectedNode) return false;
    return !!(serviceCostModelData.serviceCostModel as any)[
      this.selectedNode.type
    ];
  }

  isFieldVisible(field: any): boolean {
    if (!field.visibleIf || !this.selectedNode) return true;
    try {
      const config = this.selectedNode.config || {};
      const fn = new Function("config", `return !!(${field.visibleIf});`);
      return fn(config);
    } catch (e) {
      console.warn("Error evaluating visibleIf for field", field.key, e);
      return true;
    }
  }

  get selectedPrimaryParams(): any[] {
    if (!this.selectedNode) return [];
    if (this.selectedNode.type === "elb") {
      const clientNode = this.nodes.find((n) => n.type === "client");
      const packageSizeKB = clientNode
        ? clientNode.config?.["packageSize"] || 50
        : 50;
      this.selectedNode.config["packageSizeKB"] = packageSizeKB;
    }
    const model = (serviceCostModelData.serviceCostModel as any)[
      this.selectedNode.type
    ];
    const params = model?.primaryParams || [];
    return params.filter((field: any) => this.isFieldVisible(field));
  }

  get selectedAdvancedParams(): any[] {
    if (!this.selectedNode) return [];
    const model = (serviceCostModelData.serviceCostModel as any)[
      this.selectedNode.type
    ];
    const params = model?.advancedTune || [];
    return params.filter((field: any) => this.isFieldVisible(field));
  }

  get selectedCostParams(): any[] {
    if (!this.selectedNode) return [];
    if (this.selectedNode.type === "elb") {
      const clientNode = this.nodes.find((n) => n.type === "client");
      const packageSizeKB = clientNode
        ? clientNode.config?.["packageSize"] || 50
        : 50;
      this.selectedNode.config["packageSizeKB"] = packageSizeKB;
    }
    const model = (serviceCostModelData.serviceCostModel as any)[
      this.selectedNode.type
    ];
    const params = model?.costParams || [];
    // CloudFront's Traffic Region is locked to the Users node — mirror that node's selected
    // region into the (read-only) field so it stays visible and correct in the cost panel.
    if (this.selectedNode.type === "cloudfront") {
      const clientNode = this.nodes.find((n) => n.type === "client");
      const clientRegion =
        (clientNode?.config?.["requestRegion"] as string) || "global";
      this.selectedNode.config["region"] = clientRegion;
      const regionField = params.find((p: any) => p.key === "region");
      if (regionField) {
        const clientReqRegionParam = (
          serviceCostModelData.serviceCostModel as any
        ).client?.primaryParams?.find((p: any) => p.key === "requestRegion");
        if (clientReqRegionParam?.options?.length) {
          regionField.options = clientReqRegionParam.options;
        }
      }
    }
    return params.filter((field: any) => this.isFieldVisible(field));
  }

  get selectedCostEvaluation(): any {
    if (!this.selectedNode) return null;
    const model = (serviceCostModelData.serviceCostModel as any)[
      this.selectedNode.type
    ];
    return model?.costEvaluation || null;
  }

  get costBreakdown(): CostBreakdown | null {
    if (!this.selectedNode) return null;
    return this.costService.getCostBreakdown(
      this.selectedNode,
      this.globalRegion,
      this.nodes,
    );
  }

  // Memoised so the getter returns a STABLE array reference across change-detection
  // passes while nodes/connections/selection are unchanged. Without this, returning a
  // fresh array every CD pass makes the *ngFor + ngModel in the Traffic Management
  // panel thrash and lock up the page.
  private _outConnCache: {
    nodeId: string;
    connsRef: ArchitectureConnection[];
    nodesRef: ArchitectureNode[];
    value: {
      connection: ArchitectureConnection;
      targetName: string;
      targetType: string;
    }[];
  } | null = null;

  /**
   * Outgoing edges of the selected node, paired with their downstream target's
   * name/type — backs the inspector's "Traffic Management" section so the user
   * can set what share of this node's output each downstream receives.
   */
  get selectedOutgoingConnections(): {
    connection: ArchitectureConnection;
    targetName: string;
    targetType: string;
  }[] {
    const node = this.selectedNode;
    if (!node) return [];
    const cache = this._outConnCache;
    if (
      cache &&
      cache.nodeId === node.id &&
      cache.connsRef === this.connections &&
      cache.nodesRef === this.nodes
    ) {
      return cache.value;
    }
    const value = this.connections
      .filter((c) => c.sourceNodeId === node.id)
      .map((c) => {
        const target = this.nodes.find((n) => n.id === c.targetNodeId);
        return {
          connection: c,
          targetName: target?.name ?? "Unknown",
          targetType: target?.type ?? "",
        };
      });
    this._outConnCache = {
      nodeId: node.id,
      connsRef: this.connections,
      nodesRef: this.nodes,
      value,
    };
    return value;
  }

  /** trackBy for the Traffic Management list — keeps DOM/ngModel stable across CD. */
  trackByConnId(
    _: number,
    item: { connection: ArchitectureConnection },
  ): string {
    return item.connection.id;
  }

  /** Set a single outgoing edge's traffic share (0–100%). */
  updateConnectionWeight(connectionId: string, value: number | string): void {
    let weight = Number(value);
    if (Number.isNaN(weight)) weight = 100;
    weight = Math.max(0, Math.min(100, Math.round(weight)));
    this.pushHistory(`weight:${connectionId}`);
    this.connections = this.connections.map((c) =>
      c.id === connectionId ? { ...c, trafficWeight: weight } : c,
    );
    this.onConfigChange();
    this.saveActiveTabState();
  }

  get selectedConnection(): ArchitectureConnection | undefined {
    return this.connections.find(
      (connection) => connection.id === (this.selectedConnectionIds[0] ?? ""),
    );
  }

  get selectedConnectionSummary(): string {
    const connection = this.selectedConnection;
    if (!connection) {
      return "";
    }
    const source =
      this.nodes.find((node) => node.id === connection.sourceNodeId)?.name ??
      "Unknown";
    const target =
      this.nodes.find((node) => node.id === connection.targetNodeId)?.name ??
      "Unknown";
    return `${source} -> ${target}`;
  }

  get filteredCatalog(): AwsServiceDefinition[] {
    const query = this.paletteSearch.trim().toLowerCase();
    let services = this.catalog;

    const devServices = new Set([
      "client",
      "route53",
      "cloudfront",
      "apiGateway",
      "elb",
      "lambda",
      "ec2",
      "ecs",
      "eks",
      "appRunner",
      "s3",
      "efs",
      "rds",
      "aurora",
      "dynamoDb",
      "elastiCache",
      "sqs",
      "sns",
      "eventBridge",
      "stepFunctions",
      "cloudWatch",
      "xray",
      "cognito",
      "appSync",
      "bedrock",
      "kinesis",
      "kinesisFirehose",
    ]);

    if (this.roleMode === "developer") {
      services = services.filter((s) => devServices.has(s.type));
    } else {
      // Architect Mode
      if (!this.showAllServices) {
        services = services.filter((s) => devServices.has(s.type));
      }
    }

    if (!query) {
      return services;
    }
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query),
    );
  }

  get catalogCategories(): Array<{
    name: string;
    services: AwsServiceDefinition[];
  }> {
    const categories = new Map<string, AwsServiceDefinition[]>();
    for (const service of this.filteredCatalog) {
      const list = categories.get(service.category) ?? [];
      list.push(service);
      categories.set(service.category, list);
    }
    return [...categories.entries()].map(([name, services]) => ({
      name,
      services,
    }));
  }

  get totalCost(): number {
    return this.costService.calculateTotalMonthlyCost(
      this.nodes,
      this.globalCurrency,
      this.globalRegion,
    );
  }

  get totalCostFormatted(): string {
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);
    return `${symbol}${this.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  get mobileSidebarOpen(): boolean {
    return !this.leftCollapsed || !this.rightCollapsed;
  }

  get hasSelection(): boolean {
    return (
      this.selectedNodeIds.length > 0 ||
      this.selectedConnectionIds.length > 0 ||
      this.annotations.some((a) => a.selected)
    );
  }

  isVariableCostActive(node: ArchitectureNode): boolean {
    if (node.type === "client") {
      return !!node.config["variableTraffic"];
    }
    // Downstream synced services: walk all clients, check if this node is downstream and the client has variable+sync on
    for (const client of this.nodes) {
      if (client.type !== "client") continue;
      if (
        !client.config["variableTraffic"] ||
        !client.config["syncRpsToServices"]
      )
        continue;
      const downstream = this.getDownstreamNodeIds(client.id);
      if (downstream.has(node.id)) return true;
    }
    return false;
  }

  getNodeCostFormatted(node: ArchitectureNode): string {
    const cost =
      this.costService.calculateNodeCostUsd(
        node,
        this.globalRegion,
        this.nodes,
      ) *
      (this.globalCurrency === "USD"
        ? 1
        : this.costService["conversionRates"][this.globalCurrency]);
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);
    return `${symbol}${cost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  setCurrency(currency: Currency): void {
    this.globalCurrency = currency;
  }

  nodeIconUrl(type: AwsServiceType): string {
    return this.awsCatalog.getByType(type).iconUrl;
  }

  /**
   * Distinct AWS services on the canvas, each with a short docs overview and a
   * deep link into the full docs. Powers the architect-mode "Services on this
   * canvas" panel — contextual (only what's used), not random.
   */
  get canvasServices(): { type: AwsServiceType; name: string; overview: string }[] {
    const docs = serviceDocumentationData as Record<
      string,
      { overview?: string }
    >;
    const seen = new Set<AwsServiceType>();
    const out: { type: AwsServiceType; name: string; overview: string }[] = [];
    for (const node of this.nodes) {
      if (node.type === "client" || seen.has(node.type)) {
        continue;
      }
      seen.add(node.type);
      const def = this.awsCatalog.getByType(node.type);
      out.push({
        type: node.type,
        name: def.name,
        overview: docs[node.type]?.overview || def.description || "",
      });
    }
    return out;
  }

  /** Unified view of active services on the canvas, aggregating instance counts, costs, and percentage contributions. */
  get unifiedServices(): {
    type: AwsServiceType;
    name: string;
    overview: string;
    totalCost: number;
    formattedCost: string;
    pct: number;
    count: number;
  }[] {
    const docs = serviceDocumentationData as Record<
      string,
      { overview?: string }
    >;
    const rate =
      this.globalCurrency === "USD"
        ? 1
        : this.costService["conversionRates"][this.globalCurrency];
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);

    // Calculate node costs in USD
    const nodeCosts = new Map<string, number>();
    let totalUsd = 0;
    for (const node of this.nodes) {
      if (node.type === "client") {
        continue;
      }
      const usd = this.costService.calculateNodeCostUsd(
        node,
        this.globalRegion,
        this.nodes,
      );
      nodeCosts.set(node.id, usd);
      totalUsd += usd;
    }

    // Group by AwsServiceType
    const grouped = new Map<
      AwsServiceType,
      {
        nodes: any[];
        cost: number;
      }
    >();

    for (const node of this.nodes) {
      if (node.type === "client") {
        continue;
      }
      if (!grouped.has(node.type)) {
        grouped.set(node.type, { nodes: [], cost: 0 });
      }
      const g = grouped.get(node.type)!;
      g.nodes.push(node);
      g.cost += nodeCosts.get(node.id) || 0;
    }

    const out: {
      type: AwsServiceType;
      name: string;
      overview: string;
      totalCost: number;
      formattedCost: string;
      pct: number;
      count: number;
    }[] = [];

    const divisor = totalUsd || 1;

    for (const [type, info] of grouped.entries()) {
      const def = this.awsCatalog.getByType(type);
      const pct = totalUsd > 0 ? Math.round((info.cost / divisor) * 100) : 0;

      out.push({
        type,
        name: def.name,
        overview: docs[type]?.overview || def.description || "",
        totalCost: info.cost,
        formattedCost: `${symbol}${(info.cost * rate).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        pct,
        count: info.nodes.length,
      });
    }

    // Sort: cost descending, then count descending, then name
    return out.sort((a, b) => {
      if (Math.abs(a.totalCost - b.totalCost) > 0.0001) {
        return b.totalCost - a.totalCost;
      }
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }

  /** Top monthly cost contributors for the architect-mode empty state. */
  get costDrivers(): {
    name: string;
    type: AwsServiceType;
    formatted: string;
    pct: number;
  }[] {
    const rate =
      this.globalCurrency === "USD"
        ? 1
        : this.costService["conversionRates"][this.globalCurrency];
    const symbol = this.costService.getCurrencySymbol(this.globalCurrency);
    const items = this.nodes
      .map((n) => ({
        node: n,
        usd: this.costService.calculateNodeCostUsd(
          n,
          this.globalRegion,
          this.nodes,
        ),
      }))
      .filter((i) => i.usd > 0.0001)
      .sort((a, b) => b.usd - a.usd);
    const totalUsd = items.reduce((s, i) => s + i.usd, 0) || 1;
    return items.slice(0, 4).map((i) => ({
      name: i.node.name,
      type: i.node.type,
      formatted: `${symbol}${(i.usd * rate).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      pct: Math.max(4, Math.round((i.usd / totalUsd) * 100)),
    }));
  }

  setRegion(region: string): void {
    this.previousRegion = this.globalRegion; // Save before switching
    this.globalRegion = region;
    this.loadRegionCost(region);
  }

  loadRegionCost(region: string): void {
    this.loadingRegionCost = true;
    this.costService
      .loadRegionPricing(region)
      .then(() => {
        this.loadingRegionCost = false;
        this.onConfigChange();
      })
      .catch((err) => {
        console.error("Failed to load region pricing: ", err);
        this.loadingRegionCost = false;
        this.onConfigChange();
      });
  }

  dismissUnsupportedRegion(): void {
    this.showUnsupportedRegion = false;
    this.unsupportedRegionCode = "";
    this.costService.unsupportedRegion$.next(null);
  }

  goHome(): void {
    if (this.anyTabUnsaved()) {
      const count = this.tabs.filter((_, i) => this.tabIsUnsaved(i)).length;
      this.leaveGuard = {
        action: "home",
        title: "Leave to homepage?",
        message:
          count > 1
            ? `You have unsaved work on ${count} canvases. Save it first, or discard it and go to the homepage.`
            : "You have unsaved work on the canvas. Save it first, or discard it and go to the homepage.",
      };
      return;
    }
    this.doGoHome();
  }

  /** Native browser warning for refresh / closing the tab / external back. */
  @HostListener("window:beforeunload", ["$event"])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.anyTabUnsaved()) {
      event.preventDefault();
      event.returnValue = "";
    }
  }

  private doGoHome(): void {
    window.history.pushState(null, "", "/");
    window.dispatchEvent(new Event("popstate"));
  }

  /** True when the active canvas has any services, connections, or notes. */
  private canvasHasContent(): boolean {
    return (
      this.nodes.length > 0 ||
      this.connections.length > 0 ||
      this.annotations.length > 0
    );
  }

  /** True when a given tab (active or not) holds any content. */
  private tabHasContent(index: number): boolean {
    if (index === this.activeTabIndex) return this.canvasHasContent();
    const t = this.tabs[index];
    return (
      !!t &&
      ((t.nodes?.length ?? 0) > 0 ||
        (t.connections?.length ?? 0) > 0 ||
        (t.annotations?.length ?? 0) > 0)
    );
  }

  /** True when a tab has content AND unsaved edits (orange dot). New empty
   *  tabs start dirty but have no content, so they never trip the guard. */
  private tabIsUnsaved(index: number): boolean {
    const t = this.tabs[index];
    return !!t && t.dirty && this.tabHasContent(index);
  }

  /** True when any tab (active or background) has unsaved content. Used so we
   *  never silently lose work that lives on a non-active canvas. */
  private anyTabUnsaved(): boolean {
    return this.tabs.some((_, i) => this.tabIsUnsaved(i));
  }

  /** True when any tab holds content (saved or not). Used by the mode switch so
   *  an empty active tab doesn't hide work on other canvases. */
  private anyTabHasContent(): boolean {
    return this.tabs.some((_, i) => this.tabHasContent(i));
  }

  /** Collapse every canvas down to a single fresh, empty tab. */
  private resetAllCanvases(): void {
    this.simulation.stop();
    this.tabs = [];
    this.activeTabIndex = 0;
    this.applyProject({
      id: "local-project",
      name: "Canvas 1",
      nodes: [],
      connections: [],
      annotations: [],
      currency: this.globalCurrency,
      region: this.globalRegion,
      updatedAt: new Date().toISOString(),
    });
  }

  /** Persist every tab (not just the active one) so no canvas is lost. */
  private persistWorkspace(): void {
    this.saveActiveTabState();
    // Keep the single-project key in sync for the active canvas (back-compat).
    this.storage.save(this.currentProject()).subscribe();
    const workspace: PersistedWorkspace = {
      activeIndex: this.activeTabIndex,
      tabs: this.tabs.map((t) => ({
        id: t.id,
        name: t.name,
        projectName: t.projectName,
        nodes: t.nodes,
        connections: t.connections,
        annotations: t.annotations,
        currency: t.globalCurrency,
        region: t.globalRegion,
      })),
    };
    this.storage.saveWorkspace(workspace);
    this.tabs.forEach((t) => (t.dirty = false));
  }

  /** Save all canvases immediately (no loader) for the leave-guard flow. */
  private saveNow(): void {
    this.persistWorkspace();
    this.setMessage("All canvases saved.", "success");
  }

  /** Rebuild every tab from a saved workspace on load. */
  private restoreWorkspace(ws: PersistedWorkspace): void {
    this.tabs = ws.tabs.map((pt, i) => ({
      id: pt.id || `tab-${Date.now()}-${i}`,
      name: pt.name || `Canvas ${i + 1}`,
      projectName: pt.projectName || pt.name || "Untitled AWS Architecture",
      nodes: pt.nodes || [],
      connections: pt.connections || [],
      annotations: pt.annotations || [],
      packets: [],
      selectedNodeIds: [],
      selectedConnectionIds: [],
      zoom: this.isMobileViewport ? 0.65 : 0.85,
      pan: { x: 40, y: 40 },
      globalCurrency: pt.currency || "USD",
      globalRegion: pt.region || "us-east-1",
      simulationMode: "idle" as SimulationMode,
      totals: { processed: 0, dropped: 0, avgLatency: 0 },
      tick: 0,
      dirty: false,
    }));
    const idx = Math.min(
      Math.max(ws.activeIndex ?? 0, 0),
      this.tabs.length - 1,
    );
    this.loadTabState(idx);
    this.resetHistory();
    this.tabs.forEach((t) => (t.dirty = false));
  }

  /** Handles a button choice from the unsaved-work guard popup. */
  resolveLeaveGuard(
    choice: "keep" | "fresh" | "saveFresh" | "save" | "discard" | "cancel",
  ): void {
    const g = this.leaveGuard;
    this.leaveGuard = null;
    if (!g || choice === "cancel") return;

    const proceed = () => {
      if (g.action === "switch" && g.mode) this.applyRoleSwitch(g.mode);
      else if (g.action === "home") this.doGoHome();
      else if (g.action === "closeTab" && g.tabIndex != null)
        this.doCloseTab(g.tabIndex);
    };

    switch (choice) {
      case "keep": // mode switch: carry the canvas into the new mode
        proceed();
        break;
      case "fresh": // mode switch: clear every canvas, then switch
        this.resetAllCanvases();
        proceed();
        break;
      case "saveFresh": // mode switch: save all, clear every canvas, then switch
        this.saveNow();
        this.resetAllCanvases();
        proceed();
        break;
      case "save": // home / closeTab: save first, then leave/close
        this.saveNow();
        proceed();
        break;
      case "discard": // home / closeTab: leave/close without saving
        proceed();
        break;
    }
  }

  /** Toggles the navbar role-switcher dropdown. */
  toggleRoleMenu(event: Event): void {
    event.stopPropagation();
    this.roleMenuOpen = !this.roleMenuOpen;
  }

  /** Switches the playground role (architect ↔ developer) in place, keeping the
   *  current canvas. Persists the choice in the URL so a reload stays put. */
  switchRole(mode: "developer" | "architect"): void {
    this.roleMenuOpen = false;
    if (this.roleMode === mode) return;
    if (this.anyTabHasContent()) {
      this.leaveGuard = {
        action: "switch",
        mode,
        title: `Switch to ${mode} mode`,
        message:
          "Your current canvases will carry over. Bring them with you, start fresh, or save your work first.",
      };
      return;
    }
    this.applyRoleSwitch(mode);
  }

  private applyRoleSwitch(mode: "developer" | "architect"): void {
    this.roleMode = mode;
    if (typeof window !== "undefined" && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set("mode", mode);
      window.history.replaceState(null, "", url.toString());
    }
  }

  /** Closes the role-switcher dropdown when clicking anywhere else. */
  @HostListener("document:click")
  closeRoleMenu(): void {
    if (this.roleMenuOpen) this.roleMenuOpen = false;
  }

  goDocs(): void {
    window.history.pushState(null, "", "/docs");
    window.dispatchEvent(new Event("popstate"));
  }

  @HostListener("window:keydown", ["$event"])
  onKeydown(event: KeyboardEvent): void {
    const mod = event.ctrlKey || event.metaKey;
    const target = event.target as HTMLElement;
    const inEditable =
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
      target.contentEditable === "true";

    const isSaveHotkey = mod && event.key.toLowerCase() === "s";
    if (isSaveHotkey) {
      event.preventDefault();
      this.triggerSaveWithLoader();
      return;
    }

    // Undo / redo — skip while typing in a field so native text undo still works.
    if (mod && !inEditable) {
      const k = event.key.toLowerCase();
      if (k === "z" && !event.shiftKey) {
        event.preventDefault();
        this.undo();
        return;
      }
      if (k === "y" || (k === "z" && event.shiftKey)) {
        event.preventDefault();
        this.redo();
        return;
      }
      if (k === "c") {
        event.preventDefault();
        this.copySelection();
        return;
      }
      if (k === "v") {
        event.preventDefault();
        this.pasteClipboard();
        return;
      }
      if (k === "d") {
        event.preventDefault();
        this.duplicateSelection();
        return;
      }
    }

    if (
      event.key === "Control" ||
      event.key === "Meta" ||
      event.key === "Shift"
    ) {
      this.ctrlPressed = true;
      return;
    }

    // "?" opens the shortcuts panel; Esc closes it (or clears selection).
    if (!mod && !inEditable && event.key === "?") {
      event.preventDefault();
      this.toggleHotkeys();
      return;
    }
    if (event.key === "Escape") {
      if (this.showHotkeys) {
        this.closeHotkeys();
        return;
      }
      if (!inEditable && this.hasSelection) {
        this.clearSelection();
        return;
      }
    }

    if (event.key !== "Delete" && event.key !== "Backspace") {
      return;
    }
    if (inEditable) {
      return;
    }
    if (this.hasSelection) {
      event.preventDefault();
      this.deleteSelected();
    }
  }

  @HostListener("window:keyup", ["$event"])
  onKeyup(event: KeyboardEvent): void {
    if (
      event.key === "Control" ||
      event.key === "Meta" ||
      event.key === "Shift"
    ) {
      this.ctrlPressed = false;
    }
  }

  @HostListener("window:blur")
  onWindowBlur(): void {
    this.ctrlPressed = false;
  }

  onPaletteDragStart(event: DragEvent, type: AwsServiceType): void {
    event.dataTransfer?.setData("application/aws-service", type);
  }

  onAnnotationDragStart(event: DragEvent): void {
    event.dataTransfer?.setData("application/annotation", "true");
  }

  connectorId(nodeId: string, portId: string): string {
    return `${nodeId}:${portId}`;
  }

  inputPorts(node: ArchitectureNode): ServicePort[] {
    return node.ports.filter((port) => port.direction === "input");
  }

  outputPorts(node: ArchitectureNode): ServicePort[] {
    return node.ports.filter((port) => port.direction === "output");
  }

  onCanvasPointerDown(event: PointerEvent): void {
    if (this.isFlowInteractiveTarget(event.target)) {
      return;
    }
    // Library handles panning via fZoom directive
  }

  /**
   * Clears the selection when the user clicks empty canvas. We handle this
   * ourselves rather than relying only on Foblex's fSelectionChange: after a
   * node drag, Foblex swallows the click that immediately follows, leaving the
   * selection stuck until another node is clicked.
   */
  onCanvasBackgroundClick(event: MouseEvent): void {
    const target = event.target;
    if (
      this.isFlowInteractiveTarget(target) ||
      (target instanceof Element && target.closest(".canvas-tab-bar"))
    ) {
      return;
    }
    if (this.hasSelection) {
      this.clearSelection();
    }
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
      '.node-card, .annotation-node, .port, .f-connection, .mini-map, button, a, input, select, textarea, [contenteditable="true"]',
    );
  }

  private cancelCanvasPan(): void {
    // Native library panning doesn't need manual cancellation here
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const point = this.toCanvasPoint(event.clientX, event.clientY);

    // Handle AWS Service Drop — addService captures undo history + selects + messages
    const type = event.dataTransfer?.getData(
      "application/aws-service",
    ) as AwsServiceType;
    if (type) {
      // Center the node card (148×94) on the drop point.
      this.addService(type, point.x - 74, point.y - 47);
      return;
    }

    // Handle Annotation Drop
    const isAnnotation =
      event.dataTransfer?.getData("application/annotation") === "true";
    if (isAnnotation) {
      this.addAnnotation(point.x - 110, point.y - 60);
      this.setMessage("Note added to the architecture.", "success");
    }
  }

  onFoblexMoveNodes(event: FMoveNodesEvent): void {
    this.pushHistory("move");
    this.nodes = this.nodes.map((node) => {
      const moved = event.nodes.find((item) => item.id === node.id);
      return moved
        ? { ...node, x: moved.position.x, y: moved.position.y }
        : node;
    });
    this.annotations = this.annotations.map((anno) => {
      const moved = event.nodes.find((item) => item.id === anno.id);
      return moved
        ? { ...anno, x: moved.position.x, y: moved.position.y }
        : anno;
    });
    this.revealMinimap();
  }

  onNodePositionChange(
    nodeId: string,
    position: { x: number; y: number },
  ): void {
    this.nodes = this.nodes.map((node) =>
      node.id === nodeId ? { ...node, x: position.x, y: position.y } : node,
    );
  }

  /**
   * Returns a stable position object for a node/annotation so [fNodePosition]
   * keeps the same reference unless x/y actually change. Without this, the
   * template's inline object literal is rebuilt on every change-detection pass
   * (every ~180ms while the sim is running) and Foblex re-applies the position,
   * cancelling any in-progress drag — making nodes feel un-draggable mid-run.
   */
  nodePos(item: { id: string; x: number; y: number }): {
    x: number;
    y: number;
  } {
    const cached = this.positionCache.get(item.id);
    if (cached && cached.x === item.x && cached.y === item.y) {
      return cached;
    }
    const next = { x: item.x, y: item.y };
    this.positionCache.set(item.id, next);
    return next;
  }
  private readonly positionCache = new Map<string, { x: number; y: number }>();

  onFoblexSelection(event: FSelectionChangeEvent): void {
    this.selectedNodeIds = event.nodeIds.filter((id) =>
      this.nodes.some((n) => n.id === id),
    );
    const selectedAnnoIds = event.nodeIds.filter((id) =>
      this.annotations.some((a) => a.id === id),
    );
    this.selectedConnectionIds = event.connectionIds;

    if (
      this.selectedNodeIds.length > 0 ||
      this.selectedConnectionIds.length > 0 ||
      selectedAnnoIds.length > 0
    ) {
      // No automatic expansion as per user request
    }

    // Update the selected flag on nodes for UI feedback
    this.nodes = this.nodes.map((node) => ({
      ...node,
      selected: this.selectedNodeIds.includes(node.id),
    }));

    // Update the selected flag on annotations
    this.annotations = this.annotations.map((anno) => ({
      ...anno,
      selected: selectedAnnoIds.includes(anno.id),
    }));
  }

  serviceColor(type: AwsServiceType): string {
    return this.awsCatalog.getByType(type).color;
  }

  onFoblexCanvasChange(event: FCanvasChangeEvent): void {
    this.pan = { x: event.position.x, y: event.position.y };
    // Keep the exact scale — toCanvasPoint() divides by this, so rounding here
    // makes dropped nodes drift from the cursor once zoomed. Display rounds via pipe.
    this.zoom = event.scale;
    this.revealMinimap();
  }

  onMinimapInteract(event: Event): void {
    event.stopPropagation();
    this.revealMinimap();
  }

  onFoblexCreateConnection(event: FCreateConnectionEvent): void {
    const source = this.findPortSelection(event.sourceId);
    const target = this.findPortSelection(event.targetId ?? "");
    if (!source || !target) {
      this.setMessage(
        "Drop the connection onto a compatible AWS input port.",
        "error",
      );
      return;
    }
    this.tryCreateConnection(
      source.node,
      source.port,
      target.node,
      target.port,
    );
  }

  onPortClick(
    event: MouseEvent,
    node: ArchitectureNode,
    port: ServicePort,
  ): void {
    event.stopPropagation();
    if (port.direction === "output") {
      this.activePort = { node, port };
      this.setMessage(
        `Connect ${node.name} ${port.label} to a compatible input port.`,
        "neutral",
      );
      return;
    }

    if (!this.activePort) {
      this.setMessage(
        "Start from an output port, then choose a compatible input port.",
        "error",
      );
      return;
    }

    const sourceDef = this.awsCatalog.getByType(this.activePort.node.type);
    if (
      sourceDef.behavior.allowedTargets.length > 0 &&
      !sourceDef.behavior.allowedTargets.includes(node.type)
    ) {
      this.setMessage(
        `${sourceDef.name} cannot be connected directly to ${node.name}. Follow AWS integration patterns.`,
        "error",
      );
      this.activePort = undefined;
      return;
    }

    this.tryCreateConnection(
      this.activePort.node,
      this.activePort.port,
      node,
      port,
    );
    this.activePort = undefined;
  }

  tryCreateConnection(
    sourceNode: ArchitectureNode,
    sourcePort: ServicePort,
    targetNode: ArchitectureNode,
    targetPort: ServicePort,
  ): void {
    let finalSourcePort = sourcePort;
    let finalTargetPort = targetPort;
    let result = this.validation.validate(
      sourceNode,
      sourcePort,
      targetNode,
      targetPort,
      this.connections,
    );

    // If exact port match fails, auto-correct by finding ANY valid port combination between these two nodes
    if (!result.allowed) {
      const allOutputs = sourceNode.ports.filter(
        (p) => p.direction === "output",
      );
      const allInputs = targetNode.ports.filter((p) => p.direction === "input");

      let foundAlternative = false;
      for (const sp of allOutputs) {
        for (const tp of allInputs) {
          const altResult = this.validation.validate(
            sourceNode,
            sp,
            targetNode,
            tp,
            this.connections,
          );
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
      this.setMessage(result.message, "error");
      return;
    }

    this.pushHistory();
    const connection = this.factory.createConnection(
      sourceNode.id,
      finalSourcePort.id,
      targetNode.id,
      finalTargetPort.id,
      this.validation.connectionTypeFor(result.ruleId, finalSourcePort.type),
      result.message,
    );
    this.connections = [...this.connections, connection];
    this.setMessage(result.message, "success");
    this.onboarding.notify("edgeCreated");
    this.afterGraphMutated();
  }

  selectNode(id: string): void {
    this.selectedNodeIds = [id];
    this.selectedConnectionIds = [];
    this.nodes = this.nodes.map((node) => ({
      ...node,
      selected: node.id === id,
    }));
    this.advancedConfigExpanded = false;
    this.costEvaluationExpanded = false;
  }

  selectConnection(id: string): void {
    this.selectedConnectionIds = [id];
    this.selectedNodeIds = [];
    this.nodes = this.nodes.map((node) => ({ ...node, selected: false }));
    this.annotations = this.annotations.map((a) => ({ ...a, selected: false }));
  }

  clearSelection(): void {
    this.selectedNodeIds = [];
    this.selectedConnectionIds = [];
    this.nodes = this.nodes.map((node) => ({ ...node, selected: false }));
    this.annotations = this.annotations.map((a) => ({ ...a, selected: false }));
  }

  deleteSelected(): void {
    const nodeCount = this.selectedNodeIds.length;
    const connectionCount = this.selectedConnectionIds.length;
    const selectedAnnoIds = this.annotations
      .filter((a) => a.selected)
      .map((a) => a.id);
    const annoCount = selectedAnnoIds.length;

    if (nodeCount === 0 && connectionCount === 0 && annoCount === 0) return;

    this.pushHistory();

    // 1. Delete selected connections
    if (connectionCount > 0) {
      this.connections = this.connections.filter(
        (c) => !this.selectedConnectionIds.includes(c.id),
      );
    }

    // 2. Delete selected nodes and their associated connections
    if (nodeCount > 0) {
      this.connections = this.connections.filter(
        (c) =>
          !this.selectedNodeIds.includes(c.sourceNodeId) &&
          !this.selectedNodeIds.includes(c.targetNodeId),
      );
      this.nodes = this.nodes.filter(
        (n) => !this.selectedNodeIds.includes(n.id),
      );
    }

    // 3. Delete selected annotations
    if (annoCount > 0) {
      this.annotations = this.annotations.filter(
        (a) => !selectedAnnoIds.includes(a.id),
      );
    }

    const msg =
      nodeCount > 0
        ? `Deleted ${nodeCount} service(s) and their links.`
        : annoCount > 0
          ? `Deleted ${annoCount} annotation(s).`
          : `Deleted ${connectionCount} link(s).`;

    this.clearSelection();
    this.setMessage(msg, "neutral");
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

  // ───── Keyboard-shortcuts panel ─────
  private hotkeysSeen(): boolean {
    try {
      return localStorage.getItem(SimulatorComponent.HOTKEYS_SEEN_KEY) === "true";
    } catch {
      return false;
    }
  }

  openHotkeys(): void {
    // Keyboard shortcuts are desktop-only — never surface them on touch/tablet.
    if (this.isMobileViewport) {
      return;
    }
    this.showHotkeys = true;
  }

  closeHotkeys(): void {
    this.showHotkeys = false;
    try {
      localStorage.setItem(SimulatorComponent.HOTKEYS_SEEN_KEY, "true");
    } catch {
      // ignore persistence failures
    }
  }

  toggleHotkeys(): void {
    this.showHotkeys ? this.closeHotkeys() : this.openHotkeys();
  }

  // ───── Copy / paste / duplicate ─────
  private newId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return (
      "id-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).substring(2, 11)
    );
  }

  /**
   * Deep-clones a set of nodes plus the connections wholly contained within
   * that set, assigning fresh ids and shifting positions by (dx, dy). Port ids
   * are preserved so the remapped connections still resolve to the right ports.
   */
  private cloneGraph(
    srcNodes: ArchitectureNode[],
    srcConnections: ArchitectureConnection[],
    dx: number,
    dy: number,
  ): { nodes: ArchitectureNode[]; connections: ArchitectureConnection[] } {
    const idMap = new Map<string, string>();
    const nodes: ArchitectureNode[] = srcNodes.map((n): ArchitectureNode => {
      const id = this.newId();
      idMap.set(n.id, id);
      return {
        ...n,
        id,
        x: n.x + dx,
        y: n.y + dy,
        selected: false,
        status: "normal",
        config: { ...n.config },
        ports: n.ports.map((p) => ({ ...p })),
        metrics: this.factory.emptyMetrics(),
      };
    });
    const connections: ArchitectureConnection[] = srcConnections
      .filter((c) => idMap.has(c.sourceNodeId) && idMap.has(c.targetNodeId))
      .map((c): ArchitectureConnection => ({
        ...c,
        id: this.newId(),
        sourceNodeId: idMap.get(c.sourceNodeId)!,
        targetNodeId: idMap.get(c.targetNodeId)!,
        traffic: {
          requestsPerSecond: 0,
          latency: 0,
          errorRate: 0,
          intensity: 0,
        },
        animationOffset: Math.random(),
      }));
    return { nodes, connections };
  }

  private selectNodes(ids: string[]): void {
    this.selectedNodeIds = ids;
    this.selectedConnectionIds = [];
    this.annotations = this.annotations.map((a) => ({ ...a, selected: false }));
    this.nodes = this.nodes.map((n) => ({
      ...n,
      selected: ids.includes(n.id),
    }));
  }

  copySelection(): void {
    if (this.selectedNodeIds.length === 0) {
      return;
    }
    const selected = this.nodes.filter((n) =>
      this.selectedNodeIds.includes(n.id),
    );
    const ids = new Set(selected.map((n) => n.id));
    const internal = this.connections.filter(
      (c) => ids.has(c.sourceNodeId) && ids.has(c.targetNodeId),
    );
    this.clipboard = {
      nodes: selected.map((n) => ({
        ...n,
        config: { ...n.config },
        ports: n.ports.map((p) => ({ ...p })),
      })),
      connections: internal.map((c) => ({ ...c, traffic: { ...c.traffic } })),
    };
    this.pasteCount = 0;
    this.setMessage(
      `Copied ${selected.length} service(s). Press Ctrl+V to paste.`,
      "neutral",
    );
  }

  pasteClipboard(): void {
    if (!this.clipboard || this.clipboard.nodes.length === 0) {
      return;
    }
    this.pushHistory();
    const offset = 40 * ++this.pasteCount;
    const { nodes, connections } = this.cloneGraph(
      this.clipboard.nodes,
      this.clipboard.connections,
      offset,
      offset,
    );
    this.nodes = [...this.nodes, ...nodes];
    this.connections = [...this.connections, ...connections];
    this.selectNodes(nodes.map((n) => n.id));
    this.revealMinimap();
    this.setMessage(`Pasted ${nodes.length} service(s).`, "success");
    this.afterGraphMutated();
  }

  duplicateSelection(): void {
    if (this.selectedNodeIds.length === 0) {
      return;
    }
    const selected = this.nodes.filter((n) =>
      this.selectedNodeIds.includes(n.id),
    );
    const ids = new Set(selected.map((n) => n.id));
    const internal = this.connections.filter(
      (c) => ids.has(c.sourceNodeId) && ids.has(c.targetNodeId),
    );
    this.pushHistory();
    const { nodes, connections } = this.cloneGraph(
      selected,
      internal,
      40,
      40,
    );
    this.nodes = [...this.nodes, ...nodes];
    this.connections = [...this.connections, ...connections];
    this.selectNodes(nodes.map((n) => n.id));
    this.revealMinimap();
    this.setMessage(`Duplicated ${nodes.length} service(s).`, "success");
    this.afterGraphMutated();
  }

  startSimulation(): void {
    if (this.isSimulationDisabled) {
      this.setMessage(
        "Fix integration errors (red health cards) before running the simulation.",
        "error",
      );
      return;
    }
    this.simulation.start(this.nodes, this.connections);
    this.setMessage(
      "Simulation started. Real-time traffic is flowing.",
      "success",
    );
    this.onboarding.notify("simulationStarted");
  }

  pauseSimulation(): void {
    this.mode === "paused" ? this.simulation.resume() : this.simulation.pause();
  }

  stopSimulation(): void {
    this.simulation.stop();
    this.packets = [];
    this.setMessage("Simulation stopped.", "neutral");
  }

  openDocs(): void {
    this.simulation.stop();
    window.history.pushState(null, "", "/docs");
    window.dispatchEvent(new Event("popstate"));
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
      // Persist every tab, not just the active one, so no canvas is lost.
      this.persistWorkspace();
      this.setMessage("Architecture saved successfully.", "success");
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
    const tabName = this.tabs[this.activeTabIndex]?.name || "hld-architecture";
    const safeName = tabName
      .replace(/[/\\?%*:|"<> ]/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .toLowerCase();
    const fileName = `${safeName || "architecture"}.json`;

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    this.setMessage(`Project exported as ${fileName}.`, "success");
  }

  importProject(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(
          e.target?.result as string,
        ) as ArchitectureProject;
        this.simulation.stop();
        this.applyProject(project);
        this.setMessage("Project imported successfully.", "success");
      } catch (err) {
        this.setMessage("Invalid project file format.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  loadPreset(): void {
    this.simulation.stop();
    if (this.roleMode === "developer") {
      this.applyProject(this.presets.ecommercePreset());
      this.setMessage("Loaded the serverless ecommerce preset.", "success");
    } else {
      this.applyProject(this.presets.messagingPreset());
      this.setMessage("Loaded the real-time messaging app preset.", "success");
    }
  }

  resetCanvas(): void {
    this.simulation.stop();
    // Record the pre-clear state so Ctrl+Z can bring the architecture back.
    if (
      this.nodes.length > 0 ||
      this.connections.length > 0 ||
      this.annotations.length > 0
    ) {
      this.pushHistory();
    }
    this.nodes = [];
    this.connections = [];
    this.annotations = [];
    this.packets = [];
    this.clearSelection();
    this.setMessage("Canvas reset.", "neutral");
  }

  setZoom(delta: number): void {
    const next = Math.min(
      1.8,
      Math.max(0.45, Number((this.zoom + delta).toFixed(2))),
    );
    this.flowCanvas?.setScale(next);
    this.revealMinimap();
  }

  toggleRunStats(): void {
    this.runStatsExpanded = !this.runStatsExpanded;
  }

  onRunStatsMouseLeave(): void {
    const selects = document.querySelectorAll(".run-stats select");
    selects.forEach((select) => (select as HTMLElement).blur());
  }

  onPanelClick(event: MouseEvent): void {
    if (!this.isMobileViewport) return;
    const target = event.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("select") ||
      target.closest(".region-select-wrapper")
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
    const numValue = Number(value);
    const selectedType = this.selectedNode.type;
    const selectedId = this.selectedNode.id;
    this.pushHistory(`config:${selectedId}:${key}`);

    this.nodes = this.nodes.map((node) =>
      this.selectedNodeIds.includes(node.id)
        ? { ...node, config: { ...node.config, [key]: numValue } }
        : node,
    );

    // Client special handling: propagate RPS to downstream services if sync is on
    if (
      selectedType === "client" &&
      (key === "requestRate" ||
        key === "variableMinRps" ||
        key === "variableMaxRps")
    ) {
      const clientNode = this.nodes.find((n) => n.id === selectedId);
      if (clientNode?.config["syncRpsToServices"]) {
        // If variable traffic is on and the range changed, propagate the new midpoint
        let propagateRps = clientNode.config["requestRate"];
        if (
          clientNode.config["variableTraffic"] &&
          (key === "variableMinRps" || key === "variableMaxRps")
        ) {
          const min = clientNode.config["variableMinRps"] || 1;
          const max = clientNode.config["variableMaxRps"] || min;
          propagateRps = (min + max) / 2;
          this.nodes = this.nodes.map((n) =>
            n.id === selectedId
              ? { ...n, config: { ...n.config, requestRate: propagateRps } }
              : n,
          );
        }
        this.propagateRpsToDownstream(selectedId, propagateRps);
      }
    }

    this.onConfigChange();
  }

  updateSelectConfig(key: any, value: any): void {
    if (!this.selectedNode) {
      return;
    }
    const selectedType = this.selectedNode.type;
    const selectedId = this.selectedNode.id;
    this.pushHistory(`config:${selectedId}:${key}`);

    // Handle client booleans BEFORE applying so we can react to the transition
    if (selectedType === "client" && key === "syncRpsToServices") {
      const clientNode = this.nodes.find((n) => n.id === selectedId);
      if (clientNode) {
        if (value === true) {
          this.snapshotDownstreamThroughput(selectedId);
          const rps = clientNode.config["variableTraffic"]
            ? this.clientMidpoint(clientNode)
            : clientNode.config["requestRate"] || 100;
          this.nodes = this.nodes.map((n) =>
            n.id === selectedId
              ? { ...n, config: { ...n.config, [key]: true } }
              : n,
          );
          this.propagateRpsToDownstream(selectedId, rps);
          this.onConfigChange();
          return;
        } else {
          this.restoreDownstreamThroughput(selectedId);
          this.nodes = this.nodes.map((n) =>
            n.id === selectedId
              ? { ...n, config: { ...n.config, [key]: false } }
              : n,
          );
          this.onConfigChange();
          return;
        }
      }
    }

    if (selectedType === "client" && key === "variableTraffic") {
      const clientNode = this.nodes.find((n) => n.id === selectedId);
      if (clientNode) {
        if (value === true) {
          // Backfill range defaults on first enable so existing/preset nodes
          // (which were created before these params existed) get sensible values
          const min = Number(clientNode.config["variableMinRps"]) || 50;
          const max = Number(clientNode.config["variableMaxRps"]) || 200;
          const mid = Math.round((min + max) / 2);
          this.nodes = this.nodes.map((n) =>
            n.id === selectedId
              ? {
                ...n,
                config: {
                  ...n.config,
                  variableTraffic: true,
                  variableMinRps: min,
                  variableMaxRps: max,
                  requestRate: mid,
                },
              }
              : n,
          );
          if (clientNode.config["syncRpsToServices"]) {
            this.propagateRpsToDownstream(selectedId, mid);
          }
          this.onConfigChange();
          return;
        } else {
          this.nodes = this.nodes.map((n) =>
            n.id === selectedId
              ? { ...n, config: { ...n.config, variableTraffic: false } }
              : n,
          );
          this.onConfigChange();
          return;
        }
      }
    }

    this.nodes = this.nodes.map((node) =>
      this.selectedNodeIds.includes(node.id)
        ? { ...node, config: { ...node.config, [key]: value } }
        : node,
    );
    this.onConfigChange();
  }

  private clientMidpoint(clientNode: ArchitectureNode): number {
    const min = Number(clientNode.config["variableMinRps"]) || 50;
    const max = Number(clientNode.config["variableMaxRps"]) || 200;
    return Math.round((min + max) / 2);
  }

  private getDownstreamNodeIds(sourceId: string): Set<string> {
    const visited = new Set<string>();
    const queue: string[] = [sourceId];
    while (queue.length) {
      const id = queue.shift()!;
      for (const c of this.connections) {
        if (c.sourceNodeId === id && !visited.has(c.targetNodeId)) {
          visited.add(c.targetNodeId);
          queue.push(c.targetNodeId);
        }
      }
    }
    return visited;
  }

  private snapshotDownstreamThroughput(clientId: string): void {
    const downstream = this.getDownstreamNodeIds(clientId);
    const snapshot: Record<string, number> = {};
    for (const node of this.nodes) {
      if (
        downstream.has(node.id) &&
        typeof node.config["throughput"] === "number"
      ) {
        snapshot[node.id] = node.config["throughput"];
      }
    }
    // Store the originals on the client for restore-on-toggle-off. The stable
    // capacity reference (_designThroughput) is set by propagateRpsToDownstream to
    // the synced RPS, so the simulation actually uses the pushed value.
    this.nodes = this.nodes.map((n) =>
      n.id === clientId
        ? { ...n, config: { ...n.config, _syncSnapshot: snapshot } }
        : n,
    );
  }

  private restoreDownstreamThroughput(clientId: string): void {
    const client = this.nodes.find((n) => n.id === clientId);
    const snapshot: Record<string, number> =
      client?.config["_syncSnapshot"] || {};
    this.nodes = this.nodes.map((n) => {
      if (snapshot[n.id] !== undefined) {
        const { _designThroughput, ...rest } = n.config;
        return { ...n, config: { ...rest, throughput: snapshot[n.id] } };
      }
      return n;
    });
    this.nodes = this.nodes.map((n) =>
      n.id === clientId
        ? { ...n, config: { ...n.config, _syncSnapshot: {} } }
        : n,
    );
  }

  private propagateRpsToDownstream(clientId: string, rps: number): void {
    const downstream = this.getDownstreamNodeIds(clientId);
    const rounded = Math.max(1, Math.round(rps * 100) / 100);
    this.nodes = this.nodes.map((n) =>
      downstream.has(n.id)
        ? {
          ...n,
          // throughput drives the cost panel; _designThroughput is the capacity
          // the simulation reads, so both must reflect the synced RPS for the
          // pushed value to actually change latency/utilization.
          config: { ...n.config, throughput: rounded, _designThroughput: rounded },
        }
        : n,
    );
  }

  isFieldInvalid(field: any): boolean {
    if (!this.selectedNode) {
      return false;
    }
    if (field.type === "enum" || field.type === "boolean") {
      return false;
    }
    const val = this.selectedNode.config[field.key];
    if (field.min !== undefined) {
      const num =
        val !== undefined && val !== null && val !== ""
          ? Number(val)
          : field.default !== undefined
            ? Number(field.default)
            : 0;
      return isNaN(num) || num < field.min;
    }
    return false;
  }

  updateNodeName(value: string): void {
    const targetId = this.selectedNodeIds[0];
    if (!targetId) {
      return;
    }
    this.pushHistory(`rename:${targetId}`);
    this.nodes = this.nodes.map((node) =>
      node.id === targetId ? { ...node, name: value } : node,
    );
  }

  onConfigChange(): void {
    // Sync local changes to the simulation service so they take effect immediately
    this.simulation.updateNodes(this.nodes, this.connections);
    this.onboarding.notify("configChanged");
    this.afterGraphMutated();
  }

  // ── Challenges (Developer Mode) ──────────────────────────────────────────────

  /** Re-evaluates milestones for the active challenge after any canvas change. */
  private afterGraphMutated(): void {
    this.challengeService.notifyGraphChanged(this.nodes, this.connections);
  }

  /** Shows a brief center-screen popup when a milestone is reached. */
  private showMilestonePopup(number: number, total: number, label: string, isHidden?: boolean): void {
    this.milestonePopup = { number, total, label, isHidden };
    if (this.milestonePopupTimer) clearTimeout(this.milestonePopupTimer);
    this.milestonePopupTimer = setTimeout(() => (this.milestonePopup = null), 3200);
  }

  /** Empty starting canvas for Developer Mode (the Challenge hub is the focus). */
  private blankDeveloperProject(): ArchitectureProject {
    return {
      id: "dev-blank",
      name: "Developer Canvas",
      nodes: [],
      connections: [],
      annotations: [],
      currency: "USD",
      updatedAt: new Date().toISOString(),
    };
  }

  /** Panel → start a challenge: always opens a fresh canvas seeded with a Users node. */
  onStartChallenge(challenge: Challenge): void {
    this.simulation.stop();
    this.challengeService.start(challenge.id);
    // Open every challenge on its own new canvas so existing work is preserved.
    this.addCanvasTab(challenge.title, challenge.title);
    const client = this.factory.createNode("client", 80, 220);
    // Seed the Users node with this challenge's workload (RPS / payload / spikes)
    // so the simulation reflects the problem from the first run.
    const refClient = challenge.referenceSolution?.nodes.find(
      (n) => n.type === "client",
    );
    if (refClient?.config) {
      client.config = { ...client.config, ...refClient.config } as typeof client.config;
    }
    this.nodes = [client];
    this.connections = [];
    this.annotations = [];
    this.packets = [];
    this.clearSelection();
    this.saveActiveTabState();
    this.afterGraphMutated();
    this.setMessage(`Challenge started on a new canvas: ${challenge.title}`, "success");
  }

  /** Panel → reset/redesign a challenge: clears progress and resets canvas. */
  onResetChallenge(challenge: Challenge): void {
    this.simulation.stop();
    this.pushHistory();
    const client = this.factory.createNode("client", 80, 220);
    this.nodes = [client];
    this.connections = [];
    this.annotations = [];
    this.packets = [];
    this.clearSelection();
    this.afterGraphMutated();
    this.setMessage(`Challenge progress reset: ${challenge.title}`, "success");
  }

  /** Panel → leave the curated sandbox loaded for freeform practice. */
  onFreePractice(): void {
    this.simulation.stop();
    this.challengeService.exit();
    this.applyProject(this.presets.ecommercePreset());
    this.setMessage("Free practice — sandbox loaded.", "success");
  }

  /** Panel → replay the onboarding tour. */
  onReplayTour(): void {
    this.onboarding.start(true);
  }

  /** Panel → score the current architecture against the active challenge. */
  onEvaluateChallenge(): void {
    const result = this.challengeService.evaluate(this.nodes, this.connections);
    if (!result) return;
    this.setMessage(
      result.passed
        ? `Passed! Scored ${result.score}/100.`
        : `Scored ${result.score}/100 — see suggestions to improve.`,
      result.passed ? "success" : "neutral",
    );
  }

  /** Panel → load the challenge's reference solution onto the canvas. */
  onShowReference(challenge: Challenge): void {
    this.simulation.stop();
    const { nodes, connections } = this.graphBuilder.build(
      challenge.referenceSolution.nodes,
      challenge.referenceSolution.edges,
    );
    this.applyProject({
      id: `reference-${challenge.id}`,
      name: `${challenge.title} — Reference`,
      nodes,
      connections,
      annotations: [],
      currency: "USD",
      updatedAt: new Date().toISOString(),
    });
    this.afterGraphMutated();
    this.setMessage("Loaded the reference solution.", "neutral");
  }

  // ── Undo / Redo ────────────────────────────────────────────────────────────

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Deep-clone the current canvas into a snapshot. */
  private snapshotState(): CanvasSnapshot {
    return {
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      connections: JSON.parse(JSON.stringify(this.connections)),
      annotations: JSON.parse(JSON.stringify(this.annotations)),
    };
  }

  /**
   * Capture the pre-mutation state. Call this at the start of any method that
   * changes nodes / connections / annotations. Pass a `coalesceKey` for
   * continuous edits (e.g. 'config', 'move') so a slider drag becomes a single
   * undo entry instead of dozens.
   */
  private pushHistory(coalesceKey?: string): void {
    // Any edit that records history makes the active canvas unsaved (orange dot).
    const activeTab = this.tabs[this.activeTabIndex];
    if (activeTab) activeTab.dirty = true;
    const now = Date.now();
    if (
      coalesceKey &&
      coalesceKey === this.lastHistoryKey &&
      now - this.lastHistoryTime < 700
    ) {
      this.lastHistoryTime = now;
      return; // fold rapid successive edits into the entry already on the stack
    }
    this.undoStack.push(this.snapshotState());
    if (this.undoStack.length > this.historyLimit) this.undoStack.shift();
    this.redoStack = [];
    this.lastHistoryKey = coalesceKey ?? "";
    this.lastHistoryTime = now;
  }

  /** Clear history — used when loading a project or switching canvas tabs. */
  private resetHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.lastHistoryKey = "";
    this.lastHistoryTime = 0;
  }

  private applySnapshot(snap: CanvasSnapshot): void {
    this.nodes = snap.nodes.map((n) => ({ ...n, selected: false }));
    this.connections = [...snap.connections];
    this.annotations = snap.annotations.map((a) => ({ ...a, selected: false }));
    this.selectedNodeIds = [];
    this.selectedConnectionIds = [];
    this.packets = [];
    this.simulation.updateNodes(this.nodes, this.connections);
    const activeTab = this.tabs[this.activeTabIndex];
    if (activeTab) activeTab.dirty = true;
    this.saveActiveTabState();
    if (this.flowCanvas) this.flowCanvas.redraw();
  }

  undo(): void {
    if (this.mode === "running") {
      this.setMessage("Stop the simulation before undoing changes.", "error");
      return;
    }
    if (this.undoStack.length === 0) {
      this.setMessage("Nothing to undo.", "neutral");
      return;
    }
    this.redoStack.push(this.snapshotState());
    this.applySnapshot(this.undoStack.pop()!);
    this.lastHistoryKey = "";
    this.setMessage("Undo.", "neutral");
  }

  redo(): void {
    if (this.mode === "running") {
      this.setMessage("Stop the simulation before redoing changes.", "error");
      return;
    }
    if (this.redoStack.length === 0) {
      this.setMessage("Nothing to redo.", "neutral");
      return;
    }
    this.undoStack.push(this.snapshotState());
    this.applySnapshot(this.redoStack.pop()!);
    this.lastHistoryKey = "";
    this.setMessage("Redo.", "neutral");
  }

  nodeStyle(node: ArchitectureNode): Record<string, string> {
    return {
      transform: `translate(${node.x}px, ${node.y}px)`,
      borderColor: this.statusColor(node.status),
    };
  }

  edgePath(connection: ArchitectureConnection): string {
    const source = this.nodes.find(
      (node) => node.id === connection.sourceNodeId,
    );
    const target = this.nodes.find(
      (node) => node.id === connection.targetNodeId,
    );
    if (!source || !target) {
      return "";
    }
    const start = this.portPoint(source, "output");
    const end = this.portPoint(target, "input");
    const curve = Math.max(80, Math.abs(end.x - start.x) * 0.45);
    return `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
  }

  packetPoint(packet: DataPacket): { x: number; y: number } {
    const connection = this.connections.find(
      (candidate) => candidate.id === packet.connectionId,
    );
    if (!connection) {
      return { x: 0, y: 0 };
    }
    const source = this.nodes.find(
      (node) => node.id === connection.sourceNodeId,
    );
    const target = this.nodes.find(
      (node) => node.id === connection.targetNodeId,
    );
    if (!source || !target) {
      return { x: 0, y: 0 };
    }
    const start = this.portPoint(source, "output");
    const end = this.portPoint(target, "input");
    return {
      x: start.x + (end.x - start.x) * packet.progress,
      y: start.y + (end.y - start.y) * packet.progress,
    };
  }

  connectionMidpoint(connection: ArchitectureConnection): {
    x: number;
    y: number;
  } {
    const source = this.nodes.find(
      (node) => node.id === connection.sourceNodeId,
    );
    const target = this.nodes.find(
      (node) => node.id === connection.targetNodeId,
    );
    if (!source || !target) {
      return { x: 0, y: 0 };
    }
    const start = this.portPoint(source, "output");
    const end = this.portPoint(target, "input");
    return {
      x: start.x + (end.x - start.x) * 0.5,
      y: start.y + (end.y - start.y) * 0.5,
    };
  }

  statusColor(status: HealthStatus): string {
    const colors: Record<HealthStatus, string> = {
      normal: "#16a34a",
      busy: "#d97706", // amber — nearing capacity (warning)
      overloaded: "#dc2626", // red — past capacity, treated as an error
      failing: "#dc2626",
      offline: "#dc2626", // red when stopped/offline
    };
    return colors[status];
  }

  /**
   * Human-readable latency: ms under 1s, seconds under 1 min, then "Xm Ys".
   * Keeps overloaded nodes legible as latency climbs from ms into minutes.
   */
  formatLatency(ms: number | null | undefined): string {
    const v = Math.max(0, Math.round(Number(ms) || 0));
    if (v < 1000) return `${v}ms`;
    if (v < 60000) {
      const s = v / 1000;
      return `${s % 1 === 0 ? s : s.toFixed(1)}s`;
    }
    const mins = Math.floor(v / 60000);
    const secs = Math.round((v % 60000) / 1000);
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }

  connectionColor(connection: ArchitectureConnection): string {
    if (connection.traffic.errorRate > 10) {
      return "#dc2626"; // red when stopped/failing
    }
    if (connection.traffic.intensity > 0.7) {
      return "#eab308"; // yellow when busy
    }
    // Default idle edge: dark ink on light, light slate on dark so it stays visible.
    return this.themeService.isDark ? "#64748b" : "#111827";
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  isPortSelected(nodeId: string, portId: string): boolean {
    return (
      this.activePort?.node.id === nodeId && this.activePort?.port.id === portId
    );
  }

  trackByService(_: number, item: any): string {
    return item.type;
  }

  trackByCategory(_: number, item: { name: string }): string {
    return item.name;
  }

  private applyProject(project: ArchitectureProject): void {
    this.projectName = project.name;
    this.globalCurrency = project.currency || "USD";
    this.globalRegion = project.region || "us-east-1";
    this.loadRegionCost(this.globalRegion);
    // Normalize client nodes: ensure requestRate is at least the JSON min (100 default)
    // so legacy saved nodes don't surface a stale value of 1 from earlier toggle bugs.
    this.nodes = project.nodes.map((n) => {
      if (n.type === "client") {
        const rate = Number(n.config["requestRate"]);
        if (!rate || rate < 2) {
          return { ...n, config: { ...n.config, requestRate: 100 } };
        }
      }
      return n;
    });
    this.connections = project.connections;
    this.annotations = project.annotations || [];
    this.packets = [];
    this.clearSelection();
    this.resetHistory();

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
      this.tabs = [
        {
          id: `tab-${Date.now()}`,
          name: project.name || "Canvas 1",
          projectName: project.name || "Untitled AWS Architecture",
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
          simulationMode: "idle",
          totals: { processed: 0, dropped: 0, avgLatency: 0 },
          tick: 0,
          dirty: true,
        },
      ];
      this.activeTabIndex = 0;
    } else {
      const tab = this.tabs[this.activeTabIndex];
      tab.name = project.name || `Canvas ${this.activeTabIndex + 1}`;
      tab.projectName = project.name || "Untitled AWS Architecture";
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
      tab.simulationMode = "idle";
      tab.totals = { processed: 0, dropped: 0, avgLatency: 0 };
      tab.tick = 0;
      tab.dirty = true;
    }
  }

  saveActiveTabState(): void {
    if (this.activeTabIndex < 0 || this.activeTabIndex >= this.tabs.length)
      return;
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
    this.loadRegionCost(this.globalRegion);
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
      tab.simulationMode,
    );

    this.resetHistory();
  }

  switchCanvasTab(index: number): void {
    if (index === this.activeTabIndex || index < 0 || index >= this.tabs.length)
      return;
    this.saveActiveTabState();
    this.loadTabState(index);
  }

  /**
   * Creates a fresh empty canvas tab, makes it active, and returns its index.
   * New canvases start dirty (orange dot) since they have never been saved.
   */
  private addCanvasTab(name: string, projectName: string): number {
    this.saveActiveTabState();
    const tabIndex = this.tabs.length;
    const newTab: CanvasTab = {
      id: `tab-${Date.now()}`,
      name,
      projectName,
      nodes: [],
      connections: [],
      annotations: [],
      packets: [],
      selectedNodeIds: [],
      selectedConnectionIds: [],
      zoom: this.isMobileViewport ? 0.65 : 0.85,
      pan: { x: 40, y: 40 },
      globalCurrency: "USD",
      globalRegion: "us-east-1",
      simulationMode: "idle",
      totals: { processed: 0, dropped: 0, avgLatency: 0 },
      tick: 0,
      dirty: true,
    };
    this.tabs.push(newTab);
    this.loadTabState(tabIndex);
    return tabIndex;
  }

  addNewTab(): void {
    const next = this.tabs.length + 1;
    this.addCanvasTab(`Canvas ${next}`, `Untitled AWS Architecture ${next}`);
    this.setMessage("New canvas tab added.", "success");
  }

  closeTab(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.tabs.length <= 1) {
      this.setMessage("Cannot close the only remaining canvas.", "error");
      return;
    }
    if (this.tabIsUnsaved(index)) {
      this.leaveGuard = {
        action: "closeTab",
        tabIndex: index,
        title: "Close this canvas?",
        message:
          "This canvas has unsaved changes. Save your work first, or discard it.",
      };
      return;
    }
    this.doCloseTab(index);
  }

  private doCloseTab(index: number): void {
    this.tabs.splice(index, 1);
    if (index === this.activeTabIndex) {
      const nextIndex = Math.min(index, this.tabs.length - 1);
      this.loadTabState(nextIndex);
    } else if (index < this.activeTabIndex) {
      this.activeTabIndex--;
    }
    this.setMessage("Canvas tab closed.", "neutral");
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
      id: "local-project",
      name: this.projectName,
      nodes: this.nodes,
      connections: this.connections,
      annotations: this.annotations,
      currency: this.globalCurrency,
      region: this.globalRegion,
      updatedAt: new Date().toISOString(),
    };
  }

  private setMessage(
    message: string,
    tone: "neutral" | "success" | "error",
  ): void {
    this.validationMessage = message;
    this.validationTone = tone;
  }

  private findPortSelection(connectorId: string): PortSelection | undefined {
    const [nodeId, portId] = connectorId.split(":");
    const node = this.nodes.find((candidate) => candidate.id === nodeId);
    const port = node?.ports.find((candidate) => candidate.id === portId);
    return node && port ? { node, port } : undefined;
  }

  private toCanvasPoint(
    clientX: number,
    clientY: number,
  ): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.pan.x) / this.zoom,
      y: (clientY - rect.top - this.pan.y) / this.zoom,
    };
  }

  private portPoint(
    node: ArchitectureNode,
    direction: "input" | "output",
  ): { x: number; y: number } {
    return {
      x: node.x + (direction === "input" ? 0 : 184),
      y: node.y + 62,
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

  private static readonly mobileMediaQueryList =
    "(max-width: 900px), (hover: none) and (pointer: coarse)";

  private updateMobileViewport(): void {
    const isMobile = window.matchMedia(
      SimulatorComponent.mobileMediaQueryList,
    ).matches;
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
      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    });
  }
}
