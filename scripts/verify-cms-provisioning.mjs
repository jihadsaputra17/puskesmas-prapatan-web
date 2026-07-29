import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const migrationPath = "db/migrations/001_cms_schema.sql";
const requiredTables = ["users", "health_news", "layanan_poli", "jadwal_dokter", "website_settings"];
const migration = await readFile(migrationPath, "utf8");

for (const table of requiredTables) {
  if (!new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "i").test(migration)) {
    throw new Error(`Missing idempotent provisioning for ${table}.`);
  }
}

for await (const path of glob("src/**/*.{ts,tsx}")) {
  const source = await readFile(path, "utf8");
  if (/\b(?:CREATE|ALTER|DROP)\s+TABLE\b/i.test(source)) {
    throw new Error(`Runtime schema DDL found in ${path}.`);
  }
}

console.log("CMS provisioning migration covers all CMS tables; runtime source has no table DDL.");
