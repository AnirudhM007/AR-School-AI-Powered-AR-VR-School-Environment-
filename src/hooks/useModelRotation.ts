'use client';

import { useRef, useCallback, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function useModelRotation(speed = 0.005) {
  const ref = useRef<Group>(null);
  const [rotating, setRotating] = useState(true);

  useFrame(() => {
    if (ref.current && rotating) {
      ref.current.rotation.y += speed;
    }
  });

  const toggle = useCallback(() => setRotating(r => !r), []);

  return { ref, rotating, toggle };
}
