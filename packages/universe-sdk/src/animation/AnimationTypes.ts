export interface TweenConfig {
  duration: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

export interface NodeAnimationState {
  targetPosition: [number, number, number];
  currentPosition: [number, number, number];
  targetScale: number;
  currentScale: number;
  targetRotation: [number, number, number];
  currentRotation: [number, number, number];
  pulseIntensity: number;
  pulsePhase: number;
}

export interface PulseWaveformConfig {
  frequency: number;
  amplitude: number;
  decay?: number;
}
