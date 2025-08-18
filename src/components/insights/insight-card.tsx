'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m, usePageInView, useReducedMotion } from 'motion/react';
import { getTransitionConfig } from '@/lib/animations';
import type { Insight } from '@/types/insight';
import { getS3ImageUrl } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';
import { LazyMotionWrapper } from '@/components/ui/LazyMotionWrapper';

interface InsightCardProps {
  insight: Insight;
  index?: number; // Add index prop to determine if card is above the fold
}

export default function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const [s3Url, setS3Url] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);
  const isPageVisible = usePageInView();
  const prefersReducedMotion = useReducedMotion();

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Conditional animation props based on motion preference
  const motionProps = prefersReducedMotion
    ? {
        variants: cardVariants,
        initial: 'hidden',
        whileInView: isPageVisible ? 'visible' : undefined,
        viewport: { once: true, margin: '-50px' },
        transition: getTransitionConfig('card'),
      }
    : {
        variants: cardVariants,
        initial: 'hidden',
        whileInView: isPageVisible ? 'visible' : undefined,
        viewport: { once: true, margin: '-50px' },
        transition: getTransitionConfig('card'),
      };

  const hoverEffects = prefersReducedMotion
    ? {}
    : {
        scale: 1.05,
        y: -4,
      };

  return (
    <Link
      href={`/case-studies/${insight.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 rounded-xl"
    >
      <LazyMotionWrapper>
        <m.div
          className="group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm cursor-pointer h-128 border border-gray-800/30 shadow-lg hover:shadow-xl transition-shadow duration-200 hover:border-blue-500/50"
          {...motionProps}
          whileHover={hoverEffects}
          tabIndex={0}
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
                  className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-900/20 backdrop-blur-sm text-blue-100 tracking-wide border border-blue-400/50 transition-transform duration-150 hover:scale-105 hover:-translate-y-1"
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -1 }}
                >
                  {tech}
                </m.span>
              ))}
            </div>
          </div>
        </m.div>
      </LazyMotionWrapper>
    </Link>
  );
}
