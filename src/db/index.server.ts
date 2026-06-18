import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL ?? '', { schema });

export function getDb() {
  return db;
}

export type Database = ReturnType<typeof getDb>;
