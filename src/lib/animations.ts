/**
 * Simplified animation system for Motion React
 *
 * Best practices applied:
 * - Focus on transform/opacity for performance
 * - Simple, reusable variants
 * - Automatic reduced motion support
 * - Hardware-accelerated animations
 */

import { useReducedMotion } from 'motion/react';

// Core animation variants - only keeping used ones
export const variants = {
  // Basic fade - simple opacity transition
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide animations - hardware accelerated
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

  // Scale animations - interactive elements
  button: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },

  // Card animations - content blocks
  card: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    hover: { y: -5, scale: 1.02 },
  },

  // Image animations - subtle lift without scale
  image: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: { y: -10 },
  },

  // Modal animations - smooth entrances
  modal: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20 },
  },
};

// Simple spring transitions - only keeping used ones
export const transitions = {
  // Form controls - inputs, selects, textareas (subtle focus feedback)
  input: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },

  // Interactive buttons - more pronounced feedback for clicks/hover
  'icon-button': { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.8 },

  // Fade animations
  fade: { type: 'tween' as const, duration: 0.3, ease: 'easeOut' as const },

  // Modal animations
  modal: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1.0 },

  // Entrance animations
  entrance: { type: 'spring' as const, stiffness: 100, damping: 30, mass: 1.0 },

  // Image animations
  image: { type: 'spring' as const, stiffness: 250, damping: 25, mass: 0.7 },

  // Card animations
  card: { type: 'spring' as const, stiffness: 300, damping: 20, mass: 0.8 },
};

// Hook to get motion-aware variants
export function useMotionVariant(variantName: keyof typeof variants) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // For reduced motion, use simple fade variants
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return variants[variantName];
}

// Hook to get appropriate transition
export function useMotionTransition(type: keyof typeof transitions) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return { type: 'tween' as const, duration: 0.2, ease: 'easeOut' as const };
  }

  return transitions[type];
}

// Export types
export type VariantType = keyof typeof variants;
export type TransitionType = keyof typeof transitions;
