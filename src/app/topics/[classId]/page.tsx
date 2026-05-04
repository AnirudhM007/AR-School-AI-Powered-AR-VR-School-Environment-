'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SearchBar from '@/components/SearchBar';
import { CLASSES, TOPICS, CATEGORIES, getTopicsByClass, getTopicsByCategory } from '@/lib/topics';
import { TopicCard } from '@/lib/types';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function TopicsPage() {
  const params = useParams();
  const classId = params?.classId as string;
  const classItem = CLASSES.find(c => c.id === classId);

  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');

  let topics: TopicCard[] = classId
    ? getTopicsByClass(classId)
    : TOPICS;

  if (activeCategory !== 'All') {
    topics = topics.filter(t => t.category === activeCategory);
  }
  if (query) {
    topics = topics.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
  }

  return (
    <main className="page-shell px-5 pt-12 pb-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <Link href="/">
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">
            {classItem ? classItem.label : 'All Topics'} ▾
          </h1>
          <p className="text-white/40 text-xs">{topics.length} topics available</p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} className="w-10 h-10 glass rounded-2xl flex items-center justify-center">
          <Search size={16} className="text-white/60" />
        </motion.button>
      </motion.div>

      {/* ── Search ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
        <SearchBar placeholder="Search topics..." onSearch={setQuery} />
      </motion.div>

      {/* ── Category tabs ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide"
      >
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-glow-sm'
                : 'glass text-white/50 hover:text-white/80'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Topic Grid ── */}
      <AnimatePresence mode="wait">
        {topics.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-white/30"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p>No topics found</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory + query}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4"
          >
            {topics.map(topic => (
              <motion.div key={topic.id} variants={itemVariants}>
                <Link href={`/viewer/${topic.id}`}>
                  <GlassCard className="overflow-hidden cursor-pointer" tap>
                    {/* Thumbnail */}
                    <div
                      className={`h-32 bg-gradient-to-br ${topic.color} flex items-center justify-center text-5xl relative`}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="relative z-10 drop-shadow-lg">{topic.thumbnail}</span>
                    </div>
                    {/* Label */}
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm">{topic.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{topic.category}</p>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
