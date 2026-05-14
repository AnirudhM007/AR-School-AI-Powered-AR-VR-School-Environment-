'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  HelpCircle,
  Info,
  Maximize2,
  Move,
  RefreshCw,
  RotateCw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import GlassCard from '@/components/GlassCard';
import FloatingButton from '@/components/FloatingButton';
import { buildTopicContext, getTopicById } from '@/lib/topics';
import { useARSession } from '@/hooks/useARSession';
import { TopicAnnotation } from '@/lib/types';

const ModelCanvas = dynamic(() => import('@/components/ModelCanvas'), { ssr: false });

type ControlId = 'move' | 'rotate' | 'scale' | 'reset';

export default function ARPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;
  const topic = getTopicById(topicId);
  const { state, error, session, start, end } = useARSession();

  const [showHelp, setShowHelp] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activeControl, setActiveControl] = useState<ControlId | null>('move');
  const [selectedAnnotation, setSelectedAnnotation] = useState<TopicAnnotation | null>(
    topic?.annotations[0] ?? null,
  );
  const [modelTransform, setModelTransform] = useState({
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    scale: 1,
  });

  const touchState = useRef({
    lastX: 0,
    lastY: 0,
    initialDistance: 0,
    initialScale: 1,
  });

  const aiContext = useMemo(
    () => buildTopicContext(topic, selectedAnnotation?.id),
    [selectedAnnotation?.id, topic],
  );

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (activeControl === 'reset') {
      setModelTransform({
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
      });
      setTimeout(() => setActiveControl('move'), 220);
    }
  }, [activeControl]);

  if (!topic) {
    return (
      <main className="page-shell flex items-center justify-center px-5">
        <GlassCard className="p-6 text-center">
          <p className="text-white/65">Lesson not found.</p>
        </GlassCard>
      </main>
    );
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!activeControl || activeControl === 'reset' || state !== 'active') return;

    if (activeControl === 'scale' && event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      touchState.current.initialDistance = Math.hypot(dx, dy);
      touchState.current.initialScale = modelTransform.scale;
      return;
    }

    if (event.touches.length === 1) {
      touchState.current.lastX = event.touches[0].clientX;
      touchState.current.lastY = event.touches[0].clientY;
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!activeControl || activeControl === 'reset' || state !== 'active') return;

    if (activeControl === 'scale') {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        const scaleDelta = distance / (touchState.current.initialDistance || 1);
        setModelTransform((current) => ({
          ...current,
          scale: Math.max(0.12, touchState.current.initialScale * scaleDelta),
        }));
      }
      return;
    }

    if (event.touches.length === 1) {
      const dx = event.touches[0].clientX - touchState.current.lastX;
      const dy = event.touches[0].clientY - touchState.current.lastY;

      if (activeControl === 'rotate') {
        setModelTransform((current) => ({
          ...current,
          rotation: [current.rotation[0] + dy * 0.01, current.rotation[1] + dx * 0.01, current.rotation[2]],
        }));
      }

      if (activeControl === 'move') {
        setModelTransform((current) => ({
          ...current,
          position: [current.position[0] + dx * 0.0045, current.position[1] - dy * 0.0045, current.position[2]],
        }));
      }

      touchState.current.lastX = event.touches[0].clientX;
      touchState.current.lastY = event.touches[0].clientY;
    }
  };

  const handleBack = () => {
    if (state === 'active') {
      setShowExitModal(true);
      return;
    }
    router.back();
  };

  const confirmExit = () => {
    end();
    router.back();
  };

  return (
    <main
      className={`fixed inset-0 z-50 overflow-hidden ${state === 'active' ? 'bg-transparent' : 'gradient-bg'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute inset-0">
        <ModelCanvas
          modelUrl={topic.modelUrl}
          autoRotate={state !== 'active'}
          xrSession={session}
          transformPosition={modelTransform.position}
          transformRotation={modelTransform.rotation}
          transformScale={modelTransform.scale}
          modelScale={topic.modelScale}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center justify-between px-4 pt-8">
        <button onClick={handleBack} className="glass-strong grid h-11 w-11 place-items-center rounded-[20px]">
          {state === 'active' ? <X size={18} className="text-white/80" /> : <ArrowLeft size={18} className="text-white/80" />}
        </button>
        <GlassCard className="px-4 py-2" hover={false} tap={false}>
          <p className="text-sm font-semibold text-white">{topic.title}</p>
        </GlassCard>
        <button className="glass-strong grid h-11 w-11 place-items-center rounded-[20px]">
          <Volume2 size={18} className="text-white/80" />
        </button>
      </motion.div>

      <div className="relative z-10 mt-4 flex justify-center px-4">
        <AnimatePresence mode="wait">
          {state === 'starting' ? (
            <motion.div key="starting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-strong rounded-full px-5 py-3 text-sm text-white/75">
              Starting AR session...
            </motion.div>
          ) : state === 'active' ? (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-strong flex items-center gap-2 rounded-full px-5 py-3 text-sm text-white/75">
              <Move size={15} className="text-brand-accent" />
              Move your device, then use the controls to place and inspect the model.
            </motion.div>
          ) : state === 'unsupported' || state === 'error' ? (
            <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-strong max-w-sm rounded-[24px] px-5 py-4 text-center text-sm text-white/70">
              {state === 'error' ? error : 'AR is not supported here.'} The lesson is still available in the 3D fallback view.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="absolute right-4 top-1/4 z-10 flex flex-col gap-3">
        <FloatingButton
          size="sm"
          variant="glass"
          active={showInfoPanel}
          onClick={() => setShowInfoPanel((value) => !value)}
          icon={<Info size={16} />}
          label="Info"
        />
        <FloatingButton size="sm" variant="glass" icon={<Sparkles size={16} />} label="Light" />
        <FloatingButton
          size="sm"
          variant="glass"
          active={activeControl === 'reset'}
          onClick={() => setActiveControl('reset')}
          icon={<RefreshCw size={16} />}
          label="Reset"
        />
      </motion.div>

      <div className="absolute bottom-24 left-0 right-0 z-10 px-4">
        {showInfoPanel ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
            <GlassCard variant="strong" className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="screen-kicker">Interactive Labels</p>
                  <h2 className="text-base font-semibold text-white">{selectedAnnotation?.label ?? topic.title}</h2>
                </div>
                <Link
                  href={{
                    pathname: '/ai',
                    query: {
                      topic: topic.id,
                      part: selectedAnnotation?.id,
                      prompt: aiContext?.prompt,
                    },
                  }}
                  className="rounded-full bg-gradient-primary px-3 py-2 text-xs font-semibold text-white"
                >
                  Ask AI
                </Link>
              </div>
              <p className="text-sm leading-6 text-white/65">{selectedAnnotation?.description ?? topic.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topic.annotations.map((annotation) => (
                  <button
                    key={annotation.id}
                    onClick={() => setSelectedAnnotation(annotation)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selectedAnnotation?.id === annotation.id ? 'glass-purple text-brand-accent' : 'glass text-white/60'
                    }`}
                  >
                    {annotation.label}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : null}

        <div className="glass-strong rounded-[30px] px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Use controls to interact</p>
            <button onClick={() => setShowHelp(true)} className="text-xs font-semibold text-brand-accent">
              Help
            </button>
          </div>
          <div className="flex items-center justify-between gap-3">
            {([
              { id: 'move', icon: Move, label: 'Move' },
              { id: 'rotate', icon: RotateCw, label: 'Rotate' },
              { id: 'scale', icon: Maximize2, label: 'Scale' },
              { id: 'reset', icon: RefreshCw, label: 'Reset' },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveControl(id)}
                className="flex flex-col items-center gap-2"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-[18px] transition ${activeControl === id ? 'glass-purple text-brand-accent' : 'glass text-white/65'}`}>
                  <Icon size={17} />
                </div>
                <span className={`text-[11px] font-semibold ${activeControl === id ? 'text-brand-accent' : 'text-white/45'}`}>{label}</span>
              </button>
            ))}

            <button className="ml-2 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-glow-sm">
              <Camera size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHelp ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-end bg-black/55 px-4 pb-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ y: 260 }}
              animate={{ y: 0 }}
              exit={{ y: 260 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <GlassCard variant="strong" className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="glass-purple grid h-11 w-11 place-items-center rounded-[18px]">
                    <HelpCircle size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">AR controls help</h2>
                    <p className="text-sm text-white/45">Use one mode at a time for smoother interactions.</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-white/65">
                  <p><span className="font-semibold text-white">Move:</span> drag to reposition the model in front of you.</p>
                  <p><span className="font-semibold text-white">Rotate:</span> drag to turn the model and inspect different angles.</p>
                  <p><span className="font-semibold text-white">Scale:</span> pinch with two fingers to resize the model.</p>
                  <p><span className="font-semibold text-white">Info:</span> open part labels and jump into an AI explanation.</p>
                </div>
                <button onClick={() => setShowHelp(false)} className="mt-5 w-full rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white">
                  Close
                </button>
              </GlassCard>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showExitModal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/65 px-6"
          >
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}>
              <GlassCard variant="strong" className="w-[320px] p-6 text-center">
                <h2 className="text-lg font-semibold text-white">Exit AR View?</h2>
                <p className="mt-2 text-sm leading-6 text-white/55">You can return to the 3D viewer or reopen AR again from the lesson page.</p>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setShowExitModal(false)} className="glass flex-1 rounded-full px-4 py-3 text-sm font-semibold text-white/70">
                    Cancel
                  </button>
                  <button onClick={confirmExit} className="flex-1 rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white">
                    Leave
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
