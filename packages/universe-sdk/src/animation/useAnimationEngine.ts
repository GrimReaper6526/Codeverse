import { useFrame } from '@react-three/fiber';
import { globalAnimationController } from './AnimationController';

export function useAnimationEngine() {
  useFrame((_, delta) => {
    // Clamp delta to prevent big jumps on frame drops
    const safeDelta = Math.min(delta, 0.1);
    globalAnimationController.update(safeDelta);
  });

  return globalAnimationController;
}
