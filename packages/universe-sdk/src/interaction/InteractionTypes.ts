import { SoftwareGraphEdge } from '@codeverse/types';
import { CelestialNode } from '../generator/universeGenerator';

export type InteractionToolMode = 'SELECT' | 'INSPECT' | 'MEASURE_DEPENDENCY' | 'PAN';

export type SelectionMode = 'SINGLE' | 'MULTI';

export interface HoverDetails {
  nodeId: string;
  node: CelestialNode;
  point: [number, number, number];
  screenPosition: { x: number; y: number };
  distance: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  nodeId: string | null;
  node: CelestialNode | null;
  screenPosition: { x: number; y: number };
}

export interface DependencyTrace {
  upstreamNodeIds: Set<string>;
  downstreamNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
}

export interface InteractionState {
  toolMode: InteractionToolMode;
  selectionMode: SelectionMode;
  selectedNodeIds: Set<string>;
  hoveredNodeId: string | null;
  hoverDetails: HoverDetails | null;
  contextMenu: ContextMenuState;
  dependencyTrace: DependencyTrace;
}

export interface InteractionEngineActions {
  setToolMode: (mode: InteractionToolMode) => void;
  setSelectionMode: (mode: SelectionMode) => void;
  selectNode: (nodeId: string, isMulti?: boolean) => void;
  clearSelection: () => void;
  hoverNode: (nodeId: string | null, details?: HoverDetails | null) => void;
  openContextMenu: (node: CelestialNode, screenPos: { x: number; y: number }) => void;
  closeContextMenu: () => void;
  computeDependencyTrace: (nodeId: string | null, edges: SoftwareGraphEdge[]) => DependencyTrace;
}
