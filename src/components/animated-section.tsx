'use client';

import { m } from 'motion/react';
import { type ReactNode } from 'react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

type AnimationVariant = 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
  trigger?: 'immediate' | 'scroll';
}

export function AnimatedSection({
  children,
  variant = 'fadeIn',
  className = '',
  trigger = 'scroll',
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
      className={className}
      variants={animationVariants}
      initial="hidden"
      {...(trigger === 'immediate' 
        ? { animate: 'visible' }
        : { whileInView: 'visible' }
      )}
      transition={transition}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </m.div>
  );
}
