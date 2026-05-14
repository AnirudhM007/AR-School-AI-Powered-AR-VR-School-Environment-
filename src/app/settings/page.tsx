'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Settings,
  Cpu,
  Database,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: User,      label: 'Account',       subtitle: 'student@arschool.app', chevron: true },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Settings,  label: 'App Settings',  subtitle: 'Theme, notifications', chevron: true },
      { icon: Cpu,       label: 'AR Preferences', subtitle: 'Placement, quality',   chevron: true },
    ],
  },
  {
    title: 'Data',
    items: [
      { icon: Database,  label: 'Data & Storage', subtitle: 'Clear cache, manage', chevron: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQs, contact us',  chevron: true },
      { icon: Info,        label: 'About AR School', subtitle: 'v1.0.0 · Web Edition', chevron: false },
    ],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
};

export default function SettingsPage() {
  return (
    <main className="page-shell px-5 pt-12 pb-24">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Link href="/">
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 glass rounded-2xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.div>
        </Link>
        <h1 className="text-white font-bold text-xl">Settings</h1>
      </motion.div>

      {/* ── Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard variant="purple" className="p-4 flex items-center gap-4" tap={false}>
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-indigo flex items-center justify-center text-2xl shadow-glow-sm">
            🎓
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base">Student Name</p>
            <p className="text-white/50 text-xs">student@arschool.app</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 glass-purple rounded-full text-brand-accent">Free Plan</span>
              <span className="text-[10px] px-2 py-0.5 glass rounded-full text-white/50">Class 6</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/30" />
        </GlassCard>
      </motion.div>

      {/* ── Settings List ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {SETTINGS_SECTIONS.map(section => (
          <motion.div key={section.title} variants={itemVariants}>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-2 pl-1">
              {section.title}
            </p>
            <GlassCard tap={false} hover={false} className="divide-y divide-white/5 overflow-hidden">
              {section.items.map(({ icon: Icon, label, subtitle, chevron }, i) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.98, backgroundColor: 'rgba(255,255,255,0.04)' }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 text-left"
                >
                  <div className="w-9 h-9 glass-purple rounded-xl flex items-center justify-center">
                    <Icon size={17} className="text-brand-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
                  </div>
                  {chevron && <ChevronRight size={16} className="text-white/25" />}
                </motion.button>
              ))}
            </GlassCard>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div variants={itemVariants}>
          <GlassCard tap hover className="overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-4 px-4 py-3.5"
            >
              <div className="w-9 h-9 bg-red-500/15 border border-red-500/25 rounded-xl flex items-center justify-center">
                <LogOut size={17} className="text-red-400" />
              </div>
              <span className="text-red-400 text-sm font-semibold">Logout</span>
            </motion.button>
          </GlassCard>
        </motion.div>
      </motion.div>
    </main>
  );
}
