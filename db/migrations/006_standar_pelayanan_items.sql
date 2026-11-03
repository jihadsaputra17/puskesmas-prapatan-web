-- Standar Pelayanan (Public Service Standards) CMS table
-- Safe to rerun.

CREATE TABLE IF NOT EXISTS standar_pelayanan_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL DEFAULT 'standar-pelayanan',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  file_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS standar_pelayanan_items_slug_idx
  ON standar_pelayanan_items (slug);

CREATE INDEX IF NOT EXISTS standar_pelayanan_items_category_published_idx
  ON standar_pelayanan_items (category, published_at DESC);
