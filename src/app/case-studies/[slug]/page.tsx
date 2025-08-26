import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCaseStudyBySlug, getAllCaseStudies } from '@/server/db/queries';
import { CaseStudyHero } from '@/components/case-study/case-study-hero';
import { CaseStudyOverview } from '@/components/case-study/case-study-overview';
import { CaseStudySection } from '@/components/case-study/case-study-section';
import { CaseStudyImage } from '@/components/case-study/case-study-image';
import { CaseStudyQuote } from '@/components/case-study/case-study-quote';
import { AnimatedSection } from '@/components/ui/animated-section';
import { Suspense } from 'react';
import { CaseStudyContentSkeleton } from '@/components/case-study/case-study-content-skeleton';

export async function generateStaticParams() {
  const caseStudies = await getAllCaseStudies();
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.',
    };
  }

  return {
    title: `${caseStudy.title} | Slickage`,
    description: caseStudy.overview,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.overview,
      type: 'article',
      images: [
        {
          url: caseStudy.heroImage,
          width: 1200,
          height: 630,
          alt: caseStudy.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.overview,
      images: [caseStudy.heroImage],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) return notFound();

  return (
    <>
      <link rel="dns-prefetch" href="//slickage-website.s3.us-west-2.amazonaws.com" />
      <link
        rel="preconnect"
        href="https://slickage-website.s3.us-west-2.amazonaws.com"
        crossOrigin="anonymous"
      />

      <main className="flex-1 py-8">
        <AnimatedSection variant="slideUp">
          <CaseStudyHero
            type="hero"
            title={caseStudy.title}
            subtitle={caseStudy.subtitle}
            heroImage={caseStudy.heroImage}
          />
        </AnimatedSection>

        <AnimatedSection variant="slideUp">
          <CaseStudyOverview
            overview={caseStudy.overview}
            tags={caseStudy.tags}
            quickFacts={caseStudy.quickFacts}
          />
        </AnimatedSection>

        <Suspense fallback={<CaseStudyContentSkeleton contentLength={caseStudy.content.length} />}>
          {caseStudy.content.map((item: any, idx: number) => (
            <AnimatedSection key={idx} variant="slideUp">
              {item.type === 'section' && (
                <CaseStudySection title={item.title} content={item.content} />
              )}
              {item.type === 'image' && (
                <CaseStudyImage type="image" src={item.src} alt={item.alt} caption={item.caption} />
              )}
              {item.type === 'quote' && (
                <CaseStudyQuote quote={item.quote} author={item.author} role={item.role} />
              )}
            </AnimatedSection>
          ))}
        </Suspense>
      </main>
    </>
  );
}
