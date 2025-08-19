'use client';

import React from 'react';
import { LazyMotion, domAnimation } from 'motion/react';

interface LazyMotionWrapperProps {
  children: React.ReactNode;
}

export function LazyMotionWrapper({ children }: LazyMotionWrapperProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
