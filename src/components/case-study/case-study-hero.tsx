'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { CaseStudy } from '@/types/case-study';
import { getS3ImageUrl } from '@/lib/utils';
import { logger } from '@/lib/utils/logger';
import { LoadingSpinnerOverlay } from '@/components/ui/loading-spinner';

export default function CaseStudyHero({
  title,
  subtitle,
  heroImage,
}: Pick<CaseStudy, 'title' | 'subtitle'> & { heroImage: string }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [s3Url, setS3Url] = useState<string>('/placeholder.svg');
  const [isLoadingS3, setIsLoadingS3] = useState(false);

  useEffect(() => {
    if (heroImage && heroImage !== '/placeholder.svg') {
      setIsLoadingS3(true);
      getS3ImageUrl(heroImage)
        .then((url) => {
          setS3Url(url);
          setIsLoadingS3(false);
        })
        .catch((error) => {
          logger.error('Error loading hero image:', error);
          setS3Url('/placeholder.svg');
          setIsLoadingS3(false);
        });
    } else {
      setS3Url('/placeholder.svg');
      setIsLoadingS3(false);
    }
  }, [heroImage]);

  const imageSrc = isLoadingS3 ? '/placeholder.svg' : s3Url;

  useEffect(() => {
    if (expandedIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIdx(null);
    };
    const handleScroll = () => setExpandedIdx(null);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [expandedIdx]);

  return (
    <section className="relative min-h-[30vh] flex items-center">
      <div className="hero-wide relative w-full h-dvh max-h-[75vh] md:max-h-[50vh] overflow-hidden">
        <Image
          key={imageSrc}
          src={imageSrc}
          alt="Hero image"
          className="blur-[3px] w-full h-full md:h-auto sm:object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          priority={true}
          unoptimized={heroImage?.toLowerCase().includes('.gif')}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {isLoadingS3 && <LoadingSpinnerOverlay />}
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
