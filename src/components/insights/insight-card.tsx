'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { Insight } from '@/types/insight';
import { LazyImage } from '@/components/ui';

interface InsightCardProps {
  insight: Insight;
  index?: number; // Add index prop to determine if card is above the fold
}

export default function InsightCard({ insight, index = 0 }: InsightCardProps) {
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

  const imageVariants = {
    hover: { scale: 1.07, transition: { duration: 0.5 } },
  };

  // Set priority for first 3 cards (likely above the fold)
  const isAboveTheFold = index < 3;

  return (
    <Link
      href={`/case-studies/${insight.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
    >
      <motion.div
        className="group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm cursor-pointer"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        tabIndex={0}
      >
        <div className="relative h-128 overflow-hidden">
          <div className="p-6 absolute z-1000 flex flex-col justify-end h-full">
            <h3 className="text-3xl font-semibold text-white mb-2">{insight.title}</h3>
            <p className="text-gray-400 mb-4">{insight.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {insight.tags.map((tech: string, index: number) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-400/30 via-blue-500/20 to-violet-400/20 text-blue-100 tracking-wide transition-all duration-150 shadow-none"
                  whileHover="hover"
                  variants={tagVariants}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-4/5 bg-gradient-to-t from-gray-950/95 via-gray-950/80 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300 z-900"></div>
          <motion.div
            className="w-full h-full absolute inset-0"
            variants={imageVariants}
            whileHover="hover"
          >
            <div className="relative w-full h-full">
              <LazyImage
                src={insight.imageSrc}
                alt={insight.title}
                fill
                priority={isAboveTheFold}
                lazy={!isAboveTheFold} // Disable lazy loading for above-the-fold cards
                threshold={0.1}
                rootMargin="50px"
                showLoadingSpinner={false}
                containerClassName="w-full h-full"
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
