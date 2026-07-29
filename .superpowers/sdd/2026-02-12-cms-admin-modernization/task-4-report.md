# Task 4 report

## Implemented
- Added `AdminNav`, semantic admin navigation, current-page `aria-current`, focus rings, and 44px minimum link targets.
- Admin sees dashboard, news, services, schedules, settings. Superadmin also sees user management.
- Admin layout now calls existing `requireAdmin`; failed authorization redirects to `/login`.
- Dashboard loads existing news, service, schedule helpers; shows factual counts, most recent news, and `Data belum tersedia.` when content cannot be loaded.

## TDD evidence
- RED: `npm test -- src/components/admin/AdminNav.test.tsx` failed because `./AdminNav` did not exist.
- GREEN: same command passed: 2 tests.

## Verification
- `npm test`: 12 files, 36 tests passed.
- `git diff --check`: passed.
- `npm run lint`: fails from pre-existing repository lint violations outside Task 4 files.
- `npx tsc --noEmit`: fails from existing Vitest globals missing in `tsconfig` plus pre-existing test files.

## Review fix round 1
- Dashboard count cards now use dedicated `COUNT(*)` helpers for news, services, and schedules. Capped six-item news loader remains preview-only, so dashboard never presents a capped list length as total count.
- Dashboard loaders retain explicit `available` or `unavailable` state. Successful zero remains `0`; failed count/news loads render `Data belum tersedia.`.
- Added `src/app/admin/page.test.tsx` regression coverage for successful empty state, unavailable count state, and seven-news total versus six-item recent preview.

## Verification (round 1)
- RED: `npm test -- src/app/admin/page.test.tsx` failed: unavailable news card rendered `0`; seven-news fixture rendered capped `6`.
- GREEN: `npm test -- src/app/admin/page.test.tsx src/components/admin/AdminNav.test.tsx` — 2 files, 5 tests passed.
- Full: `npm test` — 13 files, 39 tests passed.
- `git diff --check` — passed.
