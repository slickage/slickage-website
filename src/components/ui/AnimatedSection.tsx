'use client';

import { m } from 'motion/react';
import React from 'react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

type AnimationVariant = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedSection({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.3,
  className = '',
}: AnimatedSectionProps) {
  const transition = useMotionTransition('contentEntrance');

  const getVariantMapping = () => {
    switch (variant) {
      case 'fadeIn':
        return useMotionVariant('fade');
      case 'slideUp':
        return useMotionVariant('slideUp');
      case 'slideDown':
        return useMotionVariant('slideDown');
      case 'slideLeft':
        return useMotionVariant('slideLeft');
      case 'slideRight':
        return useMotionVariant('slideRight');
      default:
        return useMotionVariant('fade');
    }
  };

  const animationVariants = getVariantMapping();

  return (
    <m.div
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{
        once: true,
        margin: '-50px',
        amount: 0.3,
      }}
      transition={{
        ...transition,
        delay,
        duration,
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  );
}
