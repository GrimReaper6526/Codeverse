'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Code2,
} from 'lucide-react';

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  size?: string;
  children?: FileItem[];
}

export const mockFileTree: FileItem[] = [
  {
    id: 'f-apps',
    name: 'apps',
    type: 'folder',
    children: [
      {
        id: 'f-web',
        name: 'web',
        type: 'folder',
        children: [
          {
            id: 'f-web-src',
            name: 'src',
            type: 'folder',
            children: [
              { id: 'f-page', name: 'page.tsx', type: 'file', extension: 'tsx', size: '2.2 KB' },
              {
                id: 'f-layout',
                name: 'layout.tsx',
                type: 'file',
                extension: 'tsx',
                size: '0.8 KB',
              },
              {
                id: 'f-dashboard',
                name: 'dashboard/page.tsx',
                type: 'file',
                extension: 'tsx',
                size: '1.4 KB',
              },
            ],
          },
          {
            id: 'f-web-json',
            name: 'package.json',
            type: 'file',
            extension: 'json',
            size: '1.8 KB',
          },
        ],
      },
      {
        id: 'f-api',
        name: 'api',
        type: 'folder',
        children: [
          { id: 'f-api-main', name: 'src/main.ts', type: 'file', extension: 'ts', size: '1.1 KB' },
          {
            id: 'f-api-module',
            name: 'src/app.module.ts',
            type: 'file',
            extension: 'ts',
            size: '2.4 KB',
          },
        ],
      },
    ],
  },
  {
    id: 'f-packages',
    name: 'packages',
    type: 'folder',
    children: [
      {
        id: 'f-universe-sdk',
        name: 'universe-sdk',
        type: 'folder',
        children: [
          {
            id: 'f-physics',
            name: 'physics/forceSimulation.ts',
            type: 'file',
            extension: 'ts',
            size: '4.8 KB',
          },
          {
            id: 'f-scene',
            name: 'render/SceneBuilder.tsx',
            type: 'file',
            extension: 'tsx',
            size: '6.2 KB',
          },
          {
            id: 'f-canvas',
            name: 'render/UniverseCanvas.tsx',
            type: 'file',
            extension: 'tsx',
            size: '3.5 KB',
          },
        ],
      },
    ],
  },
  {
    id: 'f-docs',
    name: 'PRD.md',
    type: 'file',
    extension: 'md',
    size: '6.3 KB',
  },
];

interface FileTreeProps {
  tree: FileItem[];
  openFolders: Record<string, boolean>;
  onToggleFolder: (id: string) => void;
  selectedFileId: string | null;
  onSelectFile: (file: FileItem) => void;
  searchQuery: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  openFolders,
  onToggleFolder,
  selectedFileId,
  onSelectFile,
  searchQuery,
}) => {
  const getFileIcon = (ext?: string) => {
    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'jsx':
      case 'js':
        return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'json':
        return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'md':
        return <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const renderItem = (item: FileItem, level: number = 0) => {
    const isFolder = item.type === 'folder';
    const isOpen = openFolders[item.id] !== false;
    const isSelected = selectedFileId === item.id;

    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.children
    ) {
      return null;
    }

    return (
      <div key={item.id} className="space-y-0.5 font-sans select-none">
        <div
          onClick={() => {
            if (isFolder) onToggleFolder(item.id);
            else onSelectFile(item);
          }}
          className={`flex items-center justify-between p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
            isSelected
              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
              : 'border-transparent hover:bg-slate-900/80 text-slate-300 hover:text-white'
          }`}
          style={{ paddingLeft: `${level * 12 + 6}px` }}
        >
          <div className="flex items-center space-x-1.5 min-w-0 overflow-hidden">
            {isFolder ? (
              <>
                <span className="text-slate-500">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </span>
                {isOpen ? (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </>
            ) : (
              <>
                <span className="w-3.5 h-3.5" />
                {getFileIcon(item.extension)}
              </>
            )}
            <span className="truncate font-mono text-[11px] font-medium">{item.name}</span>
          </div>

          {item.size && (
            <span className="text-[9px] font-mono text-slate-400 shrink-0 ml-2">{item.size}</span>
          )}
        </div>

        {isFolder && isOpen && item.children && (
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-l border-slate-800/60 ml-3 pl-1 space-y-0.5 overflow-hidden"
            >
              {item.children.map((child) => renderItem(child, level + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return <div className="space-y-1 p-2">{tree.map((item) => renderItem(item))}</div>;
};
