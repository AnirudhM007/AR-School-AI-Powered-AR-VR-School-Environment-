'use client';

import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';
import { iosGentleSpring } from '@/lib/motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'purple';
  hover?: boolean;
  tap?: boolean;
  glow?: boolean;
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  hover = true,
  tap = true,
  glow = false,
  ...props
}: GlassCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setCanHover(mediaQuery.matches);
    apply();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', apply);
      return () => mediaQuery.removeEventListener('change', apply);
    }

    mediaQuery.addListener(apply);
    return () => mediaQuery.removeListener(apply);
  }, []);

  const base = clsx(
    'rounded-[28px] overflow-hidden relative',
    {
      'glass': variant === 'default',
      'glass-strong': variant === 'strong',
      'glass-purple': variant === 'purple',
      'shadow-glass': true,
      'glow-border': glow,
    },
    className
  );

  return (
    <motion.div
      className={base}
      whileHover={
        hover && canHover && !prefersReducedMotion ? { scale: 1.01, y: -2 } : undefined
      }
      whileTap={tap && !prefersReducedMotion ? { scale: 0.992 } : undefined}
      transition={iosGentleSpring}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-80" />
      {children}
    </motion.div>
  );
}
