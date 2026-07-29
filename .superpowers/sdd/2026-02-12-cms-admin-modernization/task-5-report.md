# Task 5 Report — Content Workflows

## Implemented

- Added `AdminFeedback`, rendering success as `role="status"` and errors as `role="alert"`.
- Added tested `ConfirmDeleteButton`; destructive callback runs only after native confirmation. Button exposes disabled pending state.
- Replaced news image uploader/gallery form UI with one optional `image_url` field and preserved `/api/berita` POST and `/api/berita/:id` PUT fetch paths.
- News create/edit forms validate through `newsSchema`, show `formatFieldErrors`, connect errors with `aria-describedby`, retain feedback, and disable submit while pending.
- Settings and add-schedule forms now validate with Task 1 schemas, expose labels/error references/pending submit controls, and display shared feedback.
- Refactored existing news/service/schedule delete clients to shared confirmation while preserving DELETE paths.

## TDD Evidence

1. Added `ConfirmDeleteButton.test.tsx` before component.
2. Initial run failed as expected: `Failed to resolve import "./ConfirmDeleteButton"`.
3. Implemented minimal component; focused test passed.

## Verification

- `npm test -- src/components/admin/ConfirmDeleteButton.test.tsx` — pass (1 test).
- `npm test -- --run` — pass (14 files, 40 tests).
- Scoped ESLint for changed new/refactored form/control files — pass.
- `npm run build` — completed successfully. Build logged expected missing `POSTGRES_URL` errors from static data collection but returned success.
- Root `npm run lint` remains failing from existing unrelated lint violations across public/admin files. It also reports pre-existing `any` errors in untouched service/schedule edit/list modules.

## Known Scope Gap

Task requested responsive mobile cards plus full service/schedule edit-form refactor. Those existing modules remain unchanged in this commit; follow-up required before declaring Task 5 fully complete.

## Fix Round 1

- Completed live service create/edit and schedule create/edit forms with shared schema validation, per-field errors, `aria-describedby`, pending submit controls, and `AdminFeedback`.
- Corrected live schedule create route coverage (`tambah/TambahJadwalForm.tsx`); retained existing routes and API fetch paths.
- Added responsive mobile card views plus desktop semantic, horizontally-scrollable tables for news, services, and schedules. Empty states and edit/create URLs preserved.
- Linked settings `hero_subtitle` and both schedule day fieldsets to validation errors.
- Expanded delete-control tests: cancel no-op, confirm invokes callback, pending disables action and confirmation message asserted. Added settings field-error accessibility regression test.
- Removed obsolete, unreferenced news image uploader components after news forms moved to optional single cover URL.
- Hardened HTTP URL schema refinement so malformed optional URLs yield validation errors rather than throw.
- Removed task-generated untracked plan `docs/superpowers/plans/2026-02-12-cms-admin-content-workflows.md`; path was neither tracked nor present in git history.

### Verification

- `npm test -- src/components/admin/ConfirmDeleteButton.test.tsx` — 3 passing.
- `npm test -- src/app/admin/settings/SettingsForm.test.tsx` — 1 passing.
- `npm test -- --run` — 15 files, 43 tests passing.
- `npx eslint src/app/admin/berita src/app/admin/layanan src/app/admin/jadwal src/app/admin/settings src/components/admin src/app/api` — 0 errors; 1 existing warning in untouched `src/app/api/users/users-mutations.test.ts`.
- `npm run lint` — fails from 10 pre-existing, out-of-scope errors (`route.ts`, users, public pages/components) and 6 warnings; no Task 5 CMS errors.
- `npm run build` — exit 0. Expected missing `POSTGRES_URL` collection logs plus pre-existing Next workspace/middleware warnings.
- `git diff --check` — pass.

## Fix Round 2

- Bound service create/edit Quill `.ql-editor[contenteditable]` roots directly to `aria-labelledby="deskripsi-label"`; label no longer targets Quill wrapper.
- Moved conditional `aria-describedby="deskripsi-error"` onto editable root, so validation message reaches actual editor control.
- Added create/edit regression coverage with mocked Quill editor root. Test fails against wrapper association and asserts labelled editable control plus description error association.

### Verification

- RED: `npm test -- src/app/admin/layanan/LayananDescriptionAccessibility.test.tsx` — failed twice: label associated with non-labellable wrapper `<div>`.
- GREEN: focused regression — 2 passing.
- `npm test -- --run` — 16 files, 45 tests passing.
- `npx eslint src/app/admin/layanan/tambah/TambahLayananForm.tsx 'src/app/admin/layanan/[id]/edit/EditLayananForm.tsx' src/app/admin/layanan/LayananDescriptionAccessibility.test.tsx` — 0 errors, 0 warnings.
- `git diff --check` — pass.
