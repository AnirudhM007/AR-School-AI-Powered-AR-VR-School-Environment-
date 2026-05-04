'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Cpu, User, Trophy } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home',    href: '/',        icon: Home },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'AR',      href: '/ar',      icon: Cpu },
  { label: 'Rank',    href: '/leaderboard', icon: Trophy },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="glass-strong mx-3 mb-3 rounded-3xl px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <Link key={href} href={href} className="flex-1">
                <motion.div
                  className="flex flex-col items-center gap-1 py-1 cursor-pointer"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl bg-brand-purple/30"
                        style={{ inset: '-6px -8px' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon
                      size={22}
                      className={
                        isActive
                          ? 'text-brand-accent relative z-10'
                          : 'text-white/40 relative z-10'
                      }
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium tracking-wide ${
                      isActive ? 'text-brand-accent' : 'text-white/40'
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
