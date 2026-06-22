'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const AVATARS = ['🧠', '🎓', '🚀', '🔬', '🫀', '🪐'];
const CLASS_OPTIONS = ['5', '6', '7', '8', '9', '10'];

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    avatar: string;
    classId: string;
    email: string;
    name: string;
  }) => void;
}

export default function AuthModal({ open, onClose, onSubmit }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classId, setClassId] = useState('6');
  const [avatar, setAvatar] = useState('🧠');

  const disabled = useMemo(
    () => name.trim().length < 2 || !email.includes('@'),
    [email, name],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end bg-black/55 px-4 pb-5 md:items-center md:justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 220, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 220, opacity: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="glass-strong w-full max-w-md rounded-[32px] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="screen-kicker">Student Login</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Save your progress locally</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Create a lightweight profile for quizzes, badges, streaks, and favorites.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="glass-fast grid h-10 w-10 place-items-center rounded-[18px]"
              >
                <X size={16} className="text-white/72" />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Choose avatar</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`grid h-12 w-12 place-items-center rounded-[18px] text-2xl ${
                      avatar === item ? 'glass-purple glow-border' : 'glass'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Anirudh"
                  className="glass w-full rounded-[20px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@arschool.app"
                  className="glass w-full rounded-[20px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Class</span>
                <div className="grid grid-cols-3 gap-2">
                  {CLASS_OPTIONS.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setClassId(entry)}
                      className={`rounded-[18px] px-3 py-3 text-sm font-semibold ${
                        classId === entry ? 'glass-purple text-brand-accent' : 'glass text-white/62'
                      }`}
                    >
                      Class {entry}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                onSubmit({
                  avatar,
                  classId,
                  email: email.trim(),
                  name: name.trim(),
                });
                onClose();
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow-sm disabled:opacity-50"
            >
              <Sparkles size={16} />
              Continue into AR School
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
