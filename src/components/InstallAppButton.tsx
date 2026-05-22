'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Share2, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  const isIos = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsInstalled(isStandaloneMode());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setShowIosHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      setShowIosHelp(true);
    }
  };

  if (isInstalled || (!deferredPrompt && !isIos)) {
    return null;
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => void handleInstall()}
        whileTap={{ scale: 0.96 }}
        className="glass-fast inline-flex h-11 items-center gap-2 rounded-[20px] px-4 text-sm font-semibold text-white"
      >
        <Download size={16} className="text-brand-accent" />
        Install App
      </motion.button>

      <AnimatePresence>
        {showIosHelp ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end bg-black/55 px-4 pb-6"
            onClick={() => setShowIosHelp(false)}
          >
            <motion.div
              initial={{ y: 220, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 220, opacity: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="glass-strong w-full rounded-[30px] p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="screen-kicker">Install AR School</p>
                  <h2 className="text-lg font-semibold text-white">Add it to your home screen</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIosHelp(false)}
                  className="glass-fast grid h-10 w-10 place-items-center rounded-[18px]"
                >
                  <X size={16} className="text-white/75" />
                </button>
              </div>

              <div className="space-y-3 text-sm leading-6 text-white/70">
                <p>Open the browser menu, tap the share button, then choose Add to Home Screen.</p>
                <p className="inline-flex items-center gap-2 text-white">
                  <Share2 size={16} className="text-brand-accent" />
                  Share, then Add to Home Screen
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowIosHelp(false)}
                className="mt-5 w-full rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-white"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
