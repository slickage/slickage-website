import { eq } from 'drizzle-orm';
import { db } from '@/server/db';
import { case_studies, type CaseStudy } from '@/server/db/schema';

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const result = await db.select().from(case_studies).where(eq(case_studies.slug, slug)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await db.select().from(case_studies).orderBy(case_studies.createdAt);
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}
