import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${sizeClass} border-4 border-transparent border-t-blue-400 border-r-violet-400 border-b-blue-500 border-l-violet-500 rounded-full animate-spin shadow-lg`}
      ></div>
      <div
        className={`absolute inset-0 ${sizeClass} border-4 border-transparent border-t-violet-300 border-r-blue-300 rounded-full animate-spin animation-delay-75 opacity-60`}
      ></div>
    </div>
  );
}

/**
 * Full screen loading spinner with backdrop
 */
export function LoadingSpinnerOverlay({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 via-violet-500/15 to-blue-600/25 backdrop-blur-sm border border-white/5 z-10 ${className}`}
    >
      <LoadingSpinner size="lg" />
    </div>
  );
}
