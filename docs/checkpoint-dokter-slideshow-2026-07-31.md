# Checkpoint — Dokter slideshow (carousel)

**Branch:** `main` (pushed, Vercel auto-deploy)
**Date:** 2026-07-31
**Prior doc:** `docs/checkpoint-dokter-profiles-2026-07-31.md` (photo sizing history)

## User requirement (turned out to be the real ask)

> "IF THE PHOTO OF DOCTOR MORE THAN 3, MAKE IT SLIDESHOW!!!"

Squishing/tightening photos was **rejected**. Instead: `>3` doctors → slideshow, not a tall grid.

## Commits

| Commit | What |
|---|---|
| `2559ee2` | Tighten section rhythm (`py-10 md:py-12`) + doctor photos 4:5 (shorter, uniform) |
| `a2c121a` | Admin photo autosize: client-side center-crop to aspect + live preview (`CoverImageField`, `image-compress.ts`) |
| `e80a7a4` | chore: ignore `.vercel`, `.env*` |
| `097a17e` | docs: prior checkpoint |
| `9046d0f` | **feat: doctor slideshow when >3 doctors** |
| `9c9e230` | **style: hero-style overlay arrows on slideshow** |

## Implementation

### New files
- `src/components/layout/DokterCard.tsx` — shared card (photo/initials, nama, poli); grid + carousel reuse it
- `src/components/layout/DokterCarousel.tsx` — `"use client"` scroll-snap carousel:
  - Track: `snap-x snap-mandatory`, cards `w-[85%]` mobile / `calc(50%-0.5rem)` sm / `calc(33.333%-0.667rem)` lg, hidden scrollbar
  - Prev/next buttons + dot pagination (`Ke dokter N`)
  - `scrollBy`/`scrollTo` smooth, resize listener, scroll-position → disabled state

### Changed
- `src/components/layout/DokterSection.tsx` — `CAROUSEL_MIN = 4`; `>=4` → `<DokterCarousel>`, else existing grid
- `src/components/layout/DokterSection.test.tsx` — mock `DokterCard`; +1 test: 5 doctors → prev/next buttons + 5 dots visible

### Arrow restyle (matches hero slideshow)
Swiper nav style from `HeroSlideshow.tsx` + `globals.css` `.hero-slideshow .swiper-button-*`:
- 48×48 circle, `bg-white/70` + `backdrop-blur-md`, `shadow-md`, navy icon (18px chevron SVG)
- Absolute overlay at track edges (`left/right-2 sm:left/right-4`), `top-1/2 -translate-y-1/2`, `z-10`
- Hover: solid white + teal + `scale-110`; disabled: `opacity-35 pointer-events-none`

## Verification (all passed)

- Vitest: **81/81** (22 files); new carousel test green
- `eslint` OK on all touched files; `npm run build` compiles
- **Live browser check** (puppeteer-core + Chrome, 1440px): seed 2 fake doctors (6 total) → carousel rendered: 6 cards, 6 dots, prev disabled at start, click next → scroll 0→411px, active dot 1, prev enabled. **Then deleted fakes**.
- Real DB already had 4 active doctors (Tien, Yose, Narni, Indri) → **carousel live on production with real data**
- Post-arrow-restyle DOM check: 48×48, `rgba(255,255,255,0.7)`, `blur(12px)`, prev at track left edge (128 vs track 112), disabled correctly

## Tooling note (no psql on this machine)

`psql` not installed. Temporary seed/cleanup used a throwaway node script with `@vercel/postgres` reading `POSTGRES_URL` from `.env.local`:

```js
import { sql } from "@vercel/postgres";
await sql`INSERT INTO dokter (nama, poli, foto_url, urutan, aktif) VALUES (..)`;
await sql`DELETE FROM dokter WHERE nama = ANY(${FAKE_NAMES})`;
```

Script was deleted after use. Repo stays clean of prod-DB tooling.

## Behavior summary (for handoff)

- **≤3 doctors** → grid (unchanged)
- **>3 doctors** → one-row slideshow: 3 visible desktop, 2 tablet, 1 mobile (peek next card)
- Dots below; arrows match hero style; native touch swipe still works
- Threshold is server-side (`doctors.length >= 4`) — no admin toggle needed

## Next steps / leftovers

1. Photos uploaded before autosize feature may not be 4:5-cropped — re-upload once via Kelola Dokter for uniform crop (existing ones display 4:5 via `object-cover` anyway)
2. Untracked images in repo root (`WhatsApp Image 2026-06-29...jpeg`, `LOGO PKM EDIT.png`, `poto puskesmas prapatan.jpg`) — likely real doctor/brand assets, commit or delete
3. Open branches still parked: `feat/admin-ui-design-a-polish`, `feat/public-patient-experience`
4. `db/migrations/002_dokter_profiles.sql` already applied (site works, doctors in DB)

## Lesson (repeat from prior checkpoint)

Always hard refresh (Ctrl+Shift+R) after deploy — browser cache caused false "nothing changed" reports. Verify live via puppeteer/curl against `https://puskesmas-prapatan-web.vercel.app/`.
