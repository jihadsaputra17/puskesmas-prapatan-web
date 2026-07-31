# Checkpoint — Admin skeleton, dokter sections, Google Maps embed

**Branch:** `main` (pushed, Vercel auto-deploy)
**Date:** 2026-07-31
**Prior docs:** `checkpoint-dokter-slideshow-2026-07-31.md`, `checkpoint-dokter-profiles-2026-07-31.md`

## Commits (this session, newest first)

| Commit | What |
|---|---|
| `115d55d` | Maps: official pb embed with "Puskesmas Prapatan" place marker |
| `7e1bcea` | Maps: coords update `-1.273145, 116.820868` |
| `579a986` | **CSP fix**: add `frame-src https://www.google.com` to allow maps iframe |
| `dd7ba7b` | Maps iframe added to "Hubungi Kami" panel on `/profil` |
| `80f8997` | Dokter section removed from `/layanan` (beranda only) |
| `ca22926` | Dokter skeleton on beranda (was `fallback={null}` → blank gap) |
| `99e53dc` | Admin dashboard skeleton loading |

## 1. Admin dashboard skeleton

- `/admin` was the only admin page without `loading.tsx` → clicking "Dashboard Utama" gave zero feedback during server render
- Added `src/app/admin/loading.tsx`: pulsing header bars + 3 summary card blocks + berita panel block
- Same pattern as existing admin `loading.tsx` files (dokter/berita/jadwal/layanan/settings)

## 2. Dokter section fixes

- **Beranda delay**: `page.tsx` had `<Suspense fallback={null}>` around `DokterSection` → section popped in after all others (Berita/Layanan had skeletons)
  - Fix: new `src/components/layout/DokterSkeleton.tsx` (sky-wash band, pulsing heading + 3 × 4:5 card placeholders) as fallback
  - Verified: skeleton string present in initial streamed HTML (`curl | grep "Memuat dokter"`), then swaps to 4 real cards
- **Layanan page**: user didn't want doctor cards on `/layanan` (beranda only)
  - Removed `<DokterSection />` + import from `src/app/layanan/page.tsx` (also dropped now-unused `Link` import)
  - Verified: `/layanan` HTML has no `dokter-heading`/`id="dokter"`; beranda still does

## 3. Google Maps embed — 3 iterations (pitfalls documented)

1. `dd7ba7b` — added user-provided iframe (`maps?q=coords&output=embed`) to `/profil` Hubungi Kami panel. **Nothing rendered**: site CSP `src/middleware.ts` had `default-src 'self'` with no `frame-src` → iframe blocked (0 google requests in headless).
2. `579a986` — added `frame-src https://www.google.com` to CSP. Map loaded (27 google reqs, colored tiles confirmed via pixel sampling — blue water / beige roads).
3. `7e1bcea` — user gave new coords `-1.273145, 116.820868` (share link `maps.app.goo.gl/vr8dcUj1VGJkex9BA`). Resolved link → pure coords, no place → **pin showed raw coordinates** `1°16'23.3"S 116°49'15.1"E` (canvas label, not DOM text).
4. `115d55d` — user supplied official embed URL (pb string, place ID `0x84589db9a99b3a15`, name `Puskesmas Prapatan`). Pin now shows place label. Final:

```jsx
<iframe
  title="Lokasi Puskesmas Prapatan"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.30208068394845!2d116.82057021651418!3d-1.273194055199423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df1473fec75d6c9%3A0x84589db9a99b3a15!2sPuskesmas%20Prapatan!5e0!3m2!1sen!2sus!4v1785490729632!5m2!1sen!2sus"
  width="100%" height="180" style={{ border: 0 }} loading="lazy"
  referrerPolicy="no-referrer-when-downgrade" className="mt-6 rounded-lg"
/>
```

## Verification notes

- All: lint OK, `npm run build` OK
- Live checks via `curl` grep (skeleton strings, `maps/embed?pb=`, absence of `dokter-heading` on `/layanan`)
- Map render verified in headless Chrome: 27 google requests, frame `google.com/maps/embed?pb=...` loads, pixel sampling showed colored map tiles

## Lessons

1. **CSP gotcha**: `frame-src` must be explicit — `default-src 'self'` silently blocks iframes. Curl headers confirm CSP live; grep for `frame-src`.
2. **Coordinate `?q=` embeds show coordinate text as the pin label** — no place name in URL → no name on map. Use the official pb embed URL (Share → Embed a map) for labeled pins.
3. `loading="lazy"` iframe only fetches near viewport — scrollIntoView in puppeteer needed to trigger; user must scroll too.
4. Vercel deploys lag ~40–90s after push — wait, re-curl before blaming code.
5. `p.createCDPSession()` is a Promise in modern puppeteer — must `await`.
6. Google Maps embed refuses direct navigation (must be in iframe) — test embeds via `setContent` with iframe, not `goto` on the embed URL.

## Next steps / leftovers

- Optionally add map to footer "Hubungi kami" (user declined-adjacent; offer still open)
- Untracked images in repo root (`WhatsApp Image 2026-06-29...`, `LOGO PKM EDIT.png`, `poto puskesmas prapatan.jpg`)
- Parked branches: `feat/admin-ui-design-a-polish`, `feat/public-patient-experience`
- 4 doctor photos: re-upload once via Kelola Dokter if pre-autosize photos need uniform 4:5 crop
