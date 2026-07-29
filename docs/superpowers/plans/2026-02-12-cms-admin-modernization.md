# CMS and Admin Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize CMS administration while preserving routes/data and enforcing server-side role authorization plus validated mutation boundaries.

**Architecture:** Add focused shared authorization and Zod schema modules. Every protected API mutation authorizes first, parses input second, then calls existing parameterized database work. Refresh admin shell and module forms around reusable accessibility/feedback patterns without changing public routes, tables, or role names.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, NextAuth v4, Vercel Postgres, Zod, Tailwind CSS 3, Vitest, React Testing Library.

## Global Constraints

- Preserve existing Postgres tables, admin/public URLs, existing content, and roles `admin`/`superadmin`.
- `admin` manages news, services, schedules, settings; `superadmin` also manages users.
- Every server action/API mutation authorizes before validation/database work.
- Use Zod at every mutation trust boundary; image fields accept HTTP(S) URLs only.
- Do not implement complaint storage/intake, managed uploads, or invented clinic metrics/facts.
- Return non-sensitive errors; log internal errors server-side.
- Keep 16px minimum form text, visible focus, labels, errors, 44px controls, mobile-first layouts.
- Run `npm test`, `npm run lint`, `npm run build`; fix lint errors in touched CMS/API paths.

---

## File structure

- `src/lib/admin-auth.ts`: role constants, server session guards, API-safe authorization response helper.
- `src/lib/admin-schemas.ts`: Zod schemas and safe field-error formatter for all mutation inputs.
- `src/lib/admin-auth.test.ts`, `src/lib/admin-schemas.test.ts`: guard/schema contract coverage.
- `src/components/admin/AdminNav.tsx`: role-aware responsive admin navigation.
- `src/components/admin/AdminFeedback.tsx`: shared live result/error status component.
- `src/components/admin/ConfirmDeleteButton.tsx`: explicit destructive-action confirmation wrapper.
- `src/app/admin/layout.tsx`: protected responsive shell.
- `src/app/admin/page.tsx`: factual content dashboard.
- Existing `src/app/api/{berita,jadwal,layanan,settings,users}/...`: guarded schema-based mutations.
- Existing `src/app/admin/{berita,jadwal,layanan,settings,users}/...`: accessible module lists/forms using shared feedback patterns.

## Task 1: Install Zod and establish shared authorization/schema contracts

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `src/lib/admin-auth.ts`
- Create: `src/lib/admin-auth.test.ts`
- Create: `src/lib/admin-schemas.ts`
- Create: `src/lib/admin-schemas.test.ts`

**Interfaces:**
- `requireAdmin(): Promise<{ id: string; role: "admin" | "superadmin" }>` throws `UnauthorizedError` or `ForbiddenError`.
- `requireSuperadmin(): Promise<{ id: string; role: "superadmin" }>` throws same safe errors.
- `toAuthorizationResponse(error: unknown): NextResponse | null` maps absent session to 401 and wrong role to 403.
- Schemas export `newsSchema`, `serviceSchema`, `scheduleSchema`, `settingsSchema`, `userSchema`, `passwordResetSchema`.

- [ ] **Step 1: Install Zod**

```bash
npm install zod
```

- [ ] **Step 2: Write failing guard tests**

```ts
import { describe, expect, it, vi } from "vitest";
import { requireAdmin, requireSuperadmin } from "./admin-auth";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));

it("rejects a missing session before mutation work", async () => {
  await expect(requireAdmin()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
});
it("rejects admin from superadmin-only work", async () => {
  await expect(requireSuperadmin()).rejects.toMatchObject({ code: "FORBIDDEN" });
});
```

- [ ] **Step 3: Run guard test and verify RED**

Run: `npm test -- src/lib/admin-auth.test.ts`  
Expected: FAIL because `admin-auth` does not exist.

- [ ] **Step 4: Implement minimal guards**

```ts
const ADMIN_ROLES = ["admin", "superadmin"] as const;
export async function requireAdmin() { /* getServerSession(authOptions), require ADMIN_ROLES */ }
export async function requireSuperadmin() { /* require role === "superadmin" */ }
```

