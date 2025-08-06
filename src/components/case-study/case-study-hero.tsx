'use client';

import { useState, useEffect } from 'react';
import type { CaseStudy } from '@/types/case-study';
import { motion } from 'motion/react';
import Image from 'next/image';
import { getS3ImageUrl } from '@/lib/utils';
import { LoadingSpinnerOverlay } from '@/components/ui/LoadingSpinner';

export default function CaseStudyHero({
  title,
  subtitle,
  heroImage,
}: Pick<CaseStudy, 'title' | 'subtitle'> & { heroImage: string }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (heroImage === '/placeholder.svg') {
          setImageUrl('/placeholder.svg');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const url = await getS3ImageUrl(heroImage);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading hero image:', error);
        setImageUrl('/placeholder.svg');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [heroImage]);

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
        {isLoading && <LoadingSpinnerOverlay />}
        {!isLoading && (
          <Image
            src={imageUrl}
            alt="Hero image"
            className="blur-[3px] w-full h-full md:h-auto sm:object-cover"
            width={0}
            height={0}
            sizes="100vw"
            priority
          />
        )}
        <div className="h-full flex items-end justify-center px-4 py-16 bg-linear-to-t from-slate-950 to-transparent absolute w-full bottom-0">
          <div className="container mx-auto flex flex-col items-start md:items-center">
            <div className="uppercase text-xs opacity-50 font-bold">Case Study</div>
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-8 relative z-10 hidden">
        <motion.div
          className="flex flex-col items-center text-center space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-4">
            Case Study
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-2 gradient-text">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 mb-4">{subtitle}</p>
          <motion.div
            className="flex flex-row gap-4 justify-center mt-6"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
            initial="hidden"
            animate="show"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
