'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
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
  }, [insight.imageSrc]);

  const imageSrc = isLoadingS3 ? '/placeholder.svg' : s3Url;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: {
      scale: 1.03,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      transition: { duration: 0.25 },
    },
  };

  const tagVariants = {
    hover: { scale: 1.1, transition: { duration: 0.15 } },
  };

  // Set priority for first 3 cards (likely above the fold)
  const isAboveTheFold = index < 3;

  return (
    <Link
      href={`/case-studies/${insight.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
    >
      <motion.div
        className="group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm cursor-pointer h-128"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        tabIndex={0}
      >
        <div className="relative w-full h-full">
          {isLoadingS3 && <LoadingSpinnerOverlay />}

          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={insight.title}
              fill
              priority={isAboveTheFold}
              loading={isAboveTheFold ? undefined : 'lazy'}
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              unoptimized={insight.imageSrc?.toLowerCase().includes('.gif')}
            />
          </div>

          <div className="absolute left-0 right-0 bottom-0 h-4/5 bg-gradient-to-t from-blue-900/95 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight leading-tight">
              {insight.title}
            </h3>
            <p className="text-gray-100 mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {insight.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {insight.tags.map((tech: string, index: number) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-violet-800/50 backdrop-blur-sm text-white tracking-wide transition-all duration-150 shadow-lg border border-violet-400/40"
                  whileHover="hover"
                  variants={tagVariants}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
