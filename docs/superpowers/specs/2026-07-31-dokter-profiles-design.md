# Tim Dokter (photo + name + poli) — design

**Date:** 2026-07-31  
**Status:** approved for planning (user: “I just trust your recommendation”)  
**Scope:** public doctor cards under Pelayanan + admin CRUD for doctor profiles.

## Context

Website Puskesmas Prapatan already has:

- Public **Pelayanan / Layanan poli** block (home + `/layanan`)
- CMS for berita, layanan, jadwal, settings, users
- `jadwal_dokter` stores schedule rows only (`nama_dokter`, `poli`, hours) — no photo, no profile entity
- Image pattern for berita: HTTPS URL **or** compressed `data:image/*` via `CoverImageField` + `SmartImage`
- Auth: `requireAdmin` / `requireSuperadmin`, Zod at mutation boundaries

User wants a **“trusted experts”** style block under Pelayanan: doctor **photo + name + poli**, editable in admin.

## Goals

- Show real doctor profiles (photo, name, poli) under Pelayanan on public site.
- Let `admin` / `superadmin` create, edit, delete, reorder, and show/hide doctors in CMS.
- Reuse Design A civic tokens and existing image upload/display patterns.
- Keep existing `jadwal_dokter` schedule behavior unchanged.
- Never invent doctor names, photos, or credentials.

## Non-goals (v1)

- Doctor detail/profile page and long bio (option C deferred).
- Swiper carousel clone of commercial hospital sites (use accessible card grid first).
- Hard FK link between doctor rows and schedule rows.
- Vercel Blob / external object storage (keep data URL + HTTPS like berita).
- Changing top-level public nav (no new “Dokter” menu item in v1).
- Clinical booking, credentials verification, or license registry.

## Decisions locked with user

| Topic | Choice |
|-------|--------|
| Placement | Under **Pelayanan / Layanan poli** |
| Card content | **B** — photo + name + poli |
| Admin | Full CRUD in admin menu |
| Data model | **Approach 1** — new `dokter` table, separate from `jadwal_dokter` |
| Process | User delegated remaining product choices to agent recommendations |

## Data model

