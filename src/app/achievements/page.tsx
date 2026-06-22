'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Award, Lock, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAppState } from '@/lib/app-state';

export default function AchievementsPage() {
  const { badges } = useAppState();
  const unlockedCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="screen-header mb-3">
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <div className="glass grid h-11 w-11 place-items-center rounded-[20px]">
                <ArrowLeft size={18} className="text-white/80" />
              </div>
            </Link>
            <div>
              <p className="screen-kicker">Achievements</p>
              <h1 className="screen-title">Badge collection</h1>
            </div>
          </div>
        </div>
        <p className="screen-subtitle">
          You have unlocked {unlockedCount} out of {badges.length} milestones so far.
        </p>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-5">
        <GlassCard variant="purple" className="p-5" glow>
          <div className="flex items-center gap-4">
            <div className="glass grid h-14 w-14 place-items-center rounded-[22px]">
              <Award size={22} className="text-brand-accent" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Learn, place, quiz, and ask</p>
              <p className="mt-1 text-sm leading-6 text-white/65">
                Each badge reflects a different kind of learning behavior so the app feels rewarding beyond just XP.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 + index * 0.04, type: 'spring', stiffness: 220, damping: 24 }}
          >
            <GlassCard
              variant={badge.unlocked ? 'purple' : 'default'}
              className={`p-4 ${badge.unlocked ? 'glow-border' : 'opacity-70'}`}
              glow={badge.unlocked}
              tap={false}
              hover={false}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-white/10 text-3xl">
                  {badge.icon}
                </div>
                {badge.unlocked ? (
                  <Sparkles size={16} className="text-brand-cyan" />
                ) : (
                  <Lock size={16} className="text-white/32" />
                )}
              </div>
              <h2 className="text-base font-semibold text-white">{badge.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/58">{badge.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
