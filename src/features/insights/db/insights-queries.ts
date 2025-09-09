import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { insights, type Insight } from '@/server/db/schema';

export async function getFeaturedInsights(): Promise<Insight[]> {
  try {
    return await db.select().from(insights).orderBy(insights.createdAt);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  try {
    const result = await db.select().from(insights).where(eq(insights.slug, slug)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching insight:', error);
    return null;
  }
}
