'use client';

import { useState, useEffect, useRef } from 'react';
import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { getS3ImageUrl } from '@/lib/services/s3-service';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';
import type { CaseStudyContentItem } from '@/server/db/schema';

const ImageLightbox = dynamic(() =>
  import('@/components/ui/image-lightbox').then((mod) => mod.ImageLightbox),
);

export function CaseStudyImage({
  src,
  alt,
  caption,
}: Extract<CaseStudyContentItem, { type: 'image' }>) {
  const [s3Url, setS3Url] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);
  const hasLoadedS3Ref = useRef(false);

  const imageVariants = useMotionVariant('image');
  const transition = useMotionTransition('image');
  const { trackContentInteraction } = useEventTracking();

  const { elementRef, isIntersecting } = useIntersectionObserver();

  const handleImageClick = () => {
    const pathParts = window.location.pathname.split('/');
    const caseStudyId = pathParts[pathParts.length - 1] || 'unknown';

    trackContentInteraction('case_study', 'CASE_STUDY_IMAGE_CLICKED', {
      id: caseStudyId,
      imageSrc: src,
    });
  };

  useEffect(() => {
    if (isIntersecting && src && src !== '/placeholder.svg' && !hasLoadedS3Ref.current) {
      setIsLoadingS3(true);
      hasLoadedS3Ref.current = true;
      logger.info(`Generating S3 URL for case study image: ${src}`);
      
      getS3ImageUrl(src)
        .then((url: string) => {
          setS3Url(url);
          setIsLoadingS3(false);
          logger.info(`S3 URL loaded successfully for case study image: ${src}`);
        })
        .catch((error: unknown) => {
          logger.error('Error loading case study image:', error);
          setS3Url('/placeholder.svg');
          setIsLoadingS3(false);
        });
    }
  }, [isIntersecting, src]);

  const motionProps = {
    variants: imageVariants,
    transition,
    initial: 'hidden',
    animate: 'visible',
    whileHover: 'hover',
  };

  return (
    <div ref={elementRef} className="container mx-auto px-4 py-8">
      <m.div
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5 cursor-pointer relative"
        {...motionProps}
        style={{ willChange: 'transform' }}
      >
        <div
          className="relative group cursor-pointer overflow-hidden rounded-lg aspect-video"
          onClick={handleImageClick}
        >
          {isLoadingS3 && <LoadingSpinnerOverlay />}
          <ImageLightbox
            src={s3Url}
            alt={alt}
            fill
            className="object-cover"
            unoptimized={src?.toLowerCase().includes('.gif')}
            priority={false}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            placeholder="blur"
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
