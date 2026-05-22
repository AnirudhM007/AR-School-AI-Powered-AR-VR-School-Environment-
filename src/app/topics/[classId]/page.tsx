'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SearchBar from '@/components/SearchBar';
import { CATEGORIES, CLASSES, getTopicsByClass } from '@/lib/topics';

export default function TopicsPage() {
  const params = useParams();
  const classId = params?.classId as string;
  const classItem = CLASSES.find((entry) => entry.id === classId);
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');

  const topics = useMemo(() => {
    return getTopicsByClass(classId).filter((topic) => {
      const matchesCategory = activeCategory === 'All' || topic.category === activeCategory;
      const matchesQuery =
        query.trim() === '' ||
        topic.title.toLowerCase().includes(query.toLowerCase()) ||
        topic.relatedTopics.some((entry) => entry.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, classId, query]);

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="screen-header mb-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="glass grid h-11 w-11 place-items-center rounded-[20px]">
                <ArrowLeft size={18} className="text-white/80" />
              </div>
            </Link>
            <div>
              <p className="screen-kicker">{classItem?.label ?? 'Topics'}</p>
              <h1 className="text-2xl font-semibold text-white">{classItem?.description ?? 'Explore immersive lessons'}</h1>
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-br ${classItem?.color ?? 'from-brand-purple to-brand-indigo'} text-2xl shadow-glow-sm`}>
            {classItem?.emoji ?? '📚'}
          </div>
        </div>
        <p className="screen-subtitle">
          Choose a topic, preview it in 3D, then switch into AR when you are ready.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-4">
        <SearchBar placeholder="Search this class..." onSearch={setQuery} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 flex items-center gap-2 overflow-x-auto pb-1"
      >
        <div className="glass flex h-10 min-w-10 items-center justify-center rounded-full">
          <Search size={15} className="text-white/55" />
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

      <div className="grid grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 + index * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
          >
            <Link
              href={{
                pathname: `/viewer/${topic.id}`,
                query: { from: `/topics/${classId}` },
              }}
            >
              <GlassCard className="overflow-hidden">
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${topic.color}`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative text-6xl">{topic.thumbnail}</div>
                </div>
                <div className="p-4">
                  <h2 className="text-base font-semibold text-white">{topic.title}</h2>
                  <p className="mt-1 text-sm text-white/50">{topic.subtitle}</p>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
