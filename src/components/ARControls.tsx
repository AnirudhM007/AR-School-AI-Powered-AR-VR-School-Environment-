'use client';

import { motion } from 'framer-motion';
import { Info, RotateCw, ZoomIn, Maximize2 } from 'lucide-react';
import FloatingButton from './FloatingButton';

interface ARControlsProps {
  onInfo?: () => void;
  onRotate?: () => void;
  onZoom?: () => void;
  onARView?: () => void;
  activeMode?: string;
}

const CONTROLS = [
  { id: 'info',   label: 'Info',   Icon: Info,       action: 'onInfo' },
  { id: 'rotate', label: 'Rotate', Icon: RotateCw,   action: 'onRotate' },
  { id: 'zoom',   label: 'Zoom',   Icon: ZoomIn,     action: 'onZoom' },
];

export default function ARControls({ onInfo, onRotate, onZoom, onARView, activeMode }: ARControlsProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    onInfo, onRotate, onZoom,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
      className="flex flex-col gap-3"
    >
      {/* Vertical glass panel */}
      <div className="glass rounded-3xl p-3 flex flex-col gap-3 shadow-glass">
        {CONTROLS.map(({ id, label, Icon, action }) => (
          <FloatingButton
            key={id}
            size="sm"
            variant="glass"
            active={activeMode === id}
            onClick={handlers[action]}
            icon={<Icon size={16} />}
            label={label}
          />
        ))}
      </div>

      {/* AR View button */}
      <motion.button
        onClick={onARView}
        className="w-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-brand-purple to-brand-indigo rounded-2xl py-2 px-1 shadow-glow-sm text-white"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88 }}
      >
        <Maximize2 size={16} />
        <span className="text-[9px] font-bold tracking-wide">AR View</span>
      </motion.button>
    </motion.div>
  );
}
