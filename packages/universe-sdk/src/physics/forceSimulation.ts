/// <reference path="../types/d3-force-3d.d.ts" />
import { SoftwareGraphNode, SoftwareGraphEdge } from '@codeverse/types';
import * as d3ForceModule from 'd3-force-3d';

const d3Force: typeof d3ForceModule = (d3ForceModule as any).default || d3ForceModule;

export interface PhysicsNode extends SoftwareGraphNode {
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  radius?: number;
}

export interface PhysicsLink {
  source: PhysicsNode | string;
  target: PhysicsNode | string;
  strength?: number;
}

export class ForceSimulation3D {
  private simulation: d3ForceModule.Simulation3D<PhysicsNode>;
  private nodesMap = new Map<string, PhysicsNode>();

  constructor(nodes: SoftwareGraphNode[], edges: SoftwareGraphEdge[]) {
    const physicsNodes: PhysicsNode[] = nodes.map((node) => {
      const radius = node.type === 'galaxy' ? 8 : node.type === 'star' ? 5 : node.type === 'planet' ? 3 : 1.5;
      return {
        ...node,
        radius,
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
      };
    });

    const physicsLinks: PhysicsLink[] = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      strength: edge.strength || 0.5,
    }));

    physicsNodes.forEach((n) => this.nodesMap.set(n.id, n));

    const chargeForce = d3Force.forceManyBody<PhysicsNode>().strength((d: PhysicsNode) => (d.type === 'galaxy' ? -300 : -80));
    const linkForce = d3Force
      .forceLink<PhysicsNode>(physicsLinks)
      .id((d: PhysicsNode) => String(d.id))
      .distance(30);
    const centerForce = d3Force.forceCenter<PhysicsNode>(0, 0, 0);
    const collideForce = d3Force.forceCollide<PhysicsNode>().radius((d: PhysicsNode) => (d.radius || 2) * 1.5);

    this.simulation = d3Force
      .forceSimulation<PhysicsNode>(physicsNodes, 3)
      .force('charge', chargeForce)
      .force('link', linkForce)
      .force('center', centerForce)
      .force('collide', collideForce);

    this.simulation.alphaDecay(0.02);
  }

  tick(): void {
    if (this.simulation) {
      this.simulation.tick();
    }
  }

  getPositions(): Map<string, [number, number, number]> {
    const map = new Map<string, [number, number, number]>();
    const nodes = this.simulation.nodes() as PhysicsNode[];
    for (const node of nodes) {
      map.set(node.id, [node.x ?? 0, node.y ?? 0, node.z ?? 0]);
    }
    return map;
  }

  setNodePin(id: string, position: [number, number, number] | null): void {
    const node = this.nodesMap.get(id);
    if (node) {
      if (position) {
        node.fx = position[0];
        node.fy = position[1];
        node.fz = position[2];
      } else {
        node.fx = null;
        node.fy = null;
        node.fz = null;
      }
      this.reheat();
    }
  }

  stop(): void {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  reheat(): void {
    if (this.simulation) {
      this.simulation.alpha(0.3);
      this.simulation.restart();
    }
  }
}
