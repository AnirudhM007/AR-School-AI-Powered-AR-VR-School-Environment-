'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface FloatingButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode;
  icon?: ReactNode;
  label?: string;
  variant?: 'primary' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

export default function FloatingButton({
  children,
  icon,
  label,
  variant = 'glass',
  size = 'md',
  active = false,
  className,
  ...props
}: FloatingButtonProps) {
  const base = clsx(
    'flex flex-col items-center justify-center gap-1 cursor-pointer select-none outline-none',
    'rounded-2xl transition-colors duration-200',
    {
      // sizes
      'w-10 h-10 text-xs': size === 'sm',
      'w-14 h-14 text-xs': size === 'md',
      'w-16 h-16 text-sm': size === 'lg',
      // variants
      'bg-gradient-to-br from-brand-purple to-brand-indigo text-white shadow-glow-sm':
        variant === 'primary',
      'glass text-white/80 hover:text-white': variant === 'glass' && !active,
      'glass-purple text-brand-accent': variant === 'glass' && active,
      'bg-red-500/20 border border-red-500/30 text-red-400': variant === 'danger',
    },
    className
  );

  return (
    <motion.button
      className={base}
      whileHover={{ scale: 1.08, y: -1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      {...props}
    >
      {icon && <span className="text-lg leading-none">{icon}</span>}
      {children}
      {label && <span className="text-[9px] font-semibold tracking-wide leading-none">{label}</span>}
    </motion.button>
  );
}