New table `dokter` (additive migration only):

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID PK | `gen_random_uuid()` |
| `nama` | VARCHAR(255) NOT NULL | Display name |
| `poli` | VARCHAR(100) NOT NULL | Free text matching layanan/jadwal poli labels |
| `foto_url` | TEXT NOT NULL DEFAULT `''` | HTTPS/HTTP URL or empty; may store compressed data URL like berita |
| `urutan` | INT NOT NULL DEFAULT `0` | Lower = earlier |
| `aktif` | BOOLEAN NOT NULL DEFAULT `true` | Public visibility |
| `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | |

Indexes:

- `(aktif, urutan, nama)` for public list
- optional `(poli)` for future per-poli filter

Migration file: `db/migrations/002_dokter_profiles.sql`

- `CREATE TABLE IF NOT EXISTS`
- indexes `IF NOT EXISTS`
- no DROP / destructive ALTER
- safe to rerun
- extend `scripts/verify-cms-provisioning.mjs` / `test:cms-provisioning` to require `dokter` table

**No seed rows.** Empty public section hides until staff add real doctors.

### Relation to jadwal

- `jadwal_dokter` remains schedule-only.
- Names may match by convention (`nama` ≈ `nama_dokter`, `poli` string) but **no FK** in v1.
- Admin copy may note: “Jadwal praktik tetap dikelola di menu Jadwal Dokter.”

## Authorization and validation

- All dokter admin pages and mutations: `requireAdmin()` (same as layanan/jadwal).
- Zod `dokterSchema`:

```ts
{
  nama: required non-empty trimmed string
  poli: required non-empty trimmed string
  foto_url: same rules as berita optionalNewsImage
    (empty | http(s) | data:image/(png|jpe?g|gif|webp);base64, length ≤ 2_000_000)
  urutan: optional int ≥ 0 (default 0)
  aktif: optional boolean (default true)
}
```

- API: authorize → parse → SQL → `revalidatePath` for `/`, `/layanan`, `/admin/dokter`.
- Unauthorized → safe 401/403; validation → 400 + field errors; never leak SQL/stack.

## Admin experience

### Nav

Add to shared admin links (after Layanan Poli or before Jadwal):

- `{ href: "/admin/dokter", label: "Kelola Dokter" }`

### Routes (mirror layanan/jadwal)

| Route | Purpose |
|-------|---------|
| `/admin/dokter` | List: photo thumb, nama, poli, urutan, aktif badge, edit + delete |
| `/admin/dokter/tambah` | Create form |
| `/admin/dokter/[id]/edit` | Edit form |

### Form fields

- Nama (required)
- Poliklinik (required text; free string, consistent with jadwal `poli`)
- Foto — reuse `CoverImageField` / compress pattern (drag-drop → WebP data URL) + optional URL fallback
- Urutan (number, default 0)
- Aktif (checkbox, default on)

### List UX

- Table desktop / cards mobile (match existing admin density)
- Confirm before delete (`ConfirmDeleteButton` pattern)
- Empty state factual: “Belum ada data dokter.”
- No fabricated counts beyond real row count if shown on dashboard (optional later; not required v1)

### API

| Method | Path | Action |
|--------|------|--------|
| POST | `/api/dokter` | Create |
| PUT | `/api/dokter/[id]` | Update |
| DELETE | `/api/dokter/[id]` | Delete |

Shared read helpers in e.g. `src/lib/dokter-actions.ts`:

- `getDokterList()` — admin (all rows)
- `getDokterById(id)` — admin
- `getDokterPublik()` — `aktif = true` ordered by `urutan ASC, nama ASC`

## Public experience

### Placement

1. **Home** (`/`): after Layanan poli cards / `LayananSection` — new section component.
2. **`/layanan`**: same shared component below service directory.

Not in top nav. Not on `/layanan/[id]` in v1 (can filter by poli later).

### Component

`DokterSection` (server-friendly):

- Loads `getDokterPublik()`
- If zero rows → render **nothing** (no empty marketing placeholder)
- Section chrome:
  - eyebrow: e.g. `Tim medis`
  - title: e.g. `Dokter kami`
  - short description: factual, settings-agnostic one-liner (no invented specialties count)
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (or 4 if many), `gap` consistent with Design A panels

### Card

```
┌─────────────────────┐
│      [ photo ]      │  aspect ~4/5 or square, object-cover
│                     │  rounded panel top
├─────────────────────┤
│ Nama Dokter         │  navy, semibold
│ Poli Umum           │  muted / teal chip
└─────────────────────┘
```

- Photo via `SmartImage` (data: + remote)
- Missing `foto_url`: neutral placeholder (initials from name **or** simple civic silhouette) — not a stock stock-doctor photo
- Alt text: doctor `nama` (and poli in accessible text on card)
- No “Lihat profil →” link in v1
- `panel` / `panel-lift` language consistent with layanan cards
- Touch targets and contrast WCAG AA; honor reduced motion

### Copy constraints

- Do not invent titles like “spesialis bedah saraf” unless stored (poli field only in v1).
- Do not claim hospital-grade specialist marketing beyond factual puskesmas framing.

## Image rules

- Same as berita covers: client compress WebP/JPEG → data URL, or paste HTTPS URL.
- Server validates type/size bounds via shared image schema helper (extract/reuse `optionalNewsImage` as shared `optionalCmsImage` if clean).
- No new `dangerouslySetInnerHTML` paths.
- README note: large data URLs bloat DB; Blob storage remains future Phase 3 item.

## Architecture / files (expected)

```
db/migrations/002_dokter_profiles.sql
src/lib/dokter-actions.ts
src/lib/admin-schemas.ts          # dokterSchema
src/app/api/dokter/route.ts
src/app/api/dokter/[id]/route.ts
src/app/admin/dokter/**
src/components/admin/AdminNav.tsx # link
src/components/layout/DokterSection.tsx
src/app/page.tsx                  # mount section
src/app/layanan/page.tsx          # mount section
src/app/globals.css               # only if small card helpers needed
tests: schema, API auth/validation, AdminNav link, DokterSection empty/hide, public render with fixture
scripts/verify-cms-provisioning.mjs  # require dokter table
```

## Error handling

- Public DB failure: section omits / soft-fail like other public lists (no crash whole home).
- Admin mutations: field errors + AdminFeedback; 500 generic Indonesian message + server log.
- Delete missing id: 404 safe message.

## Testing

- `dokterSchema` unit tests (valid, empty nama, bad image, oversized data URL)
- API mutations: unauthenticated blocked; admin create/update/delete; no SQL on bad role (match content-mutations style)
- `AdminNav` includes Kelola Dokter for admin + superadmin
- `DokterSection`: renders cards from fixture; renders null/empty fragment when list empty
- `npm test` green; `test:cms-provisioning` includes `dokter`
- Manual smoke: admin CRUD → home shows card; set `aktif=false` → disappears

## Deployment

1. Operator runs:

```bash
psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql
```

2. Deploy app that reads `dokter`.
3. Staff fill real doctors in `/admin/dokter`.
4. No change to existing CMS tables/data.

## Out of scope follow-ups (document only)

- Detail page `/dokter/[slug]` + bio/riwayat
- Swiper carousel if card count grows large
- Link doctor entity ↔ jadwal rows
- Per-poli filter on `/layanan/[id]`
- Vercel Blob for photos
- Dashboard count widget for dokter

## Success criteria

- Admin can manage doctors without code changes.
- Home and `/layanan` show photo + name + poli for active doctors under Pelayanan area.
- No fake doctors when table empty.
- Existing jadwal/layanan/berita flows unchanged.
- Tests and provisioning guard cover new table and mutations.
)
