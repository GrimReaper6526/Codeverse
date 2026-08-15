import { Injectable, Logger } from '@nestjs/common';
import {
  createSampleUniverseGraph,
  CodeUniverseGraph,
} from '@codeverse/universe-sdk';

export type NodeType = 'galaxy' | 'star' | 'planet' | 'moon' | 'satellite' | 'service';

@Injectable()
export class UniverseService {
  private readonly logger = new Logger(UniverseService.name);

  async getUniverseGraph(repoId?: string) {
    this.logger.log(`Generating universe graph metrics for repo: ${repoId || 'default-universe'}`);
    const rawGraph = createSampleUniverseGraph();
    const graphEngine = new CodeUniverseGraph(rawGraph);

    const clusters = graphEngine.clusterNodes();

    return {
      universeId: repoId || 'universe-main',
      nodesCount: rawGraph.nodes.length,
      edgesCount: rawGraph.edges.length,
      clustersCount: clusters.length,
      graph: rawGraph,
      clusters,
    };
  }

  async filterUniverseGraph(query: { type?: string; searchQuery?: string; minSymbols?: number }) {
    const rawGraph = createSampleUniverseGraph();
    const graphEngine = new CodeUniverseGraph(rawGraph);

    const filtered = graphEngine.filterGraph({
      types: query.type ? [query.type as NodeType] : undefined,
      searchQuery: query.searchQuery,
      minSymbolCount: query.minSymbols,
    });

    return {
      filteredNodesCount: filtered.nodes.length,
      filteredEdgesCount: filtered.edges.length,
      graph: filtered,
    };
  }

  async getShortestPath(sourceId: string, targetId: string) {
    const rawGraph = createSampleUniverseGraph();
    const graphEngine = new CodeUniverseGraph(rawGraph);

    const path = graphEngine.findShortestPath(sourceId, targetId);

    return {
      sourceId,
      targetId,
      pathLength: path.length > 0 ? path.length - 1 : 0,
      path,
    };
  }
}
