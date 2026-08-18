'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, GitBranch, Activity, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export interface RepositoryData {
  id: string;
  name: string;
  owner: string;
  description: string;
  provider: 'GITHUB' | 'GITLAB' | 'BITBUCKET';
  branch: string;
  planetCount: number;
  symbolCount: number;
  tags: string[];
  status: 'synced' | 'indexing' | 'error';
  lastSync: string;
}

interface RepositoryCardProps {
  repo: RepositoryData;
  onLaunchUniverse: (repoId: string) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo, onLaunchUniverse }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl hover:border-cyan-500/40 hover:shadow-cyan-950/30 transition-all flex flex-col justify-between overflow-hidden"
    >
      {/* Glow background accent */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

      <div>
        {/* Header: Title & Provider */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-slate-900 text-indigo-400 group-hover:border-cyan-500/50 group-hover:text-cyan-300 transition-colors">
              <Github className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span>{repo.owner}</span>
                <span>/</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <GitBranch className="w-3 h-3" />
                  {repo.branch}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                {repo.name}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            {repo.status === 'synced' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Synced
              </span>
            ) : repo.status === 'indexing' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <Activity className="w-3 h-3 animate-spin" />
                Indexing AST
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Sync Error
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-sans leading-relaxed">
          {repo.description}
        </p>

        {/* AST Metrics Stats */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Module Planets</span>
            <span className="text-sm font-bold text-indigo-300 font-mono">
              {repo.planetCount} Modules
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium font-sans">AST Symbols</span>
            <span className="text-sm font-bold text-cyan-300 font-mono">
              {repo.symbolCount} Nodes
            </span>
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {repo.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
          <Clock className="w-3 h-3" />
          <span>Updated {repo.lastSync}</span>
        </div>

        <button
          onClick={() => onLaunchUniverse(repo.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 hover:text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
        >
          <span>Launch 3D Universe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
