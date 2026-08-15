import { SoftwareGraphEdge } from '@codeverse/types';
import { DependencyTrace } from './InteractionTypes';

export class InteractionTraceUtils {
  /**
   * Computes upstream (callers/importers) and downstream (callees/dependencies) node IDs
   * and all connecting edge IDs for a focused node.
   */
  public static computeDependencyTrace(
    nodeId: string | null,
    edges: SoftwareGraphEdge[],
  ): DependencyTrace {
    const upstreamNodeIds = new Set<string>();
    const downstreamNodeIds = new Set<string>();
    const highlightedEdgeIds = new Set<string>();

    if (!nodeId) {
      return { upstreamNodeIds, downstreamNodeIds, highlightedEdgeIds };
    }

    for (const edge of edges) {
      if (edge.target === nodeId) {
        upstreamNodeIds.add(edge.source);
        highlightedEdgeIds.add(edge.id);
      } else if (edge.source === nodeId) {
        downstreamNodeIds.add(edge.target);
        highlightedEdgeIds.add(edge.id);
      }
    }

    return {
      upstreamNodeIds,
      downstreamNodeIds,
      highlightedEdgeIds,
    };
  }

  /**
   * Projects a 3D world position to 2D screen pixels.
   */
  public static projectWorldToScreen(
    worldPosition: [number, number, number],
    camera: { project: (v: { x: number; y: number; z: number }) => void },
    screenSize: { width: number; height: number },
  ): { x: number; y: number } {
    const vec = { x: worldPosition[0], y: worldPosition[1], z: worldPosition[2] };
    camera.project(vec);

    const x = Math.round(((vec.x + 1) * screenSize.width) / 2);
    const y = Math.round(((-vec.y + 1) * screenSize.height) / 2);

    return { x, y };
  }
}
