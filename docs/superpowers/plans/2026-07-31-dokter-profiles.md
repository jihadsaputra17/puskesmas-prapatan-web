# Tim Dokter Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CMS-managed doctor profiles (photo + name + poli) shown under Pelayanan on home and `/layanan`, with admin CRUD at `/admin/dokter`.

**Architecture:** New additive `dokter` Postgres table (separate from `jadwal_dokter`). Zod `dokterSchema` + `requireAdmin` on all mutations. Read helpers in `dokter-actions.ts`. Public `DokterSection` loads active rows only and hides when empty. Admin mirrors layanan CRUD (list/tambah/edit/delete) with `CoverImageField` + `SmartImage` for photos.

**Tech Stack:** Next.js App Router, `@vercel/postgres`, Zod, Vitest, existing Design A tokens, `CoverImageField` / `SmartImage`

**Spec:** `docs/superpowers/specs/2026-07-31-dokter-profiles-design.md`

## Global Constraints

- Do **not** invent doctor names, photos, credentials, or specialist marketing copy
- Do **not** change `jadwal_dokter` schema or schedule behavior
- Additive migration only (`CREATE TABLE IF NOT EXISTS` / indexes) — no DROP/TRUNCATE
- Photos: empty | HTTP(S) URL | `data:image/(png|jpe?g|gif|webp);base64,` max length 2_000_000 (same as berita)
- All mutations: `requireAdmin` → Zod → SQL → `revalidatePath` for `/`, `/layanan`, `/admin/dokter`
- Public empty list → render **nothing** (no fake placeholders with stock doctors)
- Reuse Design A: `panel`, `panel-lift`, `button-primary`, `input-field`, `eyebrow`, navy/teal
- No doctor detail page, bio, or top-nav “Dokter” item in this plan
- Run `npx vitest run` after each task; keep existing tests green
- Never commit `.env.local` or secrets

## File map

| File | Responsibility |
|------|----------------|
| `db/migrations/002_dokter_profiles.sql` | Idempotent `dokter` table + indexes |
| `scripts/verify-cms-provisioning.mjs` | Also require `002` + `dokter` table |
| `src/lib/admin-schemas.ts` | Export shared image helper + `dokterSchema` |
| `src/lib/admin-schemas.test.ts` | Schema tests for dokter |
| `src/lib/dokter-actions.ts` | `getDokter`, `getDokterById`, `getDokterPublik`, optional count |
| `src/app/api/dokter/route.ts` | POST create |
| `src/app/api/dokter/[id]/route.ts` | PUT update, DELETE |
| `src/app/api/content-mutations.test.ts` | Auth/validation cases for dokter API |
| `src/components/admin/AdminNav.tsx` | “Kelola Dokter” link |
| `src/components/admin/AdminNav.test.tsx` | Assert link visible |
| `src/app/admin/dokter/page.tsx` | Admin list |
| `src/app/admin/dokter/DeleteDokterButton.tsx` | Delete client control |
| `src/app/admin/dokter/tambah/page.tsx` | Create page shell |
| `src/app/admin/dokter/tambah/TambahDokterForm.tsx` | Create form |
| `src/app/admin/dokter/[id]/edit/page.tsx` | Edit page shell |
| `src/app/admin/dokter/[id]/edit/EditDokterForm.tsx` | Edit form |
| `src/components/layout/DokterSection.tsx` | Public grid section |
| `src/components/layout/DokterSection.test.tsx` | Empty hide + card render |
| `src/app/page.tsx` | Mount after `LayananSection` |
| `src/app/layanan/page.tsx` | Mount after main services content |
| `README.md` | Document migration `002` command |

---

### Task 1: Migration + provisioning guard

**Files:**
- Create: `db/migrations/002_dokter_profiles.sql`
- Modify: `scripts/verify-cms-provisioning.mjs`
- Modify: `README.md` (migration section only)

**Interfaces:**
- Consumes: existing `001_cms_schema.sql` pattern; `npm run test:cms-provisioning`
- Produces: table `dokter (id, nama, poli, foto_url, urutan, aktif, created_at)` + indexes; guard fails if missing

- [ ] **Step 1: Write migration file**

