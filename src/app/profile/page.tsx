'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, ChevronRight, LogIn, Settings, Target, Trophy, Zap } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import GlassCard from '@/components/GlassCard';
import { useAppState } from '@/lib/app-state';
import { getLevelProgress } from '@/lib/gamification';
import { useState } from 'react';

export default function ProfilePage() {
  const [showAuth, setShowAuth] = useState(false);
  const { badges, isHydrated, profile, quests, recentTopics, signIn, signOut, stats } = useAppState();
  const { progress, nextLevelXP } = getLevelProgress(profile.xp, profile.level);

  if (!isHydrated) {
    return (
      <main className="page-shell px-5 pb-24 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>
        <GlassCard variant="strong" className="p-6" tap={false} hover={false}>
          <p className="text-base font-semibold text-white">Loading your saved profile...</p>
          <p className="mt-2 text-sm text-white/55">
            Restoring XP, streaks, quizzes, badges, and recent lessons on this device.
          </p>
        </GlassCard>
      </main>
    );
  }

  return (
    <>
      <main className="page-shell px-5 pb-24 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <Link href="/settings">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="glass flex h-10 w-10 items-center justify-center rounded-2xl"
            >
              <Settings size={18} className="text-white/60" />
            </motion.div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mb-5">
          <GlassCard variant="purple" className="relative overflow-hidden p-5" tap={false} glow>
            <div className="absolute inset-0 pointer-events-none bg-gradient-glow opacity-50" />
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand-accent text-4xl glass-strong shadow-glow-sm">
                {profile.avatar}
                <div className="absolute -bottom-2 rounded-full border border-brand-purple bg-brand-accent px-2 py-0.5 text-xs font-bold text-brand-purple">
                  Lv.{profile.level}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="glass rounded-full px-2 py-0.5 text-xs font-medium text-brand-accent">
                    Class {profile.classId}
                  </span>
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-300">
                    🔥 {profile.streakDays} day streak
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  {profile.isSignedIn ? profile.email : 'Guest profile on this device'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wide text-white/50">
                <span>Progress to Lv.{profile.level + 1}</span>
                <span>{profile.xp} / {nextLevelXP}</span>
              </div>
              <div className="glass-strong h-2 w-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-accent to-brand-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Topics', value: stats.topicsExplored, icon: '🔬' },
            { label: 'AR', value: stats.arSessions, icon: '🥽' },
            { label: 'AI Chats', value: stats.aiChats, icon: '🤖' },
          ].map((item) => (
            <GlassCard key={item.label} className="p-3 text-center" tap={false}>
              <div className="text-2xl">{item.icon}</div>
              <div className="mt-1 text-lg font-bold text-white">{item.value}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-white/40">{item.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
          <div className="mb-2 flex items-end justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Achievements</p>
            <Link href="/achievements" className="text-xs font-medium text-brand-accent">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.slice(0, 5).map((badge) => (
              <GlassCard
                key={badge.id}
                className={`min-w-[116px] flex-shrink-0 p-3 text-center ${badge.unlocked ? 'glow-border' : 'opacity-50 grayscale'}`}
                tap={false}
                hover={false}
              >
                <div className="mb-1 text-3xl">{badge.icon}</div>
                <p className="text-xs font-bold leading-tight text-white">{badge.title}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <p className="mb-2 pl-1 text-xs font-semibold uppercase tracking-widest text-white/30">Activities</p>
          <GlassCard tap={false} hover={false} className="divide-y divide-white/5">
            {[
              { href: '/quests', label: 'Daily Quests', icon: Target, meta: `${quests.filter((quest) => quest.completed).length}/${quests.length} done` },
              { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, meta: `${profile.xp} XP` },
              { href: '/quiz', label: 'Quiz Center', icon: Zap, meta: `${stats.quizzesCompleted} attempted` },
              { href: '/achievements', label: 'Achievements', icon: Award, meta: `${badges.filter((badge) => badge.unlocked).length} unlocked` },
            ].map(({ href, icon: Icon, label, meta }) => (
              <Link key={href} href={href}>
                <motion.div whileTap={{ backgroundColor: 'rgba(255,255,255,0.04)' }} className="flex items-center gap-4 px-4 py-3.5">
                  <div className="glass flex h-8 w-8 items-center justify-center rounded-xl">
                    <Icon size={16} className="text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-white">{label}</span>
                    <span className="text-xs text-white/40">{meta}</span>
                  </div>
                  <ChevronRight size={16} className="text-white/25" />
                </motion.div>
              </Link>
            ))}
          </GlassCard>
        </motion.div>

        {recentTopics.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="mb-6">
            <p className="mb-2 pl-1 text-xs font-semibold uppercase tracking-widest text-white/30">Recently Learned</p>
            <div className="space-y-3">
              {recentTopics.slice(0, 2).map((topic) => (
                <Link key={topic.id} href={{ pathname: `/viewer/${topic.id}`, query: { from: '/profile' } }}>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`grid h-14 w-14 place-items-center rounded-[20px] bg-gradient-to-br ${topic.color} text-3xl shadow-glow-sm`}>
                        {topic.thumbnail}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-white">{topic.title}</h3>
                        <p className="truncate text-sm text-white/50">{topic.subtitle}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={profile.isSignedIn ? signOut : () => setShowAuth(true)}
          className="glass flex w-full items-center gap-4 rounded-[28px] px-4 py-4 text-left"
        >
          <div className="grid h-11 w-11 place-items-center rounded-[18px] border border-white/12 bg-white/5">
            <LogIn size={18} className="text-red-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {profile.isSignedIn ? 'Switch to guest mode' : 'Create local student profile'}
            </p>
            <p className="text-xs text-white/45">
              {profile.isSignedIn ? 'Keep the app usable without your saved profile details.' : 'Save XP, quizzes, badges, favorites, and streaks.'}
            </p>
          </div>
        </motion.button>
      </main>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSubmit={signIn} />
    </>
  );
}
