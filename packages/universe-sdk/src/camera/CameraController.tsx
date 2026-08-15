import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPose, CameraMode, CameraEngineConfig } from './CameraEngineTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OrbitControlsImpl = any;

interface CameraControllerProps {
  mode: CameraMode;
  targetPose: CameraPose;
  isTransitioning: boolean;
  onTransitionComplete?: () => void;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  shakeOffset?: [number, number, number];
  config?: Partial<CameraEngineConfig>;
  focusedNodePosition?: [number, number, number] | null;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  mode,
  targetPose,
  isTransitioning,
  onTransitionComplete,
  autoRotate = false,
  autoRotateSpeed = 0.15,
  shakeOffset = [0, 0, 0],
  focusedNodePosition,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  const targetPosVec = useRef<THREE.Vector3>(new THREE.Vector3(...targetPose.position));
  const targetLookVec = useRef<THREE.Vector3>(new THREE.Vector3(...targetPose.target));

  // Sync internal vectors when targetPose changes
  useEffect(() => {
    targetPosVec.current.set(...targetPose.position);
    targetLookVec.current.set(...targetPose.target);
  }, [targetPose]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const lerpFactor = Math.min(delta * 4.5, 0.1);

    // 1. Smooth Camera Fly-To & Lerp to Target Pose
    if (isTransitioning) {
      camera.position.lerp(targetPosVec.current, lerpFactor);
      controls.target.lerp(targetLookVec.current, lerpFactor);

      const posDistSq = camera.position.distanceToSquared(targetPosVec.current);
      const targetDistSq = controls.target.distanceToSquared(targetLookVec.current);

      if (posDistSq < 0.05 && targetDistSq < 0.05) {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }
    }

    // 2. Lock onto focused node position if in ORBIT_TARGET mode
    if (mode === 'ORBIT_TARGET' && focusedNodePosition) {
      const nodePosVec = new THREE.Vector3(...focusedNodePosition);
      controls.target.lerp(nodePosVec, lerpFactor);
    }

    // 3. Cinematic Auto-Rotation Drift
    if (autoRotate || mode === 'CINEMATIC_AUTO_ROTATE') {
      const angle = delta * autoRotateSpeed * 0.5;
      const x = camera.position.x;
      const z = camera.position.z;
      camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
      camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
    }

    // 4. Apply procedural Micro Camera Shake
    if (shakeOffset[0] !== 0 || shakeOffset[1] !== 0 || shakeOffset[2] !== 0) {
      camera.position.x += shakeOffset[0];
      camera.position.y += shakeOffset[1];
      camera.position.z += shakeOffset[2];
    }

    // 5. Update OrbitControls configuration
    controls.minDistance = 2;
    controls.maxDistance = 300;
    controls.maxPolarAngle = mode === 'TOP_DOWN_MAP' ? Math.PI / 2.05 : Math.PI / 1.75;
    controls.enableRotate = mode !== 'TOP_DOWN_MAP';

    controls.update();
  });

  return <OrbitControls ref={controlsRef} makeDefault enableDamping />;
};
