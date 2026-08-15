export type NodeType =
  | 'galaxy'
  | 'solar_system'
  | 'star'
  | 'planet'
  | 'moon'
  | 'satellite'
  | 'service'
  | 'node';

export interface SoftwareGraphNode {
  id: string;
  name: string;
  type: NodeType;
  path: string;
  symbolCount: number;
  connections: string[];
}

export interface SoftwareGraphEdge {
  id: string;
  source: string;
  target: string;
  strength: number;
}

export interface UniverseGraph {
  nodes: SoftwareGraphNode[];
  edges: SoftwareGraphEdge[];
}
