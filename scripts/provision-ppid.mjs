import { readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";

const rootDir = path.resolve(import.meta.dirname, "..");

if (!process.env.POSTGRES_URL) {
  const envText = await readFile(path.join(rootDir, ".env.local"), "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const migration = await readFile(path.join(rootDir, "db/migrations/003_ppid_items.sql"), "utf8");
const statements = migration
  .split(";")
  .map((s) =>
    s
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim(),
  )
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
}

console.log("Successfully provisioned ppid_items table and indexes in Postgres.");
process.exit(0);
