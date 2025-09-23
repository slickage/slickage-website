'use client';

import { LazyMotion, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';

interface MotionWrapperProps {
  children: ReactNode;
}

export function MotionWrapper({ children }: MotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
