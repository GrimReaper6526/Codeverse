'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from './DashboardHeader';
import { RepositoryCard, RepositoryData } from './RepositoryCard';
import { SystemMetricsPanel } from './SystemMetricsPanel';
import { ActivityFeed } from './ActivityFeed';
import { ImportRepoModal } from './ImportRepoModal';

const initialRepositories: RepositoryData[] = [
  {
    id: '1',
    name: 'Codeverse',
    owner: 'GrimReaper6526',
    description: 'AI-native software architecture visualization engine with 3D R3F universe canvas & AST graph parser.',
    provider: 'GITHUB',
    branch: 'main',
    planetCount: 12,
    symbolCount: 313,
    tags: ['Next.js 14', 'NestJS', 'R3F', 'TypeScript', 'Prisma', 'Tailwind'],
    status: 'synced',
    lastSync: 'Just now',
  },
  {
    id: '2',
    name: 'microservices-core',
    owner: 'enterprise-org',
    description: 'Distributed event-driven microservices architecture with Kafka event bus & NestJS gRPC endpoints.',
    provider: 'GITHUB',
    branch: 'production',
    planetCount: 24,
    symbolCount: 640,
    tags: ['NestJS', 'Kafka', 'Docker', 'PostgreSQL', 'Redis'],
    status: 'synced',
    lastSync: '2 hours ago',
  },
  {
    id: '3',
    name: 'quantum-ui-system',
    owner: 'design-team',
    description: 'Cybernetic glassmorphic design token library with WebGL dynamic shaders & Framer Motion primitives.',
    provider: 'GITHUB',
    branch: 'main',
    planetCount: 6,
    symbolCount: 142,
    tags: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    status: 'synced',
    lastSync: '1 day ago',
  },
  {
    id: '4',
    name: 'ai-rag-orchestrator',
    owner: 'ai-labs',
    description: 'Multi-provider model router with AST code chunking, PgVector similarity search & context memory.',
    provider: 'GITHUB',
    branch: 'dev',
    planetCount: 10,
    symbolCount: 287,
    tags: ['Python', 'FastAPI', 'PgVector', 'OpenAI', 'DeepSeek'],
    status: 'synced',
    lastSync: '3 days ago',
  },
];

export const DashboardView: React.FC = () => {
  const router = useRouter();
  const [repositories, setRepositories] = useState<RepositoryData[]>(initialRepositories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleLaunchUniverse = (repoId: string) => {
    console.log(`Launching 3D Universe for repository: ${repoId}`);
    router.push('/');
  };

  const handleImportComplete = (newRepo: RepositoryData) => {
    setRepositories((prev) => [newRepo, ...prev]);
  };

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header & Quick Metrics */}
      <DashboardHeader
        onOpenImportModal={() => setIsImportModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Primary Repository Universes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 tracking-tight">Active Software Universes</h2>
          <span className="text-xs font-mono text-slate-400">{filteredRepositories.length} Repositories</span>
        </div>

        {filteredRepositories.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/30 text-slate-500 text-xs">
            No software universes found matching "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRepositories.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} onLaunchUniverse={handleLaunchUniverse} />
            ))}
          </div>
        )}
      </div>

      {/* 3. Metrics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800/60">
        <SystemMetricsPanel />
        <ActivityFeed />
      </div>

      {/* 4. Import Repository Modal */}
      <ImportRepoModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
