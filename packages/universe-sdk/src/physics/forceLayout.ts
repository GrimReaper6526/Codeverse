import { SoftwareGraphNode } from '@codeverse/types';

export interface Node3DPosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

export function compute3DForceLayout(nodes: SoftwareGraphNode[]): Map<string, Node3DPosition> {
  const positions = new Map<string, Node3DPosition>();
  const count = nodes.length;

  nodes.forEach((node, index) => {
    if (node.type === 'galaxy') {
      positions.set(node.id, { id: node.id, x: 0, y: 0, z: 0 });
      return;
    }

    // Calculate spherical distribution around the center galaxy node
    const phi = Math.acos(-1 + (2 * index) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const radius = node.type === 'planet' ? 6 : node.type === 'service' ? 9 : 12;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    positions.set(node.id, { id: node.id, x, y, z });
  });

  return positions;
}