- [ ] **Step 5: Run guard test and verify GREEN**

Run: `npm test -- src/lib/admin-auth.test.ts`  
Expected: PASS.

- [ ] **Step 6: Write failing schema tests**

```ts
import { expect, it } from "vitest";
import { newsSchema, serviceSchema } from "./admin-schemas";

it("rejects a javascript image URL", () => {
  expect(newsSchema.safeParse({ title: "Info", slug: "info", excerpt: "Ringkas", content: "Isi", image_url: "javascript:alert(1)", template: "standard" }).success).toBe(false);
});
it("requires service name and description", () => {
  expect(serviceSchema.safeParse({ nama_poli: "", deskripsi: "" }).success).toBe(false);
});
```

- [ ] **Step 7: Run schema test and verify RED**

Run: `npm test -- src/lib/admin-schemas.test.ts`  
Expected: FAIL because schemas do not exist.

- [ ] **Step 8: Implement schemas**

```ts
const httpUrl = z.string().url().refine((value) => new URL(value).protocol === "https:" || new URL(value).protocol === "http:");
export const serviceSchema = z.object({ nama_poli: z.string().trim().min(1), deskripsi: z.string().trim().min(1), icon: z.string().trim().max(100).optional() });
export const scheduleSchema = z.object({ nama_dokter: z.string().trim().min(1), poli: z.string().trim().min(1), hari: z.array(z.string().trim().min(1)).min(1), jam_mulai: z.string().trim().min(1), jam_selesai: z.string().trim().min(1) });
```

Add equivalent strict schemas for news templates/fields, known settings keys, users, and password reset. Reject unknown settings keys. Export `formatFieldErrors(error)` returning `{ [field: string]: string }`.

- [ ] **Step 9: Run unit tests and commit**

```bash
npm test -- src/lib/admin-auth.test.ts src/lib/admin-schemas.test.ts
git add package.json package-lock.json src/lib/admin-auth.ts src/lib/admin-auth.test.ts src/lib/admin-schemas.ts src/lib/admin-schemas.test.ts
git commit -m "feat: add CMS authorization and validation"
```

## Task 2: Secure news, service, schedule, and settings API mutations

**Files:**
- Modify: `src/app/api/berita/route.ts`, `src/app/api/berita/[id]/route.ts`
- Modify: `src/app/api/layanan/route.ts`, `src/app/api/layanan/[id]/route.ts`
- Modify: `src/app/api/jadwal/route.ts`, `src/app/api/jadwal/[id]/route.ts`
- Modify: `src/app/api/settings/route.ts`
- Create: `src/app/api/content-mutations.test.ts`

**Interfaces:** all content/settings POST/PUT/DELETE routes require `requireAdmin`; malformed payload returns 400 `{ error: string, fields?: Record<string,string> }`; no guard/schema failure reaches SQL.

- [ ] **Step 1: Write failing route authorization test**

```ts
it("returns 401 for unauthenticated service creation", async () => {
  mockedGetServerSession.mockResolvedValue(null);
  const response = await POST(new Request("http://test/api/layanan", { method: "POST", body: JSON.stringify({}) }));
  expect(response.status).toBe(401);
  expect(mockedSql).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/app/api/content-mutations.test.ts`  
Expected: FAIL because existing route returns 403 and imports database route directly.

- [ ] **Step 3: Apply shared guard before parsing**

```ts
try { await requireAdmin(); } catch (error) {
  const response = toAuthorizationResponse(error);
  if (response) return response;
  throw error;
}
```

Use this exact ordering in all listed routes. Replace ad-hoc session checks. Do not interpolate HTML galleries in routes; accept one validated `image_url` only and leave rich content sanitization to public renderer.

- [ ] **Step 4: Parse input with schemas**

```ts
const parsed = serviceSchema.safeParse(await request.json());
if (!parsed.success) return NextResponse.json({ error: "Data layanan tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
```

For news `FormData`, map named fields to `newsSchema`; for schedule normalize comma string/array to `hari: string[]` before parsing. Validate route IDs as non-empty UUID strings before SQL.

- [ ] **Step 5: Update database calls/revalidation**

