import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCaseStudyById, caseStudies } from '@/data/case-studies';
import { CaseStudyHero } from '@/components/case-study/case-study-hero';
import { CaseStudyOverview } from '@/components/case-study/case-study-overview';
import { CaseStudySection } from '@/components/case-study/case-study-section';
import { CaseStudyImage } from '@/components/case-study/case-study-image';
import { CaseStudyQuote } from '@/components/case-study/case-study-quote';
import { AnimatedSection } from '@/components/ui/animated-section';

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    id: caseStudy.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const caseStudy = await getCaseStudyById(id);

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

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy = await getCaseStudyById(id);

  if (!caseStudy) return notFound();

  return (
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

      {caseStudy.content.map((item, idx) => (
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
    </main>
  );
}
