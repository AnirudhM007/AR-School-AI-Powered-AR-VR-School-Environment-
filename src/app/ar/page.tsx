'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { TOPICS } from '@/lib/topics';

export default function ARIndexPage() {
  return (
    <main className="page-shell px-5 pt-12 pb-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-white">AR Mode <span>🥽</span></h1>
        <p className="text-white/40 text-sm mt-1">Select a topic to experience in AR</p>
      </motion.div>

      {/* AR availability card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <GlassCard variant="purple" className="p-4 flex items-center gap-4" tap={false} glow>
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/30 flex items-center justify-center">
            <Cpu size={22} className="text-brand-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">WebXR AR Ready</p>
            <p className="text-white/50 text-xs mt-0.5">Requires Chrome + Android ARCore</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Topic list */}
      <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3 pl-1">Pick a Topic</p>
      <div className="space-y-3">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link href={`/ar/${topic.id}`}>
              <GlassCard className="flex items-center gap-4 p-4 cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl`}>
                  {topic.thumbnail}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{topic.title}</p>
                  <p className="text-white/40 text-xs">{topic.category}</p>
                </div>
                <span className="text-xs px-2 py-1 glass-purple rounded-full text-brand-accent font-medium">Launch AR →</span>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
