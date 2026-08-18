'use client';

import React from 'react';
import { Plus, Search, Filter, Sparkles, Box, GitBranch, Cpu, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  onOpenImportModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenImportModal,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              AST Universe Command Center
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Software Repositories & Universes
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Explore 3D architecture graphs, real-time telemetry, and AI repository insights across
            your connected codebases.
          </p>
        </div>

        {/* Primary Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenImportModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-medium text-xs shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 transition-all border border-indigo-400/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Import Git Repository</span>
        </motion.button>
      </div>

      {/* Global Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Repositories</div>
            <div className="text-lg font-bold text-slate-100 font-mono">4 Active</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">AST Symbols</div>
            <div className="text-lg font-bold text-slate-100 font-mono">1,482 Nodes</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">Sync Status</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">100% Synced</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">AI Vector Store</div>
            <div className="text-lg font-bold text-slate-100 font-mono">8,920 Vectors</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-2 rounded-xl border border-slate-800/60">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repository universes by name, language, or branch..."
            className="w-full bg-slate-950/80 border border-slate-800/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
