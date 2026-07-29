# Task 2 Report: Secure CMS content/settings mutations

## Status
Complete. Commit: `fix: secure CMS content mutations` (final hash reported by `git log -1 --oneline`).

## Scope delivered
- Secured POST/PUT/DELETE endpoints for news, services, schedules, and settings with Task 1 `requireAdmin` and `toAuthorizationResponse`.
- Authorization now runs before request body parsing or SQL. Missing session returns `401 { error: "Unauthorized" }`; non-admin role returns `403 { error: "Forbidden" }`.
- Applied Task 1 strict Zod schemas and `formatFieldErrors` to all mutation payloads. Invalid payloads return `400 { error, fields }` before database/action work.
- News accepts validated one `image_url` only (legacy first `images` value remains compatibility fallback); removed route-side gallery HTML interpolation.
- Schedule accepts `hari` array or comma-delimited string, normalizes to non-empty `string[]`, and persists one row per day on create.
- Validated dynamic route IDs as UUIDs before SQL. Bad ID returns 400; SQL never receives it.
- Kept existing tables/columns and parameterized Vercel Postgres tagged SQL. Added affected admin/public route revalidation after successful news, service, and schedule mutations; settings action retains its existing revalidation.
- News duplicate slug/database unique conflict (`23505`) now returns 409; other unexpected failures return generic 500.

## Files changed
- `src/app/api/berita/route.ts`
- `src/app/api/berita/[id]/route.ts`
- `src/app/api/layanan/route.ts`
- `src/app/api/layanan/[id]/route.ts`
- `src/app/api/jadwal/route.ts`
- `src/app/api/jadwal/[id]/route.ts`
- `src/app/api/settings/route.ts`
- `src/app/api/content-mutations.test.ts` (new)

## TDD evidence
1. RED: created unauthenticated service mutation test, ran:
   `npm test -- src/app/api/content-mutations.test.ts`
   Initial test harness mock-hoisting error fixed without production change. Rerun failed as expected: `expected 403 to be 401`.
2. GREEN: implemented shared guard/schema mutation paths, expanded route contract suite, ran:
   `npm test -- src/app/api/content-mutations.test.ts`
   Passed: 1 file, 6 tests.

Tests cover unauthenticated 401/no SQL, wrong-role 403/no SQL, invalid service fields/no SQL, invalid news URL/no SQL, authorized schedule comma-day normalization, and validated authorized settings action input.

## Final verification
- `npm test -- src/app/api/content-mutations.test.ts` — passed, 1 file / 6 tests.
- `npm test` — passed, 10 files / 27 tests.
- `npm run build` — passed compilation, TypeScript, static generation, exit 0.
- `git diff --check` — passed.

## Concerns
- Build emits existing environment/config warnings: multiple lockfiles, deprecated middleware convention, and expected database read errors while `POSTGRES_URL` absent during static generation. Build exits 0.
- Existing admin UI labels still present superadmin-only capabilities for some routes. Task brief explicitly requires `requireAdmin` for all listed content/settings mutations, so API permits both `admin` and `superadmin` while UI behavior remains unchanged.
- No live database integration run; SQL paths validated by mocked external database boundary in route tests.
