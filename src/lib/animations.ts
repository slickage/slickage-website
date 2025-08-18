/**
 * Centralized animation configuration for consistent motion behavior across the application
 *
 * This file provides standardized spring configurations for different interaction types,
 * ensuring consistent animation feel and performance optimization.
 */

// Spring configuration types
export interface SpringConfig {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass?: number;
}

export interface TweenConfig {
  type: 'tween';
  ease: 'easeIn' | 'easeOut' | 'easeInOut' | 'linear';
  duration?: number;
}

export type TransitionConfig = SpringConfig | TweenConfig;

// Standard spring configurations for different interaction types
export const springConfigs = {
  // Interactive elements (buttons, inputs, etc.) - Quick, responsive
  interactive: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },

  // Hover effects - Subtle, smooth
  hover: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 0.6,
  },

  // Focus effects - Quick, precise
  focus: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },

  // Modal animations - Smooth, professional
  modal: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1.0,
  },

  // Content entrance - Gentle, welcoming
  entrance: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 30,
    mass: 1.0,
  },

  // Card interactions - Balanced, engaging
  card: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
} as const;

// Tween configurations for reduced motion or simple transitions
export const tweenConfigs = {
  // Simple fade transitions
  fade: {
    type: 'tween' as const,
    ease: 'easeOut' as const,
    duration: 0.2,
  },

  // Quick scale transitions
  scale: {
    type: 'tween' as const,
    ease: 'easeOut' as const,
    duration: 0.15,
  },

  // Smooth opacity transitions
  opacity: {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration: 0.3,
  },
} as const;

// Helper function to get spring config by type
export function getSpringConfig(type: keyof typeof springConfigs): SpringConfig {
  return springConfigs[type];
}

// Helper function to get tween config by type
export function getTweenConfig(type: keyof typeof tweenConfigs): TweenConfig {
  return tweenConfigs[type];
}

// Helper function to get appropriate config based on motion preference
export function getTransitionConfig(
  type: keyof typeof springConfigs | keyof typeof tweenConfigs,
  prefersReducedMotion: boolean = false,
): TransitionConfig {
  if (prefersReducedMotion) {
    // For reduced motion, use simple tween transitions
    switch (type) {
      case 'interactive':
      case 'hover':
      case 'focus':
        return getTweenConfig('scale');
      case 'modal':
      case 'entrance':
      case 'card':
        return getTweenConfig('fade');
      default:
        return getTweenConfig('opacity');
    }
  }

  // For normal motion, use spring configurations
  if (type in springConfigs) {
    return getSpringConfig(type as keyof typeof springConfigs);
  }

  // Fallback to tween if spring config not found
  return getTweenConfig('opacity');
}

// Export types for component usage
export type SpringConfigType = keyof typeof springConfigs;
export type TweenConfigType = keyof typeof tweenConfigs;
