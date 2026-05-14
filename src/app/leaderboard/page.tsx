'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { LEADERBOARD_CITY, LEADERBOARD_GLOBAL, LeaderboardEntry } from '@/lib/gamification';

const TABS = ['City', 'Country', 'Global'] as const;
type Tab = typeof TABS[number];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Global');

  const data: LeaderboardEntry[] = activeTab === 'Global' ? LEADERBOARD_GLOBAL : activeTab === 'City' ? LEADERBOARD_CITY : LEADERBOARD_CITY;

  return (
    <main className="page-shell px-5 pt-12 pb-24">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-glow-sm mb-3">
          <Trophy size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-white/50 text-sm mt-1">See how you rank among other students</p>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 p-1 glass rounded-2xl mb-6 relative">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl relative z-10 transition-colors ${
                isActive ? 'text-white' : 'text-white/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="leaderboard-tab"
                  className="absolute inset-0 bg-brand-purple rounded-xl -z-10 shadow-glow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── List ── */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {data.map((user, index) => (
              <GlassCard
                key={user.id}
                className={`p-4 flex items-center gap-4 ${user.isCurrentUser ? 'glow-border' : ''}`}
                variant={user.isCurrentUser ? 'purple' : 'default'}
                tap={false}
              >
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-800' :
                  index === 2 ? 'bg-amber-700 text-amber-100' :
                  'glass text-white/50'
                }`}>
                  {index < 3 ? <Medal size={16} /> : `#${index + 1}`}
                </div>

                {/* Avatar */}
                <div className="text-3xl">{user.avatar}</div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-white font-bold text-sm flex items-center gap-2">
                    {user.username}
                    {user.isCurrentUser && <span className="text-[9px] px-1.5 py-0.5 bg-brand-accent text-brand-purple rounded-full uppercase tracking-wider">You</span>}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">Level {user.level}</p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-brand-accent font-bold text-sm flex items-center gap-1 justify-end">
                    {user.xp.toLocaleString()} <Star size={12} className="fill-brand-accent" />
                  </p>
                  <p className="text-white/40 text-[10px]">XP</p>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
