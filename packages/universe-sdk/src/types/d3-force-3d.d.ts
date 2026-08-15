declare module 'd3-force-3d' {
  export interface SimulationNode3D {
    id: string;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
  }

  export interface SimulationLink3D<Node extends SimulationNode3D> {
    source: Node | string;
    target: Node | string;
    strength?: number;
  }

  export interface Force3D<Node extends SimulationNode3D> {
    (alpha?: number): void;
    initialize(nodes: Node[], random?: () => number): void;
    strength(strength: number | ((node: Node) => number)): this;
    distance(distance: number | ((link: SimulationLink3D<Node>) => number)): this;
    id(id: (node: Node) => string): this;
    radius(radius: number | ((node: Node) => number)): this;
  }

  export interface Simulation3D<Node extends SimulationNode3D> {
    nodes(): Node[];
    nodes(nodes: Node[]): this;
    force(name: string): Force3D<Node>;
    force(name: string, force: Force3D<Node> | null): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaDecay(): number;
    alphaDecay(decay: number): this;
    restart(): this;
    stop(): this;
    tick(iterations?: number): this;
  }

  export function forceSimulation<Node extends SimulationNode3D = SimulationNode3D>(
    nodes?: Node[],
    numDimensions?: number,
  ): Simulation3D<Node>;

  export function forceManyBody<Node extends SimulationNode3D = SimulationNode3D>(): Force3D<Node>;
  export function forceLink<Node extends SimulationNode3D = SimulationNode3D>(
    links?: SimulationLink3D<Node>[],
  ): Force3D<Node>;
  export function forceCenter<Node extends SimulationNode3D = SimulationNode3D>(
    x?: number,
    y?: number,
    z?: number,
  ): Force3D<Node>;
  export function forceCollide<Node extends SimulationNode3D = SimulationNode3D>(): Force3D<Node>;
}
