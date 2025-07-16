'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CaseStudy } from '@/types/case-study';
import { motion, AnimatePresence } from 'motion/react';

export default function CaseStudyHero({
  title,
  subtitle,
  heroImages,
}: Pick<CaseStudy, 'title' | 'subtitle'> & { heroImages: string[] }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

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
    <section className="relative min-h-[40vh] flex items-center">
      <div className="container mx-auto px-4 py-8 md:py-8 relative z-10 ">
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
          >
            {heroImages?.map((img, idx) => (
              <motion.div
                key={img}
                className="w-50 h-72 md:w-80 md:h-[28rem] cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setExpandedIdx(idx)}
              >
                <Image
                  src={img || '/placeholder.svg'}
                  alt={`${title} image ${idx + 1}`}
                  fill
                  className="object-cover rounded-lg shadow-md"
                  sizes="(max-width: 768px) 224px, 384px"
                  priority={idx === 0}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {/* Modal for expanded image with Motion for React */}
      <AnimatePresence>
        {expandedIdx !== null && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 cursor-zoom-out backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative flex items-center justify-center max-w-3xl max-h-[80vh] w-auto h-auto p-4 bg-black/80 rounded-xl"
            >
              <Image
                src={heroImages[expandedIdx] || '/placeholder.svg'}
                alt={`${title} expanded image ${expandedIdx + 1}`}
                width={900}
                height={600}
                className="object-contain rounded-lg cursor-zoom-out"
                priority
                onClick={() => setExpandedIdx(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
