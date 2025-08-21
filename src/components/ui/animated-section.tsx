'use client';

import { m } from 'motion/react';
import { type ReactNode } from 'react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

type AnimationVariant = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
}

export function AnimatedSection({
  children,
  variant = 'fadeIn',
  className = '',
}: AnimatedSectionProps) {
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
  const transition = useMotionTransition('contentEntrance');

  return (
    <m.div
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      transition={transition}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  );
}
