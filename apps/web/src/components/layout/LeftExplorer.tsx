'use client';

import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  ChevronRight,
  ChevronDown,
  Globe,
  Server,
  Package,
  ShieldCheck,
  Zap,
  Filter,
} from 'lucide-react';

interface ExplorerItem {
  id: string;
  name: string;
  type: 'folder' | 'module' | 'service' | 'file';
  symbolCount?: number;
  children?: ExplorerItem[];
}

const mockTree: ExplorerItem[] = [
  {
    id: '1',
    name: 'apps',
    type: 'folder',
    children: [
      { id: '1-1', name: 'web (Next.js Frontend)', type: 'module', symbolCount: 42 },
      { id: '1-2', name: 'api (NestJS Backend)', type: 'service', symbolCount: 68 },
    ],
  },
  {
    id: '2',
    name: 'packages',
    type: 'folder',
    children: [
      { id: '2-1', name: 'universe-sdk (3D Engine)', type: 'module', symbolCount: 104 },
      { id: '2-2', name: 'ai-sdk (Model Router & RAG)', type: 'service', symbolCount: 56 },
      { id: '2-3', name: 'ui (Design Tokens)', type: 'module', symbolCount: 28 },
      { id: '2-4', name: 'types (AST Contracts)', type: 'file', symbolCount: 15 },
    ],
  },
];

export const LeftExplorer: React.FC = () => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ '1': true, '2': true });

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 h-[calc(100vh-3.5rem)] glass-panel border-r border-slate-800/80 flex flex-col z-20 select-none">
      {/* Explorer Header */}
      <div className="p-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
            Universe Explorer
          </span>
        </div>
        <button
          type="button"
          aria-label="Filter Explorer Symbols"
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Repository Stats Summary */}
      <div className="p-3 bg-slate-950/40 border-b border-slate-800/40 grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
          <div className="text-slate-400 flex items-center space-x-1">
            <Package className="w-3 h-3 text-indigo-400" />
            <span>Modules</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">12 Planets</div>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
          <div className="text-slate-400 flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Nodes</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-0.5">313 Symbols</div>
        </div>
      </div>

      {/* Tree Explorer View */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {mockTree.map((item) => (
          <div key={item.id} className="space-y-1">
            <div
              onClick={() => toggleFolder(item.id)}
              className="flex items-center space-x-1.5 p-1.5 rounded-md hover:bg-slate-800/60 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              {openFolders[item.id] ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{item.name}</span>
            </div>

            {openFolders[item.id] && item.children && (
              <div className="ml-4 border-l border-slate-800/80 pl-2 space-y-1">
                {item.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-800/70 text-slate-300 hover:text-cyan-300 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {child.type === 'service' ? (
                        <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      ) : child.type === 'module' ? (
                        <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                      <span className="truncate text-xs font-mono">{child.name}</span>
                    </div>
                    {child.symbolCount && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono group-hover:bg-cyan-950 group-hover:text-cyan-400 transition-colors">
                        {child.symbolCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Universe Engine Status Bar */}
      <div className="p-2.5 border-t border-slate-800/60 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AST Graph Synced</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">60 FPS</span>
      </div>
    </aside>
  );
};
