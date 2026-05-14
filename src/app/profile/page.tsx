'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, ChevronRight, Target, Medal, Zap, Lock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { USER_PROFILE, getLevelProgress } from '@/lib/gamification';

const STATS = [
  { label: 'Topics Explored', value: '12', emoji: '🔬' },
  { label: 'AR Sessions', value: '4', emoji: '🥽' },
  { label: 'AI Chats', value: '27', emoji: '🤖' },
];

export default function ProfilePage() {
  const { progress, nextLevelXP } = getLevelProgress(USER_PROFILE.xp, USER_PROFILE.level);

  return (
    <main className="page-shell px-5 pt-12 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <Link href="/settings">
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
          >
            <Settings size={18} className="text-white/60" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Profile Card & XP */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-5">
        <GlassCard variant="purple" className="p-5 relative overflow-hidden" tap={false}>
          <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
          
          <div className="flex gap-4 items-center mb-4">
            <div className="w-20 h-20 rounded-full glass-strong border-2 border-brand-accent flex items-center justify-center text-4xl shadow-glow-sm relative">
              🎓
              <div className="absolute -bottom-2 bg-brand-accent text-brand-purple text-xs font-bold px-2 py-0.5 rounded-full border border-brand-purple">
                Lv.{USER_PROFILE.level}
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">{USER_PROFILE.username}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 glass rounded-full text-brand-accent flex items-center gap-1 font-medium">
                  <Zap size={10} className="fill-brand-accent" /> {USER_PROFILE.xp} XP
                </span>
                <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full font-medium flex items-center gap-1">
                  🔥 {USER_PROFILE.streakDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-white/50 uppercase tracking-wide">
              <span>Progress to Lv.{USER_PROFILE.level + 1}</span>
              <span>{USER_PROFILE.xp} / {nextLevelXP}</span>
            </div>
            <div className="h-2 w-full glass-strong rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-accent to-brand-purple" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 mb-6">
        {STATS.map(s => (
          <GlassCard key={s.label} className="p-3 text-center" tap={false}>
            <div className="text-2xl">{s.emoji}</div>
            <div className="text-white font-bold text-lg mt-1">{s.value}</div>
            <div className="text-white/40 text-[10px] mt-0.5 leading-tight">{s.label}</div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Badges Section */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
        <div className="flex justify-between items-end mb-2 px-1">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">Achievements</p>
          <span className="text-brand-accent text-xs font-medium">See all</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {USER_PROFILE.badges.map(badge => (
            <GlassCard key={badge.id} className={`p-3 min-w-[100px] flex-shrink-0 text-center relative ${!badge.unlockedAt ? 'opacity-50 grayscale' : 'glow-border'}`} tap={false}>
              {!badge.unlockedAt && (
                <div className="absolute top-1.5 right-1.5">
                  <Lock size={12} className="text-white/40" />
                </div>
              )}
              <div className="text-3xl mb-1 drop-shadow-md">{badge.icon}</div>
              <p className="text-white text-xs font-bold leading-tight">{badge.title}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Gamification Links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2 pl-1">Activities</p>
        <GlassCard tap={false} hover={false} className="divide-y divide-white/5">
          {[
            { href: '/quests', label: 'Daily Quests', emoji: <Target size={18} className="text-blue-400" /> },
            { href: '/leaderboard', label: 'Leaderboard', emoji: <Medal size={18} className="text-yellow-400" /> },
          ].map(({ href, label, emoji }) => (
            <Link key={href} href={href}>
              <motion.div whileTap={{ backgroundColor: 'rgba(255,255,255,0.04)' }} className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-8 h-8 glass rounded-xl flex items-center justify-center">{emoji}</div>
                <span className="flex-1 text-white text-sm font-medium">{label}</span>
                <ChevronRight size={16} className="text-white/25" />
              </motion.div>
            </Link>
          ))}
        </GlassCard>
      </motion.div>
    </main>
  );
}
