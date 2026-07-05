import {
  Annotation,
  ArchitectureConnection,
  ArchitectureNode,
  Currency,
  DataPacket,
  SimulationMode,
} from './architecture.model';
import type { PersistedTab } from '../services/project-storage.service';

/** A single canvas in the multi-tab workspace, including runtime-only state. */
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
  /** True when the canvas has unsaved changes (orange dot); false once saved. */
  dirty: boolean;
}

const DEFAULT_CURRENCY: Currency = 'USD';
const DEFAULT_REGION = 'us-east-1';
const DEFAULT_PAN = { x: 40, y: 40 };

/** Serializes a runtime tab to its persistable form (drops runtime-only fields). */
export function toPersistedTab(tab: CanvasTab): PersistedTab {
  return {
    id: tab.id,
    name: tab.name,
    projectName: tab.projectName,
    nodes: tab.nodes,
    connections: tab.connections,
    annotations: tab.annotations,
    currency: tab.globalCurrency,
    region: tab.globalRegion,
  };
}

/**
 * Rebuilds a runtime tab from persisted data, filling runtime-only defaults.
 * Tolerant of partial/legacy records so a malformed save never loses a canvas.
 */
export function fromPersistedTab(tab: PersistedTab, index: number, defaultZoom: number): CanvasTab {
  return {
    id: tab.id || `tab-${Date.now()}-${index}`,
    name: tab.name || `Canvas ${index + 1}`,
    projectName: tab.projectName || tab.name || 'Untitled AWS Architecture',
    nodes: tab.nodes || [],
    connections: tab.connections || [],
    annotations: tab.annotations || [],
    packets: [],
    selectedNodeIds: [],
    selectedConnectionIds: [],
    zoom: defaultZoom,
    pan: { ...DEFAULT_PAN },
    globalCurrency: tab.currency || DEFAULT_CURRENCY,
    globalRegion: tab.region || DEFAULT_REGION,
    simulationMode: 'idle' as SimulationMode,
    totals: { processed: 0, dropped: 0, avgLatency: 0 },
    tick: 0,
    dirty: false,
  };
}
