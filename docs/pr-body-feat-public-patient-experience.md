## Summary
- Rebuild public patient-facing website (Phase 1): accessible shell, home, schedules, services, news, support/recovery pages.
- Modernize CMS/admin (Phase 2): shared `requireAdmin`/`requireSuperadmin`, Zod validation, role-aware admin UI, superadmin user workflow.
- Close auth/XSS/provisioning gaps: remove legacy unguarded server mutations, sanitize service HTML, add idempotent CMS migration.
- Deploy readiness: Vercel auth env vars, CMS schema migration applied, public preview verified; replace DOMPurify/jsdom with `sanitize-html` for Vercel runtime.

## Preview
- Working preview: https://puskesmas-prapatan-pqv6x3kdu-saputrajihad-1763s-projects.vercel.app
- Do **not** use older preview hosts that return 500 (pre-fix deploys).

## Test plan
- [x] `npm test` — 20 files / 60 tests
- [x] `npm run build`
- [x] Preview public routes HTTP 200: `/`, `/layanan`, `/jadwal-dokter`, `/berita`, `/login`, `/pengaduan`, `/profil`
- [x] Unauthenticated `/admin` redirects to `/login`
- [ ] Manual browser admin login + role checks (`admin` vs `superadmin`)
- [ ] Production deploy after merge + re-verify

## Notes
- Full lint still has documented legacy failures outside CMS paths (Phase 3).
- Production env already has `POSTGRES_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`.
- CMS migration `db/migrations/001_cms_schema.sql` already applied to production DB.
- Handoff: `docs/deployment-handoff-2026-02-12.md`
