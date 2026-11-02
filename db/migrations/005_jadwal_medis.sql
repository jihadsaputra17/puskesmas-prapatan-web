-- Additive column for medical staff role (Jenis Tenaga Medis) on jadwal_dokter.
-- Safe to rerun.

ALTER TABLE jadwal_dokter
  ADD COLUMN IF NOT EXISTS jenis_tenaga_medis VARCHAR(100) NOT NULL DEFAULT 'Dokter';
