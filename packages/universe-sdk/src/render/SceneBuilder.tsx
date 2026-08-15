'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CelestialNode } from '../generator/universeGenerator';
import { SoftwareGraphEdge } from '@codeverse/types';

interface CelestialNodeMeshProps {
  node: CelestialNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

export const CelestialNodeMesh: React.FC<CelestialNodeMeshProps> = ({
  node,
  isSelected,
  isHovered,
  onSelect,
  onHover,
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

  const activeColor = isSelected ? '#38bdf8' : isHovered ? '#ffffff' : node.color;
  const emissiveIntensity = isSelected ? 1.0 : isHovered ? 0.8 : node.emissiveIntensity;

  return (
    <group position={node.position}>
      {/* Atmosphere Glow Aura */}
      {node.atmosphereGlow && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[node.size * 1.25, 32, 32]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={isSelected ? 0.4 : isHovered ? 0.3 : 0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Main Celestial Body */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
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
        color={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#cbd5e1'}
        anchorX="center"
        anchorY="bottom"
      >
        {node.name}
      </Text>

      {/* HTML Tooltip on Hover */}
      {isHovered && (
        <Html distanceFactor={20}>
          <div className="glass-panel px-3 py-2 rounded-xl text-xs text-slate-100 shadow-glow-cyan pointer-events-none whitespace-nowrap bg-slate-900/90 backdrop-blur-md border border-slate-700">
            <div className="font-bold text-cyan-400 text-sm flex items-center space-x-1">
              <span>{node.name}</span>
              {node.language && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  .{node.language}
                </span>
              )}
            </div>
            <div className="text-slate-300 text-[11px] mt-1 space-y-0.5 font-mono">
              <div>Type: {node.type.toUpperCase()}</div>
              <div>Symbols: {node.symbolCount}</div>
              <div>Path: {node.path}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Dependency Edge Line Component
interface EdgeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
  isHighlighted: boolean;
}

export const EdgeLine: React.FC<EdgeLineProps> = ({ start, end, strength, isHighlighted }) => {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end],
  );
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineColor = isHighlighted ? '#38bdf8' : '#475569';
  const lineOpacity = isHighlighted ? 0.9 : Math.min(0.5, Math.max(0.15, strength));

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
  hoveredNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onHoverNode: (nodeId: string | null) => void;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  nodes,
  edges,
  selectedNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
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
      {nodes.map((node) => (
        <CelestialNodeMesh
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          isHovered={hoveredNodeId === node.id}
          onSelect={onSelectNode}
          onHover={onHoverNode}
        />
      ))}

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

        return (
          <EdgeLine
            key={edge.id}
            start={start}
            end={end}
            strength={edge.strength}
            isHighlighted={isHighlighted}
          />
        );
      })}

      {/* Smooth Interactive Orbit Controls */}
      <OrbitControls makeDefault enableDamping />
    </>
  );
};
