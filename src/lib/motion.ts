export const iosSpring = {
  type: 'spring' as const,
  stiffness: 180,
  damping: 24,
  mass: 1.02,
};

export const iosGentleSpring = {
  type: 'spring' as const,
  stiffness: 145,
  damping: 22,
  mass: 1.08,
};

export const iosSnappySpring = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 26,
  mass: 0.98,
};

export const iosFadeUp = {
  initial: { opacity: 0, y: 22, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: iosGentleSpring,
};

export const iosFadeDown = {
  initial: { opacity: 0, y: -18, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: iosGentleSpring,
};
