import 'server-only';

import { db } from './index';
import { case_studies, insights } from './schema';
import { caseStudies } from '../data/case-studies';
import { featuredInsights } from '../data/insights';
import { logger } from '@/lib/utils/logger';

async function seed() {
  console.log('Seeding database...');

  try {
    // Seed case studies
    console.log('Seeding case studies...');
    for (const caseStudy of caseStudies) {
      await db.insert(case_studies).values({
        slug: caseStudy.slug,
        title: caseStudy.title,
        subtitle: caseStudy.subtitle,
        heroImage: caseStudy.heroImage,
        overview: caseStudy.overview,
        tags: caseStudy.tags,
        quickFacts: caseStudy.quickFacts || {},
        content: caseStudy.content,
      });
      logger.info(`Added case study: ${caseStudy.title}`);
    }

    // Seed insights
    console.log('Seeding insights...');
    for (const insight of featuredInsights) {
      await db.insert(insights).values({
        slug: insight.slug,
        title: insight.title,
        description: insight.description,
        imageSrc: insight.imageSrc,
        tags: insight.tags,
      });
      logger.info(`Added insight: ${insight.title}`);
    }

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}

export { seed };