Use `parsed.data` only. Preserve table/column names and parameterized `sql` calls. Revalidate affected admin/public routes after successful mutation. Return `409` for duplicate user-facing unique values such as news slug; otherwise return generic 500.

- [ ] **Step 6: Run route tests and verify GREEN**

Run: `npm test -- src/app/api/content-mutations.test.ts`  
Expected: PASS for unauthenticated, wrong-role, invalid URL, invalid fields, and valid-role paths.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/berita src/app/api/layanan src/app/api/jadwal src/app/api/settings src/app/api/content-mutations.test.ts
git commit -m "fix: secure CMS content mutations"
```

## Task 3: Secure superadmin user mutations and legacy user actions

**Files:**
- Modify: `src/app/api/users/route.ts`, `src/app/api/users/[id]/route.ts`, `src/app/api/users/reset-password/route.ts`
- Modify: `src/lib/user-actions.ts`
- Create: `src/app/api/users/users-mutations.test.ts`

**Interfaces:** all user reads/mutations require `requireSuperadmin`; create/update/reset parse user/password schemas; user-facing errors never expose database messages.

- [ ] **Step 1: Write failing wrong-role test**

```ts
it("rejects admin user creation", async () => {
  mockedGetServerSession.mockResolvedValue({ user: { id: "a", role: "admin" } });
  const response = await POST(new Request("http://test/api/users", { method: "POST", body: JSON.stringify(validUser) }));
  expect(response.status).toBe(403);
  expect(mockedSql).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/app/api/users/users-mutations.test.ts`  
Expected: FAIL until shared guard is used consistently.

- [ ] **Step 3: Implement guard/schema boundary**

Use `requireSuperadmin` for every user API handler and `user-actions.ts` function. Validate UUID route IDs, `name`, normalized email, exact role union, and password minimum eight characters. Keep bcrypt hashing server-side after successful parse.

- [ ] **Step 4: Remove error leakage**

Replace `Terjadi kesalahan internal: ${error.message}` with generic `Gagal memperbarui kata sandi.`; retain `console.error` server log. Preserve duplicate-email 409 message without revealing unrelated account data.

- [ ] **Step 5: Run test and commit**

```bash
npm test -- src/app/api/users/users-mutations.test.ts
git add src/app/api/users src/lib/user-actions.ts src/app/api/users/users-mutations.test.ts
git commit -m "fix: enforce superadmin user mutations"
```

## Task 4: Build role-aware admin shell and factual dashboard

**Files:**
- Create: `src/components/admin/AdminNav.tsx`
- Create: `src/components/admin/AdminNav.test.tsx`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/page.tsx`

**Interfaces:** `AdminNav({ role, userName }: { role: "admin" | "superadmin"; userName?: string })` shows content/settings links to both roles and users link only to `superadmin`; current path gets `aria-current="page"`.

- [ ] **Step 1: Write failing navigation role test**

```tsx
render(<AdminNav role="admin" userName="Rina" />);
expect(screen.getByRole("link", { name: /kelola berita/i })).toBeVisible();
expect(screen.getByRole("link", { name: /pengaturan situs/i })).toBeVisible();
expect(screen.queryByRole("link", { name: /manajemen pengguna/i })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/components/admin/AdminNav.test.tsx`  
Expected: FAIL because component does not exist.

- [ ] **Step 3: Implement navigation and layout**

Create semantic `<nav aria-label="Navigasi admin">`, links for dashboard/news/services/schedules/settings, conditional users link, 44px targets, focus rings, responsive sidebar/header. `AdminLayout` uses `requireAdmin` and redirects unauthorized visitors to login. Do not encode authorization only in nav.

- [ ] **Step 4: Implement factual dashboard**

Load existing service/news/schedule lists through existing helpers, derive only counts and most recent available records. Render `Data belum tersedia.` on empty/unavailable results; do not show “Sistem Berjalan Normal” or clinical performance claims.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/components/admin/AdminNav.test.tsx
git add src/components/admin/AdminNav.tsx src/components/admin/AdminNav.test.tsx src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat: modernize admin shell and dashboard"
```

## Task 5: Standardize content module forms, lists, and deletes

**Files:**
- Create: `src/components/admin/AdminFeedback.tsx`
- Create: `src/components/admin/ConfirmDeleteButton.tsx`
- Create: `src/components/admin/ConfirmDeleteButton.test.tsx`
- Modify: `src/app/admin/berita/**`
- Modify: `src/app/admin/layanan/**`
- Modify: `src/app/admin/jadwal/**`
- Modify: `src/app/admin/settings/SettingsForm.tsx`

**Interfaces:** `AdminFeedback({ result }: { result: { type: "success" | "error"; message: string } | null })` renders `role="status"` or `role="alert"`; `ConfirmDeleteButton` calls `onConfirm` only after browser confirmation.

- [ ] **Step 1: Write failing destructive confirmation test**

```tsx
it("does not mutate before confirmation", async () => {
  const onConfirm = vi.fn();
  vi.spyOn(window, "confirm").mockReturnValue(false);
  render(<ConfirmDeleteButton onConfirm={onConfirm} itemName="layanan" />);
  await userEvent.click(screen.getByRole("button", { name: /hapus layanan/i }));
  expect(onConfirm).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/components/admin/ConfirmDeleteButton.test.tsx`  
Expected: FAIL because component does not exist.

- [ ] **Step 3: Implement shared feedback/destructive controls**

Use native `window.confirm("Hapus layanan? Tindakan ini tidak dapat dibatalkan.")`; buttons expose pending disabled state. Feedback uses safe API response message or generic network failure. Do not dismiss error before users can read it.

- [ ] **Step 4: Refactor content forms**

For news/service/schedule/settings forms: associate every label with an ID; render schema field errors next to controls with `aria-describedby`; use submit button `disabled` during fetch; render `AdminFeedback`. Replace image multi-upload/gallery UI with one optional labelled HTTP(S) cover-image URL. Keep existing create/edit URLs and fetch paths.

- [ ] **Step 5: Refactor lists/delete actions**

Use shared confirmation component in every delete button. Make list layouts horizontally scrollable semantic tables on desktop and readable cards on small screens. Add factual empty states and preserve edit/create routes.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- src/components/admin/ConfirmDeleteButton.test.tsx
npm run lint
git add src/components/admin src/app/admin/berita src/app/admin/layanan src/app/admin/jadwal src/app/admin/settings
git commit -m "feat: improve CMS content workflows"
```

## Task 6: Modernize superadmin user workflow and final verification

**Files:**
- Modify: `src/app/admin/users/**`
- Create: `src/app/admin/users/UserForm.test.tsx`
- Modify: `README.md`

**Interfaces:** user pages require `requireSuperadmin`; user forms have labels, role select limited to `admin`/`superadmin`, pending state, field feedback, and safe reset/delete results.

- [ ] **Step 1: Write failing user form accessibility test**

```tsx
render(<AddUserForm />);
expect(screen.getByLabelText(/nama/i)).toBeRequired();
expect(screen.getByLabelText(/email/i)).toBeRequired();
expect(screen.getByLabelText(/kata sandi/i)).toBeRequired();
expect(screen.getByLabelText(/peran/i)).toHaveValue("admin");
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/app/admin/users/UserForm.test.tsx`  
Expected: FAIL until labels/default role meet contract.

- [ ] **Step 3: Apply superadmin route protection and form patterns**

Every users page/server loader calls `requireSuperadmin`; unauthorized admin cannot load user data. Refactor create/edit/reset forms with shared feedback, field errors, pending controls, role union options, and generic failure messages. Use shared destructive confirmation for delete.

- [ ] **Step 4: Update README CMS policy**

Document roles, URL-only image policy, required server-side validation/authorization for future CMS mutations, and no complaint persistence.

- [ ] **Step 5: Run focused verification**

```bash
npm test -- src/app/admin/users/UserForm.test.tsx src/lib/admin-auth.test.ts src/lib/admin-schemas.test.ts src/app/api/content-mutations.test.ts src/app/api/users/users-mutations.test.ts
npm run lint
npm run build
git diff --check
```

Expected: all new/touched CMS checks pass. Record any remaining lint failure with exact untouched path and defer only to Phase 3.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/users README.md
git commit -m "feat: complete superadmin user workflow"
```
