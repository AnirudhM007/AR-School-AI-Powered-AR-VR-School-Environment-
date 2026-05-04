'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Target, Trophy, Flame } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { DAILY_QUESTS } from '@/lib/gamification';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function QuestsPage() {
  return (
    <main className="page-shell px-5 pt-12 pb-6">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <Link href="/profile">
          <motion.div whileTap={{ scale: 0.85 }} className="w-10 h-10 glass rounded-2xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </Link>
        <h1 className="text-2xl font-bold text-white">Daily Quests</h1>
      </motion.div>

      {/* Streak Header */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <GlassCard variant="purple" className="p-4 flex items-center gap-4" tap={false} glow>
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
            <Flame size={24} className="text-orange-500 fill-orange-500" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">3 Day Streak!</p>
            <p className="text-white/60 text-xs">Complete 1 more quest today to maintain it.</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quests List */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest pl-1">Today's Goals</p>
        {DAILY_QUESTS.map(quest => (
          <motion.div key={quest.id} variants={itemVariants}>
            <GlassCard className="p-4" tap={false}>
              <div className="flex gap-4">
                <div className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center">
                  {quest.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">{quest.title}</h3>
                  <p className="text-white/50 text-xs mt-0.5 mb-2">{quest.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 glass-strong rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${quest.completed ? 'bg-green-400' : 'bg-brand-accent'}`} 
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white/70">{quest.progress}/{quest.total}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-brand-accent text-xs font-bold">+{quest.rewardXP} XP</span>
                {quest.completed ? (
                  <span className="text-green-400 text-xs font-bold px-2 py-1 bg-green-400/10 rounded-md">Claimed</span>
                ) : (
                  <span className="text-white/40 text-xs">In Progress</span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
