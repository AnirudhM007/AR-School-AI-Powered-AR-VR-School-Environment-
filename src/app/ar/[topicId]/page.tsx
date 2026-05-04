'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Volume2, Camera, RotateCw, Maximize2, RefreshCw, HelpCircle, Move, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import GlassCard from '@/components/GlassCard';
import FloatingButton from '@/components/FloatingButton';
import { useARSession } from '@/hooks/useARSession';
import { getTopicById } from '@/lib/topics';

const ModelCanvas = dynamic(() => import('@/components/ModelCanvas'), { ssr: false });

export default function ARPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;
  const topic = getTopicById(topicId);

  const { state, error, start, end } = useARSession();
  const [showHelp, setShowHelp] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);

  // Auto-attempt AR on mount
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    if (state === 'active') {
      setShowExitModal(true);
    } else {
      router.back();
    }
  };

  const confirmExit = () => {
    end();
    router.back();
  };

  const CONTROLS = [
    { id: 'move',   icon: Move,      label: 'Move' },
    { id: 'rotate', icon: RotateCw,  label: 'Rotate' },
    { id: 'scale',  icon: Maximize2, label: 'Scale' },
    { id: 'reset',  icon: RefreshCw, label: 'Reset' },
  ];

  return (
    <main className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* ── AR Canvas / Fallback ── */}
      {state === 'active' ? (
        // Real AR would overlay on camera via WebXR — here we show a mockup
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white/20 text-sm">📷 Camera feed active</div>
        </div>
      ) : (
        /* Fallback 3D viewer */
        <div className="absolute inset-0">
          {topic && <ModelCanvas modelUrl={topic.modelUrl} autoRotate />}
        </div>
      )}

      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3"
      >
        <motion.button whileTap={{ scale: 0.85 }} onClick={handleBack}>
          <div className="w-10 h-10 glass-strong rounded-2xl flex items-center justify-center">
            {state === 'active' ? <X size={18} className="text-white/70" /> : <ArrowLeft size={18} className="text-white/70" />}
          </div>
        </motion.button>
        <GlassCard className="px-4 py-2" tap={false} hover={false}>
          <span className="text-white text-xs font-semibold">{topic?.title ?? 'AR View'}</span>
        </GlassCard>
        <motion.button whileTap={{ scale: 0.85 }}>
          <div className="w-10 h-10 glass-strong rounded-2xl flex items-center justify-center">
            <Volume2 size={18} className="text-white/70" />
          </div>
        </motion.button>
      </motion.div>

      {/* ── Status / Instructions ── */}
      <div className="relative z-10 flex justify-center mt-2">
        <AnimatePresence mode="wait">
          {state === 'unsupported' || state === 'error' ? (
            <motion.div
              key="unsupported"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-6"
            >
              <GlassCard variant="strong" className="px-5 py-4 text-center">
                <div className="text-3xl mb-2">📱</div>
                <p className="text-white font-semibold text-sm">
                  {state === 'error' ? error : 'AR Not Supported'}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Showing 3D viewer instead. AR requires Chrome on Android with ARCore.
                </p>
              </GlassCard>
            </motion.div>
          ) : state === 'starting' ? (
            <motion.div
              key="starting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong px-6 py-3 rounded-2xl flex items-center gap-3"
            >
              <div className="w-4 h-4 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
              <span className="text-white text-sm font-medium">Starting AR…</span>
            </motion.div>
          ) : state === 'active' ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-strong px-6 py-3 rounded-2xl flex items-center gap-2"
            >
              <Move size={14} className="text-brand-accent" />
              <span className="text-white/80 text-sm">Move device to place object</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Right side control panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute right-4 top-1/3 z-10 flex flex-col gap-3"
      >
        <div className="glass-strong rounded-3xl p-2 flex flex-col gap-2">
          {[
            { id: 'info',  label: 'Info',  emoji: 'ℹ️' },
            { id: 'light', label: 'Light', emoji: '☀️' },
            { id: 'reset', label: 'Reset', emoji: '↺' },
          ].map(({ id, label, emoji }) => (
            <FloatingButton
              key={id}
              size="sm"
              variant="glass"
              active={activeControl === id}
              onClick={() => setActiveControl(prev => prev === id ? null : id)}
              icon={<span className="text-base">{emoji}</span>}
              label={label}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Bottom Controls ── */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex flex-col items-center gap-4 px-4">
        {/* Control row */}
        <div className="glass-strong rounded-3xl px-4 py-3 flex items-center gap-4">
          {CONTROLS.map(({ id, icon: Icon, label }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.85 }}
              onClick={() => setActiveControl(prev => prev === id ? null : id)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  activeControl === id ? 'bg-brand-purple/40 border border-brand-purple/60' : 'glass'
                }`}
              >
                <Icon size={18} className={activeControl === id ? 'text-brand-accent' : 'text-white/70'} />
              </div>
              <span className={`text-[9px] font-medium ${activeControl === id ? 'text-brand-accent' : 'text-white/50'}`}>
                {label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-5">
          <FloatingButton size="md" variant="glass" icon={<Camera size={20} />} label="Capture" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center shadow-glow-purple"
          >
            <span className="text-2xl">🎯</span>
          </motion.button>
          <FloatingButton
            size="md"
            variant="glass"
            icon={<HelpCircle size={20} />}
            label="Help"
            onClick={() => setShowHelp(true)}
          />
        </div>
      </div>

      {/* ── Help Panel ── */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/60 flex items-end"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full mx-4 mb-4"
              onClick={e => e.stopPropagation()}
            >
              <GlassCard variant="strong" className="p-5">
                <h2 className="text-white font-bold text-base mb-3">AR Controls Help</h2>
                {[
                  ['Move', 'Drag to reposition the 3D object in space'],
                  ['Rotate', 'Two-finger twist to rotate the model'],
                  ['Scale', 'Pinch to scale the model up or down'],
                  ['Reset', 'Return model to original position and size'],
                  ['Capture', 'Take an AR screenshot to save'],
                ].map(([t, d]) => (
                  <div key={t} className="flex gap-3 mb-3">
                    <span className="text-brand-accent font-semibold text-sm w-14 flex-shrink-0">{t}</span>
                    <span className="text-white/60 text-xs">{d}</span>
                  </div>
                ))}
                <button
                  onClick={() => setShowHelp(false)}
                  className="mt-2 w-full py-2.5 glass rounded-2xl text-white/70 text-sm font-medium"
                >
                  Close
                </button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Exit Modal ── */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/70 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <GlassCard variant="strong" className="p-6 text-center">
                <div className="text-4xl mb-3">🚪</div>
                <h2 className="text-white font-bold text-base mb-1">Exit AR View?</h2>
                <p className="text-white/50 text-sm mb-5">Do you want to go back to the topics list?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-2.5 glass rounded-2xl text-white/70 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmExit}
                    className="flex-1 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo rounded-2xl text-white text-sm font-semibold"
                  >
                    Yes, Go Back
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
