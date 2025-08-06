import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps extends Omit<ImageProps, 'ref'> {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  modalClassName?: string;
}

export default function ImageLightbox({
  src,
  alt,
  priority = false,
  className = '',
  modalClassName = '',
  ...props
}: ImageLightboxProps) {
  const [expanded, setExpanded] = useState<boolean | null>(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
        className="cursor-pointer relative w-full h-full"
        onClick={() => setExpanded(true)}
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={expanded ? 'true' : 'false'}
        ref={triggerRef}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded(true);
        }}
      >
        <Image
          className={className}
          src={src || '/placeholder.svg'}
          alt={alt}
          priority={priority}
          {...props}
        />
      </div>
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
                    src={src || '/placeholder.svg'}
                    alt={alt}
                    width={900}
                    height={600}
                    className={`object-contain rounded-lg cursor-zoom-out
                      ${isPortrait ? 'w-3xl h-auto' : 'w-6xl h-auto'}`}
                    priority={priority}
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
