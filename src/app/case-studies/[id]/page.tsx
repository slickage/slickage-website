'use client';

import { notFound } from 'next/navigation';
import { getCaseStudyById } from '@/data/case-studies';
import { CaseStudyHero } from '@/components/case-study/case-study-hero';
import { CaseStudyOverview } from '@/components/case-study/case-study-overview';
import { CaseStudySection } from '@/components/case-study/case-study-section';
import { CaseStudyImage } from '@/components/case-study/case-study-image';
import { CaseStudyQuote } from '@/components/case-study/case-study-quote';
import { AnimatedSection } from '@/components/ui/animated-section';
import type { CaseStudy } from '@/types/case-study';
import { useEffect, useState } from 'react';

export default function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [caseStudy, setCaseStudy] = useState<CaseStudy | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        const { id } = await params;
        const data = await getCaseStudyById(id);
        setCaseStudy(data);
      } catch (error) {
        console.error('Error loading case study:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCaseStudy();
  }, [params]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
