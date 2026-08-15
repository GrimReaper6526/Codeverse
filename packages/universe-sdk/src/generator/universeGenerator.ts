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
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  atmosphereGlow: boolean;
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
    ts: '#3178c6',
    tsx: '#3178c6',
    typescript: '#3178c6',
    js: '#f7df1e',
    jsx: '#f7df1e',
    javascript: '#f7df1e',
    py: '#3572A5',
    python: '#3572A5',
    css: '#563d7c',
    scss: '#c6538c',
    html: '#e34c26',
    go: '#00ADD8',
    rs: '#dea584',
    rust: '#dea584',
    sql: '#e38c00',
    md: '#083fa1',
    markdown: '#083fa1',
    json: '#00b4d8',
    yaml: '#cb171e',
    yml: '#cb171e',
    default: '#38bdf8',
  };

  static generateCelestialUniverse(
    graph: UniverseGraph,
    galaxyName = 'CodeVerse Primary Galaxy',
  ): CelestialUniverse {
    const celestialNodes: CelestialNode[] = [];
    const nodeMap = new Map<string, CelestialNode>();

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

      // Scale physical properties based on symbol metrics
      const symbolScale = Math.min(2.5, 1.0 + (node.symbolCount || 0) * 0.05);

      let size = 1.0 * symbolScale;
      let mass = 1.0 * symbolScale;
      let orbitalRadius = 10 + i * 6;
      let rotationSpeed = 0.01;
      let orbitSpeed = 0.005;
      let color = this.LANGUAGE_COLORS[language] || this.LANGUAGE_COLORS.default;
      let emissiveIntensity = 0.2;
      let roughness = 0.4;
      let metalness = 0.1;
      let atmosphereGlow = false;

      switch (node.type) {
        case 'galaxy':
          size = 8.0 * symbolScale;
          mass = 100.0;
          color = '#818cf8';
          emissiveIntensity = 0.9;
          roughness = 0.1;
          metalness = 0.8;
          atmosphereGlow = true;
          stats.totalGalaxies++;
          break;
        case 'star':
        case 'service':
          size = 5.0 * symbolScale;
          mass = 35.0;
          color = '#fbbf24';
          emissiveIntensity = 0.8;
          roughness = 0.2;
          metalness = 0.6;
          atmosphereGlow = true;
          stats.totalStars++;
          break;
        case 'planet':
        case 'solar_system':
          size = 3.0 * symbolScale;
          mass = 12.0;
          emissiveIntensity = 0.3;
          atmosphereGlow = true;
          stats.totalPlanets++;
          break;
        case 'moon':
          size = 1.4 * symbolScale;
          mass = 4.0;
          color = '#c084fc';
          emissiveIntensity = 0.2;
          stats.totalMoons++;
          break;
        case 'satellite':
        case 'node':
          size = 0.9 * symbolScale;
          mass = 1.5;
          color = '#f472b6';
          emissiveIntensity = 0.1;
          stats.totalSatellites++;
          break;
      }

      // Compute spiral galaxy position in 3D coordinate space
      const angle = i * 0.45;
      const radius = 20 + i * 10;
      const posX = radius * Math.cos(angle);
      const posY = Math.sin(i * 0.3) * 6;
      const posZ = radius * Math.sin(angle);

      const celestialNode: CelestialNode = {
        ...node,
        color,
        size: Number(size.toFixed(2)),
        mass: Number(mass.toFixed(2)),
        orbitalRadius,
        rotationSpeed: rotationSpeed * (i % 2 === 0 ? 1 : -1),
        orbitSpeed,
        position: [
          Number(posX.toFixed(2)),
          Number(posY.toFixed(2)),
          Number(posZ.toFixed(2)),
        ],
        language,
        emissiveIntensity,
        roughness,
        metalness,
        atmosphereGlow,
      };

      celestialNodes.push(celestialNode);
      nodeMap.set(node.id, celestialNode);
    }

    return {
      galaxyName,
      nodes: celestialNodes,
      edges: graph.edges,
      stats,
    };
  }
}
