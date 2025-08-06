'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { getS3ImageUrl } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';

const ImageLightbox = dynamic(() => import('../ui/ImageLightbox'));

export default function CaseStudyImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // If it's already a placeholder image, don't show loading
        if (src === '/placeholder.svg') {
          setImageUrl('/placeholder.svg');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const url = await getS3ImageUrl(src);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl('/placeholder.svg');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);
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
          {isLoading && <LoadingSpinnerOverlay />}
          {!isLoading && (
            <ImageLightbox
              src={imageUrl}
              alt={alt}
              width={900}
              height={500}
              className="object-fill w-full h-auto"
              priority
            />
          )}
        </div>
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-[#0A0A0A] bg-opacity-80">
            {caption}
          </div>
        )}
      </motion.div>
    </div>
  );
}
