'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Sparkles, X } from 'lucide-react';
import { TopicAnnotation } from '@/lib/types';

interface AnnotationPanelProps {
  annotation: TopicAnnotation | null;
  topicTitle: string;
  visible: boolean;
  onClose: () => void;
}

export default function AnnotationPanel({
  annotation,
  topicTitle,
  visible,
  onClose,
}: AnnotationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  useEffect(() => {
    setAiExplanation(null);
    setLoading(false);
  }, [annotation?.id, visible]);

  const handleLearnMore = async () => {
    if (!annotation || loading) return;

    setLoading(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Explain ${annotation.label} in ${topicTitle}`,
          topic: topicTitle,
          selectedLabel: annotation.label,
        }),
      });

      const data = await response.json();
      setAiExplanation(data.answer ?? 'No explanation returned.');
    } catch {
      setAiExplanation('I could not fetch the explanation right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && annotation ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="glass-strong rounded-[28px] p-4"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="screen-kicker">Model Part</p>
              <h3 className="text-lg font-semibold text-white">{annotation.label}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="glass-fast grid h-10 w-10 place-items-center rounded-[18px]"
            >
              <X size={16} className="text-white/72" />
            </button>
          </div>

          <p className="text-sm leading-6 text-white/72">{annotation.description}</p>

          <button
            type="button"
            onClick={() => void handleLearnMore()}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-60"
          >
            <BookOpenText size={16} />
            {loading ? 'Loading...' : 'Learn More'}
          </button>

          {aiExplanation ? (
            <div className="mt-4 rounded-[22px] border border-white/12 bg-white/5 px-4 py-3">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-brand-cyan" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  AI Explanation
                </p>
              </div>
              <p className="text-sm leading-6 text-white/74">{aiExplanation}</p>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
