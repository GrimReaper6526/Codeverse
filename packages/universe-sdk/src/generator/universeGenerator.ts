import { SoftwareGraphNode, SoftwareGraphEdge, UniverseGraph } from '@codeverse/types';

export interface CelestialNode extends SoftwareGraphNode {
  color: string;
  size: number;
  mass: number;
  orbitalRadius: number;
  rotationSpeed: number;
  orbitSpeed: number;
  position: [number, number, number];
  parentEntityId?: string;
  language?: string;
}

export interface CelestialUniverse {
  galaxyName: string;
  nodes: CelestialNode[];
  edges: SoftwareGraphEdge[];
  stats: {
    totalGalaxies: number;
    totalStars: number;
    totalPlanets: number;
    totalMoons: number;
    totalSatellites: number;
  };
}

export class UniverseGenerator {
  private static readonly LANGUAGE_COLORS: Record<string, string> = {
    typescript: '#3178c6',
    javascript: '#f7df1e',
    python: '#3572A5',
    css: '#563d7c',
    html: '#e34c26',
    go: '#00ADD8',
    rust: '#dea584',
    sql: '#e38c00',
    markdown: '#083fa1',
    json: '#292929',
    default: '#38bdf8',
  };

  static generateCelestialUniverse(
    graph: UniverseGraph,
    galaxyName = 'CodeVerse Primary Galaxy',
  ): CelestialUniverse {
    const celestialNodes: CelestialNode[] = [];
    const stats = {
      totalGalaxies: 0,
      totalStars: 0,
      totalPlanets: 0,
      totalMoons: 0,
      totalSatellites: 0,
    };

    for (let i = 0; i < graph.nodes.length; i++) {
      const node = graph.nodes[i];
      const ext = node.path.split('.').pop()?.toLowerCase() || '';
      const language = ext in this.LANGUAGE_COLORS ? ext : 'default';

      let size = 1.0;
      let mass = 1.0;
      let orbitalRadius = 10 + i * 5;
      let rotationSpeed = 0.01;
      let orbitSpeed = 0.005;
      let color = this.LANGUAGE_COLORS[language] || this.LANGUAGE_COLORS.default;

      switch (node.type) {
        case 'galaxy':
          size = 6.0;
          mass = 50.0;
          color = '#818cf8';
          stats.totalGalaxies++;
          break;
        case 'star':
        case 'service':
          size = 4.0;
          mass = 20.0;
          color = '#fbbf24';
          stats.totalStars++;
          break;
        case 'planet':
          size = 2.5;
          mass = 8.0;
          stats.totalPlanets++;
          break;
        case 'moon':
          size = 1.2;
          mass = 3.0;
          color = '#c084fc';
          stats.totalMoons++;
          break;
        case 'satellite':
          size = 0.8;
          mass = 1.0;
          color = '#f472b6';
          stats.totalSatellites++;
          break;
      }

      // Compute initial 3D spiral galaxy position
      const angle = i * 0.5;
      const radius = 15 + i * 8;
      const posX = radius * Math.cos(angle);
      const posY = (Math.random() - 0.5) * 10;
      const posZ = radius * Math.sin(angle);

      celestialNodes.push({
        ...node,
        color,
        size,
        mass,
        orbitalRadius,
        rotationSpeed: rotationSpeed * (Math.random() > 0.5 ? 1 : -1),
        orbitSpeed,
        position: [posX, posY, posZ],
        language,
      });
    }

    return {
      galaxyName,
      nodes: celestialNodes,
      edges: graph.edges,
      stats,
    };
  }
}
