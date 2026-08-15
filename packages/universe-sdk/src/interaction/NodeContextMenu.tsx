import React, { useEffect, useRef } from 'react';
import { ContextMenuState } from './InteractionTypes';

interface NodeContextMenuProps {
  contextMenu: ContextMenuState;
  onClose: () => void;
  onFocusCamera: (nodeId: string) => void;
  onTraceDependencies: (nodeId: string) => void;
  onCopyPath: (path: string) => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  contextMenu,
  onClose,
  onFocusCamera,
  onTraceDependencies,
  onCopyPath,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (contextMenu.isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isOpen, onClose]);

  if (!contextMenu.isOpen || !contextMenu.node) return null;

  const { node, screenPosition } = contextMenu;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${Math.min(screenPosition.x, window.innerWidth - 220)}px`,
    top: `${Math.min(screenPosition.y, window.innerHeight - 220)}px`,
  };

  return (
    <div
      ref={menuRef}
      style={style}
      className="z-40 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl p-2 shadow-2xl min-w-[200px] text-xs font-mono text-slate-200 animate-in fade-in zoom-in-95 space-y-1"
    >
      <div className="px-3 py-1.5 border-b border-slate-800 font-bold text-cyan-400 truncate">
        {node.name}
      </div>

      <button
        onClick={() => {
          onFocusCamera(node.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between transition-colors"
      >
        <span>🎯 Focus Camera</span>
        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">F</span>
      </button>

      <button
        onClick={() => {
          onTraceDependencies(node.id);
          onClose();
        }}
        className="w-full text-left px-3 py-2 rounded-xl hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between transition-colors"
      >
        <span>🔗 Trace Connections</span>
      </button>

      {node.path && (
        <button
          onClick={() => {
            onCopyPath(node.path!);
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-xl hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center justify-between transition-colors"
        >
          <span>📋 Copy Path</span>
        </button>
      )}

      <div className="pt-1 border-t border-slate-800">
        <button
          onClick={onClose}
          className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
