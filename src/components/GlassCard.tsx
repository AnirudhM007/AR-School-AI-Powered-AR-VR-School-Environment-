'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import clsx from 'clsx';

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
    'rounded-3xl overflow-hidden',
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
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={tap ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
