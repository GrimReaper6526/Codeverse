'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface DependencyLink {
  id: string;
  source: string;
  target: string;
  linkCount: number;
  couplingType: 'import' | 'rpc' | 'event';
}

const mockDependencyLinks: DependencyLink[] = [
  {
    id: 'link-1',
    source: 'apps/web',
    target: 'packages/universe-sdk',
    linkCount: 24,
    couplingType: 'import',
  },
  {
    id: 'link-2',
    source: 'apps/web',
    target: 'packages/ai-sdk',
    linkCount: 16,
    couplingType: 'rpc',
  },
  {
    id: 'link-3',
    source: 'apps/api',
    target: 'packages/database',
    linkCount: 42,
    couplingType: 'import',
  },
  {
    id: 'link-4',
    source: 'packages/universe-sdk',
    target: 'packages/types',
    linkCount: 12,
    couplingType: 'import',
  },
  {
    id: 'link-5',
    source: 'packages/ai-sdk',
    target: 'packages/config',
    linkCount: 8,
    couplingType: 'event',
  },
];

export const DependencyMatrix: React.FC = () => {
  return (
    <div className="p-3 space-y-3 font-sans text-xs">
      {/* Matrix Header Badge */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="font-bold text-slate-200">Energy Links Matrix</div>
            <div className="text-[10px] text-slate-400 font-mono">102 Cross-Package References</div>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Acyclic
        </span>
      </div>

      {/* Dependency Links List */}
      <div className="space-y-2">
        {mockDependencyLinks.map((link) => (
          <div
            key={link.id}
            className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/80 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-cyan-300 font-semibold">{link.source}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 mx-1 shrink-0" />
              <span className="text-purple-300 font-semibold">{link.target}</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
              <span className="capitalize text-slate-400">Type: {link.couplingType}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono font-bold">
                {link.linkCount} links
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
