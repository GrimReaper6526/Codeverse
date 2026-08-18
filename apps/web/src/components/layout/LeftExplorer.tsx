'use client';

import React, { useState } from 'react';
import { ShieldCheck, Package, Zap } from 'lucide-react';
import { ExplorerHeader, ExplorerTab } from '../explorer/ExplorerHeader';
import { ArchitectureTree, mockArchitectureTree, ASTNodeItem } from '../explorer/ArchitectureTree';
import { FileTree, mockFileTree, FileItem } from '../explorer/FileTree';
import { DependencyMatrix } from '../explorer/DependencyMatrix';

export const LeftExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('mod-app-shell');
  const [selectedFileId, setSelectedFileId] = useState<string | null>('f-page');
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    'repo-codeverse': true,
    'proj-web': true,
    'mod-app-shell': true,
    'serv-layout': true,
    'proj-sdk': true,
    'mod-physics': true,
  });

  const handleToggleNode = (id: string) => {
    setOpenNodes((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const handleExpandAll = () => {
    setOpenNodes({
      'repo-codeverse': true,
      'proj-web': true,
      'mod-app-shell': true,
      'serv-layout': true,
      'mod-dashboard': true,
      'proj-sdk': true,
      'mod-physics': true,
      'cls-force-layout': true,
      'mod-runtime': true,
      'f-apps': true,
      'f-web': true,
      'f-web-src': true,
      'f-api': true,
      'f-packages': true,
      'f-universe-sdk': true,
    });
  };

  const handleCollapseAll = () => {
    setOpenNodes({
      'repo-codeverse': false,
      'f-apps': false,
      'f-packages': false,
    });
  };

  const handleSelectNode = (node: ASTNodeItem) => {
    setSelectedNodeId(node.id);
    console.log(`[Universe Explorer] Focus camera on AST node: ${node.name} (${node.id})`);
  };

  const handleSelectFile = (file: FileItem) => {
    setSelectedFileId(file.id);
    console.log(`[Universe Explorer] Open codebase file: ${file.name} (${file.id})`);
  };

  return (
    <aside className="w-72 h-[calc(100vh-3.5rem)] glass-panel border-r border-slate-800/80 flex flex-col z-20 select-none overflow-hidden font-sans">
      {/* 1. Header with Mode Switcher & Search */}
      <ExplorerHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* 2. Repository Quick Stats Badge */}
      <div className="p-2.5 bg-slate-950/40 border-b border-slate-800/40 grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
          <div className="text-slate-400 flex items-center space-x-1">
            <Package className="w-3 h-3 text-indigo-400" />
            <span>Modules</span>
          </div>
          <div className="text-xs font-bold text-slate-100 mt-0.5 font-mono">12 Planets</div>
        </div>

        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
          <div className="text-slate-400 flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>AST Nodes</span>
          </div>
          <div className="text-xs font-bold text-slate-100 mt-0.5 font-mono">313 Symbols</div>
        </div>
      </div>

      {/* 3. Main Tree Body View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'architecture' && (
          <ArchitectureTree
            tree={mockArchitectureTree}
            openNodes={openNodes}
            onToggleNode={handleToggleNode}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            searchQuery={searchQuery}
            selectedFilter={selectedFilter}
          />
        )}

        {activeTab === 'files' && (
          <FileTree
            tree={mockFileTree}
            openFolders={openNodes}
            onToggleFolder={handleToggleNode}
            selectedFileId={selectedFileId}
            onSelectFile={handleSelectFile}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'dependencies' && <DependencyMatrix />}
      </div>

      {/* 4. Footer Status Bar */}
      <div className="p-2.5 border-t border-slate-800/60 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AST Graph Synced</span>
        </div>
        <span className="text-[10px] text-emerald-400">60 FPS</span>
      </div>
    </aside>
  );
};
