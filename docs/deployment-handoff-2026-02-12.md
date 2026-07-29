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

1. In Vercel, configure environment variables for Production (and Preview if needed):

   ```env
   POSTGRES_URL=<existing Vercel Postgres/Neon connection string>
   NEXTAUTH_SECRET=<long random secret>
   NEXTAUTH_URL=https://<production-domain>
   NEXT_PUBLIC_SITE_URL=https://<production-domain>
   ```

2. Run CMS database provisioning once from trusted operator environment:

   ```bash
   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_cms_schema.sql
   ```

   Migration is additive and idempotent. It covers `users`, `health_news`, `layanan_poli`, `jadwal_dokter`, `website_settings`, including `health_news.published_at`.

3. Verify deployed public routes and admin login. Confirm role boundaries:
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
