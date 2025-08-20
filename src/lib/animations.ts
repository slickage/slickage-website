import { useReducedMotion } from 'motion/react';

export const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },

  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    hover: { scale: 1.05, y: -4 },
  },

  image: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { y: -10 },
  },

  modal: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  },

  tag: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    hover: { scale: 1.05, y: -1 },
  },

  banner: {
    initial: { y: 100, opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
};

export const transitions = {
  fade: { type: 'tween' as const, duration: 0.3, ease: 'easeOut' as const },

  modal: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1.0 },

  contentEntrance: { type: 'spring' as const, stiffness: 100, damping: 30, mass: 1.0 },

  image: { type: 'spring' as const, stiffness: 250, damping: 25, mass: 0.7 },

  card: { type: 'spring' as const, stiffness: 300, damping: 20, mass: 0.8 },

  tag: { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.6 },

  banner: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 },
};

export function useMotionVariant(variantName: keyof typeof variants) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return variants[variantName];
}

export function useMotionTransition(type: keyof typeof transitions) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return { type: 'tween' as const, duration: 0.2, ease: 'easeOut' as const };
  }

  return transitions[type];
}

export type VariantType = keyof typeof variants;
export type TransitionType = keyof typeof transitions;
