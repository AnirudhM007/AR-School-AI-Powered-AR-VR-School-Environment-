'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Flame } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAppState } from '@/lib/app-state';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function QuestsPage() {
  const { profile, quests } = useAppState();

  return (
    <main className="page-shell px-5 pb-24 pt-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
        <Link href="/profile">
          <motion.div whileTap={{ scale: 0.85 }} className="glass flex h-10 w-10 items-center justify-center rounded-2xl">
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </Link>
        <h1 className="text-2xl font-bold text-white">Daily Quests</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <GlassCard variant="purple" className="flex items-center gap-4 p-4" tap={false} glow>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
            <Flame size={24} className="fill-orange-500 text-orange-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{profile.streakDays} day streak</p>
            <p className="text-xs text-white/60">Keep learning today to grow the streak and unlock badge progress.</p>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
        <p className="pl-1 text-xs font-semibold uppercase tracking-widest text-white/30">Today&apos;s goals</p>
        {quests.map((quest) => (
          <motion.div key={quest.id} variants={itemVariants}>
            <GlassCard className="p-4" tap={false} hover={false}>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-3xl">
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{quest.title}</h3>
                  <p className="mb-2 mt-0.5 text-xs text-white/50">{quest.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="glass-strong h-1.5 flex-1 overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${quest.completed ? 'bg-green-400' : 'bg-brand-accent'}`}
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white/70">
                      {quest.progress}/{quest.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs font-bold text-brand-accent">+{quest.rewardXP} XP</span>
                {quest.completed ? (
                  <span className="rounded-md bg-green-400/10 px-2 py-1 text-xs font-bold text-green-400">Complete</span>
                ) : (
                  <span className="text-xs text-white/40">In progress</span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