```sql
-- db/migrations/002_dokter_profiles.sql
--
-- Additive doctor profile table for public Pelayanan cards + admin CMS.
-- Run from operator environment (not via app request path):
--   psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql
--
-- Safe to rerun. Does not drop, truncate, or overwrite existing rows.

CREATE TABLE IF NOT EXISTS dokter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  poli VARCHAR(100) NOT NULL,
  foto_url TEXT NOT NULL DEFAULT '',
  urutan INT NOT NULL DEFAULT 0,
  aktif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS dokter_aktif_urutan_nama_idx
  ON dokter (aktif, urutan, nama);

CREATE INDEX IF NOT EXISTS dokter_poli_idx
  ON dokter (poli);
```

- [ ] **Step 2: Extend provisioning script**

Update `scripts/verify-cms-provisioning.mjs` so it:

1. Still validates `001_cms_schema.sql` for original tables + `published_at`.
2. Also reads `db/migrations/002_dokter_profiles.sql`.
3. Requires `CREATE TABLE IF NOT EXISTS dokter` in `002`.
4. Requires columns via regex checks for `nama`, `poli`, `foto_url`, `urutan`, `aktif` in the `002` file.
5. Keeps the runtime `CREATE|ALTER|DROP TABLE` ban over `src/**/*.{ts,tsx}`.

Minimal shape:

```js
import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const migration001 = await readFile("db/migrations/001_cms_schema.sql", "utf8");
const migration002 = await readFile("db/migrations/002_dokter_profiles.sql", "utf8");

const requiredTables001 = ["users", "health_news", "layanan_poli", "jadwal_dokter", "website_settings"];
for (const table of requiredTables001) {
  if (!new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "i").test(migration001)) {
    throw new Error(`Missing idempotent provisioning for ${table} in 001.`);
  }
}

// keep existing published_at checks against migration001 ...

if (!/CREATE TABLE IF NOT EXISTS dokter\b/i.test(migration002)) {
  throw new Error("Missing idempotent provisioning for dokter in 002.");
}
for (const col of ["nama", "poli", "foto_url", "urutan", "aktif"]) {
  if (!new RegExp(`\\b${col}\\b`, "i").test(migration002)) {
    throw new Error(`dokter migration 002 missing column ${col}.`);
  }
}

for await (const path of glob("src/**/*.{ts,tsx}")) {
  const source = await readFile(path, "utf8");
  if (/\b(?:CREATE|ALTER|DROP)\s+TABLE\b/i.test(source)) {
    throw new Error(`Runtime schema DDL found in ${path}.`);
  }
}

console.log("CMS provisioning migrations cover all CMS tables; runtime source has no table DDL.");
```

- [ ] **Step 3: Document operator command in README**

In README “Provisioning database CMS” section, after the `001` command, add:

```bash
psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql
```

Note: run `002` before deploying app code that reads `dokter`.

- [ ] **Step 4: Run provisioning test**

Run: `npm run test:cms-provisioning`  
Expected: pass, log mentions CMS tables / no runtime DDL

- [ ] **Step 5: Commit**

```bash
git add db/migrations/002_dokter_profiles.sql scripts/verify-cms-provisioning.mjs README.md
git commit -m "chore(db): add idempotent dokter profiles migration"
```

---

### Task 2: `dokterSchema` + unit tests

**Files:**
- Modify: `src/lib/admin-schemas.ts`
- Modify: `src/lib/admin-schemas.test.ts`

**Interfaces:**
- Consumes: existing `optionalNewsImage` / requiredText patterns
- Produces: exported `dokterSchema` with fields `{ nama, poli, foto_url, urutan?, aktif? }`

- [ ] **Step 1: Write failing schema tests**

Append to `src/lib/admin-schemas.test.ts`:

