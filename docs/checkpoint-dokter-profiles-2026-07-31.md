# Checkpoint — Dokter profiles

**Branch:** `feat/dokter-profiles`  
**Date:** 2026-07-31  
**Spec:** `docs/superpowers/specs/2026-07-31-dokter-profiles-design.md`  
**Plan:** `docs/superpowers/plans/2026-07-31-dokter-profiles.md`

## Deploy order

1. `psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql`
2. Deploy app from this branch / after merge
3. Admin → **Kelola Dokter** → add real doctors (foto, nama, poli)
4. Confirm home + `/layanan` show cards; set **Nonaktif** hides card

## Scope delivered

- Photo + name + poli cards under Pelayanan (home + `/layanan`)
- Admin CRUD at `/admin/dokter` (urutan, aktif, CoverImageField)
- New table `dokter` — separate from `jadwal_dokter`
- Empty public list → section hidden
- Tests: 77 pass; `test:cms-provisioning` pass

## Not in v1

- Detail page / bio
- Swiper carousel
- FK dokter ↔ jadwal
- Vercel Blob storage
