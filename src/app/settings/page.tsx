'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Database, HelpCircle, Info, Settings, Shield, Sparkles, User } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { useAppState } from '@/lib/app-state';

export default function SettingsPage() {
  const { preferences, profile, resetProgress, updatePreferences } = useAppState();

  return (
    <main className="page-shell px-5 pt-10">
      <motion.section initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="screen-header mb-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="glass grid h-11 w-11 place-items-center rounded-[20px]">
                <ArrowLeft size={18} className="text-white/80" />
              </div>
            </Link>
            <div>
              <p className="screen-kicker">Settings</p>
              <h1 className="screen-title">Tune your learning space</h1>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mb-6">
        <GlassCard variant="purple" className="p-5" glow>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-white/12 text-3xl">{profile.avatar}</div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">{profile.name}</p>
              <p className="text-sm text-white/60">{profile.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Class {profile.classId}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  {profile.xp} XP
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  {profile.streakDays} day streak
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <GlassCard className="overflow-hidden p-4" tap={false} hover={false}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Experience</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-[22px] glass px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Audio prompts</p>
                <p className="text-xs text-white/45">Keep narration and button feedback ready.</p>
              </div>
              <button
                type="button"
                onClick={() => updatePreferences({ audioEnabled: !preferences.audioEnabled })}
                className={`relative h-8 w-14 rounded-full transition ${preferences.audioEnabled ? 'bg-gradient-primary' : 'bg-white/12'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${preferences.audioEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="rounded-[22px] glass px-4 py-3">
              <p className="text-sm font-semibold text-white">Motion profile</p>
              <p className="mb-3 text-xs text-white/45">Choose how lush or minimal the glass animations should feel.</p>
              <div className="grid grid-cols-3 gap-2">
                {(['smooth', 'balanced', 'reduced'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updatePreferences({ motionMode: mode })}
                    className={`rounded-[16px] px-3 py-2 text-xs font-semibold capitalize ${
                      preferences.motionMode === mode ? 'glass-purple text-brand-accent' : 'glass text-white/58'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[22px] glass px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Placement hints</p>
                <p className="text-xs text-white/45">Show learning and AR helper copy by default.</p>
              </div>
              <button
                type="button"
                onClick={() => updatePreferences({ hintsEnabled: !preferences.hintsEnabled })}
                className={`relative h-8 w-14 rounded-full transition ${preferences.hintsEnabled ? 'bg-gradient-primary' : 'bg-white/12'}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${preferences.hintsEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mb-5">
        <GlassCard className="divide-y divide-white/5 overflow-hidden" tap={false} hover={false}>
          {[
            { icon: User, label: 'Account', subtitle: 'Local profile and class identity' },
            { icon: Settings, label: 'App Settings', subtitle: 'Navigation, UI pace, install prompt' },
            { icon: Sparkles, label: 'AR Preferences', subtitle: 'Tracking, labels, and overlay habits' },
            { icon: Database, label: 'Data & Storage', subtitle: 'Everything stays local on this device' },
            { icon: HelpCircle, label: 'Help & Support', subtitle: 'Use the AI helper and guided flows' },
            { icon: Info, label: 'About AR School', subtitle: 'Final local-first web app build' },
          ].map(({ icon: Icon, label, subtitle }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-4">
              <div className="glass-purple grid h-11 w-11 place-items-center rounded-[18px]">
                <Icon size={18} className="text-brand-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-white/45">{subtitle}</p>
              </div>
              <ChevronRight size={16} className="text-white/30" />
            </div>
          ))}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-5">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="glass grid h-11 w-11 place-items-center rounded-[18px]">
              <Shield size={18} className="text-brand-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Privacy and safety</p>
              <p className="text-xs text-white/45">No backend account is required. Your progress, favorites, and quiz data stay in local storage for now.</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        onClick={resetProgress}
        className="glass flex w-full items-center gap-4 rounded-[28px] px-4 py-4 text-left"
      >
        <div className="grid h-11 w-11 place-items-center rounded-[18px] border border-red-400/30 bg-red-500/10">
          <Database size={18} className="text-red-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-300">Reset local progress</p>
          <p className="text-xs text-red-200/60">Clear XP, quiz results, favorites, and stored learning progress on this device.</p>
        </div>
      </motion.button>
    </main>
  );
}
