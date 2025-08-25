'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getS3ImageUrl } from '@/lib/services/s3-service';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';
import type { CaseStudyContentItem } from '@/types/case-study';

export function CaseStudyHero({
  title,
  subtitle,
  heroImage,
}: Extract<CaseStudyContentItem, { type: 'hero' }>) {
  const [imageSrc, setImageSrc] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);

  useEffect(() => {
    if (heroImage && heroImage !== '/placeholder.svg') {
      setIsLoadingS3(true);
      getS3ImageUrl(heroImage)
        .then((url: string) => {
          setImageSrc(url);
          setIsLoadingS3(false);
        })
        .catch((error: unknown) => {
          logger.error('Error loading hero image:', error);
          setImageSrc('/placeholder.svg');
          setIsLoadingS3(false);
        });
    } else {
      setImageSrc('/placeholder.svg');
      setIsLoadingS3(false);
    }
  }, [heroImage]);

  const isGif = heroImage?.toLowerCase().includes('.gif');

  return (
    <section className="relative min-h-[30vh] flex items-center">
      <div className="hero-wide relative w-full h-dvh max-h-[75vh] md:max-h-[50vh] overflow-hidden">
        {isLoadingS3 && <LoadingSpinnerOverlay />}
        <Image
          src={imageSrc}
          alt={`${title} - ${subtitle}`}
          className="blur-[3px] w-full h-full md:h-auto sm:object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          priority={true}
          unoptimized={isGif}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="h-full flex items-center justify-center px-4 py-16 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-transparent absolute w-full bottom-0">
          <div className="container mx-auto flex flex-col items-center text-center">
            <div className="uppercase text-xs opacity-80 font-bold text-blue-200 drop-shadow-lg">
              Case Study
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text drop-shadow-2xl">
              {title}
            </h1>
            <p className="max-w-2xl text-xl text-gray-100 drop-shadow-lg font-medium mx-auto">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
