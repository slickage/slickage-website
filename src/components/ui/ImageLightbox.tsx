import React, { useState, useEffect } from 'react';
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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    const handleScroll = () => setExpanded(false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [expanded]);

  return (
    <>
      <div
        className={className}
        style={{ cursor: 'pointer', position: 'relative', width: '100%', height: '100%' }}
        onClick={() => setExpanded(true)}
      >
        <Image src={src || '/placeholder.svg'} alt={alt} priority={priority} {...props} />
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
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative flex items-center justify-center max-w-3xl max-h-[80vh] w-auto h-auto p-4 bg-black/80 rounded-xl"
                >
                  <Image
                    src={src || '/placeholder.svg'}
                    alt={alt}
                    width={900}
                    height={600}
                    className="object-contain rounded-lg cursor-zoom-out"
                    priority={priority}
                    onClick={() => setExpanded(false)}
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
