'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneBuilder } from './SceneBuilder';
import { createSampleUniverseGraph } from '../graph/universeGraphBuilder';
import { UniverseGenerator } from '../generator/universeGenerator';
import { useCameraEngine } from '../camera/useCameraEngine';
import { useCameraHotkeys } from '../camera/useCameraHotkeys';
import { CameraControlsHUD } from '../camera/CameraControlsHUD';

interface UniverseCanvasProps {
  repoId?: string;
  onNodeSelect?: (nodeId: string | null) => void;
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({ onNodeSelect }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const celestialUniverse = useMemo(() => {
    const graph = createSampleUniverseGraph();
    return UniverseGenerator.generateCelestialUniverse(graph, 'CodeVerse Software Galaxy');
  }, []);

  const spatialNodes = useMemo(() => {
    return celestialUniverse.nodes.map((n) => ({
      id: n.id,
      position: n.position,
      size: n.size,
      name: n.name,
    }));
  }, [celestialUniverse.nodes]);

  const cameraEngine = useCameraEngine({
    nodes: spatialNodes,
  });

  const selectedNode = useMemo(() => {
    return celestialUniverse.nodes.find((n) => n.id === selectedNodeId);
  }, [celestialUniverse.nodes, selectedNodeId]);

  const handleSelectNode = useCallback(
    (id: string) => {
      const newSelectedId = selectedNodeId === id ? null : id;
      setSelectedNodeId(newSelectedId);
      if (onNodeSelect) {
        onNodeSelect(newSelectedId);
      }

      if (newSelectedId) {
        const nodeData = spatialNodes.find((n) => n.id === newSelectedId);
        if (nodeData) {
          cameraEngine.flyToNode(nodeData, cameraEngine.targetPose.position);
        }
      }
    },
    [selectedNodeId, onNodeSelect, spatialNodes, cameraEngine],
  );

  const handleFocusSelected = useCallback(() => {
    if (selectedNode) {
      const nodeData = spatialNodes.find((n) => n.id === selectedNode.id);
      if (nodeData) {
        cameraEngine.flyToNode(nodeData, cameraEngine.targetPose.position);
      }
    }
  }, [selectedNode, spatialNodes, cameraEngine]);

  const handleToggleCinematic = useCallback(() => {
    if (cameraEngine.mode === 'CINEMATIC_AUTO_ROTATE') {
      cameraEngine.resetOverview();
    } else {
      cameraEngine.setMode('CINEMATIC_AUTO_ROTATE');
    }
  }, [cameraEngine]);

  // Setup Keyboard Hotkeys (R, F, C, T, Space)
  useCameraHotkeys({
    onResetOverview: cameraEngine.resetOverview,
    onFocusSelected: handleFocusSelected,
    onToggleCinematic: handleToggleCinematic,
    onToggleTopDown: cameraEngine.switchToTopDownMap,
    onToggleAutoRotate: cameraEngine.toggleAutoRotate,
  });

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      <Canvas camera={{ position: cameraEngine.config.defaultPosition, fov: cameraEngine.config.defaultFov }}>
        <SceneBuilder
          nodes={celestialUniverse.nodes}
          edges={celestialUniverse.edges}
          selectedNodeId={selectedNodeId}
          hoveredNodeId={hoveredNodeId}
          onSelectNode={handleSelectNode}
          onHoverNode={setHoveredNodeId}
          cameraMode={cameraEngine.mode}
          targetPose={cameraEngine.targetPose}
          isTransitioning={cameraEngine.isTransitioning}
          onTransitionComplete={() => cameraEngine.setIsTransitioning(false)}
          autoRotate={cameraEngine.autoRotate}
          shakeOffset={cameraEngine.shakeOffset}
          focusedNodePosition={selectedNode ? selectedNode.position : null}
        />
      </Canvas>

      {/* Camera Engine Interactive HUD Dock */}
      <CameraControlsHUD
        mode={cameraEngine.mode}
        autoRotate={cameraEngine.autoRotate}
        isTransitioning={cameraEngine.isTransitioning}
        selectedNodeName={selectedNode?.name}
        onOverview={cameraEngine.resetOverview}
        onFocusNode={handleFocusSelected}
        onTopDownMap={cameraEngine.switchToTopDownMap}
        onToggleCinematic={handleToggleCinematic}
        onToggleAutoRotate={cameraEngine.toggleAutoRotate}
      />

      {/* Floating HUD Information Header */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-3 rounded-2xl text-slate-200 z-10 border border-slate-800 backdrop-blur-md shadow-2xl flex items-center space-x-4">
        <div>
          <div className="font-bold text-sm text-cyan-400 font-mono flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{celestialUniverse.galaxyName}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 space-x-2 font-mono">
            <span>Stars: {celestialUniverse.stats.totalStars}</span>
            <span>•</span>
            <span>Planets: {celestialUniverse.stats.totalPlanets}</span>
            <span>•</span>
            <span>Moons: {celestialUniverse.stats.totalMoons}</span>
          </div>
        </div>
      </div>

      {/* Focus Node Active HUD Footer */}
      {selectedNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-5 py-2.5 rounded-full text-xs text-slate-200 border border-slate-700 flex items-center space-x-3 z-20 shadow-glow-cyan bg-slate-900/90 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400 font-mono">Selected Body:</span>
          <span className="font-bold text-cyan-300 font-mono text-sm">{selectedNode.name}</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-cyan-400 uppercase font-mono">
            {selectedNode.type}
          </span>
          <button
            onClick={() => handleSelectNode(selectedNode.id)}
            className="text-slate-400 hover:text-white text-xs font-mono ml-2 border-l border-slate-700 pl-2"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

