'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, User } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import GlassCard from '@/components/GlassCard';
import { CLASSES } from '@/lib/topics';
import { useState } from 'react';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function HomePage() {
  const [query, setQuery] = useState('');

  const filtered = CLASSES.filter(c =>
    query === '' || c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="page-shell px-5 pt-12 pb-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hello, Student <span className="animate-float inline-block">👋</span>
          </h1>
          <p className="text-white/50 text-sm mt-0.5">What do you want to learn today?</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center relative"
          >
            <Bell size={18} className="text-white/70" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-accent" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 bg-gradient-to-br from-brand-purple to-brand-indigo rounded-2xl flex items-center justify-center"
          >
            <User size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Search ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <SearchBar
          placeholder="Search topics..."
          onSearch={setQuery}
          className="w-full"
        />
      </motion.div>

      {/* ── Featured Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Link href="/topics/6">
          <GlassCard variant="purple" className="p-5 relative overflow-hidden cursor-pointer" glow>
            {/* Glow blob */}
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-brand-purple/20 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="text-5xl">🔬</div>
              <div>
                <span className="text-xs text-brand-accent font-semibold tracking-widest uppercase">Featured</span>
                <h2 className="text-white font-bold text-lg mt-0.5">Class 6 Science</h2>
                <p className="text-white/50 text-xs mt-1">Heart, Circuits & More →</p>
              </div>
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      {/* ── Class Grid ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-white font-semibold text-base mb-3">Explore by Class</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {filtered.map(cls => (
            <motion.div key={cls.id} variants={itemVariants}>
              <Link href={`/topics/${cls.id}`}>
                <GlassCard className="p-4 flex flex-col items-center gap-2 cursor-pointer" tap>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cls.color} flex items-center justify-center text-2xl shadow-glow-sm`}
                  >
                    {cls.emoji}
                  </div>
                  <span className="text-white/80 text-xs font-medium text-center">{cls.label}</span>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
