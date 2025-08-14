'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useImageLoader } from '@/lib/hooks/useImageLoader';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageLightboxProps extends Omit<ImageProps, 'ref' | 'src'> {
  src: string | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
  modalClassName?: string;
  showLoadingSpinner?: boolean;
  containerClassName?: string;
}

export default function LazyImageLightbox({
  src,
  alt,
  priority = false,
  className = '',
  modalClassName = '',
  showLoadingSpinner = true,
  containerClassName = '',
  ...props
}: LazyImageLightboxProps) {
  const [expanded, setExpanded] = useState<boolean | null>(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { imageUrl, isLoading, hasError } = useImageLoader(src, {
    fallbackImage: '/placeholder.svg',
  });

  // Check if fill prop is being used
  const isFillImage = 'fill' in props;

  // Check if we're using a placeholder image (which should be prioritized)
  const isPlaceholderImage = imageUrl === '/placeholder.svg';

  // Auto-set priority for placeholder images to fix LCP warning
  const finalPriority = isPlaceholderImage ? true : priority;

  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
      if (e.key === 'Tab' && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (firstEl && lastEl) {
          if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          } else if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        }
      }
    };
    const handleScroll = () => setExpanded(false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);

    setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelector<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable) focusable.focus();
        else modalRef.current.focus();
      }
    }, 0);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);

      if (triggerRef.current) triggerRef.current.focus();
    };
  }, [expanded]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);
  };

  return (
    <>
      <div
        className={`cursor-pointer relative w-full h-full ${containerClassName}`}
        style={{
          // Ensure container has height when using fill
          ...(isFillImage && { height: '100%' }),
        }}
        onClick={() => setExpanded(true)}
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={expanded ? 'true' : 'false'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded(true);
        }}
      >
        {/* Loading state */}
        {isLoading && showLoadingSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
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
            className={className}
            src={imageUrl}
            alt={alt}
            priority={finalPriority}
            loading={finalPriority ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            {...props}
          />
        </motion.div>

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg z-10">
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

      {/* Lightbox Modal */}
      {typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {expanded && (
              <motion.div
                className={`fixed inset-0 flex items-center justify-center z-50 cursor-zoom-out backdrop-blur-xs ${modalClassName}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpanded(false)}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                tabIndex={-1}
                ref={modalRef}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative flex items-center justify-center p-4 rounded-xl"
                >
                  <Image
                    src={imageUrl}
                    alt={alt}
                    width={900}
                    height={600}
                    className={`object-contain rounded-lg cursor-zoom-out
                      ${isPortrait ? 'w-3xl h-auto' : 'w-6xl h-auto'}`}
                    priority={finalPriority}
                    loading={finalPriority ? 'eager' : 'lazy'}
                    onClick={() => setExpanded(false)}
                    onLoad={handleImageLoad}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
