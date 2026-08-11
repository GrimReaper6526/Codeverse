'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { createSampleUniverseGraph } from '../graph/universeGraphBuilder';
import { compute3DForceLayout } from '../physics/forceLayout';

// Single 3D Sphere Node Component
const NodeMesh: React.FC<{
  id: string;
  name: string;
  type: string;
  symbolCount: number;
  position: [number, number, number];
  onSelect: (id: string) => void;
}> = ({ id, name, type, symbolCount, position, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Slow rotation animation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const nodeColor = useMemo(() => {
    switch (type) {
      case 'galaxy':
        return '#06b6d4'; // Cyan
      case 'planet':
        return '#6366f1'; // Indigo
      case 'service':
        return '#8b5cf6'; // Violet
      case 'moon':
        return '#f59e0b'; // Amber
      default:
        return '#10b981'; // Emerald
    }
  }, [type]);

  const size = type === 'galaxy' ? 1.4 : type === 'planet' ? 0.9 : 0.6;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => onSelect(id)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Label above node */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.35}
        color={hovered ? '#06b6d4' : '#cbd5e1'}
        anchorX="center"
        anchorY="bottom"
      >
        {name.split(' ')[0]}
      </Text>

      {/* Hover HTML Tooltip */}
      {hovered && (
        <Html distanceFactor={15}>
          <div className="glass-panel px-3 py-1.5 rounded-lg text-[11px] text-slate-100 shadow-glow-cyan pointer-events-none whitespace-nowrap">
            <div className="font-bold text-cyan-400">{name}</div>
            <div className="text-slate-400 font-mono text-[10px]">
              Type: {type.toUpperCase()} • Symbols: {symbolCount}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Energy Link Lines between connected nodes
const EnergyLink: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
}> = ({ start, end }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#38bdf8" opacity={0.3} transparent linewidth={1} />
    </line>
  );
};

export const UniverseCanvas: React.FC = () => {
  const graph = useMemo(() => createSampleUniverseGraph(), []);
  const positions = useMemo(() => compute3DForceLayout(graph.nodes), [graph.nodes]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas camera={{ position: [0, 8, 18], fov: 60 }}>
        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />

        {/* Outer Deep Space Stars */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        {/* 3D Nodes */}
        {graph.nodes.map((node) => {
          const pos = positions.get(node.id) || { x: 0, y: 0, z: 0 };
          return (
            <NodeMesh
              key={node.id}
              id={node.id}
              name={node.name}
              type={node.type}
              symbolCount={node.symbolCount}
              position={[pos.x, pos.y, pos.z]}
              onSelect={setSelectedNode}
            />
          );
        })}

        {/* 3D Energy Edges */}
        {graph.edges.map((edge) => {
          const startPos = positions.get(edge.source);
          const endPos = positions.get(edge.target);
          if (!startPos || !endPos) return null;
          return (
            <EnergyLink
              key={edge.id}
              start={[startPos.x, startPos.y, startPos.z]}
              end={[endPos.x, endPos.y, endPos.z]}
            />
          );
        })}

        {/* Interactive Orbit Controls */}
        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={40} minDistance={4} />
      </Canvas>

      {/* Selected Node Status Bar */}
      {selectedNode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-xs text-slate-200 border border-slate-700 flex items-center space-x-2 z-20 shadow-glow-cyan">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Active Focus Node:</span>
          <span className="font-bold text-cyan-300 font-mono">{selectedNode}</span>
        </div>
      )}
    </div>
  );
};
