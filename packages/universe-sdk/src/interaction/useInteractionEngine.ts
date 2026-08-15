import { useState, useCallback, useMemo } from 'react';
import { SoftwareGraphEdge } from '@codeverse/types';
import { CelestialNode } from '../generator/universeGenerator';
import {
  InteractionState,
  InteractionToolMode,
  SelectionMode,
  HoverDetails,
  ContextMenuState,
  DependencyTrace,
} from './InteractionTypes';
import { InteractionTraceUtils } from './InteractionTraceUtils';

interface UseInteractionEngineOptions {
  nodes: CelestialNode[];
  edges: SoftwareGraphEdge[];
  onSelectNode?: (nodeId: string | null) => void;
  onDoubleSelectNode?: (node: CelestialNode) => void;
}

export function useInteractionEngine({
  nodes: _nodes,
  edges,
  onSelectNode,
  onDoubleSelectNode,
}: UseInteractionEngineOptions) {
  const [toolMode, setToolMode] = useState<InteractionToolMode>('SELECT');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('SINGLE');
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoverDetails, setHoverDetails] = useState<HoverDetails | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    nodeId: null,
    node: null,
    screenPosition: { x: 0, y: 0 },
  });

  const activeFocusId = useMemo(() => {
    if (selectedNodeIds.size === 1) {
      return Array.from(selectedNodeIds)[0];
    }
    return hoveredNodeId;
  }, [selectedNodeIds, hoveredNodeId]);

  const dependencyTrace = useMemo<DependencyTrace>(() => {
    return InteractionTraceUtils.computeDependencyTrace(activeFocusId, edges);
  }, [activeFocusId, edges]);

  const selectNode = useCallback(
    (nodeId: string, isMulti: boolean = false) => {
      setSelectedNodeIds((prev) => {
        const next = new Set(prev);
        if (isMulti || selectionMode === 'MULTI') {
          if (next.has(nodeId)) {
            next.delete(nodeId);
          } else {
            next.add(nodeId);
          }
        } else {
          if (next.size === 1 && next.has(nodeId)) {
            next.clear();
          } else {
            next.clear();
            next.add(nodeId);
          }
        }

        const primarySelected = next.size === 1 ? Array.from(next)[0] : null;
        if (onSelectNode) {
          onSelectNode(primarySelected);
        }

        return next;
      });
    },
    [selectionMode, onSelectNode],
  );

  const clearSelection = useCallback(() => {
    setSelectedNodeIds(new Set());
    if (onSelectNode) {
      onSelectNode(null);
    }
  }, [onSelectNode]);

  const hoverNode = useCallback((nodeId: string | null, details: HoverDetails | null = null) => {
    setHoveredNodeId(nodeId);
    setHoverDetails(details);
  }, []);

  const openContextMenu = useCallback(
    (node: CelestialNode, screenPosition: { x: number; y: number }) => {
      setContextMenu({
        isOpen: true,
        nodeId: node.id,
        node,
        screenPosition,
      });
    },
    [],
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleDoubleClickNode = useCallback(
    (node: CelestialNode) => {
      selectNode(node.id, false);
      if (onDoubleSelectNode) {
        onDoubleSelectNode(node);
      }
    },
    [selectNode, onDoubleSelectNode],
  );

  const state: InteractionState = {
    toolMode,
    selectionMode,
    selectedNodeIds,
    hoveredNodeId,
    hoverDetails,
    contextMenu,
    dependencyTrace,
  };

  return {
    state,
    toolMode,
    selectionMode,
    selectedNodeIds,
    hoveredNodeId,
    hoverDetails,
    contextMenu,
    dependencyTrace,
    setToolMode,
    setSelectionMode,
    selectNode,
    clearSelection,
    hoverNode,
    openContextMenu,
    closeContextMenu,
    handleDoubleClickNode,
  };
}
