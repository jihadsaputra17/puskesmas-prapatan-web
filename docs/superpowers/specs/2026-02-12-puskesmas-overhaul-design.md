# Puskesmas Prapatan website overhaul — design

**Date:** 2026-02-12  
**Status:** approved for planning  
**Scope:** phased overhaul of public website, CMS admin, platform safety, and production readiness.

## Context

Puskesmas Prapatan is a Next.js 16 / React 19 / TypeScript application using Tailwind CSS 3, NextAuth credentials authentication, and Vercel Postgres. Existing public routes cover profile, services, doctor schedules, news, complaints, and privacy. Admin provides role-aware content management for news, schedules, services, settings, and users.

The existing database and published content must be preserved. Existing uncommitted project work must not be overwritten.

## Goals

- Make routine health-center information fast to find on mobile and desktop.
- Convey trust, clarity, accessibility, and public-service professionalism.
- Make content editing safe and predictable for authorized staff.
- Modernize security, validation, error handling, metadata, and deployment practices.
- Use current data/settings as source of truth; do not invent clinic facts or statistics.

## Non-goals

- Online clinical diagnosis, emergency dispatch, or appointment booking in this scope.
- Database replacement or destructive schema rewrite.
- Invented operating hours, contacts, service eligibility, medical claims, or performance figures.

## Design direction

**Design read:** public-sector community health-center service for patients and local residents, using an accessible trust-first interface.

- Palette: deep navy for authority, restrained clinical teal for actions and status, white/slate neutrals.
- Typography: readable sans-serif hierarchy; 16px minimum body type.
- Components: 12px panel radius; pills reserved for status and compact actions.
- Interaction: minimal, purposeful feedback only; honor `prefers-reduced-motion`.
- Accessibility: semantic HTML, visible keyboard focus, skip link, WCAG AA text contrast, 44px minimum touch targets.
- Responsive behavior: mobile first, no horizontal page scroll, navigation collapses into accessible menu.

## Phase 1 — public patient experience

### Global shell

- Rebuild public header, navigation, footer, page spacing, focus styles, and loading/error/empty states around shared design tokens.
- Include a skip-to-content link and clear current-page navigation state.
- Keep admin access visible only to authenticated eligible users.
- Use official settings data for site name, address, phone, email, and social links; gracefully degrade if settings data is unavailable.
- Add accurate title templates, descriptions, canonical/OG metadata where factual assets exist, sitemap, robots, and structured semantic landmarks.

### Home

- Lead with clinic identity and short value proposition from settings.
- Present direct task paths: browse services, view doctor schedules, submit complaint/help request.
- Surface operating/contact information only when settings contain it; never infer status or hours.
- Show available featured services and latest news from existing data sources.
- Include concise FAQ and complete contact/location area.

### Services

- Make service/poli directory easy to scan, search, and navigate.
- Service detail pages show only stored/factual content: name, description, process/preparation/contact when fields exist.
- Missing optional data is omitted, not replaced by fabricated text.

### Doctor schedules

- Provide accessible desktop table and mobile card presentation from existing schedule records.
- Support filtering by poli and day when data permits.
- State that schedules may change; show updated information only if a reliable stored timestamp exists.

### News

- Improve news index and article reading layout with accessible images, clear publication dates, and semantic article structure.
- Sanitize or safely render rich article content to prevent stored HTML/XSS risk.
- Retain current news URLs where possible.

### Profile, complaint, privacy

- Present profile information in structured public-service format.
- Rebuild complaint form with labels, validation feedback, submission state, and privacy expectation.
- Rewrite privacy page as clear policy information matching actual data handling; no legal guarantees not backed by implementation.

## Phase 2 — admin and CMS

- Redesign admin navigation, dashboard, forms, tables, and responsive layout using same token system while keeping task density appropriate.
- Dashboard reports actual available content counts/recent records only; never fake metrics.
- Enforce role permissions in shared server-side authorization helpers, not only hidden links.
- Add explicit schema validation for news, services, schedules, settings, users, and complaints.
- Standardize mutation feedback, loading, empty, and error states.
- Restrict image uploads by file type, size, and safe storage strategy; include descriptive alt text workflow.
- Preserve existing role model (`admin`, `superadmin`) unless migration explicitly changes it.

## Phase 3 — platform, security, production

- Centralize authenticated authorization checks for every server action and API mutation.
- Validate inputs at trust boundaries; return safe user-facing errors and retain detailed server logs.
- Review NextAuth configuration, password lifecycle, rate limiting feasibility, and session/cookie security for deployment.
- Add security headers appropriate to Next.js deployment, including CSP only after auditing image/editor requirements.
- Validate required environment variables at startup/build without exposing secret values.
- Add only additive, reversible database migrations for needed fields; document rollback.
- Define image optimization, cache/revalidation behavior, failure fallbacks, and deployment runbook.

## Architecture and data flow

- Next.js App Router server components load public content from existing server-side data helpers.
- Client components are limited to interactive controls: navigation menu, service/schedule filtering, forms, and editor/upload UI.
- Server actions/API routes: authenticate where required, authorize role, validate input, perform parameterized database operation, revalidate affected routes, return safe result.
- `website_settings` remains source for editable site-level facts. Existing records remain source for news, services, and schedules.
- Shared UI primitives/tokens reduce duplicate styling without a broad framework migration.

## Error handling

- Public fetch failures show factual fallback state and contact path, never an empty broken page.
- Forms show field-level validation errors and non-sensitive submission error state.
- Database/auth failures are logged server-side without leaking stack traces, SQL, secrets, or account existence.
- Mutation errors do not claim completion until database operation succeeds.

## Verification

- Unit tests: schema validation, authorization guard, data mapping, service/schedule filtering, unsafe content handling.
- Browser checks: keyboard navigation, mobile and desktop public paths, login/role behavior, admin forms, complaint submission behavior.
- Automated: `npm run lint`, TypeScript/build check via `npm run build`.
- Manual accessibility pass: contrast, focus order/visibility, labels, errors, heading order, touch target size, reduced-motion behavior.

## Delivery order

1. Establish public design tokens and global shell.
2. Rebuild home and public content routes while preserving data contracts.
3. Redesign admin shell and content workflows with enforced authorization/validation.
4. Harden platform, add tests, verify production behavior, and write deploy guide.
