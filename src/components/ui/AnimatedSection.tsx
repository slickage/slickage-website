'use client';

import { motion } from 'motion/react';
import React from 'react';
import { getTransitionConfig } from '@/lib/animations';
import { useMotionPreferences } from '@/lib/contexts/motion-preferences';

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
  const { prefersReducedMotion, shouldAnimate } = useMotionPreferences();

  const getSpringConfig = () => {
    if (prefersReducedMotion) {
      return getTransitionConfig('entrance', true);
    }

    return getTransitionConfig('entrance');
  };

  if (!shouldAnimate('entrance')) {
    return <div className={className}>{children}</div>;
  }

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
        duration: prefersReducedMotion ? 0 : duration,
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
