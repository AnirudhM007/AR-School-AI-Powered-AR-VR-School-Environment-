'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ChatUI from '@/components/ChatUI';
import { getTopicById } from '@/lib/topics';

function AIContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic') ?? '';
  const topic = topicId ? getTopicById(topicId) : undefined;

  return (
    <main className="page-shell flex flex-col h-dvh">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 pt-12 pb-4 flex-shrink-0"
      >
        <Link href={topic ? `/viewer/${topic.id}` : '/'}>
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </Link>
        <div className="flex-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base">AI Assistant</h1>
            {topic && <p className="text-white/40 text-xs">{topic.title}</p>}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="px-3 py-1.5 glass rounded-xl text-white/50 text-xs flex items-center gap-1"
        >
          <span>Model</span>
          <span className="text-brand-accent">▾</span>
        </motion.button>
      </motion.div>

      {/* ── Chat ── */}
      <div className="flex-1 overflow-hidden">
        <ChatUI topic={topic?.title} />
      </div>
    </main>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={
      <div className="page-shell flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    }>
      <AIContent />
    </Suspense>
  );
}
