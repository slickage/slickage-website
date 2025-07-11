// Case Study Detail Page Template for /case-studies/[id]
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

// Uncomment and use this for future API fetching
// async function fetchCaseStudy(id: string) {
//   const res = await fetch(`/api/case-studies/${id}`);
//   if (!res.ok) throw new Error('Failed to fetch');
//   return res.json();
// }

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy: CaseStudy | undefined = await getCaseStudyById(id);
  let markdownHtml: string | null = null;

  if (caseStudy?.markdownContent) {
    const { remark } = await import('remark');
    const remarkHtml = (await import('remark-html')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const file = await remark().use(remarkGfm).use(remarkHtml).process(caseStudy.markdownContent);
    markdownHtml = String(file);
  }

  if (!caseStudy) return notFound();

  return (
    <main className="flex-1">
      <CaseStudyHero {...caseStudy} />
      <CaseStudyOverview {...caseStudy} />
      {caseStudy.content.map((item, idx) => {
        if (item.type === 'section') {
          return <CaseStudySection key={idx} title={item.title} content={item.content} />;
        }
        if (item.type === 'image') {
          return <CaseStudyImage key={idx} src={item.src} alt={item.alt} caption={item.caption} />;
        }
        if (item.type === 'quote') {
          return (
            <CaseStudyQuote key={idx} quote={item.quote} author={item.author} role={item.role} />
          );
        }
        return null;
      })}
      {markdownHtml && (
        <section className="prose prose-invert prose-lg slickage-prose mx-auto my-8">
          <div dangerouslySetInnerHTML={{ __html: markdownHtml }} />
        </section>
      )}
    </main>
  );
}
