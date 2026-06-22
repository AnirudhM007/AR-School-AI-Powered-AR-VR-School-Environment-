'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Cpu, Home, User } from 'lucide-react';
import { iosGentleSpring, iosSpring } from '@/lib/motion';

const NAV_ITEMS = [
  { label: 'Home',    href: '/',        icon: Home },
  { label: 'Library', href: '/library', icon: BookOpen },
  { label: 'Quiz',    href: '/quiz',    icon: Brain },
  { label: 'AR',      href: '/ar',      icon: Cpu },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const shouldHide = ['/viewer/', '/ar/', '/ai', '/quiz/'].some((segment) => pathname.startsWith(segment));

  if (shouldHide) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <div className="mx-3 mb-3 rounded-[30px] glass-strong px-2 py-2.5">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <Link key={href} href={href} className="flex-1">
                <motion.div
                  className="flex flex-col items-center gap-1 py-1 cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  transition={iosSpring}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-purple/35 to-brand-cyan/15"
                        style={{ inset: '-7px -10px' }}
                        transition={iosGentleSpring}
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
