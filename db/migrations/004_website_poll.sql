-- Additive website polling table for public Beranda poll.
-- Run from operator environment (not via app request path):
--   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/004_website_poll.sql
--
-- Safe to rerun. Does not drop, truncate, or overwrite existing rows.

CREATE TABLE IF NOT EXISTS website_poll (
  option_key VARCHAR(50) PRIMARY KEY,
  votes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO website_poll (option_key, votes) VALUES
  ('sangat_bermanfaat', 0),
  ('cukup_bermanfaat', 0),
  ('bermanfaat', 0),
  ('kurang_bermanfaat', 0)
ON CONFLICT (option_key) DO NOTHING;
