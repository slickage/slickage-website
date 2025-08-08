'use client';
import React from 'react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { LazyImageLightbox } from '@/components/ui';

const LazyImageLightboxComponent = dynamic(() => import('../ui/LazyImageLightbox'));

export default function CaseStudyImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5 cursor-pointer relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative min-h-[400px]">
          <LazyImageLightboxComponent
            src={src}
            alt={alt}
            width={900}
            height={500}
            className="object-fill w-full h-auto"
            priority={false}
            lazy={true}
            threshold={0.1}
            rootMargin="100px"
            showLoadingSpinner={true}
            containerClassName="w-full h-full"
          />
        </div>
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-opacity-80">{caption}</div>
        )}
      </motion.div>
    </div>
  );
}
