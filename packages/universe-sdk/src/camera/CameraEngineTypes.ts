export type CameraMode = 
  | 'OVERVIEW'
  | 'FOCUS_NODE'
  | 'ORBIT_TARGET'
  | 'CINEMATIC_AUTO_ROTATE'
  | 'TOP_DOWN_MAP';

export interface Vector3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export interface CameraEngineConfig {
  defaultPosition: [number, number, number];
  defaultTarget: [number, number, number];
  defaultFov: number;
  flyToDuration: number; // in seconds
  dampingFactor: number;
  autoRotateSpeed: number; // radians per sec
  minDistance: number;
  maxDistance: number;
}

export interface CameraTransitionState {
  isTransitioning: boolean;
  mode: CameraMode;
  focusedNodeId: string | null;
  progress: number;
}

export interface NodeSpatialData {
  id: string;
  position: [number, number, number];
  size: number;
  name: string;
}

export const DEFAULT_CAMERA_CONFIG: CameraEngineConfig = {
  defaultPosition: [0, 25, 55],
  defaultTarget: [0, 0, 0],
  defaultFov: 55,
  flyToDuration: 1.2,
  dampingFactor: 0.08,
  autoRotateSpeed: 0.15,
  minDistance: 3,
  maxDistance: 250,
};
