import { NodeAnimationState } from './AnimationTypes';

export class AnimationController {
  private states: Map<string, NodeAnimationState> = new Map();

  public registerNode(id: string, initialPosition: [number, number, number], initialScale: number = 1.0): void {
    if (!this.states.has(id)) {
      this.states.set(id, {
        targetPosition: [...initialPosition],
        currentPosition: [...initialPosition],
        targetScale: initialScale,
        currentScale: initialScale,
        targetRotation: [0, 0, 0],
        currentRotation: [0, 0, 0],
        pulseIntensity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  public setTargetPosition(id: string, position: [number, number, number]): void {
    const state = this.states.get(id);
    if (state) {
      state.targetPosition = [...position];
    }
  }

  public setTargetScale(id: string, scale: number): void {
    const state = this.states.get(id);
    if (state) {
      state.targetScale = scale;
    }
  }

  public triggerPulse(id: string, intensity: number = 1.0): void {
    const state = this.states.get(id);
    if (state) {
      state.pulseIntensity = Math.max(state.pulseIntensity, intensity);
    }
  }

  public getNodeState(id: string): NodeAnimationState | undefined {
    return this.states.get(id);
  }

  public update(delta: number): void {
    const lerpFactor = Math.min(1.0, delta * 8.0); // smooth spring-like lerp

    this.states.forEach((state) => {
      // Lerp position
      state.currentPosition[0] += (state.targetPosition[0] - state.currentPosition[0]) * lerpFactor;
      state.currentPosition[1] += (state.targetPosition[1] - state.currentPosition[1]) * lerpFactor;
      state.currentPosition[2] += (state.targetPosition[2] - state.currentPosition[2]) * lerpFactor;

      // Lerp scale
      state.currentScale += (state.targetScale - state.currentScale) * lerpFactor;

      // Pulse decay & phase motion
      state.pulsePhase += delta * 4.0;
      if (state.pulseIntensity > 0.001) {
        state.pulseIntensity *= Math.exp(-delta * 3.0);
      } else {
        state.pulseIntensity = 0;
      }
    });
  }
}

export const globalAnimationController = new AnimationController();
