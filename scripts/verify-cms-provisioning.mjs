import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const migration001 = await readFile("db/migrations/001_cms_schema.sql", "utf8");
const migration002 = await readFile("db/migrations/002_dokter_profiles.sql", "utf8");

const requiredTables001 = ["users", "health_news", "layanan_poli", "jadwal_dokter", "website_settings"];
for (const table of requiredTables001) {
  if (!new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "i").test(migration001)) {
    throw new Error(`Missing idempotent provisioning for ${table} in 001.`);
  }
}

if (!/CREATE TABLE IF NOT EXISTS health_news[\s\S]*?published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP/i.test(migration001)) {
  throw new Error("Fresh health_news provisioning must include published_at with a non-null current timestamp default.");
}

if (!/ALTER TABLE health_news\s+ADD COLUMN IF NOT EXISTS published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP/i.test(migration001)) {
  throw new Error("Existing health_news tables must receive idempotent published_at provisioning with a non-null current timestamp backfill.");
}

if (!/CREATE TABLE IF NOT EXISTS dokter\b/i.test(migration002)) {
  throw new Error("Missing idempotent provisioning for dokter in 002.");
}
for (const col of ["nama", "poli", "foto_url", "urutan", "aktif"]) {
  if (!new RegExp(`\\b${col}\\b`, "i").test(migration002)) {
    throw new Error(`dokter migration 002 missing column ${col}.`);
  }
}

for await (const path of glob("src/**/*.{ts,tsx}")) {
  const source = await readFile(path, "utf8");
  if (/\b(?:CREATE|ALTER|DROP)\s+TABLE\b/i.test(source)) {
    throw new Error(`Runtime schema DDL found in ${path}.`);
  }
}

console.log("CMS provisioning migrations cover all CMS tables; runtime source has no table DDL.");
