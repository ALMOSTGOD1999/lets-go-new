import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });
config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required");

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // 1. Check table columns
    console.log("── Columns in itineraries table ──");
    const columns = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_name = 'itineraries'
       ORDER BY ordinal_position`,
    );
    for (const row of columns.rows) {
      console.log(
        `  ${row.column_name}  (${row.data_type})  nullable=${row.is_nullable}  default=${row.column_default ?? "—"}`,
      );
    }

    // 2. Try an insert with the same shape the app uses
    console.log("\n── Test insert ──");
    const testId = "test" + Date.now().toString(36).slice(0, 21);
    try {
      const result = await pool.query(
        `INSERT INTO itineraries (id, destination, title, days, nights, overview, price, days_details, created_at, updated_at, deleted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, DEFAULT, $9, DEFAULT)
         RETURNING id, title, destination, days, nights, overview, price, days_details, created_at, updated_at`,
        [
          testId,
          "Test Destination",
          "Test Title",
          3,
          2,
          "Test overview",
          2000,
          JSON.stringify(["day1 desc", "day2 desc", "day3 desc"]),
          new Date().toISOString(),
        ],
      );
      console.log("  ✓ Test insert succeeded:", result.rows[0].id);
    } catch (err: any) {
      console.log("  ✗ Test insert failed:", err.message);
      if (err.position) {
        console.log("    position:", err.position);
      }
      if (err.detail) {
        console.log("    detail:", err.detail);
      }
      if (err.hint) {
        console.log("    hint:", err.hint);
      }
      if (err.where) {
        console.log("    where:", err.where);
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
