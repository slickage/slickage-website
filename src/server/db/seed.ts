import { db } from './index';
import { case_studies, insights } from './schema';
import { caseStudies } from '../data/case-studies';
import { featuredInsights } from '../data/insights';

async function seed() {
  console.log('Seeding database...');

  try {
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
      }).onConflictDoNothing();
      console.log(`Added case study: ${caseStudy.title}`);
    }

    console.log('Seeding insights...');
    for (const insight of featuredInsights) {
      await db.insert(insights).values({
        slug: insight.slug,
        title: insight.title,
        description: insight.description,
        imageSrc: insight.imageSrc,
        tags: insight.tags,
      }).onConflictDoNothing();
      console.log(`Added insight: ${insight.title}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

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
