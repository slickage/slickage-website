import type { Insight } from '@/server/db/schema';
import { getFeaturedInsights } from '@/features/insights/db/insights-queries';
import { InsightCard } from './insight-card';
import { connection } from 'next/server';

export async function InsightsSection() {
  await connection();
  const insights: Insight[] = await getFeaturedInsights();

  return (
    <section id="insights" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="mx-auto text mb-12">
          <h2 className="text-4xl md:text-5xl leading-[1.1] font-bold mb-4 gradient-text">
            Insights
          </h2>
          <p className="text-xl text-gray-400">
            Read about how we built successful products with our partners.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {insights.map((insight: Insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </section>
  );
}
