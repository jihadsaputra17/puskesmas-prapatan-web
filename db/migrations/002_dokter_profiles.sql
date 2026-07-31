-- Additive doctor profile table for public Pelayanan cards + admin CMS.
-- Run from operator environment (not via app request path):
--   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql
--
-- Safe to rerun. Does not drop, truncate, or overwrite existing rows.

CREATE TABLE IF NOT EXISTS dokter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  poli VARCHAR(100) NOT NULL,
  foto_url TEXT NOT NULL DEFAULT '',
  urutan INT NOT NULL DEFAULT 0,
  aktif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS dokter_aktif_urutan_nama_idx
  ON dokter (aktif, urutan, nama);

CREATE INDEX IF NOT EXISTS dokter_poli_idx
  ON dokter (poli);
