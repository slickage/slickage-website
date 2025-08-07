import { notFound } from 'next/navigation';
import { getCaseStudyById } from '@/data/case-studies';
import {
  CaseStudyHero,
  CaseStudyOverview,
  CaseStudySection,
  CaseStudyImage,
  CaseStudyQuote,
} from '@/components/case-study';
import type { CaseStudy } from '@/types/case-study';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy: CaseStudy | undefined = await getCaseStudyById(id);

  if (!caseStudy) return notFound();

  return (
    <main className="flex-1 py-8">
      <AnimatedSection>
        <CaseStudyHero
          title={caseStudy.title}
          subtitle={caseStudy.subtitle}
          heroImage={caseStudy.heroImage}
        />
      </AnimatedSection>
      <AnimatedSection>
        <CaseStudyOverview
          overview={caseStudy.overview}
          tags={caseStudy.tags}
          quickFacts={caseStudy.quickFacts}
        />
      </AnimatedSection>
      {caseStudy.content.map((item, idx) => (
        <AnimatedSection key={idx}>
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
