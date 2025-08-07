import { pgTable, text, varchar, timestamp, uuid, index } from 'drizzle-orm/pg-core';

export const form_submissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('form_submissions_email_idx').on(table.email),
  createdAtIdx: index('form_submissions_created_at_idx').on(table.createdAt),
}));

export type NewFormSubmission = typeof form_submissions.$inferInsert;
