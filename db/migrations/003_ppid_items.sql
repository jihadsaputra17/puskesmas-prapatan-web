-- Additive PPID (Pejabat Pengelola Informasi dan Dokumentasi) table for public information + admin CMS.
-- Run from operator environment (not via app request path):
--   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/003_ppid_items.sql
--
-- Safe to rerun. Does not drop, truncate, or overwrite existing rows.

CREATE TABLE IF NOT EXISTS ppid_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL DEFAULT 'berkala',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ppid_items_slug_idx
  ON ppid_items (slug);

CREATE INDEX IF NOT EXISTS ppid_items_category_published_idx
  ON ppid_items (category, published_at DESC);
