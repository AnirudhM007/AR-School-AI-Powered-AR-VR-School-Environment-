'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Database,
  HelpCircle,
  Info,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const settingsItems = [
  { icon: User, label: 'Account', subtitle: 'Profile, class, connected devices' },
  { icon: Settings, label: 'App Settings', subtitle: 'Notifications, motion, audio' },
  { icon: Sparkles, label: 'AR Preferences', subtitle: 'Placement hints, interaction overlays' },
  { icon: Database, label: 'Data & Storage', subtitle: 'Offline cache and downloaded assets' },
  { icon: HelpCircle, label: 'Help & Support', subtitle: 'Guides, contact, troubleshooting' },
  { icon: Info, label: 'About AR School', subtitle: 'Version 1.0.0 Web Edition' },
];

export default function SettingsPage() {
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
            <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-white/12 text-3xl">🎓</div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">Student Profile</p>
              <p className="text-sm text-white/60">student@arschool.app</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  Class 6
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  412 XP
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                  7 day streak
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5">
        <GlassCard className="divide-y divide-white/5 overflow-hidden" tap={false} hover={false}>
          {settingsItems.map(({ icon: Icon, label, subtitle }) => (
            <button key={label} className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-white/[0.02]">
              <div className="glass-purple grid h-11 w-11 place-items-center rounded-[18px]">
                <Icon size={18} className="text-brand-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-white/45">{subtitle}</p>
              </div>
              <ChevronRight size={16} className="text-white/30" />
            </button>
          ))}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mb-5">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="glass grid h-11 w-11 place-items-center rounded-[18px]">
              <Shield size={18} className="text-brand-cyan" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Privacy and safety</p>
              <p className="text-xs text-white/45">AR sessions stay in-browser and your mock progress remains local for now.</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass flex w-full items-center gap-4 rounded-[28px] px-4 py-4 text-left"
      >
        <div className="grid h-11 w-11 place-items-center rounded-[18px] border border-red-400/30 bg-red-500/10">
          <LogOut size={18} className="text-red-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-300">Logout</p>
          <p className="text-xs text-red-200/60">Return to guest mode</p>
        </div>
      </motion.button>
    </main>
  );
}
