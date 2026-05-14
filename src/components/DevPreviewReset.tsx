'use client';

import { useEffect } from 'react';

export default function DevPreviewReset() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isLocalPreview =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isLocalPreview || !('serviceWorker' in navigator)) {
      return;
    }

    const resetPreviewState = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));

        if ('caches' in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }
      } catch (error) {
        console.warn('Failed to reset local preview state', error);
      }
    };

    void resetPreviewState();
  }, []);

  return null;
}
