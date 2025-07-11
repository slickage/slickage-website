import Image from 'next/image';
import type { CaseStudy } from '@/types/case-study';

export default function CaseStudyHero({
  title,
  subtitle,
  heroImage,
}: Pick<CaseStudy, 'title' | 'subtitle' | 'heroImage'>) {
  return (
    <section className="relative min-h-[40vh] flex items-center">
      <div className="absolute inset-0 bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        <div className="absolute inset-0">
          <Image
            src={heroImage || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover opacity-10 mix-blend-overlay"
            priority
          />
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 font-medium mb-4">
            Case Study
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-2 gradient-text">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 mb-4">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
