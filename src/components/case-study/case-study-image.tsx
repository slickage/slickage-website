'use client';

import { useState, useEffect } from 'react';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { getS3ImageUrl } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';
import { useEventTracking } from '@/lib/hooks/use-event-tracking';

const ImageLightbox = dynamic(() =>
  import('@/components/ui/image-lightbox').then((mod) => mod.ImageLightbox),
);

export function CaseStudyImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [s3Url, setS3Url] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);

  const imageVariants = useMotionVariant('image');
  const transition = useMotionTransition('image');
  const { trackContentInteraction } = useEventTracking();

  const handleImageClick = () => {
    const pathParts = window.location.pathname.split('/');
    const caseStudyId = pathParts[pathParts.length - 1] || 'unknown';

    trackContentInteraction('case_study', 'CASE_STUDY_IMAGE_CLICKED', {
      id: caseStudyId,
      imageSrc: src,
    });
  };

  useEffect(() => {
    if (src && src !== '/placeholder.svg') {
      setIsLoadingS3(true);
      getS3ImageUrl(src)
        .then((url) => {
          setS3Url(url);
          setIsLoadingS3(false);
        })
        .catch((error) => {
          logger.error('Error loading S3 image:', error);
          setS3Url('/placeholder.svg');
          setIsLoadingS3(false);
        });
    } else {
      setS3Url('/placeholder.svg');
      setIsLoadingS3(false);
    }
  }, [src]);

  const imageSrc = isLoadingS3 ? '/placeholder.svg' : s3Url;

  const motionProps = {
    variants: imageVariants,
    transition,
    initial: 'hidden',
    animate: 'visible',
    whileHover: 'hover',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <m.div
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5 cursor-pointer relative"
        {...motionProps}
        style={{ willChange: 'transform' }}
      >
        <div
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onClick={handleImageClick}
        >
          {isLoadingS3 && <LoadingSpinnerOverlay />}
          <ImageLightbox
            src={imageSrc}
            alt={alt}
            className="w-full h-auto"
            unoptimized={src?.toLowerCase().includes('.gif')}
          />
        </div>
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-gray-800/80">
            {caption}
          </div>
        )}
      </m.div>
    </div>
  );
}
