import { notFound } from 'next/navigation';
import { getCaseStudyById } from '@/data/case-studies';
import {
  CaseStudyHero,
  CaseStudyOverview,
  CaseStudySection,
  CaseStudyImage,
  CaseStudyQuote,
} from '@/components/case-study';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { CaseStudy } from '@/types/case-study';

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy: CaseStudy | undefined = await getCaseStudyById(id);

  if (!caseStudy) return notFound();

  return (
    <main className="flex-1 py-8">
      <AnimatedSection variant="slideUp">
        <CaseStudyHero
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
            <CaseStudyImage src={item.src} alt={item.alt} caption={item.caption} />
          )}
          {item.type === 'quote' && (
            <CaseStudyQuote quote={item.quote} author={item.author} role={item.role} />
          )}
        </AnimatedSection>
      ))}
    </main>
  );
}
