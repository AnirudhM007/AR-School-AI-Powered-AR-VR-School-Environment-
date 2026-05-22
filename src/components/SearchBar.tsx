'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { iosGentleSpring, iosSpring } from '@/lib/motion';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (q: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder = 'Search topics...', onSearch, className }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleChange = (v: string) => {
    setValue(v);
    onSearch?.(v);
  };

  return (
    <motion.div
      className={`relative flex items-center glass rounded-[22px] px-4 py-3.5 gap-3 ${
        focused ? 'glow-border' : ''
      } transition-all duration-500 ${className ?? ''}`}
      animate={{ scale: focused ? 1.006 : 1, y: focused ? -0.5 : 0 }}
      transition={iosGentleSpring}
    >
      <Search size={16} className={focused ? 'text-brand-accent' : 'text-white/35'} />
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={iosSpring}
          onClick={() => handleChange('')}
          className="text-white/40 hover:text-white/80"
        >
          <X size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}
