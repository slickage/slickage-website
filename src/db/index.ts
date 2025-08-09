import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@/lib/env';

const isLocalDatabase =
  env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('postgres:5432');

function createPool(): Pool {
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' && !isLocalDatabase ? { rejectUnauthorized: false } : false,
  });
}

declare global {
  var __pgPool__: Pool | undefined;
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined;
}

const pool: Pool = globalThis.__pgPool__ ?? createPool();
if (env.NODE_ENV !== 'production') {
  globalThis.__pgPool__ = pool;
}

const db = globalThis.__drizzleDb__ ?? drizzle(pool, { schema });
if (env.NODE_ENV !== 'production') {
  globalThis.__drizzleDb__ = db;
}

export { db, pool };
export * from './schema';
