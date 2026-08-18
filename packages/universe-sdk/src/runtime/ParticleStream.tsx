import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ActiveParticle } from './RuntimeTypes';

interface ParticleStreamProps {
  particles: ActiveParticle[];
}

export const ParticleStream: React.FC<ParticleStreamProps> = ({ particles }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  useFrame(() => {
    if (!meshRef.current) return;

    particles.forEach((p, idx) => {
      if (idx >= 500) return; // Cap max instanced particles for performance

      const x = THREE.MathUtils.lerp(p.sourcePos[0], p.targetPos[0], p.progress);
      const y = THREE.MathUtils.lerp(p.sourcePos[1], p.targetPos[1], p.progress);
      const z = THREE.MathUtils.lerp(p.sourcePos[2], p.targetPos[2], p.progress);

      // Arc lift effect in center of trajectory
      const arc = Math.sin(p.progress * Math.PI) * 2.0;

      tempObject.position.set(x, y + arc, z);
      tempObject.scale.setScalar(p.size * (1 + Math.sin(p.progress * Math.PI * 2) * 0.2));
      tempObject.updateMatrix();

      meshRef.current?.setMatrixAt(idx, tempObject.matrix);
      tempColor.set(p.color);
      meshRef.current?.setColorAt(idx, tempColor);
    });

    meshRef.current.count = Math.min(particles.length, 500);
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 500]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};
