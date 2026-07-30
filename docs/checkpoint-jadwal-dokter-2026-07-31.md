# Checkpoint: Jadwal Dokter — Card Layout

**Commit:** `a7ce20b`
**Date:** 2026-07-31
**Branch:** `main`
**Deploy:** https://puskesmas-prapatan-web.vercel.app/jadwal-dokter

---

## Done

### Redesign public jadwal-dokter page
- Card-based layout (no table) matching user's HTML prototype
- Grouped by hari, today first with orange `badge-today`
- Each card: doctor name (bold, navy), poli (muted), time chip (teal pill), status chip

### Search & filter
- **Cari nama dokter** — live text input, filters by name or poli
- **Filter poli** — `<select>` auto-populated from data
- **Filter hari** — `<select>` auto-populated from active days
- Empty state when no results

### Live status
- Shows **"Sedang praktik"** (green) if today + current time is within `jam_mulai`–`jam_selesai`
- Shows **"Tutup"** (grey) if today but outside hours
- No status chip on non-today days

### Data layer
- `getJadwalDokter()` now returns `jam_mulai` and `jam_selesai` individually (in addition to `hours`)
- `JadwalDokter` type extended with both time fields

### UI polish
- Skeleton loading matches new card layout
- Controls panel responsive (3-col on `sm+`)
- Page intro unchanged (eyebrow + title + copy)
- Footnote disclaimer preserved

### Dev
- Build: ✅ 0 errors
- Tests: 66/66 ✅ (ScheduleExplorer test updated for new query/labels)
- No override (cuti/dinas) — skipped per user decision

## Files changed

| File | Change |
|---|---|
| `src/lib/actions.ts` | Added `jam_mulai`, `jam_selesai` to type + query |
| `src/components/jadwal/ScheduleExplorer.tsx` | Complete rewrite — cards, search, filters, status |
| `src/components/jadwal/ScheduleExplorer.test.tsx` | Updated data shape + label query |
| `src/app/jadwal-dokter/page.tsx` | Minor copy update |
| `src/app/jadwal-dokter/loading.tsx` | Rewrite to match card skeleton |
| `src/app/globals.css` | Added `.controls-panel`, `.card`, `.time-chip`, `.status-chip`, `.badge-today`, `.empty-state`, `.footnote` |

## Not included (future)
- DB migration for override (cuti/dinas luar/tutup with start/end dates)
- Admin form changes for override
