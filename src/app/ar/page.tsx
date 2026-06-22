'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Box, Camera, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { TOPICS } from '@/lib/topics';

export default function ARIndexPage() {
  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="screen-kicker">AR View</p>
        <h1 className="screen-title">Launch a lesson into your room</h1>
        <p className="screen-subtitle mt-3 max-w-lg">
          Choose a model, scan your surroundings, and use the on-screen controls to move, rotate, scale, and inspect it.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5">
        <GlassCard variant="purple" className="p-5" glow>
          <div className="flex items-start gap-4">
            <div className="glass grid h-14 w-14 place-items-center rounded-[22px]">
              <Camera size={22} className="text-brand-accent" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">WebXR ready flow</p>
              <p className="mt-1 text-sm leading-6 text-white/65">
                AR will attempt to start automatically on supported Android devices. If it is unavailable, the app falls back to the 3D viewer without breaking the lesson flow.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="space-y-3">
        {TOPICS.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + index * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
          >
            <Link href={`/ar/${topic.id}`}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`grid h-14 w-14 place-items-center rounded-[22px] bg-gradient-to-br ${topic.color} text-3xl shadow-glow-sm`}>
                    {topic.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-white">{topic.title}</h2>
                    <p className="truncate text-sm text-white/50">{topic.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="glass-outline rounded-full px-3 py-1 text-[11px] font-semibold text-white/70">
                      {topic.category}
                    </div>
                    <div className="glass-purple grid h-10 w-10 place-items-center rounded-full">
                      <Box size={17} className="text-brand-accent" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-6">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-brand-cyan" />
            <p className="text-sm text-white/65">
              Surface detection, reticle placement, floating part labels, and contextual AI help are all available in the current AR lesson flow.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  );
}
