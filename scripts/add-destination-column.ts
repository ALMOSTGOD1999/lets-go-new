import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });
config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl)
    throw new Error("DATABASE_URL is required. Add it to .env.local.");

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Add free-text destination column (for frontend use)
    await pool.query(`
      ALTER TABLE itineraries
      ADD COLUMN IF NOT EXISTS destination text NOT NULL DEFAULT '';
    `);
    console.log("✓ destination column added to itineraries table");

    // Add deleted_at column (for soft-delete)
    await pool.query(`
      ALTER TABLE itineraries
      ADD COLUMN IF NOT EXISTS deleted_at timestamp;
    `);
    console.log("✓ deleted_at column added to itineraries table");

    // Make destination_id nullable since the frontend uses free-text destination
    await pool.query(`
      ALTER TABLE itineraries
      ALTER COLUMN destination_id DROP NOT NULL;
    `);
    console.log("✓ destination_id constraint removed (now nullable)");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
