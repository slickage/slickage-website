import Image from 'next/image';
import Link from 'next/link';
import { getS3ImageUrl } from '@/services/s3-service';
import type { Insight } from '@/server/db/schema';

interface InsightCardProps {
  insight: Insight;
}

export async function InsightCard({ insight }: InsightCardProps) {
  const imageSrc = insight.imageSrc === '/placeholder.svg' 
    ? '/placeholder.svg' 
    : await getS3ImageUrl(insight.imageSrc);

  return (
    <Link
      href={`/case-studies/${insight.slug}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500/50 rounded-xl"
    >
      <div
        className="group rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm cursor-pointer h-128 border border-gray-800/30 shadow-xl transition duration-200 ease-in-out hover:border-blue-500/50 hover:scale-105 hover:shadow-lg"
      >
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={insight.title}
            fill
            priority={false}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={imageSrc?.toLowerCase().includes('.gif')}
            quality={85}
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
            {insight.tags.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-900/20 backdrop-blur-sm text-blue-100 tracking-wide border border-blue-400/50 transition duration-200 ease-in-out hover:border-blue-500/50 hover:scale-105 hover:shadow-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
