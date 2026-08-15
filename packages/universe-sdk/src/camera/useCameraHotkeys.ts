import { useEffect } from 'react';
import { NodeSpatialData } from './CameraEngineTypes';

interface UseCameraHotkeysOptions {
  onResetOverview: () => void;
  onFocusSelected: () => void;
  onToggleCinematic: () => void;
  onToggleTopDown: () => void;
  onToggleAutoRotate: () => void;
  selectedNode?: NodeSpatialData | null;
  enabled?: boolean;
}

export function useCameraHotkeys({
  onResetOverview,
  onFocusSelected,
  onToggleCinematic,
  onToggleTopDown,
  onToggleAutoRotate,
  enabled = true,
}: UseCameraHotkeysOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs inside input fields or textareas
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          onResetOverview();
          break;
        case 'f':
          e.preventDefault();
          onFocusSelected();
          break;
        case 'c':
          e.preventDefault();
          onToggleCinematic();
          break;
        case 't':
          e.preventDefault();
          onToggleTopDown();
          break;
        case ' ':
          e.preventDefault();
          onToggleAutoRotate();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onResetOverview,
    onFocusSelected,
    onToggleCinematic,
    onToggleTopDown,
    onToggleAutoRotate,
  ]);
}
