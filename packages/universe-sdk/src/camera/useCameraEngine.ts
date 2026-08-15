import { useState, useCallback, useRef } from 'react';
import {
  CameraMode,
  CameraPose,
  CameraEngineConfig,
  DEFAULT_CAMERA_CONFIG,
  NodeSpatialData,
} from './CameraEngineTypes';
import { CameraMathUtils } from './CameraMathUtils';

export interface UseCameraEngineOptions {
  config?: Partial<CameraEngineConfig>;
  nodes?: NodeSpatialData[];
  onModeChange?: (mode: CameraMode) => void;
}

export function useCameraEngine(options: UseCameraEngineOptions = {}) {
  const fullConfig: CameraEngineConfig = {
    ...DEFAULT_CAMERA_CONFIG,
    ...options.config,
  };

  const [mode, setModeState] = useState<CameraMode>('OVERVIEW');
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [targetPose, setTargetPose] = useState<CameraPose>({
    position: fullConfig.defaultPosition,
    target: fullConfig.defaultTarget,
    fov: fullConfig.defaultFov,
  });

  const shakeRef = useRef<[number, number, number]>([0, 0, 0]);
  const nodesRef = useRef<NodeSpatialData[]>(options.nodes || []);
  nodesRef.current = options.nodes || [];

  const setMode = useCallback(
    (newMode: CameraMode) => {
      setModeState(newMode);
      if (options.onModeChange) {
        options.onModeChange(newMode);
      }
    },
    [options],
  );

  /**
   * Smoothly animates camera to focus on a celestial body.
   */
  const flyToNode = useCallback(
    (node: NodeSpatialData, currentCameraPos: [number, number, number]) => {
      const pose = CameraMathUtils.calculateNodeFocusPose(
        node,
        currentCameraPos,
        fullConfig.defaultFov,
      );

      setFocusedNodeId(node.id);
      setTargetPose(pose);
      setMode('FOCUS_NODE');
      setIsTransitioning(true);
    },
    [fullConfig.defaultFov, setMode],
  );

  /**
   * Resets camera to galaxy overview perspective.
   */
  const resetOverview = useCallback(() => {
    const pose = CameraMathUtils.calculateOverviewPose(
      nodesRef.current,
      fullConfig.defaultFov,
    );

    setFocusedNodeId(null);
    setTargetPose(pose);
    setMode('OVERVIEW');
    setIsTransitioning(true);
  }, [fullConfig.defaultFov, setMode]);

  /**
   * Switches camera to top-down 2D/3D map mode.
   */
  const switchToTopDownMap = useCallback(() => {
    const pose = CameraMathUtils.calculateTopDownPose(nodesRef.current);
    setTargetPose(pose);
    setMode('TOP_DOWN_MAP');
    setIsTransitioning(true);
  }, [setMode]);

  /**
   * Switches camera to cinematic auto-rotate mode.
   */
  const toggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  /**
   * Triggers micro camera shake effect.
   */
  const triggerShake = useCallback((intensity: number = 0.5) => {
    shakeRef.current = CameraMathUtils.generateCameraShake(intensity);
    setTimeout(() => {
      shakeRef.current = [0, 0, 0];
    }, 200);
  }, []);

  return {
    mode,
    setMode,
    focusedNodeId,
    autoRotate,
    toggleAutoRotate,
    isTransitioning,
    setIsTransitioning,
    targetPose,
    setTargetPose,
    shakeOffset: shakeRef.current,
    flyToNode,
    resetOverview,
    switchToTopDownMap,
    triggerShake,
    config: fullConfig,
  };
}
