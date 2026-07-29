# CMS and admin modernization — design

**Date:** 2026-02-12  
**Status:** approved for spec review  
**Scope:** Phase 2 of Puskesmas Prapatan overhaul.

## Context

The project is a Next.js 16 / React 19 / TypeScript application using Tailwind CSS 3, NextAuth credentials authentication, and Vercel Postgres. Existing admin routes manage news, services, doctor schedules, settings, and users. Public Phase 1 is complete on branch `feat/public-patient-experience`.

Existing Postgres data, admin URLs, published public URLs, and role names must be preserved. No destructive schema rewrite is allowed.

## Goals

- Make authorized content work predictable on mobile and desktop.
- Enforce role permissions server-side before all protected reads and mutations.
- Validate all CMS inputs at trust boundaries.
- Standardize admin feedback, empty states, loading states, and safe errors.
- Resolve lint errors in CMS/API files touched by this phase.

## Non-goals

- No public complaint intake or complaint data storage.
- No managed image upload or storage integration; CMS accepts image URLs only.
- No database replacement or destructive migration.
- No change to existing role names: `admin`, `superadmin`.
- No fabricated dashboard metrics, clinical statistics, or clinic facts.

## Authorization model

- `admin` may manage news, services, schedules, and settings.
- `superadmin` may perform all `admin` actions plus user management.
- Every protected server action and API mutation calls one shared authorization guard before validation or database work.
- UI visibility mirrors authorization, but hidden links/buttons never substitute for server authorization.
- Unauthorized callers receive a safe authorization result or standard HTTP `401`/`403`; errors never expose session details, user existence, SQL, or stack traces.

## Validation and data handling

Zod schemas validate every create/update/mutation boundary:

- **News:** title, slug, excerpt, content, publication date, template, optional HTTP(S) image URL.
- **Services:** name, description, icon.
- **Schedules:** doctor, poli, day, hours.
- **Settings:** known editable string settings only, with URL validation for configured URL fields.
- **Users:** name, email, role, password/reset values; user mutation remains `superadmin` only.

Server code uses existing parameterized database operations. On validation failure, forms receive field-safe messages; API callers receive structured safe validation errors. Server logs retain implementation error details without returning them to browser.

## Admin experience

### Shell and navigation

- Shared responsive admin header/sidebar uses same navy, teal, slate token system as public site.
- Navigation has current-route state, keyboard-visible focus, semantic labels, and a mobile menu suitable for touch.
- Only permitted sections appear for current role.
- Logout remains visible to authenticated users.

### Dashboard

- Dashboard shows only available counts and recent records from existing database sources.
- It does not calculate or imply clinical/public-service performance metrics.
- Empty and unavailable-data states remain factual.

### Content workflows

- News, services, and schedule list pages provide responsive table/card views, clear create actions, edit links, confirmation before delete, and factual empty states.
- Forms provide associated labels, input help where needed, inline field errors, disabled pending submit control, and a success/error result region.
- News image field remains URL-only and only accepts HTTP(S) URLs. Public image alternative text derives from stored title until a later schema change introduces explicit alt text.
- Settings form exposes existing configured settings only; unknown clinic facts remain empty rather than guessed.
- User management stays isolated to `superadmin`, including create, edit, delete, and reset password paths.

### Complaint boundary

Public complaint intake remains unavailable. The public page must not claim delivery or persistence until a separately approved intake/retention/access policy and backend exist.

## Architecture

- Create focused shared modules for server authorization, schemas, and mutation result types.
- Existing actions/API routes invoke authorization then schema parsing then existing database operation, then `revalidatePath` for affected views.
- Server components load protected data only after role guard where appropriate; client components handle visual controls and submitted form state.
- Shared admin UI primitives own repeated label/error/pending/feedback behavior. Module components own only module-specific fields and tables.
- Keep existing routes as migration boundaries; no route renames.

## Error handling

- Missing/expired session: redirect or safe unauthorized response according to current route type.
- Wrong role: safe forbidden response; no database operation.
- Invalid input: field-level form message or structured `400` API response.
- Database/action failure: generic user-facing failure message, server-side logging, no false success.
- Delete operations require an explicit user confirmation before mutation.

## Testing and verification

- Unit tests for role guards, schema valid/invalid boundaries, and URL validation.
- Route/action tests prove unauthenticated and wrong-role mutations are rejected before database execution.
- Component tests cover role-gated navigation, required labels/errors, pending button state, and destructive confirmation.
- Run `npm test`, `npm run lint`, and `npm run build`.
- Existing lint failures in CMS/API code touched by Phase 2 must be fixed. Unrelated legacy failures are logged separately rather than silently waived.

## Delivery order

1. Inventory current CMS actions/routes and introduce shared authorization, validation, and mutation result foundations.
2. Apply guards/schemas to news, services, schedules, and settings.
3. Apply `superadmin` guard/schema workflow to users.
4. Rebuild admin shell/dashboard and shared form/table feedback patterns.
5. Modernize module screens while preserving URLs and data contracts.
6. Add verification coverage, run full checks, document remaining Phase 3 security/platform work.
