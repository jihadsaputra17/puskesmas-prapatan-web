# Task 6 Report: Superadmin user workflow

## Delivered

- User listing, create, edit, and password-reset pages now call `requireSuperadmin` before loading user data or UI.
- Added user form accessibility contract test with required labeled fields and default `admin` role.
- Create, edit, and reset forms now expose Indonesian labels, pending controls, role values limited to `admin` and `superadmin`, field-feedback slots, and generic client-facing failure messages.
- User deletion now uses shared `ConfirmDeleteButton`.
- README documents CMS roles, HTTPS URL-only image policy, server validation/authorization requirement, and no complaint persistence.

## TDD record

- RED: `npm test -- src/app/admin/users/UserForm.test.tsx` failed because `AddUserForm` label was `Password`, not `Kata Sandi` (also no default role contract).
- GREEN: same command passed after form change: 1 test passed.

## Verification

Passed:

```text
npm test -- src/app/admin/users/UserForm.test.tsx src/lib/admin-auth.test.ts src/lib/admin-schemas.test.ts src/app/api/content-mutations.test.ts src/app/api/users/users-mutations.test.ts
5 files passed, 25 tests passed

git diff --check
passed
```

Deferred existing Phase 3 failures outside Task 6:

```text
npm run lint
route.ts:16:19 @typescript-eslint/no-explicit-any
src/app/berita/page.tsx:33:38 @typescript-eslint/no-explicit-any
src/components/berita/ArticleContent.tsx:15:5 react-hooks/set-state-in-effect
src/components/jadwal/ScheduleTable.tsx:21:7 react-hooks/set-state-in-effect
src/components/layout/BeritaSection.tsx:31:37 @typescript-eslint/no-explicit-any
src/components/layout/LayananSection.tsx:22:33 @typescript-eslint/no-explicit-any
```

`npm run lint` also reports pre-existing warnings in `src/app/api/users/users-mutations.test.ts`, `ArticleContent.tsx`, `ScheduleTable.tsx`, `src/lib/layanan-actions.ts`, and `src/lib/settings-actions.ts`.

```text
npm run build
fails before Task 6 code at src/app/admin/layanan/[id]/edit/EditLayananForm.tsx:34
Type error: ReactQuill props reject `ref`.
```

Build also reports workspace lockfile and deprecated middleware-convention warnings.
