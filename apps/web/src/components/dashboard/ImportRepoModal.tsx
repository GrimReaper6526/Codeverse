'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, GitBranch, Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { RepositoryData } from './RepositoryCard';

interface ImportRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (newRepo: RepositoryData) => void;
}

export const ImportRepoModal: React.FC<ImportRepoModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [provider, setProvider] = useState<'GITHUB' | 'GITLAB' | 'BITBUCKET'>('GITHUB');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [depth, setDepth] = useState<'full' | 'standard' | 'basic'>('full');
  const [step, setStep] = useState<'input' | 'indexing' | 'success'>('input');

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    setStep('indexing');

    // Simulate multi-stage AST extraction pipeline
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'new-repository';
        const repoOwner = repoUrl.split('/')[3] || 'user';

        onImportComplete({
          id: Date.now().toString(),
          name: repoName,
          owner: repoOwner,
          description: 'Imported Git repository with real-time 3D universe layout and AST graph indexing.',
          provider,
          branch,
          planetCount: 8,
          symbolCount: 184,
          tags: ['TypeScript', 'Node.js', 'React'],
          status: 'synced',
          lastSync: 'Just now',
        });
        setStep('input');
        setRepoUrl('');
        onClose();
      }, 1000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-glow-indigo">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Import Git Repository</h2>
                  <p className="text-xs text-slate-400">Generate 3D Software Universe & AST Index</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === 'input' && (
              <form onSubmit={handleImport} className="space-y-4">
                {/* Provider Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Git Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['GITHUB', 'GITLAB', 'BITBUCKET'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProvider(p)}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          provider === p
                            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Repository URL Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Repository URL</label>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="w-full rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-colors font-mono"
                  />
                </div>

                {/* Branch Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Default Branch</label>
                  <div className="relative">
                    <GitBranch className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full rounded-xl bg-slate-900/80 border border-slate-800 pl-9 pr-3.5 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/50 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* AST Indexing Depth */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Universe AST Analysis Depth</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDepth('full')}
                      className={`p-2.5 rounded-xl border text-left text-[11px] transition-all cursor-pointer ${
                        depth === 'full'
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">Full AST Universe</div>
                      <div className="text-[9px] opacity-75">Functions, Classes & 3D Force Graph</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepth('standard')}
                      className={`p-2.5 rounded-xl border text-left text-[11px] transition-all cursor-pointer ${
                        depth === 'standard'
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">Standard AST</div>
                      <div className="text-[9px] opacity-75">Modules & Services</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepth('basic')}
                      className={`p-2.5 rounded-xl border text-left text-[11px] transition-all cursor-pointer ${
                        depth === 'basic'
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">File Tree Only</div>
                      <div className="text-[9px] opacity-75">Directory layout</div>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/30 transition-all cursor-pointer"
                  >
                    <span>Analyze & Generate Universe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {step === 'indexing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 font-mono">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Parsing AST & Building 3D Physics Force Graph...</h3>
                  <p className="text-xs text-slate-400 mt-1">Extracting modules, planetary orbits, and AI embeddings.</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">Universe Successfully Initialized!</h3>
                  <p className="text-xs text-slate-400 mt-1">Redirecting to project overview...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
