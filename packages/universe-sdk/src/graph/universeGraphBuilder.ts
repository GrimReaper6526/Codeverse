import { SoftwareGraphNode, SoftwareGraphEdge, UniverseGraph } from '@codeverse/types';

export function createSampleUniverseGraph(): UniverseGraph {
  const nodes: SoftwareGraphNode[] = [
    {
      id: 'galaxy-hub',
      name: 'CodeVerse Repository Galaxy',
      type: 'galaxy',
      path: '/',
      symbolCount: 313,
      connections: ['web-app', 'api-backend', 'universe-sdk', 'ai-sdk'],
    },
    {
      id: 'web-app',
      name: 'apps/web (Next.js App)',
      type: 'planet',
      path: '/apps/web',
      symbolCount: 42,
      connections: ['universe-sdk', 'ai-sdk'],
    },
    {
      id: 'api-backend',
      name: 'apps/api (NestJS API)',
      type: 'service',
      path: '/apps/api',
      symbolCount: 68,
      connections: ['ai-sdk'],
    },
    {
      id: 'universe-sdk',
      name: 'packages/universe-sdk (3D Physics)',
      type: 'planet',
      path: '/packages/universe-sdk',
      symbolCount: 104,
      connections: ['types-pkg'],
    },
    {
      id: 'ai-sdk',
      name: 'packages/ai-sdk (Model Router)',
      type: 'service',
      path: '/packages/ai-sdk',
      symbolCount: 56,
      connections: ['types-pkg'],
    },
    {
      id: 'ui-pkg',
      name: 'packages/ui (Design Tokens)',
      type: 'moon',
      path: '/packages/ui',
      symbolCount: 28,
      connections: ['web-app'],
    },
    {
      id: 'types-pkg',
      name: 'packages/types (AST Schemas)',
      type: 'satellite',
      path: '/packages/types',
      symbolCount: 15,
      connections: [],
    },
  ];

  const edges: SoftwareGraphEdge[] = [
    { id: 'e1', source: 'galaxy-hub', target: 'web-app', strength: 1.0 },
    { id: 'e2', source: 'galaxy-hub', target: 'api-backend', strength: 1.0 },
    { id: 'e3', source: 'galaxy-hub', target: 'universe-sdk', strength: 0.9 },
    { id: 'e4', source: 'galaxy-hub', target: 'ai-sdk', strength: 0.9 },
    { id: 'e5', source: 'web-app', target: 'universe-sdk', strength: 0.85 },
    { id: 'e6', source: 'web-app', target: 'ai-sdk', strength: 0.8 },
    { id: 'e7', source: 'api-backend', target: 'ai-sdk', strength: 0.95 },
    { id: 'e8', source: 'universe-sdk', target: 'types-pkg', strength: 0.7 },
    { id: 'e9', source: 'ai-sdk', target: 'types-pkg', strength: 0.75 },
    { id: 'e10', source: 'ui-pkg', target: 'web-app', strength: 0.6 },
  ];

  return { nodes, edges };
}
