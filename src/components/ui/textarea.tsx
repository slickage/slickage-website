'use client';

import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { getTransitionConfig } from '@/lib/animations';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        whileFocus={{ scale: 1.01 }}
        transition={getTransitionConfig('focus')}
        className="inline-block w-full"
      >
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
