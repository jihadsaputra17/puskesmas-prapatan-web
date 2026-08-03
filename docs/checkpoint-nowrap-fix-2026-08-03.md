# Checkpoint — Dokter subtitle nowrap fix

**Commit:** `7a2d45c`
**Date:** 2026-08-03
**Branch:** `main` (pushed, Vercel auto-deploy)
**Live:** https://pkmprapatanbpn.web.id/ ✅ verified (deploy lag ~75s)

---

## Change

`src/components/layout/DokterSection.tsx` — subtitle "Tenaga medis yang melayani..." span:

```
whitespace-nowrap  →  md:whitespace-nowrap
```

Why: full-`nowrap` could overflow/wrap awkwardly on narrow mobile. Now wraps freely below `md` (768px), single line on desktop+.

## Verified

- `curl https://pkmprapatanbpn.web.id/ | grep -o 'whitespace-nowrap\|md:whitespace-nowrap'` → `md:whitespace-nowrap` × 2 (one here, one pre-existing md:-prefixed class elsewhere)
- Git: `0546c26..7a2d45c` clean single-commit push

## Repo state at session end

- `main` HEAD = `7a2d45c`, origin/main in sync, production live on custom domain `pkmprapatanbpn.web.id` (SSL, env swapped, NS on Vercel)
- Worktree `.worktrees/dokter-profiles` still dirty/stale (wrong description copy + old photo sizing) — parked, do not merge as-is
- Untracked root images still uncommitted: `LOGO PKM EDIT.png`, `poto puskesmas prapatan.jpg`, 6× `WhatsApp Image 2026-06-29...jpeg`
- Parked branches: `feat/admin-ui-design-a-polish`, `feat/public-patient-experience`

## Backlog (from prior handoffs)

1. Re-upload 4 doctor photos via Kelola Dokter for uniform 4:5 crop (existing show via `object-cover` anyway)
2. Commit or delete untracked root images
3. Author fields (name, role) for berita
4. Jadwal override (cuti/dinas) — DB migration needed
5. Vercel Blob for images instead of data URLs
6. Admin panel for viewing complaints in DB
7. Optional: map in footer "Hubungi kami" (offer still open)
