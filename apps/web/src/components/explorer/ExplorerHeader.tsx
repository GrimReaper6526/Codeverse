'use client';

import React from 'react';
import {
  Globe,
  FileCode,
  Link2,
  Search,
  Minimize2,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export type ExplorerTab = 'architecture' | 'files' | 'dependencies';

interface ExplorerHeaderProps {
  activeTab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="border-b border-slate-800/80 bg-slate-950/60 p-3 space-y-2.5 font-sans">
      {/* Title & Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono">
            Universe Explorer
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onExpandAll}
            title="Expand All"
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            title="Collapse All"
            className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-medium">
        <button
          type="button"
          onClick={() => onTabChange('architecture')}
          className={`flex items-center justify-center space-x-1 py-1 rounded-md transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>AST 3D</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('files')}
          className={`flex items-center justify-center space-x-1 py-1 rounded-md transition-all cursor-pointer ${
            activeTab === 'files'
              ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3 h-3" />
          <span>Files</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('dependencies')}
          className={`flex items-center justify-center space-x-1 py-1 rounded-md transition-all cursor-pointer ${
            activeTab === 'dependencies'
              ? 'bg-indigo-600/25 text-cyan-300 border border-indigo-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link2 className="w-3 h-3" />
          <span>Graph</span>
        </button>
      </div>

      {/* Search Input & Filter Selector */}
      <div className="flex items-center space-x-1.5">
        <div className="relative flex-1">
          <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search AST nodes..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-md pl-7 pr-2 py-1 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors font-mono"
          />
        </div>

        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter AST Symbols"
          className="bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300 rounded-md px-1.5 py-1 outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
        >
          <option value="all">All Types</option>
          <option value="module">Modules</option>
          <option value="service">Services</option>
          <option value="class">Classes</option>
          <option value="function">Functions</option>
        </select>
      </div>
    </div>
  );
};
