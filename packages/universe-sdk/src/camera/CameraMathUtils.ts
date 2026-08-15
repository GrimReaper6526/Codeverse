import * as THREE from 'three';
import { CameraPose, NodeSpatialData } from './CameraEngineTypes';

export class CameraMathUtils {
  /**
   * Calculates the optimal camera pose (position & lookAt target) to focus on a celestial node.
   */
  static calculateNodeFocusPose(
    node: NodeSpatialData,
    currentCameraPos: [number, number, number],
    fov: number = 55,
    offsetMultiplier: number = 3.5,
  ): CameraPose {
    const target = new THREE.Vector3(...node.position);
    const cameraPos = new THREE.Vector3(...currentCameraPos);

    // Direction vector from target to camera (or default vector if camera is at target)
    const dir = new THREE.Vector3().subVectors(cameraPos, target);
    if (dir.lengthSq() < 0.0001) {
      dir.set(0.5, 0.5, 1);
    }
    dir.normalize();

    // Calculate distance based on node size and FOV
    const radFov = (fov * Math.PI) / 180;
    const fitDistance = (node.size * offsetMultiplier) / Math.tan(radFov / 2);
    const distance = Math.max(fitDistance, node.size * 3 + 2);

    const newPos = target.clone().add(dir.multiplyScalar(distance));

    return {
      position: [newPos.x, newPos.y, newPos.z],
      target: [target.x, target.y, target.z],
      fov,
    };
  }

  /**
   * Calculates center of mass and bounding sphere radius for a group of celestial nodes.
   */
  static calculateGalaxyBounds(nodes: NodeSpatialData[]): {
    center: [number, number, number];
    radius: number;
  } {
    if (!nodes || nodes.length === 0) {
      return { center: [0, 0, 0], radius: 20 };
    }

    const centerVec = new THREE.Vector3(0, 0, 0);
    nodes.forEach((n) => {
      centerVec.add(new THREE.Vector3(...n.position));
    });
    centerVec.divideScalar(nodes.length);

    let maxDistSq = 0;
    nodes.forEach((n) => {
      const pos = new THREE.Vector3(...n.position);
      const distSq = pos.distanceToSquared(centerVec);
      if (distSq > maxDistSq) {
        maxDistSq = distSq;
      }
    });

    const radius = Math.sqrt(maxDistSq);

    return {
      center: [centerVec.x, centerVec.y, centerVec.z],
      radius: Math.max(radius, 10),
    };
  }

  /**
   * Calculates overview camera pose to view the entire software galaxy.
   */
  static calculateOverviewPose(nodes: NodeSpatialData[], fov: number = 55): CameraPose {
    const { center, radius } = this.calculateGalaxyBounds(nodes);
    const radFov = (fov * Math.PI) / 180;
    const distance = (radius * 2.2) / Math.tan(radFov / 2);

    const overviewPos: [number, number, number] = [
      center[0],
      center[1] + distance * 0.4,
      center[2] + distance * 0.9,
    ];

    return {
      position: overviewPos,
      target: center,
      fov,
    };
  }

  /**
   * Calculates top-down map camera pose.
   */
  static calculateTopDownPose(nodes: NodeSpatialData[]): CameraPose {
    const { center, radius } = this.calculateGalaxyBounds(nodes);
    const height = Math.max(radius * 2.5, 40);

    return {
      position: [center[0], center[1] + height, center[2] + 0.001],
      target: center,
    };
  }

  /**
   * Generates camera shake noise vector for micro-impact effects.
   */
  static generateCameraShake(intensity: number): [number, number, number] {
    return [
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity,
      (Math.random() - 0.5) * intensity,
    ];
  }
}
