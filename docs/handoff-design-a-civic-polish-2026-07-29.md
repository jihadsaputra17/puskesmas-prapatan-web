# Handoff — Design A Civic Polish (2026-07-29)

Last updated: 2026-07-29 (commit + push complete)

## Goal delivered

Ship **Design A — civic polish** for public UI of Website Puskesmas Prapatan:
trust-first public-sector health site, not SaaS flash.

## Repo / git state

| Item | Value |
|------|--------|
| Repo | `https://github.com/jihadsaputra17/puskesmas-prapatan-web` |
| Branch | `main` (synced with `origin/main`) |
| Design A commit | `ec9c92d` — `feat(ui): ship Design A civic public polish` |
| Prior merge | `f3c352f` — PR #1 public patient experience + CMS admin |
| Working tree | clean after push |
| Diff | 30 files, +1497 / −498 |

### Related history

- PR #1: https://github.com/jihadsaputra17/puskesmas-prapatan-web/pull/1 (merged)
- Feature worktree (history only): `.worktrees/public-patient-experience`
- Stash still present (do **not** blind-pop):
  - `stash@{0}: On main: wip-main-before-pr-merge-20260729`
  - Would conflict/duplicate with merged feature code

## Live URLs

- **Production:** https://puskesmas-prapatan-web.vercel.app
- Vercel should auto-deploy from `main` after `ec9c92d`

## What shipped (Design A)

### Design system

- Tokens in `src/app/globals.css`: navy `#0B2A3F`, teal `#0F766E`, sky wash `#E8F4F3`, panels, buttons, page-intro, section-band
- `tailwind.config.ts`: Plus Jakarta Sans, clinic color scale, shadows
- Root `src/app/layout.tsx`: font, skip link, header/footer, settings-driven shell

### Public shell

- `SiteHeader` — sticky frosted nav, monogram, active underline, primary CTA **Cek jadwal**, mobile drawer (Escape/overlay)
- `SiteFooter` — settings-only contact/hours facts
- `ClinicHero` — gradient wash, accent bar, hours/contact from settings only (no invented clinic data)
- `QuickAccess` — 4 task tiles + SVG (not 3 equal cards / emoji)
- `SectionHeading` — shared section intro pattern

### Home + list/detail pages restyled

- Home: `page.tsx`, `LayananSection`, `BeritaSection`, `FaqSection`, skeletons
- Lists: layanan, jadwal-dokter, berita, profil, pengaduan
- Detail: `layanan/[id]`, `berita/[slug]`
- System pages: login, not-found, error, kebijakan-privasi
- Explorers: `ServiceExplorer`, `ScheduleExplorer`
- Form: `PengaduanForm`

### Quality fixes with redesign

- `LayananSection` uses `plainText` (not raw HTML)
- `SiteHeader.isActive` accepts `pathname: string | null`
- Empty layanan copy aligned with tests
- Vitest excludes `.worktrees/**` (noise from nested worktree tests)
- Berita maps cast from `QueryResultRow` for TS

### Verification

```text
npx vitest run  →  20 files / 60 tests passed
```

`tsc --noEmit` still noisy on test globals (`describe`/`it`/`expect`/`vi`) in some files — pre-existing pattern; not a runtime block. App berita typing fixed via casts.

## Constraints still in force

- Public-sector / trust-first civic health site
- Preserve DB records + existing public URLs
- Settings-driven facts only — **no invented clinic data**
- Accessibility: WCAG AA, 44px targets, focus rings, reduced-motion
- Admin UI was **out of scope** for Design A public phase

## Key files touched

```text
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/{berita,layanan,jadwal-dokter,profil,pengaduan,login}/**
src/components/layout/{SiteHeader,SiteFooter,ClinicHero,QuickAccess,SectionHeading,*}
src/components/{layanan/ServiceExplorer,jadwal/ScheduleExplorer}.tsx
tailwind.config.ts
vitest.config.ts
```

## Next session — Admin UI (planned after break)

Scope: apply Design A tokens to **admin shell only** (nav, layout, forms polish). Keep CMS behavior.

Suggested order:

1. Audit current admin routes/components under `src/app/admin` + `src/components/admin`
2. Reuse public tokens (navy/teal/panel/button) — do not invent second palette
3. Admin nav active states + denser data UI (tables/forms) without SaaS chrome
4. Login already lightly polished in Design A — align admin chrome with it
5. Run `npx vitest run` + smoke admin pages locally
6. Commit + push when green

### Still open (not style)

- Stronger admin password (operator action; never store plaintext in docs)
- Phase 3 later: legacy lint, middleware→proxy, image upload, complaint backend (policy first)
- Optional: drop stash only after confirm safe
- Optional: real clinic photos (no invent)

## Do not

- Blind-pop `wip-main-before-pr-merge-20260729`
- Invent clinic hours/phone/address — settings/DB only
- Restyle admin in same commit as unrelated public fixes without clear scope
- Commit `.env.local` or secrets

## Resume command

```bash
cd C:/Website_Puskesmas-Prapatan/puskesmas-prapatan-web
git pull
npm run dev
# then: admin UI pass using Design A tokens
```

## Related docs

- Earlier deploy/CMS handoff: `docs/deployment-handoff-2026-02-12.md`
- PR body (historical): `docs/pr-body-feat-public-patient-experience.md`
