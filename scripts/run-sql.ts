/**
 * scripts/run-sql.ts
 *
 * Пряме виконання SQL проти Postgres (DATABASE_URL з .env.local) — для
 * DDL/міграцій, які не проходять через PostgREST. З'явилось 2026-09-17,
 * коли користувач дав прямий доступ до бази, щоб не копіювати міграції
 * в SQL Editor щоразу вручну.
 *
 * npx tsx scripts/run-sql.ts "select 1;"
 * npx tsx scripts/run-sql.ts --file supabase/migrations/xxx.sql
 *
 * УРОК (див. tender-intel/supabase/migrations/20260914000000_...): якщо
 * роль (anon/authenticated) має ТАБЛИЧНИЙ grant, `REVOKE SELECT (col)`
 * — no-op. Спочатку REVOKE на всю таблицю, потім GRANT явним списком.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { Client } from "pg";

async function main() {
  const [arg1, arg2] = process.argv.slice(2);
  if (!arg1) {
    console.error('Використання: npx tsx scripts/run-sql.ts "<sql>"  або  --file <path>');
    process.exit(1);
  }
  const sql = arg1 === "--file" ? readFileSync(arg2, "utf8") : arg1;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL відсутній у .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const result: any = await client.query(sql);
    const results = Array.isArray(result) ? result : [result];
    for (const r of results) {
      if (r.rows?.length) console.log(JSON.stringify(r.rows, null, 2));
      else console.log(`OK (${r.command}, rowCount=${r.rowCount})`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("ПОМИЛКА:", err.message);
  process.exit(1);
});
