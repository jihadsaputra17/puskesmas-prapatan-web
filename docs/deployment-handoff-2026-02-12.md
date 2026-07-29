# Deployment Handoff — 2026-02-12

## Delivered work

- Branch: `feat/public-patient-experience`
- Remote: `origin/feat/public-patient-experience`
- Pull request creation: <https://github.com/jihadsaputra17/puskesmas-prapatan-web/pull/new/feat/public-patient-experience>
- Public patient experience and Phase 2 CMS modernization complete.
- Final verification: `npm test` — 20 files / 60 tests passed; build passed; `git diff --check` passed.
- Full lint retains documented, untouched legacy failures for Phase 3.

## Vercel state

- Account/team: `saputrajihad-1763's projects`
- Vercel project: `puskesmas-prapatan-web`
- Preview deployment succeeded:
  <https://puskesmas-prapatan-7jrfd1dmp-saputrajihad-1763s-projects.vercel.app>
- Deployment build succeeded.
- Preview currently has Vercel Deployment Protection: unauthenticated visitors are sent to Vercel login. This is expected until protection is disabled or a public production deployment is made.
- Production deploy was **not** run.

## Required before public production launch

1. Auth environment variables — **DONE 2026-03-15**

   - Production: `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://puskesmas-prapatan-web.vercel.app`, `NEXT_PUBLIC_SITE_URL=https://puskesmas-prapatan-web.vercel.app`
   - Preview (`feat/public-patient-experience`): `NEXTAUTH_SECRET`, `NEXTAUTH_URL` + `NEXT_PUBLIC_SITE_URL` set to current preview host
   - Development: localhost values
   - `POSTGRES_URL` already present on all environments
   - Existing preview deployment must be **redeployed** before new auth vars apply

2. CMS database provisioning — **DONE 2026-03-15**

   - Ran `db/migrations/001_cms_schema.sql` against production `POSTGRES_URL`
   - Verified tables: `users`, `health_news`, `layanan_poli`, `jadwal_dokter`, `website_settings`
   - `health_news.published_at` present (existing production column type: `date`, NOT NULL)
   - `website_settings` count: 8 default keys present
   - Migration is additive/idempotent; safe to rerun

3. Verify deployed public routes and admin login — **DONE 2026-03-15 (partial)**

   - Preview public (SSO protection disabled):
     <https://puskesmas-prapatan-pqv6x3kdu-saputrajihad-1763s-projects.vercel.app>
   - Public routes HTTP 200: `/`, `/layanan`, `/jadwal-dokter`, `/berita`, `/login`, `/pengaduan`, `/profil`, `/kebijakan-privasi`
   - Unauthenticated `/admin` redirects to `/login` (NextAuth working)
   - Deploy fixes applied:
     - Replaced `isomorphic-dompurify` with `sanitize-html` (jsdom ESM crash on Vercel)
     - Explicit `secret: process.env.NEXTAUTH_SECRET` in `authOptions`
     - Preview-wide `NEXTAUTH_SECRET` set
   - Manual browser admin login with real credentials still needed (cannot complete from CLI)
   - Role boundaries still expected:
     - `admin`: news, services, schedules, settings
     - `superadmin`: includes user management

4. Create/review/merge GitHub PR into `main`.

5. Deploy production only after review and database/environment checks. Vercel CLI production command:

   ```bash
   npx vercel --prod --scope saputrajihad-1763s-projects
   ```

## Notes

- GitHub stores code; it does not host this Next.js server app.
- Vercel deployment has configured Postgres variables; local development only needs `.env.local` when running locally.
- Do not commit `.env.local` or secrets.
- Existing README deployment instructions: `README.md`.
- CMS migration: `db/migrations/001_cms_schema.sql`.
