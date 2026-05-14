'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { TOPICS } from '@/lib/topics';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function LibraryPage() {
  return (
    <main className="page-shell px-5 pt-12 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Library</h1>
          <p className="text-white/40 text-sm mt-0.5">{TOPICS.length} 3D models available</p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} className="w-10 h-10 glass rounded-2xl flex items-center justify-center">
          <Search size={18} className="text-white/60" />
        </motion.button>
      </motion.div>

      {/* All Topics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {TOPICS.map(topic => (
          <motion.div key={topic.id} variants={itemVariants}>
            <Link href={`/viewer/${topic.id}`}>
              <GlassCard className="overflow-hidden cursor-pointer">
                <div className={`h-28 bg-gradient-to-br ${topic.color} flex items-center justify-center text-4xl relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative z-10">{topic.thumbnail}</span>
                </div>
                <div className="p-3">
                  <p className="text-white font-semibold text-sm">{topic.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/40 text-xs">{topic.category}</span>
                    <span className="text-xs px-2 py-0.5 glass-purple rounded-full text-brand-accent">3D</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
