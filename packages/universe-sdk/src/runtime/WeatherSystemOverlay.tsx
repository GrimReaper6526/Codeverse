import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WeatherType } from './RuntimeTypes';

interface WeatherSystemOverlayProps {
  weather: WeatherType;
}

export const WeatherSystemOverlay: React.FC<WeatherSystemOverlayProps> = ({ weather }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle cloud positions and speeds
  const count = 600;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      col[i * 3] = 0.2;
      col[i * 3 + 1] = 0.5;
      col[i * 3 + 2] = 1.0;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || weather === 'clear_sky') return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      if (weather === 'solar_wind') {
        x += delta * 15.0; // Drifting golden particle wind
        if (x > 60) x = -60;
        colAttr.setXYZ(i, 0.98, 0.75, 0.2); // Amber gold
      } else if (weather === 'electrical_storm') {
        x += (Math.random() - 0.5) * 2.0; // Violent jitter
        y += (Math.random() - 0.5) * 2.0;
        colAttr.setXYZ(i, 0.0, 0.9, 1.0); // Cyan electric
      } else if (weather === 'nebula_fog') {
        y += Math.sin(Date.now() * 0.001 + i) * 0.05;
        colAttr.setXYZ(i, 0.6, 0.2, 0.9); // Deep magenta nebula
      } else if (weather === 'aurora') {
        z += Math.cos(Date.now() * 0.001 + i) * 0.08;
        colAttr.setXYZ(i, 0.1, 0.95, 0.5); // Emerald aurora
      }

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (weather === 'clear_sky') return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        vertexColors
        transparent
        opacity={weather === 'nebula_fog' ? 0.6 : 0.4}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
};
