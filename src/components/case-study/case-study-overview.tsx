import type { CaseStudy } from '@/types/case-study';

export default function CaseStudyOverview({
  overview,
  tags,
  quickFacts,
}: Pick<CaseStudy, 'overview' | 'tags' | 'quickFacts'>) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-xl text-gray-300 mb-4 whitespace-pre-wrap">{overview}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          {quickFacts && (
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {Object.entries(quickFacts).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white/5 rounded-lg px-4 py-2 text-sm text-gray-200 shadow"
                >
                  <span className="block font-semibold text-blue-400">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
