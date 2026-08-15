import { SoftwareGraphNode, SoftwareGraphEdge } from '@codeverse/types';

export interface ImportReference {
  sourceFile: string;
  targetImport: string;
  specifiers: string[];
  isRelative: boolean;
}

export interface DependencyAnalysisResult {
  nodes: SoftwareGraphNode[];
  edges: SoftwareGraphEdge[];
  importMap: Record<string, string[]>;
  circularDependencies: Array<[string, string]>;
}

export class DependencyAnalyzer {
  private readonly imports: ImportReference[] = [];
  private readonly filePaths = new Set<string>();

  addFileImport(sourceFile: string, targetImport: string, specifiers: string[] = []): void {
    const isRelative = targetImport.startsWith('.') || targetImport.startsWith('/');
    this.imports.push({ sourceFile, targetImport, specifiers, isRelative });
    this.filePaths.add(sourceFile);
  }

  analyzeDependencies(): DependencyAnalysisResult {
    const nodesMap = new Map<string, SoftwareGraphNode>();
    const edgesMap = new Map<string, SoftwareGraphEdge>();
    const importMap: Record<string, string[]> = {};
    const circularDependencies: Array<[string, string]> = [];

    // Create file nodes
    for (const filePath of this.filePaths) {
      const fileName = filePath.split('/').pop() || filePath;
      const fileExt = fileName.split('.').pop() || '';
      
      let nodeType: 'planet' | 'service' | 'moon' | 'satellite' = 'planet';
      if (filePath.includes('service') || filePath.includes('api')) {
        nodeType = 'service';
      } else if (fileExt === 'json' || fileExt === 'md') {
        nodeType = 'moon';
      } else if (filePath.includes('types') || filePath.includes('utils')) {
        nodeType = 'satellite';
      }

      nodesMap.set(filePath, {
        id: filePath,
        name: fileName,
        type: nodeType,
        path: filePath,
        symbolCount: 10,
        connections: [],
      });

      importMap[filePath] = [];
    }

    let edgeCounter = 1;
    for (const imp of this.imports) {
      const sourceNode = nodesMap.get(imp.sourceFile);
      if (!sourceNode) continue;

      // Find matching target node ID
      let targetNodeId: string | undefined;
      for (const candidateId of nodesMap.keys()) {
        if (candidateId.endsWith(imp.targetImport) || candidateId.includes(imp.targetImport)) {
          targetNodeId = candidateId;
          break;
        }
      }

      if (targetNodeId && targetNodeId !== imp.sourceFile) {
        if (!importMap[imp.sourceFile].includes(targetNodeId)) {
          importMap[imp.sourceFile].push(targetNodeId);
        }

        const edgeId = `dep-${imp.sourceFile}-${targetNodeId}`;
        if (edgesMap.has(edgeId)) {
          const existingEdge = edgesMap.get(edgeId)!;
          existingEdge.strength = Math.min(1.0, existingEdge.strength + 0.1);
        } else {
          edgesMap.set(edgeId, {
            id: `edge-${edgeCounter++}`,
            source: imp.sourceFile,
            target: targetNodeId,
            strength: 0.5 + imp.specifiers.length * 0.1,
          });
        }

        // Detect direct circular imports
        if (importMap[targetNodeId]?.includes(imp.sourceFile)) {
          circularDependencies.push([imp.sourceFile, targetNodeId]);
        }

        if (!sourceNode.connections.includes(targetNodeId)) {
          sourceNode.connections.push(targetNodeId);
        }
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      edges: Array.from(edgesMap.values()),
      importMap,
      circularDependencies,
    };
  }
}
