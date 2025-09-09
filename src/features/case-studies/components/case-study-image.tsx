import dynamic from 'next/dynamic';
import { getS3ImageUrl } from '@/services/s3-service';
import type { CaseStudyContentItem } from '@/server/db/schema';

const ImageLightbox = dynamic(() =>
  import('@/components/image-lightbox').then((mod) => mod.ImageLightbox),
);

export async function CaseStudyImage({
  src,
  alt,
  caption,
}: Extract<CaseStudyContentItem, { type: 'image' }>) {
  const imageSrc = src === '/placeholder.svg' 
    ? '/placeholder.svg' 
    : await getS3ImageUrl(src);

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500/10 bg-white/5 cursor-pointer relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl"
      >
        <div
          className="relative group cursor-pointer overflow-hidden rounded-lg"
        >
          <ImageLightbox
            src={imageSrc}
            alt={alt}
            unoptimized={src?.toLowerCase().includes('.gif')}
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        </div>
        {caption && (
          <div className="px-4 py-2 text-center text-gray-400 text-sm bg-gray-800/80">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
