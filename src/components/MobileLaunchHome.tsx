'use client';

import { useEffect } from 'react';

export default function MobileLaunchHome() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);

    if (!isMobileDevice || window.location.pathname === '/') {
      return;
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;

    const isFreshLaunch =
      !navigationEntry ||
      navigationEntry.type === 'navigate' ||
      navigationEntry.type === 'reload';

    if (isFreshLaunch) {
      window.location.replace('/');
    }
  }, []);

  return null;
}
