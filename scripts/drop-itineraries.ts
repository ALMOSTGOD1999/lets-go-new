import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });
config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Add it to .env.local.');
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    await pool.query('DROP TABLE IF EXISTS itineraries;');
    console.log('✓ itineraries table dropped');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
