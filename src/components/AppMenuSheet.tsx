'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  ChevronRight,
  Cpu,
  Home,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { useAppState } from '@/lib/app-state';

const MENU_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/library', label: 'Library', icon: BookOpen },
  { href: '/ar', label: 'AR Lessons', icon: Cpu },
  { href: '/quiz', label: 'Quiz Center', icon: Sparkles },
  { href: '/quests', label: 'Daily Quests', icon: Target },
  { href: '/achievements', label: 'Achievements', icon: Award },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface AppMenuSheetProps {
  onClose: () => void;
  onOpenAuth: () => void;
  open: boolean;
}

export default function AppMenuSheet({
  onClose,
  onOpenAuth,
  open,
}: AppMenuSheetProps) {
  const { profile, quests, signOut, stats } = useAppState();
  const completedQuests = quests.filter((quest) => quest.completed).length;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] bg-black/45"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: -360 }}
            animate={{ x: 0 }}
            exit={{ x: -360 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="glass-strong h-full w-[min(86vw,360px)] rounded-r-[36px] border-l-0 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="screen-kicker">AR School</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Control Center</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-fast grid h-10 w-10 place-items-center rounded-[18px]"
              >
                <X size={16} className="text-white/72" />
              </button>
            </div>

            <div className="glass-purple mb-5 rounded-[28px] p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-[20px] bg-white/12 text-3xl">
                  {profile.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-white">{profile.name}</p>
                  <p className="truncate text-sm text-white/56">
                    {profile.isSignedIn ? profile.email : 'Guest mode'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="glass rounded-[18px] px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-white">{profile.level}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Level</p>
                </div>
                <div className="glass rounded-[18px] px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-white">{stats.topicsExplored}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Topics</p>
                </div>
                <div className="glass rounded-[18px] px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-white">{completedQuests}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">Quests</p>
                </div>
              </div>

              <button
                type="button"
                onClick={profile.isSignedIn ? signOut : onOpenAuth}
                className="mt-4 w-full rounded-full bg-white/12 px-4 py-3 text-sm font-semibold text-white"
              >
                {profile.isSignedIn ? 'Switch to Guest Mode' : 'Sign In Locally'}
              </button>
            </div>

            <div className="space-y-2">
              {MENU_ITEMS.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={onClose}>
                  <div className="glass flex items-center gap-3 rounded-[22px] px-4 py-3">
                    <div className="glass-fast grid h-10 w-10 place-items-center rounded-[16px]">
                      <Icon size={18} className="text-brand-accent" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-white">{label}</span>
                    <ChevronRight size={16} className="text-white/28" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
