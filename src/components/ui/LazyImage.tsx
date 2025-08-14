'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'motion/react';
import { useImageLoader } from '@/lib/hooks/useImageLoader';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps extends Omit<ImageProps, 'src'> {
  src: string | undefined;
  alt: string;
  showLoadingSpinner?: boolean;
  className?: string;
  containerClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  showLoadingSpinner = true,
  className = '',
  containerClassName = '',
  onLoad,
  onError,
  ...imageProps
}: LazyImageProps) {
  const { imageUrl, isLoading, hasError } = useImageLoader(src, {
    fallbackImage: '/placeholder.svg',
  });

  const handleImageLoad = () => {
    onLoad?.();
  };

  const handleImageError = () => {
    onError?.();
  };

  // Check if fill prop is being used
  const isFillImage = 'fill' in imageProps;

  // Check if we're using a placeholder image (which should be prioritized)
  const isPlaceholderImage = imageUrl === '/placeholder.svg';

  // Auto-set priority for placeholder images to fix LCP warning
  const finalPriority = isPlaceholderImage ? true : imageProps.priority;

  return (
    <div
      className={`relative ${containerClassName}`}
      style={{
        // Ensure container has height when using fill
        ...(isFillImage && { height: '100%' }),
      }}
    >
      {/* Loading state */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <LoadingSpinner size="md" />
        </div>
      )}

      {/* Actual image with Next.js built-in lazy loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className={`relative ${isFillImage ? 'w-full h-full' : ''}`}
      >
        <Image
          src={imageUrl}
          alt={alt}
          className={`transition-opacity duration-300 ${className}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={finalPriority}
          loading={finalPriority ? 'eager' : 'lazy'}
          {...imageProps}
        />
      </motion.div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-center text-red-500 dark:text-red-400">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}
