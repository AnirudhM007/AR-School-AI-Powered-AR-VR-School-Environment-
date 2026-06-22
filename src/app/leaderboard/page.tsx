'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Medal, Sparkles, Trophy } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAppState } from '@/lib/app-state';
import { LeaderboardEntry } from '@/lib/gamification';

const TABS = ['City', 'Global'] as const;
type Tab = typeof TABS[number];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Global');
  const { leaderboardCity, leaderboardGlobal } = useAppState();

  const data: LeaderboardEntry[] = activeTab === 'Global' ? leaderboardGlobal : leaderboardCity;

  return (
    <main className="page-shell px-5 pt-10">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-glow-sm">
          <Trophy size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="mt-1 text-sm text-white/50">Compare your learning streak with other students</p>
      </motion.div>

      <div className="mb-6 flex gap-2 rounded-2xl p-1 glass">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-semibold ${
                isActive ? 'text-white' : 'text-white/50'
              }`}
            >
              {isActive ? (
                <motion.div
                  layoutId="leaderboard-tab"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-primary shadow-glow-sm"
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                />
              ) : null}
              {tab}
            </button>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-5">
        <GlassCard variant="purple" className="p-4" glow>
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-brand-cyan" />
            <p className="text-sm leading-6 text-white/70">
              Ranking is based on locally tracked XP for now, so your progress updates instantly as you explore, quiz, and learn in AR.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            className="space-y-3"
          >
            {data.map((user, index) => (
              <GlassCard
                key={`${activeTab}-${user.id}`}
                className={`flex items-center gap-4 p-4 ${user.isCurrentUser ? 'glow-border' : ''}`}
                variant={user.isCurrentUser ? 'purple' : 'default'}
                tap={false}
                hover={false}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  index === 0
                    ? 'bg-yellow-500 text-yellow-900'
                    : index === 1
                      ? 'bg-white/70 text-slate-900'
                      : index === 2
                        ? 'bg-amber-700 text-amber-100'
                        : 'glass text-white/55'
                }`}>
                  {index < 3 ? <Medal size={16} /> : `#${index + 1}`}
                </div>

                <div className="text-3xl">{user.avatar}</div>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    {user.username}
                    {user.isCurrentUser ? (
                      <span className="rounded-full bg-brand-accent px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-brand-purple">
                        You
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">Level {user.level}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-brand-accent">{user.xp.toLocaleString()} XP</p>
                  <p className="text-[10px] text-white/38">Score</p>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
