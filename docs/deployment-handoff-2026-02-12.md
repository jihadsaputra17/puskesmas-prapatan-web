# Deployment Handoff — 2026-02-12

Last updated: 2026-07-29 (Design A public UI shipped on `main`)

> **Latest session handoff:** `docs/handoff-design-a-civic-polish-2026-07-29.md`
> Design A commit: `ec9c92d` on `main` — civic polish public UI live / pushed.

## Delivered work

- Branch: `main` (feature branch merged via PR #1)
- Feature history: `feat/public-patient-experience` @ `b7bd46d` (worktree retained)
- Public patient experience (Phase 1) and CMS/admin modernization (Phase 2) complete
- **Design A civic public polish** complete on `main` (`ec9c92d`)
- Final verification: `npx vitest run` — 20 files / 60 tests passed
- Full lint retains documented, untouched legacy failures for Phase 3

## Live URLs

- **Production (use this):** <https://puskesmas-prapatan-web.vercel.app>
- Production deployment: <https://puskesmas-prapatan-272syaeai-saputrajihad-1763s-projects.vercel.app>
- Latest good preview: <https://puskesmas-prapatan-pqv6x3kdu-saputrajihad-1763s-projects.vercel.app>
- **Do not use old previews** such as `...7jrfd1dmp...` (pre-fix 500 deploys)

## Vercel / env state

- Account/team: `saputrajihad-1763's projects`
- Project: `puskesmas-prapatan-web`
- SSO deployment protection: **disabled** (public access allowed)
- Production env set:
  - `POSTGRES_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL=https://puskesmas-prapatan-web.vercel.app`
  - `NEXT_PUBLIC_SITE_URL=https://puskesmas-prapatan-web.vercel.app`
- Preview-wide `NEXTAUTH_SECRET` set
- Development localhost auth vars set

## Database

- Migration applied: `db/migrations/001_cms_schema.sql`
- Tables present: `users`, `health_news`, `layanan_poli`, `jadwal_dokter`, `website_settings`
- `health_news.published_at` present
- `website_settings` default keys present (8)

## Runtime fixes applied for deploy

- Replaced `isomorphic-dompurify` with `sanitize-html` (jsdom ESM crash on Vercel)
- Explicit `secret: process.env.NEXTAUTH_SECRET` in `src/lib/auth.ts`

## Verification status

1. Auth env vars — **DONE**
2. CMS schema migration — **DONE**
3. Public route checks — **DONE** (HTTP 200 on key pages)
4. GitHub PR create/merge into `main` — **PENDING**
   - Compare: <https://github.com/jihadsaputra17/puskesmas-prapatan-web/compare/main...feat/public-patient-experience?expand=1>
   - PR body draft: `docs/pr-body-feat-public-patient-experience.md`
   - Production already deployed from feature branch via CLI; merge still needed to align `main`
5. Production deploy — **DONE**
6. Admin login — **DONE (user-confirmed success 2026-03-15)**
   - Superadmin email available: `admin@puskesmas.com`
   - Password was operator-reset via secure DB hash update (not stored in docs)
   - Other accounts present: `saputra.jihad@gmail.com` (superadmin), `penulis@puskesmas.com` (role `user`)
   - CMS password policy in forms remains min 8 chars; recommend upgrading weak passwords later

## Role model

- `admin`: news, services, schedules, settings
- `superadmin`: all admin capabilities + user management

## Next session checklist

1. ~~Create + merge PR into `main`~~ **DONE** — PR #1 merged @ `f3c352f`
2. ~~Design A public UI polish~~ **DONE** — `ec9c92d` (see `docs/handoff-design-a-civic-polish-2026-07-29.md`)
3. **Next:** Admin UI restyle using Design A tokens (nav/shell/forms; keep CMS behavior)
4. Optional: change admin password to stronger 8+ char password via admin UI
5. Optional Phase 3:
   - fix remaining legacy lint failures
   - migrate deprecated `middleware` → `proxy`
   - managed image uploads (if approved)
   - real complaint intake backend (only after policy approval)
6. Stash note: `stash@{0}` `wip-main-before-pr-merge-20260729` — do not blind-pop

## Notes

- Never commit `.env.local` or secrets
- GitHub stores code; Vercel hosts app
- Handoff companion PR body: `docs/pr-body-feat-public-patient-experience.md`
- CMS migration path: `db/migrations/001_cms_schema.sql`
