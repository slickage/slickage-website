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

// Uncomment and use this for future API fetching
// async function fetchCaseStudy(id: string) {
//   const res = await fetch(`/api/case-studies/${id}`);
//   if (!res.ok) throw new Error('Failed to fetch');
//   return res.json();
// }

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy: CaseStudy | undefined = await getCaseStudyById(id);

  if (!caseStudy) return notFound();

  return (
    <main className="flex-1 py-8">
      <AnimatedSection>
        <CaseStudyHero {...caseStudy} />
      </AnimatedSection>
      <AnimatedSection>
        <CaseStudyOverview {...caseStudy} />
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
