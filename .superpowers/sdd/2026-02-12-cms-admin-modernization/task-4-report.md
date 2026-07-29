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
