'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, Search, Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import GlassCard from '@/components/GlassCard';
import { CLASSES, TOPICS } from '@/lib/topics';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24 },
  },
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const filteredClasses = CLASSES.filter((item) =>
    query === '' ? true : item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const featuredTopic = TOPICS[0];
  const spotlightTopics = TOPICS.slice(1, 4);

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="screen-header mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.92 }} className="glass h-11 w-11 rounded-[20px] grid place-items-center">
            <Menu size={18} className="text-white/80" />
          </motion.button>
          <div>
            <p className="screen-kicker">AR School</p>
            <h1 className="screen-title text-gradient">Hello, Student!</h1>
          </div>
        </div>
        <div className="glass-purple flex h-11 w-11 items-center justify-center rounded-[20px] text-lg">
          🧑🏽
        </div>
      </motion.section>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="screen-subtitle mb-5 max-w-sm"
      >
        Pick a class, open a 3D lesson, and jump into a smooth AR learning flow with instant explanations.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-6">
        <SearchBar
          placeholder="Search classes, topics, or concepts..."
          onSearch={setQuery}
          className="w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mb-6"
      >
        <Link href={`/viewer/${featuredTopic.id}`}>
          <GlassCard variant="purple" className="overflow-hidden p-5" glow>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/10 to-transparent" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="max-w-[70%]">
                <p className="screen-kicker text-white/70">{featuredTopic.heroLabel}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{featuredTopic.title}</h2>
                <p className="mt-2 text-sm text-white/70">{featuredTopic.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredTopic.stats.map((stat) => (
                    <span
                      key={stat}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/12 bg-white/10 text-6xl shadow-glow-sm">
                {featuredTopic.thumbnail}
              </div>
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }} className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Explore by Class</h2>
            <p className="text-sm text-white/45">Choose a grade to open curated topics.</p>
          </div>
          <Link href="/library" className="text-sm font-semibold text-brand-accent">
            See all
          </Link>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-3 gap-3">
          {filteredClasses.map((cls) => (
            <motion.div key={cls.id} variants={itemVariants}>
              <Link href={`/topics/${cls.id}`}>
                <GlassCard className="p-3.5">
                  <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${cls.color} text-2xl shadow-glow-sm`}>
                    {cls.emoji}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{cls.label}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-white/45">{cls.description}</p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-brand-cyan" />
          <h2 className="text-lg font-semibold text-white">Trending Lessons</h2>
        </div>
        <div className="space-y-3">
          {spotlightTopics.map((topic) => (
            <Link href={`/viewer/${topic.id}`} key={topic.id}>
              <GlassCard className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${topic.color} text-3xl shadow-glow-sm`}>
                    {topic.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white">{topic.title}</h3>
                    <p className="truncate text-sm text-white/50">{topic.subtitle}</p>
                  </div>
                  <div className="glass-outline rounded-full px-3 py-1 text-[11px] font-semibold text-white/70">
                    {topic.category}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
