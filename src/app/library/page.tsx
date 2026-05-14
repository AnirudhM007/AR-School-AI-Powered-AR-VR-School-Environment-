'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, Filter } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SearchBar from '@/components/SearchBar';
import { CATEGORIES, TOPICS } from '@/lib/topics';

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
};

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      const matchesCategory = activeCategory === 'All' || topic.category === activeCategory;
      const matchesQuery =
        query.trim() === '' ||
        topic.title.toLowerCase().includes(query.toLowerCase()) ||
        topic.relatedTopics.some((entry) => entry.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="screen-header mb-3">
          <div>
            <p className="screen-kicker">Topic Selection</p>
            <h1 className="screen-title">Discover 3D lessons</h1>
          </div>
          <div className="glass h-11 w-11 rounded-[20px] grid place-items-center">
            <Compass size={18} className="text-white/80" />
          </div>
        </div>
        <p className="screen-subtitle">
          Browse every available learning model, then open the viewer or jump directly into AR.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-4">
        <SearchBar placeholder="Search models, organs, planets..." onSearch={setQuery} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mb-5 flex items-center gap-2 overflow-x-auto pb-1"
      >
        <div className="glass flex h-10 min-w-10 items-center justify-center rounded-full">
          <Filter size={16} className="text-white/65" />
        </div>
        {CATEGORIES.filter((category) => category !== 'Vehicles').map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category
                ? 'bg-gradient-primary text-white shadow-glow-sm'
                : 'glass text-white/55'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      <motion.div initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <motion.div key={topic.id} variants={itemVariants}>
            <Link href={`/viewer/${topic.id}`}>
              <GlassCard className="overflow-hidden">
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${topic.color}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_45%)]" />
                  <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                    {topic.category}
                  </div>
                  <div className="relative text-6xl drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)]">{topic.thumbnail}</div>
                </div>
                <div className="p-4">
                  <h2 className="text-base font-semibold text-white">{topic.title}</h2>
                  <p className="mt-1 text-sm text-white/50">{topic.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topic.stats.slice(0, 2).map((stat) => (
                      <span key={stat} className="glass-outline rounded-full px-2.5 py-1 text-[11px] font-semibold text-white/70">
                        {stat}
                      </span>
                    ))}
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
