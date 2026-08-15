import { Injectable, Logger } from '@nestjs/common';
import { DependencyAnalyzer } from '@codeverse/universe-sdk';

@Injectable()
export class DependencyAnalyzerService {
  private readonly logger = new Logger(DependencyAnalyzerService.name);

  async analyzeRepositoryDependencies(files: Array<{ path: string; content?: string }>) {
    this.logger.log(`Analyzing repository dependencies across ${files.length} files`);
    const analyzer = new DependencyAnalyzer();

    for (const file of files) {
      if (!file.content) continue;

      // Regular expressions to extract ES6 import statements and require statements
      const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;

      let match: RegExpExecArray | null;

      while ((match = importRegex.exec(file.content)) !== null) {
        const importPath = match[1];
        analyzer.addFileImport(file.path, importPath, []);
      }

      while ((match = requireRegex.exec(file.content)) !== null) {
        const requirePath = match[1];
        analyzer.addFileImport(file.path, requirePath, []);
      }
    }

    const result = analyzer.analyzeDependencies();

    return {
      totalFiles: files.length,
      totalDependencies: result.edges.length,
      circularDependenciesCount: result.circularDependencies.length,
      circularDependencies: result.circularDependencies,
      nodes: result.nodes,
      edges: result.edges,
    };
  }
}
