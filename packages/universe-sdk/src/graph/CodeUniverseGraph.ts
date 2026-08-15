import { SoftwareGraphNode, SoftwareGraphEdge, UniverseGraph } from '@codeverse/types';

export interface GraphFilterOptions {
  types?: Array<'galaxy' | 'star' | 'planet' | 'moon' | 'satellite' | 'service'>;
  minSymbolCount?: number;
  searchQuery?: string;
  pathPrefix?: string;
}

export interface NodeCluster {
  clusterId: string;
  clusterName: string;
  color: string;
  nodes: SoftwareGraphNode[];
}

export class CodeUniverseGraph {
  private readonly nodesMap = new Map<string, SoftwareGraphNode>();
  private readonly edgesMap = new Map<string, SoftwareGraphEdge>();
  private readonly adjacency = new Map<string, Set<string>>();
  private readonly inEdges = new Map<string, Set<string>>();

  constructor(graph?: UniverseGraph) {
    if (graph) {
      this.loadFromJSON(graph);
    }
  }

  addNode(node: SoftwareGraphNode): this {
    this.nodesMap.set(node.id, { ...node });
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, new Set());
    }
    if (!this.inEdges.has(node.id)) {
      this.inEdges.set(node.id, new Set());
    }
    return this;
  }

  addEdge(edge: SoftwareGraphEdge): this {
    this.edgesMap.set(edge.id, { ...edge });

    if (!this.nodesMap.has(edge.source) || !this.nodesMap.has(edge.target)) {
      return this;
    }

    if (!this.adjacency.has(edge.source)) {
      this.adjacency.set(edge.source, new Set());
    }
    this.adjacency.get(edge.source)!.add(edge.target);

    if (!this.inEdges.has(edge.target)) {
      this.inEdges.set(edge.target, new Set());
    }
    this.inEdges.get(edge.target)!.add(edge.source);

    return this;
  }

  getNode(id: string): SoftwareGraphNode | undefined {
    return this.nodesMap.get(id);
  }

  getAllNodes(): SoftwareGraphNode[] {
    return Array.from(this.nodesMap.values());
  }

  getAllEdges(): SoftwareGraphEdge[] {
    return Array.from(this.edgesMap.values());
  }

  getNeighbors(id: string): SoftwareGraphNode[] {
    const targets = this.adjacency.get(id);
    if (!targets) return [];
    return Array.from(targets)
      .map((targetId) => this.nodesMap.get(targetId))
      .filter((n): n is SoftwareGraphNode => Boolean(n));
  }

  getDegreeCentrality(id: string): number {
    const outDeg = this.adjacency.get(id)?.size || 0;
    const inDeg = this.inEdges.get(id)?.size || 0;
    return outDeg + inDeg;
  }

  filterGraph(options: GraphFilterOptions): UniverseGraph {
    const filteredNodes: SoftwareGraphNode[] = [];
    const validNodeIds = new Set<string>();

    for (const node of this.nodesMap.values()) {
      if (options.types && options.types.length > 0 && !options.types.includes(node.type as any)) {
        continue;
      }
      if (options.minSymbolCount && node.symbolCount < options.minSymbolCount) {
        continue;
      }
      if (options.pathPrefix && !node.path.startsWith(options.pathPrefix)) {
        continue;
      }
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        const match =
          node.name.toLowerCase().includes(query) || node.path.toLowerCase().includes(query);
        if (!match) continue;
      }

      filteredNodes.push({ ...node });
      validNodeIds.add(node.id);
    }

    const filteredEdges = Array.from(this.edgesMap.values()).filter(
      (edge) => validNodeIds.has(edge.source) && validNodeIds.has(edge.target),
    );

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }

  findShortestPath(sourceId: string, targetId: string): string[] {
    if (!this.nodesMap.has(sourceId) || !this.nodesMap.has(targetId)) {
      return [];
    }

    const queue: string[] = [sourceId];
    const visited = new Set<string>([sourceId]);
    const parentMap = new Map<string, string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === targetId) {
        const path: string[] = [];
        let curr: string | undefined = targetId;
        while (curr) {
          path.unshift(curr);
          curr = parentMap.get(curr);
        }
        return path;
      }

      const neighbors = this.adjacency.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    return [];
  }

  clusterNodes(): NodeCluster[] {
    const clustersMap = new Map<string, SoftwareGraphNode[]>();
    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];

    let colorIdx = 0;
    for (const node of this.nodesMap.values()) {
      const clusterKey = node.path.split('/')[1] || 'root';
      if (!clustersMap.has(clusterKey)) {
        clustersMap.set(clusterKey, []);
      }
      clustersMap.get(clusterKey)!.push(node);
    }

    return Array.from(clustersMap.entries()).map(([clusterId, nodes]) => ({
      clusterId,
      clusterName: clusterId.toUpperCase(),
      color: colors[colorIdx++ % colors.length],
      nodes,
    }));
  }

  toUniverseGraph(): UniverseGraph {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
    };
  }

  private loadFromJSON(graph: UniverseGraph) {
    this.nodesMap.clear();
    this.edgesMap.clear();
    this.adjacency.clear();
    this.inEdges.clear();

    for (const node of graph.nodes) {
      this.addNode(node);
    }

    for (const edge of graph.edges) {
      this.addEdge(edge);
    }
  }
}
