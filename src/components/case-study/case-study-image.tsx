'use client';
import { motion } from 'motion/react';
import ImageLightbox from '../ui/ImageLightbox';

export default function CaseStudyImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
        <ImageLightbox
          src={src}
          alt={alt}
          width={900}
          height={500}
          className="object-fill w-full h-auto"
          priority
        />
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-[#0A0A0A] bg-opacity-80">
            {caption}
          </div>
        )}
      </motion.div>
    </div>
  );
}
