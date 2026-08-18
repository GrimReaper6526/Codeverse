'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Globe,
  Box,
  Package,
  Server,
  Cpu,
  Braces,
  Eye,
} from 'lucide-react';

export interface ASTNodeItem {
  id: string;
  name: string;
  type: 'repository' | 'project' | 'module' | 'service' | 'class' | 'function';
  loc?: number;
  complexity?: number;
  children?: ASTNodeItem[];
}

export const mockArchitectureTree: ASTNodeItem = {
  id: 'repo-codeverse',
  name: 'Codeverse (Galaxy)',
  type: 'repository',
  children: [
    {
      id: 'proj-web',
      name: 'apps/web (Frontend App)',
      type: 'project',
      children: [
        {
          id: 'mod-app-shell',
          name: 'AppShell (Planet)',
          type: 'module',
          loc: 420,
          complexity: 4,
          children: [
            {
              id: 'serv-layout',
              name: 'LayoutEngine (Moon)',
              type: 'service',
              children: [
                { id: 'fn-top-nav', name: 'TopNav()', type: 'function', loc: 98 },
                { id: 'fn-left-explorer', name: 'LeftExplorer()', type: 'function', loc: 145 },
                { id: 'fn-cmd-palette', name: 'CommandPalette()', type: 'function', loc: 180 },
              ],
            },
          ],
        },
        {
          id: 'mod-dashboard',
          name: 'Dashboard (Planet)',
          type: 'module',
          loc: 310,
          complexity: 3,
          children: [
            { id: 'fn-repo-card', name: 'RepositoryCard()', type: 'function', loc: 75 },
            { id: 'fn-import-modal', name: 'ImportRepoModal()', type: 'function', loc: 110 },
          ],
        },
      ],
    },
    {
      id: 'proj-sdk',
      name: 'packages/universe-sdk (Physics Engine)',
      type: 'project',
      children: [
        {
          id: 'mod-physics',
          name: 'ForceSimulation (Planet)',
          type: 'module',
          loc: 580,
          complexity: 8,
          children: [
            {
              id: 'cls-force-layout',
              name: 'ForceLayout3D (Satellite)',
              type: 'class',
              children: [
                { id: 'fn-step', name: 'stepPhysics()', type: 'function', loc: 45 },
                { id: 'fn-apply-forces', name: 'applyNBodyForces()', type: 'function', loc: 62 },
              ],
            },
          ],
        },
        {
          id: 'mod-runtime',
          name: 'RuntimeTelemetry (Planet)',
          type: 'module',
          loc: 390,
          complexity: 5,
          children: [
            { id: 'fn-particle-stream', name: 'ParticleStream()', type: 'function', loc: 84 },
            {
              id: 'fn-weather-overlay',
              name: 'WeatherSystemOverlay()',
              type: 'function',
              loc: 102,
            },
          ],
        },
      ],
    },
  ],
};

interface ArchitectureTreeProps {
  tree: ASTNodeItem;
  openNodes: Record<string, boolean>;
  onToggleNode: (id: string) => void;
  selectedNodeId: string | null;
  onSelectNode: (node: ASTNodeItem) => void;
  searchQuery: string;
  selectedFilter: string;
}

export const ArchitectureTree: React.FC<ArchitectureTreeProps> = ({
  tree,
  openNodes,
  onToggleNode,
  selectedNodeId,
  onSelectNode,
  searchQuery,
  selectedFilter,
}) => {
  const getNodeIcon = (type: ASTNodeItem['type']) => {
    switch (type) {
      case 'repository':
        return <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'project':
        return <Box className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case 'module':
        return <Package className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'service':
        return <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'class':
        return <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'function':
        return <Braces className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    }
  };

  const renderNode = (node: ASTNodeItem, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openNodes[node.id] !== false; // Default open
    const isSelected = selectedNodeId === node.id;

    // Filter check
    if (
      searchQuery &&
      !node.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !hasChildren
    ) {
      return null;
    }

    if (selectedFilter !== 'all' && node.type !== selectedFilter && !hasChildren) {
      return null;
    }

    return (
      <div key={node.id} className="space-y-0.5 select-none font-sans">
        <motion.div
          whileHover={{ x: 2 }}
          onClick={() => {
            if (hasChildren) onToggleNode(node.id);
            onSelectNode(node);
          }}
          className={`flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-950/40'
              : 'border-transparent hover:bg-slate-900/80 text-slate-300 hover:text-white'
          }`}
          style={{ paddingLeft: `${level * 12 + 6}px` }}
        >
          <div className="flex items-center space-x-1.5 min-w-0 overflow-hidden">
            {hasChildren ? (
              <span className="text-slate-500 hover:text-slate-300">
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}

            {getNodeIcon(node.type)}
            <span className="truncate font-mono text-[11px] font-medium">{node.name}</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            {node.loc && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                {node.loc} LOC
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              title="Focus 3D Universe View"
              className="p-1 text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {hasChildren && isOpen && (
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-l border-slate-800/60 ml-3 pl-1 space-y-0.5 overflow-hidden"
            >
              {node.children!.map((child) => renderNode(child, level + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return <div className="space-y-1 p-2">{renderNode(tree)}</div>;
};
