'use client';

import { type ReactNode } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';

interface LazyMotionWrapperProps {
  children: ReactNode;
}

export function LazyMotionWrapper({ children }: LazyMotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
