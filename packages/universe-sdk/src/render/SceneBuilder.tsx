'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';

import * as THREE from 'three';
import { CelestialNode } from '../generator/universeGenerator';
import { SoftwareGraphEdge } from '@codeverse/types';
import { CameraController } from '../camera/CameraController';
import { CameraMode, CameraPose } from '../camera/CameraEngineTypes';

interface CelestialNodeMeshProps {
  node: CelestialNode;
  isSelected: boolean;
  isHovered: boolean;
  isTraceHighlighted?: boolean;
  onSelect: (nodeId: string, isMulti?: boolean) => void;
  onHover: (nodeId: string | null, event?: { x: number; y: number; point: [number, number, number] }) => void;
  onContextMenu?: (node: CelestialNode, screenPos: { x: number; y: number }) => void;
}

export const CelestialNodeMesh: React.FC<CelestialNodeMeshProps> = ({
  node,
  isSelected,
  isHovered,
  isTraceHighlighted = false,
  onSelect,
  onHover,
  onContextMenu,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * node.rotationSpeed;
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.2;
    }
  });

  const activeColor = isSelected
    ? '#38bdf8'
    : isHovered
      ? '#ffffff'
      : isTraceHighlighted
        ? '#fbbf24'
        : node.color;
  const emissiveIntensity = isSelected
    ? 1.0
    : isHovered
      ? 0.8
      : isTraceHighlighted
        ? 0.6
        : node.emissiveIntensity;

  return (
    <group position={node.position}>
      {/* Atmosphere Glow Aura */}
      {node.atmosphereGlow && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[node.size * 1.25, 32, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={isSelected ? 0.4 : isHovered ? 0.3 : isTraceHighlighted ? 0.25 : 0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Main Celestial Body */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id, e.shiftKey);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          if (onContextMenu) {
            onContextMenu(node, { x: e.clientX, y: e.clientY });
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id, {
            x: e.clientX,
            y: e.clientY,
            point: [e.point.x, e.point.y, e.point.z],
          });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[node.size, 32, 32]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={node.color}
          emissiveIntensity={emissiveIntensity}
          roughness={node.roughness}
          metalness={node.metalness}
        />
      </mesh>

      {/* Planetary Orbit Ring */}
      {node.type === 'planet' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[node.size * 1.4, node.size * 1.6, 64]} />
          <meshBasicMaterial
            color={node.color}
            opacity={0.25}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label above Node */}
      <Text
        position={[0, node.size + 0.6, 0]}
        fontSize={Math.max(0.4, node.size * 0.25)}
        color={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : isTraceHighlighted ? '#fbbf24' : '#cbd5e1'}
        anchorX="center"
        anchorY="bottom"
      >
        {node.name}
      </Text>
    </group>
  );
};

// Dependency Edge Line Component
interface EdgeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
  isHighlighted: boolean;
  isTraceHighlighted?: boolean;
}

export const EdgeLine: React.FC<EdgeLineProps> = ({
  start,
  end,
  strength,
  isHighlighted,
  isTraceHighlighted = false,
}) => {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end],
  );
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineColor = isTraceHighlighted ? '#fbbf24' : isHighlighted ? '#38bdf8' : '#475569';
  const lineOpacity = isTraceHighlighted
    ? 0.95
    : isHighlighted
      ? 0.9
      : Math.min(0.5, Math.max(0.15, strength));

  return (
    // @ts-expect-error - line element JSX binding
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={lineColor} opacity={lineOpacity} transparent linewidth={1} />
    </line>
  );
};

// Complete Scene Builder Wrapper
interface SceneBuilderProps {
  nodes: CelestialNode[];
  edges: SoftwareGraphEdge[];
  selectedNodeId: string | null;
  selectedNodeIds?: Set<string>;
  hoveredNodeId: string | null;
  highlightedEdgeIds?: Set<string>;
  traceNodeIds?: Set<string>;
  onSelectNode: (nodeId: string, isMulti?: boolean) => void;
  onHoverNode: (nodeId: string | null, details?: { x: number; y: number; point: [number, number, number] }) => void;
  onContextMenu?: (node: CelestialNode, screenPos: { x: number; y: number }) => void;

  // Camera Engine Integration
  cameraMode?: CameraMode;
  targetPose?: CameraPose;
  isTransitioning?: boolean;
  onTransitionComplete?: () => void;
  autoRotate?: boolean;
  shakeOffset?: [number, number, number];
  focusedNodePosition?: [number, number, number] | null;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedNodeIds,
  hoveredNodeId,
  highlightedEdgeIds,
  traceNodeIds,
  onSelectNode,
  onHoverNode,
  onContextMenu,
  cameraMode,
  targetPose,
  isTransitioning = false,
  onTransitionComplete,
  autoRotate = false,
  shakeOffset = [0, 0, 0],
  focusedNodePosition,
}) => {
  const nodePositionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const node of nodes) {
      map.set(node.id, node.position);
    }
    return map;
  }, [nodes]);

  return (
    <>
      {/* Lighting Hierarchy */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
      <pointLight position={[0, 0, 0]} intensity={2.0} color="#fbbf24" distance={100} />
      <pointLight position={[-30, -20, -30]} intensity={0.8} color="#38bdf8" />

      {/* Deep Space Background Stars */}
      <Stars radius={150} depth={60} count={5000} factor={5} saturation={0} fade speed={1.5} />

      {/* Render Celestial Nodes */}
      {nodes.map((node) => {
        const isSelected = selectedNodeIds ? selectedNodeIds.has(node.id) : selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isTraceHighlighted = traceNodeIds ? traceNodeIds.has(node.id) : false;

        return (
          <CelestialNodeMesh
            key={node.id}
            node={node}
            isSelected={isSelected}
            isHovered={isHovered}
            isTraceHighlighted={isTraceHighlighted}
            onSelect={onSelectNode}
            onHover={onHoverNode}
            onContextMenu={onContextMenu}
          />
        );
      })}

      {/* Render Dependency Connections */}
      {edges.map((edge) => {
        const start = nodePositionMap.get(edge.source);
        const end = nodePositionMap.get(edge.target);
        if (!start || !end) return null;

        const isHighlighted =
          selectedNodeId === edge.source ||
          selectedNodeId === edge.target ||
          hoveredNodeId === edge.source ||
          hoveredNodeId === edge.target;

        const isTraceHighlighted = highlightedEdgeIds ? highlightedEdgeIds.has(edge.id) : false;

        return (
          <EdgeLine
            key={edge.id}
            start={start}
            end={end}
            strength={edge.strength}
            isHighlighted={isHighlighted}
            isTraceHighlighted={isTraceHighlighted}
          />
        );
      })}

      {/* Dynamic Camera Controller or Default Orbit Controls */}
      {targetPose && cameraMode ? (
        <CameraController
          mode={cameraMode}
          targetPose={targetPose}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
          autoRotate={autoRotate}
          shakeOffset={shakeOffset}
          focusedNodePosition={focusedNodePosition}
        />
      ) : (
        <OrbitControls makeDefault enableDamping />
      )}
    </>
  );
};