```ts
import { dokterSchema } from "./admin-schemas";

it("requires dokter nama and poli", () => {
  expect(dokterSchema.safeParse({ nama: "", poli: "", foto_url: "" }).success).toBe(false);
});

it("accepts dokter with https photo and defaults", () => {
  const parsed = dokterSchema.safeParse({
    nama: "Dr. Sari",
    poli: "Poli Umum",
    foto_url: "https://cdn.example.test/dr-sari.webp",
  });
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.urutan).toBe(0);
    expect(parsed.data.aktif).toBe(true);
  }
});

it("accepts compressed data-image dokter photo", () => {
  const tiny =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  expect(
    dokterSchema.safeParse({
      nama: "Dr. Sari",
      poli: "Poli Gigi",
      foto_url: tiny,
      urutan: 2,
      aktif: false,
    }).success,
  ).toBe(true);
});

it("rejects javascript dokter photo URL", () => {
  expect(
    dokterSchema.safeParse({
      nama: "Dr. Sari",
      poli: "Umum",
      foto_url: "javascript:alert(1)",
    }).success,
  ).toBe(false);
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `npx vitest run src/lib/admin-schemas.test.ts`  
Expected: FAIL — `dokterSchema` not exported

- [ ] **Step 3: Implement schema**

In `src/lib/admin-schemas.ts`, after `scheduleSchema` (or near other content schemas), add:

```ts
export const dokterSchema = z
  .object({
    nama: requiredText,
    poli: requiredText,
    foto_url: optionalNewsImage,
    urutan: z.coerce.number().int().min(0).optional().default(0),
    aktif: z
      .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("on"), z.literal("")])
      .optional()
      .transform((value) => {
        if (value === undefined || value === "") return true;
        if (value === true || value === "true" || value === "on") return true;
        if (value === false || value === "false") return false;
        return true;
      }),
  })
  .strict();
```

Notes:
- Reuse existing `optionalNewsImage` (do not duplicate refine logic unless extracting a shared alias `optionalCmsImage = optionalNewsImage` for clarity).
- If Zod v4 `default` after `optional` behaves differently in this repo, match patterns already used; coerce `urutan` from form strings.

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run src/lib/admin-schemas.test.ts`  
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin-schemas.ts src/lib/admin-schemas.test.ts
git commit -m "feat(cms): add dokterSchema validation"
```

---

### Task 3: Data access helpers

**Files:**
- Create: `src/lib/dokter-actions.ts`
- Create: `src/lib/dokter-actions.test.ts` (optional pure ordering/filter unit if mocking sql is heavy — prefer thin file + integration via API tests; still add a small test that exports exist **or** mock sql like other libs if pattern exists)

**Interfaces:**
- Consumes: `@vercel/postgres` `sql`
- Produces:

```ts
export type Dokter = {
  id: string;
  nama: string;
  poli: string;
  foto_url: string;
  urutan: number;
  aktif: boolean;
  created_at?: string;
};

export async function getDokter(): Promise<Dokter[]>; // admin list — all rows, ORDER BY urutan ASC, nama ASC; on error return []
export async function getDokterById(id: string): Promise<Dokter | null>;
export async function getDokterPublik(): Promise<Dokter[]>; // aktif=true only; soft-fail []
```

- [ ] **Step 1: Implement `dokter-actions.ts`**

Mirror `src/lib/layanan-actions.ts`:

```ts
import { sql } from "@vercel/postgres";

export type Dokter = {
  id: string;
  nama: string;
  poli: string;
  foto_url: string;
  urutan: number;
  aktif: boolean;
  created_at?: string;
};

