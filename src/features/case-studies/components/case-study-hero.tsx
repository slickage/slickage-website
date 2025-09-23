import Image from 'next/image';
import { getS3ImageUrl } from '@/services/s3-service';
import type { CaseStudyContentItem } from '@/server/db/schema';

export async function CaseStudyHero({
  title,
  subtitle,
  heroImage,
}: Extract<CaseStudyContentItem, { type: 'hero' }>) {
  const imageSrc =
    heroImage === '/placeholder.svg' ? '/placeholder.svg' : await getS3ImageUrl(heroImage);

  const isGif = heroImage?.toLowerCase().includes('.gif');

  return (
    <section className="relative min-h-[30vh] flex items-center">
      <div className="hero-wide relative w-full h-dvh max-h-[75vh] md:max-h-[50vh] overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${title} - ${subtitle}`}
          className="blur-[3px] sm:object-cover"
          fill
          sizes="100vw"
          priority={true}
          unoptimized={isGif}
          quality={85}
          loading="eager"
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
