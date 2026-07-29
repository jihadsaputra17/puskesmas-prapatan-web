# Final fix report — CMS admin modernization

## Fixed Critical findings

- Removed legacy callable `"use server"` mutations and initialization DDL from `actions`, `layanan-actions`, `jadwal-actions`, and `settings-actions`.
- Preserved public read helpers and existing URLs/data tables. Schedule creation now uses guarded, schema-validated `POST /api/jadwal`; settings writes remain reachable only through guarded, schema-validated `POST /api/settings`.
- Existing user server actions retain `requireSuperadmin` before every read/mutation and schemas before SQL.
- Sanitized stored service rich HTML with `sanitizeArticleHtml` on public homepage service cards and both admin service-list previews.

## Fixed Important findings

- Replaced content/settings page ad-hoc `superadmin` checks with `requireAdmin` for news, service, schedule, and settings list/create/edit loaders.
- User pages remain `requireSuperadmin` only.

## Regression coverage

- `LayananSection.test.tsx`: script/SVG/event-handler/`javascript:` service payloads removed.
- `admin/layanan/page.test.tsx`: admin can load service management; both previews sanitize unsafe HTML.
- `content-page-authorization.test.ts`: all listed content/settings loaders invoke `requireAdmin` before data loading.
- Existing content mutation suite continues proving unauthenticated/wrong-role/malformed requests execute no SQL.

## Verification

- Focused regressions: 18/18 passed.
- Full suite: 20 files, 60 tests passed.
- Touched-path ESLint: passed.
- Full `npm run lint`: still fails in pre-existing untouched paths: root `route.ts`, `src/app/berita/page.tsx`, `src/components/berita/ArticleContent.tsx`, `src/components/jadwal/ScheduleTable.tsx`, `src/components/layout/BeritaSection.tsx`; one pre-existing warning in users mutation test.
- `npm run build`: passed. Warnings: multiple lockfiles, deprecated middleware convention, missing local `POSTGRES_URL` while static generation logs handled DB read errors.

## Final re-review round 2 — deployment provisioning

- Added versioned deployment-only migration `db/migrations/001_cms_schema.sql` for every CMS table: `users`, `health_news`, `layanan_poli`, `jadwal_dokter`, and `website_settings`.
- Migration uses additive `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` and `ON CONFLICT DO NOTHING` defaults. It contains no destructive or mutating schema/data statements, preserving existing tables, rows, and settings across safe reruns.
- Added `scripts/verify-cms-provisioning.mjs` and `npm run test:cms-provisioning`; static verification requires all CMS table provisions and rejects `CREATE`/`ALTER`/`DROP TABLE` from `src` runtime source.
- Documented exact operator command in `README.md`: `psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/001_cms_schema.sql`. Provision before application rollout; no request-path DDL restored.

### Round 2 verification

- `npm run test:cms-provisioning`: passed.
- `npm test`: 20 files, 60 tests passed.
- `npm run lint`: unchanged pre-existing failures listed above.
- `npm run build`: passed; same pre-existing workspace/middleware/missing-local-`POSTGRES_URL` warnings.
- `git diff --check`: passed.

## Final re-review round 3 — health_news published_at provisioning

- Added `health_news.published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP` to fresh-table provisioning, matching existing public news reads and ordering without runtime-query changes.
- Added idempotent `ALTER TABLE health_news ADD COLUMN IF NOT EXISTS ...` for pre-existing CMS tables. PostgreSQL applies `CURRENT_TIMESTAMP` to existing rows during column addition, so all legacy rows satisfy `NOT NULL` and future inserts retain the default.
- Extended `test:cms-provisioning` static guard: requires both fresh-table and existing-table `published_at` provisioning; retains CMS-table and runtime-DDL checks.

### Round 3 verification

- `npm run test:cms-provisioning`: passed.
- `npm test`: 20 files, 60 tests passed.
- `npm run build`: passed. Existing environment warnings remain: multiple lockfiles, deprecated middleware convention, and handled missing local `POSTGRES_URL` during static generation.
- `git diff --check`: passed.
