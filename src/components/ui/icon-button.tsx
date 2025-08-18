'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'red' | 'gray' | 'white';
  icon: React.ReactNode;
  href?: string;
  asChild?: boolean;
  target?: string;
  rel?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const variantClasses = {
  default: 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
  purple: 'bg-purple-600 hover:bg-purple-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  gray: 'bg-gray-600 hover:bg-gray-700 text-white',
  white: 'bg-white hover:bg-gray-100 text-gray-700',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const IconButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLDivElement,
  IconButtonProps
>(({ className, size = 'md', variant = 'default', icon, href, asChild = false, ...props }, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  const iconContent = (
    <div className={cn('flex items-center justify-center', iconSizes[size])}>{icon}</div>
  );

  if (href) {
    return (
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }}
        whileTap={{
          scale: 0.9,
          rotate: -5,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }}
        className="inline-block"
      >
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {iconContent}
        </a>
      </motion.div>
    );
  }

  if (asChild) {
    return (
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }}
        whileTap={{
          scale: 0.9,
          rotate: -5,
          transition: { type: 'spring', stiffness: 400, damping: 25 },
        }}
        className="inline-block"
      >
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={baseClasses}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {iconContent}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: 0.9,
        rotate: -5,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      className="inline-block"
    >
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClasses}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {iconContent}
      </button>
    </motion.div>
  );
});

IconButton.displayName = 'IconButton';

export { IconButton };
