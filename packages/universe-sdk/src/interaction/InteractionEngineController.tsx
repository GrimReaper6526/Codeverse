import React from 'react';
import { CelestialNode } from '../generator/universeGenerator';
import { HoverDetails } from './InteractionTypes';

interface InteractionEngineControllerProps {
  onHoverNode?: (nodeId: string | null, details?: HoverDetails | null) => void;
  onSelectNode?: (nodeId: string, isMulti?: boolean) => void;
  onDoubleClickNode?: (node: CelestialNode) => void;
  onContextMenuNode?: (node: CelestialNode, screenPos: { x: number; y: number }) => void;
}

export const InteractionEngineController: React.FC<InteractionEngineControllerProps> = () => {
  return null;
};
