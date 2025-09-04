import { pgTable, text, varchar, timestamp, uuid, index, jsonb } from 'drizzle-orm/pg-core';

// Define the content item type here since it's specific to case studies
export type CaseStudyContentItem =
  | { type: 'section'; title: string; content: string }
  | { type: 'hero'; title: string; subtitle: string; heroImage: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'quote'; quote: string; author: string; role?: string };

export const form_submissions = pgTable(
  'form_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 255 }),
    subject: varchar('subject', { length: 255 }).notNull(),
    message: text('message').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('form_submissions_email_idx').on(table.email),
    index('form_submissions_created_at_idx').on(table.createdAt),
  ],
);

export const case_studies = pgTable(
  'case_studies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    subtitle: text('subtitle').notNull(),
    heroImage: varchar('hero_image', { length: 500 }).notNull(),
    overview: text('overview').notNull(),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    quickFacts: jsonb('quick_facts').$type<Record<string, string>>().notNull().default({}),
    content: jsonb('content').$type<CaseStudyContentItem[]>().notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('case_studies_slug_idx').on(table.slug),
  ],
);

export const insights = pgTable(
  'insights',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    imageSrc: varchar('image_src', { length: 500 }).notNull(),
    tags: jsonb('tags').$type<string[]>().notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('insights_slug_idx').on(table.slug),
  ],
);

export type NewFormSubmission = typeof form_submissions.$inferInsert;
export type NewCaseStudy = typeof case_studies.$inferInsert;
export type NewInsight = typeof insights.$inferInsert;

export type CaseStudy = typeof case_studies.$inferSelect;
export type Insight = typeof insights.$inferSelect;
