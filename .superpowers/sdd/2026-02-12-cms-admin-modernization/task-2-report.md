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

---

## Fix Round 1 — malformed mutation bodies

### Important finding fixed
- Route body parsers (`request.json()` / `request.formData()`) previously threw into outer generic catches, returning 500. Every affected parser now has local parse handling after authorization and before schema/database/action work. Malformed JSON or multipart returns route-specific `400 { error, fields: {} }`.
- Schedule handlers now safely treat non-object parsed JSON (including `null`) as invalid schema input, avoiding `body.hari` dereference errors.

### RED
Command:
```bash
npm test -- src/app/api/content-mutations.test.ts
```
Output: failed 1/7. New regression exercised malformed JSON for service/schedule/settings POST and PUT plus malformed multipart for news POST/PUT. All seven returned 500; expected 400.

### GREEN / covering tests
Commands:
```bash
npm test -- src/app/api/content-mutations.test.ts
npm test
git diff --check
```
Output:
- Route suite: passed, 1 file / 7 tests.
- Full suite: passed, 10 files / 28 tests.
- `git diff --check`: passed (exit 0).

### Commit
`89bf91b fix(cms): reject malformed mutation bodies`

---

## Fix Round 2 — atomic schedule multi-insert

### Root cause and fix
- `POST /api/jadwal` executed one independent `INSERT` per selected day. A later insert failure could retain earlier rows despite returning `500`.
- Replaced loop with one parameterized PostgreSQL statement: `INSERT … SELECT … FROM jsonb_array_elements_text($dayJson::jsonb)`. PostgreSQL executes this as one statement, so statement failure inserts no selected-day rows.
- Serialized validated `string[]` days as JSON because `@vercel/postgres` tagged SQL parameters permit primitives, not JavaScript arrays. Existing request/response contract remains `{ success: true }`; every day still stores one row.

### TDD evidence
1. RED: changed authorized comma-day schedule regression to require one SQL execution, then ran:
   `npm test -- src/app/api/content-mutations.test.ts`
   Failed expectedly: `expected "vi.fn()" to be called 1 times, but got 2 times`.
2. GREEN: implemented one atomic insert statement, then ran:
   `npm test -- src/app/api/content-mutations.test.ts`
   Passed: 1 file / 7 tests.

### Final verification
- `npm test -- src/app/api/content-mutations.test.ts` — passed, 1 file / 7 tests.
- `npm test` — passed, 10 files / 28 tests.
- `npm run build` — passed, exit 0. Existing warnings remain: multiple lockfiles, deprecated middleware convention, and expected missing `POSTGRES_URL` read errors during static generation.
- `git diff --check` — passed.

### Commit
`fix(schedule): make multi-day insert atomic`
