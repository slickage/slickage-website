'use client';

import { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import Image, { ImageProps } from 'next/image';
import { m, AnimatePresence } from 'motion/react';
import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

interface ImageLightboxProps extends Omit<ImageProps, 'ref'> {
  src: string;
  alt: string;
  className?: string;
  modalClassName?: string;
  unoptimized?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
}

export function ImageLightbox({
  src,
  alt,
  priority = false,
  className = '',
  modalClassName = '',
  unoptimized = false,
  sizes = "100vw",
  quality = 85,
  fill = false,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState<boolean | null>(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);

  const fadeVariants = useMotionVariant('fade');
  const modalVariants = useMotionVariant('modal');
  const fadeTransition = useMotionTransition('fade');
  const modalTransition = useMotionTransition('modal');

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    const handleScroll = () => handleClose();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);

      if (triggerRef.current) triggerRef.current.focus();
    };
  }, [isOpen]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);
    setIsLoading(false);
  };

  const backdropAnimationProps = {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: fadeVariants,
    transition: fadeTransition,
  };

  const modalAnimationProps = {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: modalVariants,
    transition: modalTransition,
  };

  return (
    <>
      <div
        className="cursor-pointer relative w-full h-full"
        onClick={handleOpen}
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen ? 'true' : 'false'}
        ref={triggerRef}
      >
        {isLoading && <LoadingSpinnerOverlay />}
        <Image
          key={src}
          className={className}
          src={src}
          alt={alt}
          priority={priority}
          unoptimized={unoptimized}
          onLoad={handleImageLoad}
          quality={quality}
          sizes={sizes}
          fill={fill}
          width={DEFAULT_WIDTH}
          height={DEFAULT_HEIGHT}
        />
      </div>
      {typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {isOpen && (
              <m.div
                className={`fixed inset-0 flex items-center justify-center z-50 cursor-zoom-out backdrop-blur-xs ${modalClassName}`}
                {...backdropAnimationProps}
                onClick={handleClose}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                tabIndex={-1}
              >
                <m.div
                  {...modalAnimationProps}
                  className="relative flex items-center justify-center p-4 rounded-xl"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={DEFAULT_WIDTH}
                    height={DEFAULT_HEIGHT}
                    className={`object-contain rounded-lg cursor-zoom-out
                        ${isPortrait ? 'w-3xl h-auto' : 'w-6xl h-auto'}`}
                    priority={true}
                    unoptimized={unoptimized}
                    quality={quality}
                    sizes="100vw"
                  />
                </m.div>
              </m.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
