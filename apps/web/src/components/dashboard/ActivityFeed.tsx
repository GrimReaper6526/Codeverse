'use client';

import React from 'react';
import { GitCommit, Sparkles, Cpu, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'commit' | 'ast_sync' | 'ai_embedding';
  title: string;
  repo: string;
  timestamp: string;
  author?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'ast_sync',
    title: 'Indexed 184 new AST function nodes & particle streams',
    repo: 'GrimReaper6526 / Codeverse',
    timestamp: '2 mins ago',
  },
  {
    id: '2',
    type: 'commit',
    title: 'refactor(Visuals): Runtime Visualization setup',
    repo: 'GrimReaper6526 / Codeverse',
    timestamp: '14 mins ago',
    author: 'GrimReaper6526',
  },
  {
    id: '3',
    type: 'ai_embedding',
    title: 'Generated vector store embeddings for universe-sdk package',
    repo: 'GrimReaper6526 / Codeverse',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    type: 'ast_sync',
    title: 'Re-built 3D physics force layout graph for apps/api',
    repo: 'GrimReaper6526 / Codeverse',
    timestamp: '3 hours ago',
  },
];

export const ActivityFeed: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide">Recent Universe & AST Activity</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">REALTIME STREAM</span>
      </div>

      {/* Item List */}
      <div className="space-y-3 font-sans">
        {mockActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-900/70 transition-colors"
          >
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                act.type === 'commit'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : act.type === 'ast_sync'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              }`}
            >
              {act.type === 'commit' ? (
                <GitCommit className="w-4 h-4" />
              ) : act.type === 'ast_sync' ? (
                <Cpu className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{act.title}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                <span className="text-cyan-400">{act.repo}</span>
                <span>•</span>
                <span>{act.timestamp}</span>
                {act.author && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300">by {act.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
