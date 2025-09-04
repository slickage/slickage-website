import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '../../env';

const isLocalDatabase =
  env.DATABASE_URL?.includes('localhost') || env.DATABASE_URL?.includes('postgres:5432');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' && !isLocalDatabase ? { rejectUnauthorized: false } : false,
});

pool.addListener('error', (error) => {
  console.error('Database connection error:', error);
});

export const db = drizzle(pool, { schema });

export * from './schema';
