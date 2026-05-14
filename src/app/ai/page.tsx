'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Bot } from 'lucide-react';
import ChatUI from '@/components/ChatUI';
import { getTopicById } from '@/lib/topics';

function AIContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic') ?? '';
  const annotationId = searchParams.get('part');
  const prompt = searchParams.get('prompt');
  const topic = getTopicById(topicId);
  const annotation = annotationId ? topic?.annotations.find((item) => item.id === annotationId) : undefined;

  return (
    <main className="page-shell flex h-dvh flex-col px-4 pb-4 pt-8">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="screen-header">
          <Link href={topic ? `/viewer/${topic.id}` : '/'}>
            <div className="glass grid h-11 w-11 place-items-center rounded-[20px]">
              <ArrowLeft size={18} className="text-white/80" />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="glass-purple grid h-11 w-11 place-items-center rounded-[20px]">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="screen-kicker">AI Assistant</p>
              <h1 className="text-lg font-semibold text-white">{topic?.title ?? 'Learning chat'}</h1>
            </div>
          </div>
          <div className="glass rounded-full px-3 py-1 text-xs font-semibold text-white/55">Context on</div>
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-4">
        <div className="glass rounded-[28px] px-4 py-3 text-sm text-white/65">
          {annotation
            ? `Focused on ${annotation.label}. Ask a detailed question or use the suggested prompts below.`
            : 'Ask questions about the current topic, its structure, or how it works in real life.'}
        </div>
      </motion.div>

      <div className="glass-strong min-h-0 flex-1 rounded-[32px] pt-4">
        <ChatUI
          topic={topic?.title}
          topicId={topic?.id}
          selectedLabel={annotation?.label}
          initialPrompt={prompt}
          quickQuestions={topic?.quickQuestions}
        />
      </div>
    </main>
  );
}

export default function AIPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex items-center justify-center">
          <div className="glass-strong rounded-full p-5">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          </div>
        </div>
      }
    >
      <AIContent />
    </Suspense>
  );
}
