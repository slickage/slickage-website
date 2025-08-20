'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';
import { useEventTracking } from '@/lib/hooks/useEventTracking';
import type { Insight } from '@/types/insight';
import { getS3ImageUrl } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';

interface InsightCardProps {
  insight: Insight;
  index?: number; // Add index prop to determine if card is above the fold
}

export default function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const [s3Url, setS3Url] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);

  const cardVariants = useMotionVariant('card');
  const cardTransition = useMotionTransition('card');
  const tagVariants = useMotionVariant('tag');
  const tagTransition = useMotionTransition('tag');
  const { trackContentInteraction } = useEventTracking();

  const handleInsightClick = () => {
    trackContentInteraction('insight', 'INSIGHT_CARD_CLICKED', {
      id: insight.id,
      title: insight.title,
    });
  };

  useEffect(() => {
    if (insight.imageSrc && insight.imageSrc !== '/placeholder.svg') {
      setIsLoadingS3(true);
      logger.info('Generating S3 URL for:', insight.imageSrc);
      getS3ImageUrl(insight.imageSrc)
        .then((url) => {
          logger.info('S3 URL generated:', url);
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
  }, [insight.imageSrc, index]);

  const imageSrc = isLoadingS3 ? '/placeholder.svg' : s3Url;

  const motionProps = {
    variants: cardVariants,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    transition: cardTransition,
  };

  return (
    <Link
      href={`/case-studies/${insight.id}`}
      onClick={handleInsightClick}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 rounded-xl"
    >
      <m.div
        className="group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm cursor-pointer h-128 border border-gray-800/30 shadow-xl hover:shadow-xl transition-shadow duration-200 hover:border-blue-500/50"
        {...motionProps}
        whileHover="hover"
        tabIndex={0}
        style={{ willChange: 'transform' }}
      >
        <div className="relative w-full h-full">
          {isLoadingS3 && <LoadingSpinnerOverlay />}

          <Image
            src={imageSrc}
            alt={insight.title}
            fill
            priority={true}
            loading="eager"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={insight.imageSrc?.toLowerCase().includes('.gif')}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-4/5 bg-gradient-to-t from-gray-900/95 via-gray-800/80 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-150"></div>

        <div className="absolute left-0 right-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl md:text-2xl lg:text-2xl font-bold mb-3 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-tight leading-tight">
            {insight.title}
          </h3>
          <p className="text-gray-200 mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed text-xs md:text-sm lg:text-base">
            {insight.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {insight.tags.map((tech: string, index: number) => (
              <m.span
                key={index}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-900/20 backdrop-blur-sm text-blue-100 tracking-wide border border-blue-400/50"
                variants={tagVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={tagTransition}
                style={{ willChange: 'transform' }}
              >
                {tech}
              </m.span>
            ))}
          </div>
        </div>
      </m.div>
    </Link>
  );
}
