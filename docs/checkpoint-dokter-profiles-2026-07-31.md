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

## Photo sizing iterations (same day, after launch)

User feedback: photo too small → then cropped. Commits on `main` (pushed, Vercel auto-deploy):

1. `0bda21e` — 40px circle (`h-10 w-10` + `sizes="40px"`) — **too small**
2. `b65d58c` — fixed 176px (`relative h-44 w-full` + `fill object-cover`) — **cropped**
3. `bf2b560` — natural aspect (`w-full h-auto object-contain`, `width=400 height=500`, no fixed height) — **approved ✅**

**Final markup** (`src/components/layout/DokterSection.tsx`):

- Photo: `<SmartImage ... width={400} height={500} className="h-auto w-full object-contain" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />` — full image, no crop
- Fallback (no photo): `aspect-[4/5]` teal block with initials

Also fixed during session: Kelola Dokter missing `loading.tsx` skeleton (commit `4affb8b`, user confirmed working).

**Lesson:** verify live via `curl https://puskesmas-prapatan-web.vercel.app/` (grep for class) — browser cache and unpulled worktree caused false "nothing changed" reports; tell user Ctrl+Shift+R / incognito.