function mapRow(row: Record<string, unknown>): Dokter {
  return {
    id: String(row.id),
    nama: String(row.nama ?? ""),
    poli: String(row.poli ?? ""),
    foto_url: String(row.foto_url ?? ""),
    urutan: Number(row.urutan ?? 0),
    aktif: row.aktif === true || row.aktif === "t" || row.aktif === "true",
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

export async function getDokter(): Promise<Dokter[]> {
  try {
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      ORDER BY urutan ASC, nama ASC
    `;
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getDokterById(id: string): Promise<Dokter | null> {
  try {
    const cleanId = id.trim();
    if (!cleanId) return null;
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      WHERE id = ${cleanId}::uuid
      LIMIT 1
    `;
    const row = rows[0];
    return row ? mapRow(row as Record<string, unknown>) : null;
  } catch (error) {
    console.error("Database Error - getDokterById:", error);
    return null;
  }
}

export async function getDokterPublik(): Promise<Dokter[]> {
  try {
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      WHERE aktif = true
      ORDER BY urutan ASC, nama ASC
    `;
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  } catch (error) {
    console.error("Database Error - getDokterPublik:", error);
    return [];
  }
}
```

- [ ] **Step 2: Smoke-typecheck / test import**

Run: `npx vitest run src/lib/admin-schemas.test.ts`  
(No DB required.) Optionally add a mocked unit test file if you want; not required if Task 4 covers SQL call sites.

- [ ] **Step 3: Commit**

```bash
git add src/lib/dokter-actions.ts
git commit -m "feat(cms): add dokter data access helpers"
```

---

### Task 4: API routes + mutation security tests

**Files:**
- Create: `src/app/api/dokter/route.ts`
- Create: `src/app/api/dokter/[id]/route.ts`
- Modify: `src/app/api/content-mutations.test.ts`

**Interfaces:**
- Consumes: `requireAdmin`, `toAuthorizationResponse`, `dokterSchema`, `formatFieldErrors`, `sql`
- Produces: `POST /api/dokter`, `PUT|DELETE /api/dokter/[id]` returning `{ success: true }` or safe errors

- [ ] **Step 1: Write failing mutation tests**

In `src/app/api/content-mutations.test.ts`, import:

```ts
import { POST as createDokter } from "./dokter/route";
import { PUT as updateDokter, DELETE as deleteDokter } from "./dokter/[id]/route";
```

Add cases:

```ts
it("returns 401 for unauthenticated dokter creation before SQL", async () => {
  mockedGetServerSession.mockResolvedValue(null);
  const response = await createDokter(
    new Request("http://test/api/dokter", {
      method: "POST",
      body: JSON.stringify({ nama: "Dr. Sari", poli: "Umum", foto_url: "" }),
    }),
  );
  expect(response.status).toBe(401);
  expect(mockedSql).not.toHaveBeenCalled();
});

it("rejects invalid dokter fields before SQL", async () => {
  mockedGetServerSession.mockResolvedValue(admin);
  const response = await createDokter(
    new Request("http://test/api/dokter", {
      method: "POST",
      body: JSON.stringify({ nama: "", poli: "", foto_url: "" }),
    }),
  );
  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toMatchObject({
    error: "Data dokter tidak valid.",
  });
  expect(mockedSql).not.toHaveBeenCalled();
});

it("inserts dokter for authorized admin", async () => {
  mockedGetServerSession.mockResolvedValue(admin);
  const response = await createDokter(
    new Request("http://test/api/dokter", {
      method: "POST",
      body: JSON.stringify({
        nama: "Dr. Sari",
        poli: "Poli Umum",
        foto_url: "https://cdn.example.test/sari.webp",
        urutan: 1,
        aktif: true,
      }),
    }),
  );
  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({ success: true });
  expect(mockedSql).toHaveBeenCalledTimes(1);
});
```

Also extend the “malformed authenticated mutation bodies” suite to include `createDokter(malformedJson())` and `updateDokter(malformedJson(), params)` expecting 400 and no SQL — adjust expected status array accordingly.

- [ ] **Step 2: Run tests — expect fail**

Run: `npx vitest run src/app/api/content-mutations.test.ts`  
Expected: FAIL — modules missing

- [ ] **Step 3: Implement POST route**

`src/app/api/dokter/route.ts`:

```ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { dokterSchema, formatFieldErrors } from "@/lib/admin-schemas";

function invalidate() {
  revalidatePath("/admin/dokter");
  revalidatePath("/layanan");
  revalidatePath("/");
}

export async function POST(request: Request) {
  try {
    try {
      await requireAdmin();
    } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data dokter tidak valid.", fields: {} }, { status: 400 });
    }

    const parsed = dokterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data dokter tidak valid.", fields: formatFieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    const { nama, poli, foto_url, urutan, aktif } = parsed.data;
    await sql`
      INSERT INTO dokter (nama, poli, foto_url, urutan, aktif)
      VALUES (${nama}, ${poli}, ${foto_url || ""}, ${urutan}, ${aktif})
    `;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Dokter Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menyimpan data dokter." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 4: Implement PUT/DELETE route**

`src/app/api/dokter/[id]/route.ts` — copy structure from `src/app/api/layanan/[id]/route.ts`:

- UUID guard regex same as layanan
- DELETE: `DELETE FROM dokter WHERE id = ${id}::uuid`
- PUT: parse `dokterSchema`, `UPDATE dokter SET nama=..., poli=..., foto_url=..., urutan=..., aktif=... WHERE id=...`
- Same `invalidate()` paths
- Indonesian safe error strings for dokter

- [ ] **Step 5: Run mutation tests — expect pass**

Run: `npx vitest run src/app/api/content-mutations.test.ts`  
Expected: pass

- [ ] **Step 6: Commit**

```bash
git add src/app/api/dokter src/app/api/content-mutations.test.ts
git commit -m "feat(api): dokter CRUD with admin auth and validation"
```

---

### Task 5: Admin nav link

**Files:**
- Modify: `src/components/admin/AdminNav.tsx`
- Modify: `src/components/admin/AdminNav.test.tsx`

**Interfaces:**
- Consumes: existing `sharedLinks` array
- Produces: link `/admin/dokter` label `Kelola Dokter` for admin + superadmin

- [ ] **Step 1: Update test first**

In both AdminNav tests, add:

```ts
expect(screen.getByRole("link", { name: /kelola dokter/i })).toBeVisible();
```

- [ ] **Step 2: Run — expect fail**

Run: `npx vitest run src/components/admin/AdminNav.test.tsx`  
Expected: FAIL — link missing

- [ ] **Step 3: Add nav item**

In `sharedLinks`, after Layanan Poli:

```ts
{ href: "/admin/layanan", label: "Layanan Poli" },
{ href: "/admin/dokter", label: "Kelola Dokter" },
{ href: "/admin/jadwal", label: "Jadwal Dokter" },
```

- [ ] **Step 4: Run — expect pass**

Run: `npx vitest run src/components/admin/AdminNav.test.tsx`  
Expected: pass

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/AdminNav.tsx src/components/admin/AdminNav.test.tsx
git commit -m "feat(admin): add Kelola Dokter nav link"
```

---

### Task 6: Admin list + delete

**Files:**
- Create: `src/app/admin/dokter/page.tsx`
- Create: `src/app/admin/dokter/DeleteDokterButton.tsx`
- Create: `src/app/admin/dokter/loading.tsx` (optional simple panel skeleton matching layanan if present)

**Interfaces:**
- Consumes: `requireAdmin`, `getDokter`, `SmartImage`, `DeleteDokterButton` → `DELETE /api/dokter/:id`
- Produces: `/admin/dokter` list UI

- [ ] **Step 1: Delete button**

```tsx
// src/app/admin/dokter/DeleteDokterButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export function DeleteDokterButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const remove = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/dokter/${id}`, { method: "DELETE" });
      if (response.ok) router.refresh();
      else alert((await response.json()).error || "Gagal menghapus data dokter.");
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus data dokter.");
    } finally {
      setPending(false);
    }
  };
  return <ConfirmDeleteButton itemName="dokter" pending={pending} onConfirm={remove} />;
}
```

- [ ] **Step 2: List page**

Mirror `src/app/admin/layanan/page.tsx`:

- `requireAdmin()` + `getDokter()`
- Header: eyebrow `Fasyankes`, title `Manajemen Dokter`, copy about photo/name/poli under Pelayanan
- CTA `+ Tambah Dokter` → `/admin/dokter/tambah`
- Empty: `Belum ada data dokter.`
- Mobile cards + desktop table columns: Foto (thumb 48px via SmartImage or grey initials box), Nama, Poli, Urutan, Status (`Aktif`/`Nonaktif`), Aksi (Edit + Delete)
- Note under header: `Jadwal praktik tetap dikelola di menu Jadwal Dokter.`

Thumb helper when `foto_url` empty: a `div` with first letters of `nama`, `bg-[var(--teal-soft)]`, no stock photo.

- [ ] **Step 3: Manual type sanity**

Run: `npx vitest run`  
Expected: full suite still green (no list page tests required)

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/dokter
git commit -m "feat(admin): dokter list and delete"
```

