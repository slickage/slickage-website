'use client';

import { motion } from 'motion/react';
import React from 'react';

const variants = {
  offscreen: { opacity: 0, y: 30, scale: 0.95 },
  onscreen: { opacity: 1, y: 0, scale: 1 },
};

export default function AnimatedSection({ children }: React.PropsWithChildren<{}>) {
  return (
    <motion.div
      variants={variants}
      initial="offscreen"
      whileInView="onscreen"
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
} 