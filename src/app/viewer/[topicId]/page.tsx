'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Heart, Info, Maximize2, RotateCw, Sparkles, ZoomIn } from 'lucide-react';
import dynamic from 'next/dynamic';
import AnnotationPanel from '@/components/AnnotationPanel';
import GlassCard from '@/components/GlassCard';
import FloatingButton from '@/components/FloatingButton';
import { useAnnotations } from '@/hooks/useAnnotations';
import { iosFadeDown, iosFadeUp } from '@/lib/motion';
import { getTopicById } from '@/lib/topics';
import { TopicAnnotation } from '@/lib/types';

const ModelCanvas = dynamic(() => import('@/components/ModelCanvas'), { ssr: false });

type ActiveMode = 'info' | 'rotate' | 'zoom' | null;

export default function ViewerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = params?.topicId as string;
  const topic = getTopicById(topicId);
  const from = searchParams.get('from') ?? '/';
  const { annotations } = useAnnotations(topic?.id ?? '', topic?.annotations ?? []);

  const [liked, setLiked] = useState(false);
  const [activeMode, setActiveMode] = useState<ActiveMode>('info');
  const [autoRotate, setAutoRotate] = useState(true);
  const [expandedCanvas, setExpandedCanvas] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<TopicAnnotation | null>(null);

  useEffect(() => {
    if (!selectedAnnotation) return;
    const nextSelected = annotations.find((annotation) => annotation.id === selectedAnnotation.id) ?? null;
    if (nextSelected !== selectedAnnotation) {
      setSelectedAnnotation(nextSelected);
    }
  }, [annotations, selectedAnnotation]);

  if (!topic) {
    return (
      <main className="page-shell flex items-center justify-center px-5">
        <GlassCard className="max-w-sm p-6 text-center">
          <p className="mb-2 text-4xl">404</p>
          <p className="text-white/60">This lesson could not be found.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-brand-accent">
            Back home
          </Link>
        </GlassCard>
      </main>
    );
  }

  const showHotspots = activeMode === 'info';

  const toggleMode = (mode: ActiveMode) => {
    if (mode === 'rotate') {
      setAutoRotate((value) => !value);
      setActiveMode((current) => (current === 'rotate' ? null : 'rotate'));
      return;
    }

    if (mode === 'zoom') {
      setExpandedCanvas((value) => !value);
      setActiveMode((current) => (current === 'zoom' ? null : 'zoom'));
      return;
    }

    setActiveMode((current) => (current === mode ? null : mode));
  };

  return (
    <main className="page-shell px-4 pb-6 pt-8">
      <motion.section initial={iosFadeDown.initial} animate={iosFadeDown.animate} transition={iosFadeDown.transition} className="mb-4">
        <div className="screen-header">
          <button onClick={() => router.push(from)} className="glass grid h-11 w-11 place-items-center rounded-[20px]">
            <ArrowLeft size={18} className="text-white/80" />
          </button>
          <div className="text-center">
            <p className="screen-kicker">{topic.category}</p>
            <h1 className="text-lg font-semibold text-white">{topic.title}</h1>
          </div>
          <button
            onClick={() => setLiked((value) => !value)}
            className="glass grid h-11 w-11 place-items-center rounded-[20px]"
          >
            <Heart size={18} className={liked ? 'fill-rose-400 text-rose-400' : 'text-white/55'} />
          </button>
        </div>
      </motion.section>

      <motion.section initial={iosFadeUp.initial} animate={iosFadeUp.animate} transition={{ ...iosFadeUp.transition, delay: 0.08 }} className="mb-4">
        <GlassCard className="overflow-hidden p-3">
          <div
            className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${topic.color} ${
              expandedCanvas ? 'h-[28rem]' : 'h-[22rem]'
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_35%)]" />
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
              <div className="rounded-full border border-white/12 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                3D Preview
              </div>
              <div className="mt-4 text-[5rem] opacity-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.28)]">
                {topic.thumbnail}
              </div>
              <p className="mt-2 max-w-xs text-center text-sm text-white/45">
                Rotate the lesson, inspect labeled parts, and switch to AR when ready.
              </p>
            </div>
            <ModelCanvas
              modelUrl={topic.modelUrl}
              autoRotate={autoRotate}
              annotations={annotations}
              showProjectedLabels={showHotspots}
              selectedAnnotationId={selectedAnnotation?.id}
              onSelectAnnotation={setSelectedAnnotation}
              modelScale={topic.modelScale}
              placeholder={topic.thumbnail}
            />
          </div>
          <div className="flex items-center justify-center gap-3 px-2 pb-1 pt-4">
            <FloatingButton
              size="md"
              variant="glass"
              active={activeMode === 'info'}
              onClick={() => toggleMode('info')}
              icon={<Info size={18} />}
              label="Info"
            />
            <FloatingButton
              size="md"
              variant="glass"
              active={activeMode === 'rotate' || autoRotate}
              onClick={() => toggleMode('rotate')}
              icon={<RotateCw size={18} />}
              label="Rotate"
            />
            <FloatingButton
              size="md"
              variant="glass"
              active={activeMode === 'zoom' || expandedCanvas}
              onClick={() => toggleMode('zoom')}
              icon={<ZoomIn size={18} />}
              label="Zoom"
            />
            <Link
              href={{
                pathname: `/ar/${topic.id}`,
                query: { from },
              }}
            >
              <FloatingButton
                size="md"
                variant="primary"
                icon={<Maximize2 size={18} />}
                label="AR View"
              />
            </Link>
          </div>
        </GlassCard>
      </motion.section>

      <motion.section initial={iosFadeUp.initial} animate={iosFadeUp.animate} transition={{ ...iosFadeUp.transition, delay: 0.14 }} className="mb-4">
        {showHotspots && selectedAnnotation ? (
          <AnnotationPanel
            annotation={selectedAnnotation}
            topicTitle={topic.title}
            visible={showHotspots}
            onClose={() => setSelectedAnnotation(null)}
          />
        ) : (
          <GlassCard variant="strong" className="p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="screen-kicker">{topic.heroLabel}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{`About ${topic.title}`}</h2>
              </div>
              <div className="glass-purple rounded-full px-3 py-1 text-[11px] font-semibold text-brand-accent">
                Tap labels
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key="topic-description"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="text-sm leading-6 text-white/68"
              >
                {topic.description}
              </motion.p>
            </AnimatePresence>

            <div className="mt-4 flex flex-wrap gap-2">
              {annotations.map((annotation) => (
                <button
                  key={annotation.id}
                  onClick={() => {
                    setActiveMode('info');
                    setSelectedAnnotation(annotation);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selectedAnnotation?.id === annotation.id
                      ? 'glass-purple text-brand-accent'
                      : 'glass text-white/60'
                  }`}
                >
                  {annotation.label}
                </button>
              ))}
            </div>
          </GlassCard>
        )}
      </motion.section>

      <motion.section initial={iosFadeUp.initial} animate={iosFadeUp.animate} transition={{ ...iosFadeUp.transition, delay: 0.2 }} className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-brand-cyan" />
            <h3 className="text-lg font-semibold text-white">Ask AI while viewing</h3>
          </div>
          <p className="mb-4 text-sm leading-6 text-white/60">
            Jump into a contextual explanation tied to this lesson and the selected part.
          </p>
          <Link
            href={{
              pathname: '/ai',
              query: {
                topic: topic.id,
                from,
                part: selectedAnnotation?.id,
                prompt: selectedAnnotation?.questionPrompt,
              },
            }}
            className="inline-flex rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm"
          >
            Ask about {selectedAnnotation?.label ?? topic.title}
          </Link>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="screen-kicker mb-3">Related Topics</p>
          <div className="flex flex-wrap gap-2">
            {topic.relatedTopics.map((entry) => (
              <span key={entry} className="glass-outline rounded-full px-3 py-1.5 text-xs font-semibold text-white/70">
                {entry}
              </span>
            ))}
          </div>
        </GlassCard>
      </motion.section>
    </main>
  );
}