---

### Task 7: Admin create + edit forms

**Files:**
- Create: `src/app/admin/dokter/tambah/page.tsx`
- Create: `src/app/admin/dokter/tambah/TambahDokterForm.tsx`
- Create: `src/app/admin/dokter/[id]/edit/page.tsx`
- Create: `src/app/admin/dokter/[id]/edit/EditDokterForm.tsx`

**Interfaces:**
- Consumes: `dokterSchema`, `CoverImageField` (`name="foto_url"`), `AdminFeedback`, `formatFieldErrors`, fetch POST/PUT
- Produces: working create/edit flows

- [ ] **Step 1: Tambah page shell**

Same structure as `admin/layanan/tambah/page.tsx` — `requireAdmin`, back link to `/admin/dokter`, title `Tambah Dokter`.

- [ ] **Step 2: TambahDokterForm client**

```tsx
"use client";
// fields: nama, poli, CoverImageField name="foto_url", urutan (number), aktif (checkbox default checked)
// submit: FormData → dokterSchema.safeParse({
//   nama, poli, foto_url: String(form.get("foto_url")||""),
//   urutan: Number(form.get("urutan")||0),
//   aktif: form.get("aktif") === "on" || form.get("aktif") === "true",
// })
// POST /api/dokter JSON → on success router.push("/admin/dokter"); router.refresh()
```

