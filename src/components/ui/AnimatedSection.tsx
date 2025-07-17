'use client';

import { motion } from 'motion/react';
import React from 'react';

export default function AnimatedSection({ children }: React.PropsWithChildren<{}>) {
  return (
    <motion.div           
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
} 