'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
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
      whileHover={hover ? { scale: 1.012, y: -2 } : undefined}
      whileTap={tap ? { scale: 0.988 } : undefined}
      transition={iosGentleSpring}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-80" />
      {children}
    </motion.div>
  );
}