Use `input-field`, `button-primary`, labels in Indonesian.  
`CoverImageField` already supports drag/drop + URL; pass `name="foto_url"`.

- [ ] **Step 3: Edit page shell**

`getDokterById` → `notFound()` if missing; pass row to `EditDokterForm`.

- [ ] **Step 4: EditDokterForm**

Pre-fill `defaultValue` on inputs; `CoverImageField defaultValue={dokter.foto_url}`; checkbox `defaultChecked={dokter.aktif}`; PUT `/api/dokter/${id}`.

- [ ] **Step 5: Run full unit suite**

Run: `npx vitest run`  
Expected: pass

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/dokter
git commit -m "feat(admin): dokter create and edit forms"
```

---

### Task 8: Public `DokterSection` + mount

**Files:**
- Create: `src/components/layout/DokterSection.tsx`
- Create: `src/components/layout/DokterSection.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layanan/page.tsx`

**Interfaces:**
- Consumes: `getDokterPublik`, `SectionHeading`, `SmartImage`
- Produces: public section under Pelayanan; null when empty

- [ ] **Step 1: Write failing section tests**

```tsx
// src/components/layout/DokterSection.test.tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/dokter-actions", () => ({
  getDokterPublik: vi.fn(),
}));

vi.mock("@/components/ui/SmartImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { getDokterPublik } from "@/lib/dokter-actions";
import DokterSection from "./DokterSection";

const mockedGet = vi.mocked(getDokterPublik);

describe("DokterSection", () => {
  it("renders nothing when there are no public doctors", async () => {
    mockedGet.mockResolvedValue([]);
    const ui = await DokterSection();
    const { container } = render(ui);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders photo name and poli cards for active doctors", async () => {
    mockedGet.mockResolvedValue([
      {
        id: "1",
        nama: "Dr. Sari",
        poli: "Poli Umum",
        foto_url: "https://cdn.example.test/sari.webp",
        urutan: 0,
        aktif: true,
      },
    ]);
    const ui = await DokterSection();
    render(ui);
    expect(screen.getByRole("heading", { name: /dokter kami/i })).toBeVisible();
    expect(screen.getByText("Dr. Sari")).toBeVisible();
    expect(screen.getByText("Poli Umum")).toBeVisible();
    expect(screen.getByAltText("Dr. Sari")).toBeVisible();
  });
});
```

If async server component test pattern differs in this repo, follow whatever `BeritaSection` / similar tests use — keep assertions: empty → no heading; with data → name + poli.

- [ ] **Step 2: Run — expect fail**

Run: `npx vitest run src/components/layout/DokterSection.test.tsx`  
Expected: FAIL — module missing

- [ ] **Step 3: Implement DokterSection**

```tsx
import SectionHeading from "./SectionHeading";
import SmartImage from "@/components/ui/SmartImage";
import { getDokterPublik } from "@/lib/dokter-actions";

function initials(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function DokterSection() {
  const doctors = await getDokterPublik();
  if (doctors.length === 0) return null;

  return (
    <section className="section-band bg-[var(--sky-wash)]" id="dokter" aria-labelledby="dokter-heading">
      <div className="content-container">
        <SectionHeading
          id="dokter-heading"
          eyebrow="Tim medis"
          title="Dokter kami"
          description="Tenaga medis yang melayani di Puskesmas Prapatan sesuai data yang dipublikasikan."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <li key={d.id}>
              <article className="panel panel-lift flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/5] w-full bg-[var(--teal-soft)]">
                  {d.foto_url ? (
                    <SmartImage
                      src={d.foto_url}
                      alt={d.nama}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--navy)]"
                      aria-hidden="true"
                    >
                      {initials(d.nama) || "Dr"}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-5">
                  <h3 className="text-base font-bold tracking-tight text-navy">{d.nama}</h3>
                  <p className="text-sm font-medium text-[var(--teal)]">{d.poli}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount on home**

In `src/app/page.tsx`, after `LayananSection` suspense block:

```tsx
import DokterSection from "@/components/layout/DokterSection";
// ...
<Suspense fallback={<LayananSkeleton />}>
  <LayananSection />
</Suspense>
<Suspense fallback={null}>
  <DokterSection />
</Suspense>
```

- [ ] **Step 5: Mount on `/layanan`**

In `src/app/layanan/page.tsx`, after the main services grid / before programs or CTA — import and render:

```tsx
import DokterSection from "@/components/layout/DokterSection";
// inside page, after layanan cards section:
<DokterSection />
```

(Server component page can await/render async child directly.)

- [ ] **Step 6: Run section + full tests**

Run: `npx vitest run`  
Expected: all pass including `DokterSection` tests

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/DokterSection.tsx src/components/layout/DokterSection.test.tsx src/app/page.tsx src/app/layanan/page.tsx
git commit -m "feat(public): show dokter cards under Pelayanan"
```

---

### Task 9: Final verification + handoff note

**Files:**
- Create or update: `docs/checkpoint-dokter-profiles-2026-07-31.md` (short checkpoint)
- Touch README only if Step Task 1 missed anything

- [ ] **Step 1: Full verification**

```bash
npm run test:cms-provisioning
npx vitest run
npm run build
```

Expected:
- provisioning pass
- all tests pass
- build succeeds (DB missing locally may warn — same as other public reads)

- [ ] **Step 2: Operator checklist in checkpoint doc**

```md
# Checkpoint — Dokter profiles

## Deploy order
1. psql "$POSTGRES_URL" -v ON_ERROR_STOP=1 -f db/migrations/002_dokter_profiles.sql
2. Deploy app
3. Admin → Kelola Dokter → add real doctors (photo, name, poli)
4. Confirm home + /layanan show cards; set nonaktif hides card

## Scope delivered
- photo + name + poli under Pelayanan
- admin CRUD
- no detail page / no jadwal FK
```

- [ ] **Step 3: Commit docs**

```bash
git add docs/checkpoint-dokter-profiles-2026-07-31.md
git commit -m "docs: checkpoint dokter profiles under Pelayanan"
```

- [ ] **Step 4: Stop — report to user**

Summarize: migration command, admin path, public placement, test counts, anything deferred (detail page, swiper, Blob).

---

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| Table `dokter` additive migration | 1 |
| Provisioning guard | 1 |
| Zod + image rules | 2 |
| Read helpers public/admin | 3 |
| API auth + CRUD + revalidate | 4 |
| Admin nav | 5 |
| Admin list/delete | 6 |
| Admin create/edit + CoverImageField | 7 |
| Public section home + `/layanan`, hide if empty | 8 |
| No fake data / no jadwal change / no detail page | Global + 8 |
| Deploy runbook | 1, 9 |

## Placeholder scan

No TBD/TODO steps. Types `Dokter`, `dokterSchema`, routes, and path strings consistent across tasks.
)
