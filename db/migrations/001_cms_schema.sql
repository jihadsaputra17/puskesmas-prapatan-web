-- CMS schema provisioning migration
--
-- Run once before deploying application code that reads or writes CMS data:
--   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_cms_schema.sql
--
-- Safe to rerun. This migration only creates missing tables/indexes/columns and
-- inserts missing default setting keys. It never drops, truncates, or overwrites
-- existing CMS data. Missing published_at values receive CURRENT_TIMESTAMP.

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  template VARCHAR(50) NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE health_news
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS layanan_poli (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_poli VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  icon VARCHAR(100) DEFAULT '🏥',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jadwal_dokter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_dokter VARCHAR(255) NOT NULL,
  poli VARCHAR(100) NOT NULL,
  hari VARCHAR(50) NOT NULL,
  jam_mulai VARCHAR(10) NOT NULL,
  jam_selesai VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS health_news_slug_idx ON health_news (slug);
CREATE INDEX IF NOT EXISTS jadwal_dokter_poli_hari_idx ON jadwal_dokter (poli, hari);

INSERT INTO website_settings (setting_key, setting_value) VALUES
  ('site_name', 'Puskesmas Prapatan'),
  ('phone', '(0542) 123456'),
  ('email', 'info@puskesmasprapatan.com'),
  ('address', 'Jl. Prapatan No. 1, Kota Balikpapan'),
  ('instagram', 'https://instagram.com/puskesmasprapatan'),
  ('facebook', 'https://facebook.com/puskesmasprapatan'),
  ('hero_title', 'Pelayanan Kesehatan Terbaik untuk Anda'),
  ('hero_subtitle', 'Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.')
ON CONFLICT (setting_key) DO NOTHING;
