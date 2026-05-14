'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export type ARSessionState = 'idle' | 'starting' | 'active' | 'error' | 'unsupported';

export interface UseARSessionReturn {
  state: ARSessionState;
  error: string | null;
  start: () => Promise<void>;
  end: () => void;
}

export function useARSession(): UseARSessionReturn {
  const [state, setState] = useState<ARSessionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<XRSession | null>(null);

  const start = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check browser support
    if (!navigator.xr) {
      setState('unsupported');
      setError('WebXR is not supported in this browser.');
      return;
    }

    try {
      if (sessionRef.current) {
        // Session already exists, end it first to be safe
        sessionRef.current.end();
        sessionRef.current = null;
      }

      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) {
        setState('unsupported');
        setError('Immersive AR is not supported on this device. Try Chrome on Android with ARCore.');
        return;
      }

      setState('starting');

      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        optionalFeatures: ['local-floor', 'bounded-floor'],
        domOverlay: { root: document.body },
      });

      sessionRef.current = session;
      setState('active');

      session.addEventListener('end', () => {
        sessionRef.current = null;
        setState('idle');
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start AR session.';
      setError(msg);
      setState('error');
    }
  }, []);

  const end = useCallback(() => {
    sessionRef.current?.end();
    sessionRef.current = null;
    setState('idle');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.end();
        sessionRef.current = null;
      }
    };
  }, []);

  return { state, error, start, end };
}
