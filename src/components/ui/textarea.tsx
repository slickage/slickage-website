'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
          error
            ? '!border-red-500 focus:!border-red-500 focus-visible:!ring-red-500'
            : 'border-gray-700 focus:border-blue-500 focus-visible:ring-blue-500',
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
