'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Cpu, Orbit, Zap, Sun, CloudLightning, Layers, X, ArrowRight, Activity } from 'lucide-react';
import { useRuntimeEngine } from '@codeverse/universe-sdk';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'SEARCH_NODES' | 'CAMERA' | 'WEATHER' | 'ACTIONS';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setSimulationState } = useRuntimeEngine();

  const commands: CommandItem[] = [
    {
      id: 'node-auth-service',
      category: 'SEARCH_NODES',
      title: 'AuthService.validateToken',
      subtitle: 'apps/api/src/auth/auth.service.ts • Service Satellite',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      action: () => {
        console.log('Focusing AuthService.validateToken');
        onClose();
      },
    },
    {
      id: 'node-universe-builder',
      category: 'SEARCH_NODES',
      title: 'SceneBuilder Component',
      subtitle: 'packages/universe-sdk/src/render/SceneBuilder.tsx • Module Planet',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      action: () => {
        console.log('Focusing SceneBuilder');
        onClose();
      },
    },
    {
      id: 'cam-orbit',
      category: 'CAMERA',
      title: 'Switch Camera to Orbit Mode',
      subtitle: 'Free 3D rotation around central software galaxy',
      icon: <Orbit className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onClose();
      },
    },
    {
      id: 'cam-reset',
      category: 'CAMERA',
      title: 'Reset Camera to Galaxy Overview',
      subtitle: 'Reset pitch, yaw, and zoom coordinates',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onClose();
      },
    },
    {
      id: 'weather-clear',
      category: 'WEATHER',
      title: 'Set Weather: Clear Sky',
      subtitle: 'Optimal visibility for deep AST inspection',
      icon: <Sun className="w-4 h-4 text-amber-300" />,
      action: () => {
        setSimulationState({ weather: 'clear_sky' });
        onClose();
      },
    },
    {
      id: 'weather-storm',
      category: 'WEATHER',
      title: 'Set Weather: Electrical Storm',
      subtitle: 'High-energy particle lightning overlay',
      icon: <CloudLightning className="w-4 h-4 text-cyan-300" />,
      action: () => {
        setSimulationState({ weather: 'electrical_storm' });
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md select-none">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 px-4 py-3.5">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search AST nodes, jump to camera poses, or run AI commands..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar font-sans">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No matching AST nodes or system commands found for "{query}".
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
                      selectedIndex === idx
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-slate-100 shadow-lg shadow-cyan-950/30'
                        : 'text-slate-300 hover:bg-slate-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                          selectedIndex === idx
                            ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {cmd.icon}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold tracking-wide truncate">{cmd.title}</span>
                        {cmd.subtitle && <span className="text-[10px] text-slate-400 font-mono truncate">{cmd.subtitle}</span>}
                      </div>
                    </div>
                    {selectedIndex === idx && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 shrink-0">
                        <span>SELECT</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/60 px-4 py-2 text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Activity className="w-3 h-3" />
                <span>CODEVERSE AST SEARCH</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
