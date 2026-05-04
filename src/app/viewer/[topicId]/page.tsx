'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Info, RotateCw, ZoomIn, Maximize2, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import GlassCard from '@/components/GlassCard';
import FloatingButton from '@/components/FloatingButton';
import { getTopicById } from '@/lib/topics';

// Dynamic import (no SSR) — Three.js requires browser APIs
const ModelCanvas = dynamic(() => import('@/components/ModelCanvas'), { ssr: false });

type ActiveMode = 'info' | 'rotate' | 'zoom' | null;

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;
  const topic = getTopicById(topicId);

  const [liked, setLiked] = useState(false);
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  if (!topic) {
    return (
      <main className="page-shell flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2">😕</div>
          <p>Topic not found</p>
          <Link href="/" className="text-brand-accent text-sm mt-2 block">← Home</Link>
        </div>
      </main>
    );
  }

  const toggleMode = (mode: ActiveMode) => {
    if (mode === 'rotate') {
      setAutoRotate(r => !r);
      setActiveMode(prev => (prev === 'rotate' ? null : 'rotate'));
    } else {
      setActiveMode(prev => (prev === mode ? null : mode));
      if (mode === 'info') setShowInfo(true);
    }
  };

  return (
    <main className="page-shell relative flex flex-col">
      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 pt-12 pb-3 z-10 relative"
      >
        <button onClick={() => router.back()}>
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </button>
        <h1 className="text-white font-bold text-base">{topic.title}</h1>
        <motion.button
          whileTap={{ scale: 0.75 }}
          onClick={() => setLiked(l => !l)}
          className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
        >
          <Heart
            size={18}
            className={liked ? 'fill-red-500 text-red-500' : 'text-white/50'}
          />
        </motion.button>
      </motion.div>

      {/* ── 3D Canvas ── */}
      <div className="relative flex-1 min-h-[320px] mx-4">
        <div className="w-full h-72 relative rounded-3xl overflow-hidden glass">
          <ModelCanvas modelUrl={topic.modelUrl} autoRotate={autoRotate} />
        </div>
        <p className="text-center text-white/30 text-xs mt-2">3D Preview · Drag to rotate</p>

        {/* Controls Row */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {[
            { id: 'info' as ActiveMode, label: 'Info',   icon: Info },
            { id: 'rotate' as ActiveMode, label: 'Rotate', icon: RotateCw },
            { id: 'zoom' as ActiveMode,   label: 'Zoom',   icon: ZoomIn },
          ].map(({ id, label, icon: Icon }) => (
            <FloatingButton
              key={id}
              size="md"
              variant="glass"
              active={activeMode === id || (id === 'rotate' && autoRotate)}
              onClick={() => toggleMode(id)}
              icon={<Icon size={18} />}
              label={label}
            />
          ))}

          {/* AR View — primary */}
          <Link href={`/ar/${topic.id}`}>
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.88 }}
              className="w-14 h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-brand-purple to-brand-indigo rounded-2xl shadow-glow-sm cursor-pointer"
            >
              <Maximize2 size={18} className="text-white" />
              <span className="text-[9px] text-white font-bold tracking-wide">AR View</span>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* ── Info Panel (slide up) ── */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-20 left-0 right-0 mx-4 z-40"
          >
            <GlassCard variant="strong" className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-bold text-base">About {topic.title}</h2>
                <button onClick={() => setShowInfo(false)}>
                  <ChevronDown size={20} className="text-white/50" />
                </button>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{topic.description}</p>
              <div className="flex gap-2 mt-4">
                <Link href={`/ai?topic=${topic.id}`} className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo rounded-2xl text-white text-sm font-semibold"
                  >
                    Ask AI →
                  </motion.button>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2.5 glass rounded-2xl text-white/60 text-sm"
                >
                  Close
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Quick Link ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-5 mt-4"
      >
        <GlassCard className="p-4">
          <h3 className="text-white font-semibold text-sm mb-1">About {topic.title}</h3>
          <p className="text-white/55 text-xs leading-relaxed line-clamp-3">
            {topic.description}
          </p>
          <button
            onClick={() => setShowInfo(true)}
            className="text-brand-accent text-xs font-semibold mt-2 inline-block"
          >
            Read More →
          </button>
        </GlassCard>
      </motion.div>

      {/* ── Quiz CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-5 mt-4 pb-4"
      >
        <Link href={`/quiz/${topic.id}`}>
          <GlassCard variant="purple" className="p-4 flex items-center gap-4" glow>
            <div className="text-3xl bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
              🏆
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">Test Your Knowledge</h3>
              <p className="text-white/60 text-xs mt-0.5">Earn XP and level up!</p>
            </div>
            <span className="text-brand-accent text-xs font-bold px-3 py-1.5 glass-strong rounded-full">
              Play →
            </span>
          </GlassCard>
        </Link>
      </motion.div>
    </main>
  );
}
