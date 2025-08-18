'use client';

import { motion, useReducedMotion } from 'motion/react';
import React from 'react';

type AnimationVariant =
  | 'fadeIn' // Simple fade (original behavior)
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

const variants = {
  fadeIn: {
    offscreen: { opacity: 0, y: 20 },
    onscreen: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInUp: {
    offscreen: { opacity: 0, y: 40 },
    onscreen: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInDown: {
    offscreen: { opacity: 0, y: -40 },
    onscreen: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  fadeInLeft: {
    offscreen: { opacity: 0, x: -40 },
    onscreen: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  fadeInRight: {
    offscreen: { opacity: 0, x: 40 },
    onscreen: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
};

// Reduced motion variants for accessibility
const reducedMotionVariants = {
  fadeIn: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInUp: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInDown: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInLeft: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeInRight: {
    offscreen: { opacity: 0 },
    onscreen: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export default function AnimatedSection({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.3,
  className = '',
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // Spring configurations for different variants - optimized for performance
  const getSpringConfig = () => {
    // If user prefers reduced motion, use simple transitions
    if (prefersReducedMotion) {
      return { type: 'tween' as const, duration: 0.3, ease: 'easeOut' as const };
    }

    // Simplified spring configuration for all variants
    return { type: 'spring' as const, stiffness: 100, damping: 30, mass: 1.0 };
  };

  // Use appropriate variants based on motion preference
  const animationVariants = prefersReducedMotion ? reducedMotionVariants : variants;

  return (
    <motion.div
      variants={animationVariants[variant]}
      initial="offscreen"
      whileInView="onscreen"
      exit="exit"
      viewport={{
        once: true,
        margin: '-50px',
        amount: 0.3,
      }}
      transition={{
        ...getSpringConfig(),
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0.3 : duration,
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
