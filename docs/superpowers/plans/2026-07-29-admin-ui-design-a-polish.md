# Admin UI — Design A Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Design A civic tokens (navy/teal/panel/button) to all admin shell routes — nav, layout, dashboard, lists, forms — keeping CMS behavior unchanged.

**Architecture:** Admin UI lives under `src/app/admin/` (routes) and `src/components/admin/` (shared components). Public Design A tokens already defined in `src/app/globals.css` (CSS custom properties) and `tailwind.config.ts`. This plan replaces inline Tailwind classes with component-layer utility classes (`.panel`, `.nav-link`, `.button-primary`, `.input-field`, `.accent-bar`, `.page-intro-title`, `eyebrow`, etc.) and consistent navy/teal palette.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, CSS `@layer components` in globals.css, Vitest

## Global Constraints

- Do **not** invent a second palette — reuse `--navy`, `--teal`, `--teal-soft`, `--sky-wash`, `--surface`, `--ink`, `--muted`, `--line`, `--radius-*`, `--shadow-*` from `globals.css`
- Keep all CMS behavior identical — only touch visual classNames and layout markup
- WCAG AA: 44px touch targets, focus rings (`:focus-visible` already on `globals.css`), `aria-current="page"`
- Run `npx vitest run` after each task — all existing tests must pass (currently 20 files / 60 tests)
- Do **not** modify `src/app/globals.css` or `tailwind.config.ts` — tokens are already defined
- Login page (`src/app/login/page.tsx`) already polished in Design A — do not re-touch
- Test files (`*.test.ts`, `*.test.tsx`) must not be modified — existing tests must pass as-is

---

### Task 1: Admin Layout Shell — Sidebar, Nav, Logout

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/components/admin/AdminNav.tsx`
- Modify: `src/app/admin/LogoutButton.tsx`
- Test: `src/components/admin/AdminNav.test.tsx` (read-only — verify passes)

**Interfaces:**
- Consumes: Existing `AdminNav { role, userName }` props, `LogoutButton` client component
- Produces: Restyled sidebar shell with navy/teal tokens, nav active states, logout button using Design A tokens

- [ ] **Step 1: Restyle `layout.tsx` sidebar**

Replace raw color classes with CSS custom properties. The sidebar `<aside>` uses `bg-[var(--navy-deep)]` instead of `bg-slate-900`, header uses `border-[var(--navy)]` instead of `border-slate-800`, text uses `var(--muted)` / `var(--ink)` inverses.

```tsx
// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const { role } = await requireAdmin();
    const session = await getServerSession(authOptions);

    return (
      <div className="min-h-screen bg-[var(--sky-wash)] md:flex">
        <aside className="flex w-full flex-col bg-[var(--navy-deep)] text-[var(--muted)] shadow-[var(--shadow-lift)] md:min-h-screen md:w-64">
          <div className="border-b border-[var(--navy)] p-6">
            <h2 className="text-xl font-bold text-white">Panel Admin</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Puskesmas Prapatan</p>
          </div>
          <AdminNav role={role} userName={session?.user?.name ?? undefined} />
          <div className="border-t border-[var(--navy)] p-4">
            <p className="mb-1 truncate text-sm font-medium text-white">{session?.user?.name ?? "Pengguna"}</p>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">{role}</p>
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    );
  } catch {
    redirect("/login");
  }
}
```

- [ ] **Step 2: Run tests to verify**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed (AdminNav tests use existing class checks)

- [ ] **Step 3: Restyle `AdminNav.tsx`**

Apply `.nav-link` pattern (from globals.css `@layer components`) to nav links. Use `aria-[current=page]:` for active state. Keep the `flex-1 p-4 space-y-1` container but use `min-h-11` for 44px targets.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavProps = {
  role: "admin" | "superadmin";
  userName?: string;
};

const sharedLinks = [
  { href: "/admin", label: "Dashboard Utama" },
  { href: "/admin/berita", label: "Kelola Berita" },
  { href: "/admin/layanan", label: "Layanan Poli" },
  { href: "/admin/jadwal", label: "Jadwal Dokter" },
  { href: "/admin/settings", label: "Pengaturan Situs" },
];

export default function AdminNav({ role, userName }: AdminNavProps) {
  const pathname = usePathname();
  const links = role === "superadmin"
    ? [...sharedLinks, { href: "/admin/users", label: "Manajemen Pengguna" }]
    : sharedLinks;

  return (
    <nav aria-label="Navigasi admin" className="flex-1 p-4 space-y-1">
      {userName && <p className="px-4 pb-3 text-sm text-[var(--muted)]">{userName}</p>}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href))
              ? "page"
              : undefined
          }
          className="relative inline-flex min-h-11 w-full items-center rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-[var(--navy)] hover:text-white aria-[current=page]:bg-[var(--teal)] aria-[current=page]:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2 focus:ring-offset-[var(--navy-deep)]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

Key changes:
- Active state uses `aria-[current=page]:bg-[var(--teal)]` (solid teal pill, like public nav)
- Sub-route matching: `/admin/berita/edit/foo` also marks "Kelola Berita" as active
- Hover state uses `bg-[var(--navy)]` (lighter than deep nav background)
- Focus ring references the teal palette

- [ ] **Step 4: Restyle `LogoutButton.tsx`**

Use `button-primary` tokens but with red color for danger signal.

```tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-800 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--navy-deep)]"
    >
      Keluar (Logout)
    </button>
  );
}
```

- [ ] **Step 5: Run tests to verify**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/layout.tsx src/components/admin/AdminNav.tsx src/app/admin/LogoutButton.tsx
git commit -m "feat(admin): apply Design A tokens to admin layout shell"
```

---

### Task 2: Admin Dashboard (Home page)

**Files:**
- Modify: `src/app/admin/page.tsx`
- Test: `src/app/admin/page.test.tsx` (read-only — verify passes)

**Interfaces:**
- Consumes: Same data-loading pattern (`getBeritaCount`, `getBeritaKesehatan`, etc.)
- Produces: Dashboard with Design A panel cards, page-intro, accent-bar, eyebrow

- [ ] **Step 1: Restyle `page.tsx` dashboard**

Replace `rounded-xl border bg-white shadow-sm` with `.panel`, add `.eyebrow` / `.accent-bar` patterns.

```tsx
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getBeritaCount, getBeritaKesehatan } from "@/lib/actions";
import { getLayananCount } from "@/lib/layanan-actions";
import { getJadwalCount } from "@/lib/jadwal-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Puskesmas Prapatan",
};

type LoadResult<T> =
  | { status: "available"; data: T }
  | { status: "unavailable" };

async function loadData<T>(load: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { status: "available", data: await load() };
  } catch {
    return { status: "unavailable" };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const [newsCount, recentNews, layananCount, jadwalCount] = await Promise.all([
    loadData(getBeritaCount),
    loadData(getBeritaKesehatan),
    loadData(getLayananCount),
    loadData(getJadwalCount),
  ]);
  const latestNews = recentNews.status === "available"
    ? recentNews.data[0] as { title?: string; date?: string } | undefined
    : undefined;
  const summaries = [
    ["Berita", newsCount],
    ["Layanan Poli", layananCount],
    ["Jadwal Dokter", jadwalCount],
  ] as const;

  return (
    <>
      <header className="mb-8">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">
          Selamat datang, {session?.user?.name || "Admin"}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Ringkasan konten website Puskesmas Prapatan.
        </p>
      </header>

      <section aria-label="Ringkasan konten" className="grid gap-5 sm:grid-cols-3">
        {summaries.map(([label, result]) => (
          <article key={label} className="panel p-5">
            <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
            {result.status === "available" ? (
              <p className="mt-2 text-3xl font-bold text-[var(--navy)]">
                {result.data}
              </p>
            ) : (
              <p className="mt-2 text-[var(--muted)]">Data belum tersedia.</p>
            )}
          </article>
        ))}
      </section>

      <section className="section-band">
        <div className="panel p-6">
          <p className="eyebrow">Terkini</p>
          <h2 className="mt-1 text-lg font-bold text-[var(--navy)]">Berita terbaru</h2>
          {recentNews.status === "unavailable" ? (
            <p className="mt-3 text-[var(--muted)]">Data belum tersedia.</p>
          ) : latestNews ? (
            <div className="accent-bar mt-4">
              <p className="font-medium text-[var(--ink)]">{latestNews.title || "Data belum tersedia."}</p>
              {latestNews.date && <p className="mt-1 text-sm text-[var(--muted)]">{new Date(latestNews.date).toLocaleDateString("id-ID")}</p>}
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">Belum ada berita.</p>
          )}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat(admin): apply Design A tokens to admin dashboard"
```

---

### Task 3: List Pages — Berita, Layanan, Jadwal, Users

**Files:**
- Modify: `src/app/admin/berita/page.tsx`
- Modify: `src/app/admin/layanan/page.tsx`
- Modify: `src/app/admin/jadwal/page.tsx`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/app/admin/users/loading.tsx`

**Interfaces:**
- Consumes: Same data-fetching functions, same button components
- Produces: Lists with Design A panel containers, consistent heading/accent, table polish

- [ ] **Step 1: Restyle `berita/page.tsx`**

Replace raw helpers with Design A classes. Keep responsive pattern (mobile cards + desktop table).

```tsx
import { requireAdmin } from "@/lib/admin-auth";
import { getBeritaKesehatan } from "../../../lib/actions";
import Link from "next/link";
import { Metadata } from "next";
import DeleteBeritaButton from "./DeleteBeritaButton";

type Berita = { id: string; title: string; slug: string; date: string | Date };
export const metadata: Metadata = { title: "Kelola Berita | Admin" };

export default async function KelolaBeritaPage() {
  await requireAdmin();
  const berita = await getBeritaKesehatan() as Berita[];
  const date = (value: string | Date) => new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const action = (item: Berita) => (
    <div className="flex gap-4">
      <Link href={`/admin/berita/edit/${item.slug}`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteBeritaButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Konten</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Kelola Berita</h1>
          <p className="mt-2 text-[var(--muted)]">Manajemen artikel dan pengumuman kesehatan Puskesmas.</p>
        </div>
        <Link href="/admin/berita/tambah" className="button-primary">
          + Tambah Berita Baru
        </Link>
      </header>

      {berita.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada berita yang dipublikasikan.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            {berita.map(item => (
              <article key={item.id} className="panel p-5">
                <h2 className="font-semibold text-[var(--navy)]">{item.title}</h2>
                <p className="mt-1 text-sm text-[var(--teal)]">/{item.slug}</p>
                <p className="mt-3 text-sm text-[var(--muted)]">{date(item.date)}</p>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Judul Berita</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Tanggal Publish</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {berita.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 font-medium text-[var(--ink)]">
                      {item.title}
                      <div className="mt-1 text-xs font-normal text-[var(--teal)]">/{item.slug}</div>
                    </td>
                    <td className="p-4 text-[var(--muted)]">{date(item.date)}</td>
                    <td className="p-4">{action(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
```

- [ ] **Step 2: Restyle `layanan/page.tsx`**

Same pattern — `.panel`, `.eyebrow`, `button-primary`, consistent tokens.

```tsx
import { requireAdmin } from "@/lib/admin-auth";
import { getLayanan } from "@/lib/layanan-actions";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import Link from "next/link";
import { DeleteLayananButton } from "./DeleteLayananButton";

type Layanan = { id: string; icon: string; nama_poli: string; deskripsi: string };
export const metadata = { title: "Layanan Poli | Admin" };

export default async function ManajemenLayananPage() {
  await requireAdmin();
  const layanan = await getLayanan() as Layanan[];
  const action = (item: Layanan) => (
    <div className="flex items-center gap-4">
      <Link href={`/admin/layanan/${item.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteLayananButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Fasyankes</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Manajemen Layanan (Poli)</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola daftar layanan kesehatan yang tersedia di Puskesmas.</p>
        </div>
        <Link href="/admin/layanan/tambah" className="button-primary">
          + Tambah Layanan
        </Link>
      </header>

      {layanan.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada layanan poli yang ditambahkan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {layanan.map(item => (
              <article key={item.id} className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h2 className="font-semibold text-[var(--navy)]">{item.nama_poli}</h2>
                </div>
                <div className="mt-3 line-clamp-3 text-sm text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Icon</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Nama Poli</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Deskripsi Singkat</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {layanan.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 text-2xl">{item.icon}</td>
                    <td className="p-4 font-medium text-[var(--ink)]">{item.nama_poli}</td>
                    <td className="p-4">
                      <div className="line-clamp-2 max-w-md text-sm text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/>
                    </td>
                    <td className="p-4">{action(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
```

- [ ] **Step 3: Restyle `jadwal/page.tsx`**

Same pattern.

```tsx
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getJadwal } from "@/lib/jadwal-actions";
import DeleteJadwalButton from "./DeleteJadwalButton";

type Jadwal = { id: string; nama_dokter: string; poli: string; hari: string; jam_mulai: string; jam_selesai: string };
export const metadata = { title: "Jadwal Dokter | Admin" };

export default async function ManajemenJadwalPage() {
  await requireAdmin();
  const jadwal = await getJadwal() as Jadwal[];
  const action = (item: Jadwal) => (
    <div className="flex gap-4">
      <Link href={`/admin/jadwal/${item.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteJadwalButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Penjadwalan</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Jadwal Dokter</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola informasi jadwal praktik dokter di berbagai poli pelayanan.</p>
        </div>
        <Link href="/admin/jadwal/tambah" className="button-primary">
          + Tambah Jadwal
        </Link>
      </header>

      {jadwal.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada jadwal dokter yang ditambahkan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {jadwal.map(item => (
              <article key={item.id} className="panel p-5">
                <h2 className="font-semibold text-[var(--navy)]">{item.nama_dokter}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-[var(--muted)]">Poli</dt>
                  <dd className="text-[var(--ink)]">{item.poli}</dd>
                  <dt className="text-[var(--muted)]">Hari</dt>
                  <dd className="text-[var(--ink)]">{item.hari}</dd>
                  <dt className="text-[var(--muted)]">Jam</dt>
                  <dd className="text-[var(--ink)]">{item.jam_mulai} - {item.jam_selesai}</dd>
                </dl>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Nama Dokter</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Poli</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Hari</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Jam</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 font-medium text-[var(--ink)]">{item.nama_dokter}</td>
                    <td className="p-4 text-[var(--muted)]">{item.poli}</td>
                    <td className="p-4 text-[var(--muted)]">{item.hari}</td>
                    <td className="p-4 text-[var(--muted)]">{item.jam_mulai} - {item.jam_selesai}</td>
                    <td className="p-4">{action(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
```

- [ ] **Step 4: Restyle `users/page.tsx`**

Apply Design A tokens — `.panel`, `.eyebrow`, `button-primary`. Keep the superadmin-only role badge pattern but adjust colors.

```tsx
import { requireSuperadmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getUsers } from "@/lib/user-actions";
import DeleteUserButton from "./DeleteUserButton";

export const metadata = {
  title: "Manajemen User | Admin",
};

export default async function ManajemenUserPage() {
  const session = await requireSuperadmin();
  const users = await getUsers();

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Akses</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Manajemen User</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola akses akun pegawai dan administrator website.</p>
        </div>
        <Link href="/admin/users/tambah" className="button-primary">
          + Tambah Akun
        </Link>
      </header>

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)] text-[var(--navy)]">
                <th className="px-6 py-4 font-semibold">Nama Pegawai</th>
                <th className="px-6 py-4 font-semibold">Email / Username</th>
                <th className="px-6 py-4 font-semibold">Hak Akses</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[var(--teal-soft)]/50">
                  <td className="px-6 py-4 font-medium text-[var(--ink)]">{user.name}</td>
                  <td className="px-6 py-4 text-[var(--muted)]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-[var(--teal-soft)] text-[var(--teal)]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">
                      Edit
                    </Link>
                    <Link href={`/admin/users/${user.id}/reset`} className="text-sm font-medium text-[var(--navy)] hover:text-[var(--navy-deep)]">
                      Reset Password
                    </Link>
                    {session.id !== user.id && (
                      <DeleteUserButton id={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Restyle `users/loading.tsx`**

```tsx
export default function UsersLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--teal)]"></div>
        <p className="animate-pulse font-medium text-[var(--muted)]">Memuat data pengguna...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/berita/page.tsx src/app/admin/layanan/page.tsx src/app/admin/jadwal/page.tsx src/app/admin/users/page.tsx src/app/admin/users/loading.tsx
git commit -m "feat(admin): apply Design A tokens to list pages"
```

---

### Task 4: All Admin Forms — Add/Edit + Settings + Delete Buttons

**Files:**
- Modify: `src/app/admin/berita/tambah/TambahBeritaForm.tsx`
- Modify: `src/app/admin/berita/edit/[slug]/EditBeritaForm.tsx`
- Modify: `src/app/admin/layanan/tambah/TambahLayananForm.tsx`
- Modify: `src/app/admin/layanan/[id]/edit/EditLayananForm.tsx`
- Modify: `src/app/admin/jadwal/tambah/TambahJadwalForm.tsx`
- Modify: `src/app/admin/jadwal/[id]/edit/EditJadwalForm.tsx`
- Modify: `src/app/admin/jadwal/AddJadwalForm.tsx`
- Modify: `src/app/admin/users/AddUserForm.tsx`
- Modify: `src/app/admin/users/[id]/edit/EditUserForm.tsx`
- Modify: `src/app/admin/users/[id]/reset/ResetPasswordForm.tsx`
- Modify: `src/app/admin/settings/SettingsForm.tsx`
- Modify: `src/components/admin/AdminFeedback.tsx`
- Modify: `src/components/admin/ConfirmDeleteButton.tsx`

**Interfaces:**
- Consumes: Same form logic, validation schemas, action handlers
- Produces: All forms using `input-field`, `button-primary`, `panel`, consistent error states

- [ ] **Step 1: Update `AdminFeedback.tsx`**

Use Design A token colors instead of raw Tailwind classes.

```tsx
type Feedback = { type: "success" | "error"; message: string } | null;

export default function AdminFeedback({ result }: { result: Feedback }) {
  if (!result) return null;
  return (
    <div
      role={result.type === "error" ? "alert" : "status"}
      className={`mb-6 rounded-[var(--radius-sm)] border p-4 text-sm ${
        result.type === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-[var(--teal)]/30 bg-[var(--teal-soft)] text-[var(--teal-dark)]"
      }`}
    >
      {result.message}
    </div>
  );
}
```

- [ ] **Step 2: Update `ConfirmDeleteButton.tsx`**

Use Design A token for the red variant.

```tsx
"use client";

type ConfirmDeleteButtonProps = {
  onConfirm: () => void | Promise<void>;
  itemName: string;
  pending?: boolean;
};

export default function ConfirmDeleteButton({ onConfirm, itemName, pending = false }: ConfirmDeleteButtonProps) {
  const handleClick = () => {
    if (window.confirm(`Hapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`)) {
      void onConfirm();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 disabled:text-[var(--muted)]"
    >
      {pending ? "Menghapus..." : `Hapus ${itemName}`}
    </button>
  );
}
```

- [ ] **Step 3: Apply Design A tokens to all form files**

Replace these class patterns in every form file:

| Old pattern | New pattern |
|---|---|
| `className="w-full rounded border p-2"` | `className="input-field"` (text inputs, textareas, selects) |
| `className="w-full rounded-lg border p-2"` | `className="input-field"` |
| `className="w-full rounded border p-3"` | `className="input-field"` |
| `className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"` | `className="input-field"` |
| `className="rounded bg-teal-600 px-5 py-3 font-semibold text-white disabled:bg-slate-400"` | `className="button-primary"` (or keep teal variant) |
| `className="rounded-lg bg-teal-600 px-8 py-3 font-bold text-white disabled:bg-slate-400"` | `className="button-primary"` |
| `className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"` | `className="panel p-8"` |
| `className="max-w-3xl rounded-xl border bg-white p-8"` | `className="panel p-8 max-w-3xl"` |
| `className="max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm"` | `className="panel p-8 max-w-2xl"` |
| `<div className="mb-8 flex justify-between border-b pb-4">` | `<div className="mb-8 flex justify-between border-b border-[var(--line)] pb-4">` |
| `className="text-sm text-red-700"` (error) | `className="mt-1 text-sm text-red-700"` (keep as-is, already fine) |
| `<label className="block font-medium">` | `<label className="mb-1 block text-sm font-medium text-[var(--ink)]">` |
| `<label className="block text-sm font-medium">` | `<label className="mb-1 block text-sm font-medium text-[var(--ink)]">` |
| `role="alert"` + border-red patterns | Keep as-is — error states should remain red |

Apply to all form files:
- `TambahBeritaForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary`, label consistency
- `EditBeritaForm.tsx` — same
- `TambahLayananForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary`
- `EditLayananForm.tsx` — same
- `TambahJadwalForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary`
- `EditJadwalForm.tsx` — same
- `AddJadwalForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary` (minimal refactor of already-compressed code)
- `AddUserForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary`
- `EditUserForm.tsx` — outer div → `.panel`, inputs → `.input-field`, button → `button-primary`
- `ResetPasswordForm.tsx` — inputs → `.input-field`, button → `button-primary`
- `SettingsForm.tsx` — sections → `.panel`, inputs → `.input-field`, button → `button-primary`

Example for one compressed file (`TambahJadwalForm.tsx`):

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminFeedback from "@/components/admin/AdminFeedback";
import { formatFieldErrors, scheduleSchema } from "@/lib/admin-schemas";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
type Feedback = { type: "success" | "error"; message: string } | null;

export default function TambahJadwalForm() {
  const router = useRouter(); const [hari, setHari] = useState<string[]>([]); const [pending, setPending] = useState(false); const [feedback, setFeedback] = useState<Feedback>(null); const [fields, setFields] = useState<Record<string, string>>({});
  const error = (name: string) => fields[name] ? `${name}-error` : undefined;
  const field = (name: string, label: string, type = "text") => <div><label htmlFor={name} className="mb-1 block text-sm font-medium text-[var(--ink)]">{label}</label><input id={name} name={name} type={type} required aria-describedby={error(name)} className="input-field"/>{fields[name] && <p id={`${name}-error`} className="mt-1 text-sm text-red-700">{fields[name]}</p>}</div>;
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const parsed = scheduleSchema.safeParse({ nama_dokter: String(form.get("nama_dokter") || ""), poli: String(form.get("poli") || ""), hari, jam_mulai: String(form.get("jam_mulai") || ""), jam_selesai: String(form.get("jam_selesai") || "") }); if (!parsed.success) { setFields(formatFieldErrors(parsed.error)); setFeedback({ type: "error", message: "Periksa isian formulir." }); return; } setFields({}); setFeedback(null); setPending(true); try { const response = await fetch("/api/jadwal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) }); const result: { error?: string; fields?: Record<string, string> } = await response.json().catch(() => ({})); if (!response.ok || result.error) { setFields(result.fields || {}); setFeedback({ type: "error", message: result.error || "Gagal menyimpan jadwal." }); return; } router.push("/admin/jadwal"); router.refresh(); } catch { setFeedback({ type: "error", message: "Terjadi kesalahan jaringan saat menyimpan jadwal." }); } finally { setPending(false); } }
  return <div className="panel p-8"><AdminFeedback result={feedback}/><form onSubmit={submit} className="space-y-6"><div className="grid gap-4 md:grid-cols-2">{field("nama_dokter", "Nama Dokter")}{field("poli", "Poli Pelayanan")}</div><fieldset aria-describedby={error("hari")}><legend className="mb-2 text-sm font-medium text-[var(--ink)]">Hari Praktik</legend><div className="flex flex-wrap gap-3">{days.map(day => <label key={day} className="flex items-center gap-1.5 text-sm text-[var(--ink)]"><input type="checkbox" checked={hari.includes(day)} onChange={() => setHari(current => current.includes(day) ? current.filter(value => value !== day) : [...current, day])} className="h-4 w-4 accent-[var(--teal)]"/> {day}</label>)}</div>{fields.hari && <p id="hari-error" className="mt-1 text-sm text-red-700">{fields.hari}</p>}</fieldset><div className="grid gap-4 md:grid-cols-2">{field("jam_mulai", "Jam Mulai", "time")}{field("jam_selesai", "Jam Selesai", "time")}</div><button type="submit" disabled={pending} className="button-primary">{pending ? "Menyimpan..." : "Simpan Jadwal Dokter"}</button></form></div>;
}
```

Apply equivalent changes to all other form files following the mapping table above.

- [ ] **Step 4: Restyle `settings/page.tsx` + `SettingsForm.tsx`**

Settings page already uses some tokens. Add `.eyebrow`, `.panel` to sections, `.input-field` to inputs, `button-primary` to submit.

```tsx
// settings/page.tsx — add eyebrow
<header className="mb-8 flex justify-between items-end">
  <div>
    <p className="eyebrow">Konfigurasi</p>
    <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Pengaturan Situs</h1>
    <p className="mt-2 text-[var(--muted)]">Ubah informasi kontak, teks sambutan, dan detail publik website di sini.</p>
  </div>
</header>
```

For `SettingsForm.tsx`:
- `.panel p-6` for sections instead of `rounded-xl border bg-white p-6`
- `.input-field` for inputs
- `button-primary` for submit
- Label consistency: `mb-1 block text-sm font-medium text-[var(--ink)]`

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed (form styling changes don't affect test logic — tests check behavior, not classes)

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/berita/tambah/TambahBeritaForm.tsx src/app/admin/berita/edit/\[slug\]/EditBeritaForm.tsx src/app/admin/layanan/tambah/TambahLayananForm.tsx src/app/admin/layanan/\[id\]/edit/EditLayananForm.tsx src/app/admin/jadwal/tambah/TambahJadwalForm.tsx src/app/admin/jadwal/\[id\]/edit/EditJadwalForm.tsx src/app/admin/jadwal/AddJadwalForm.tsx src/app/admin/users/AddUserForm.tsx src/app/admin/users/\[id\]/edit/EditUserForm.tsx src/app/admin/users/\[id\]/reset/ResetPasswordForm.tsx src/app/admin/settings/SettingsForm.tsx src/app/admin/settings/page.tsx src/components/admin/AdminFeedback.tsx src/components/admin/ConfirmDeleteButton.tsx
git commit -m "feat(admin): apply Design A tokens to forms and shared components"
```

---

### Task 5: Remaining Pages — Reset Password View + Verification

**Files:**
- Modify: `src/app/admin/users/[id]/reset/page.tsx`

- [ ] **Step 1: Restyle reset password page**

```tsx
import { Metadata } from "next";
import { requireSuperadmin } from "@/lib/admin-auth";
import { getUserById } from "@/lib/user-actions";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Admin",
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperadmin();
  const resolvedParams = await params;
  const user = await getUserById(resolvedParams.id);

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--navy)]">Pengguna Tidak Ditemukan</h1>
        <p className="mt-2 text-[var(--muted)]">Pengguna dengan ID ini tidak dapat ditemukan di database.</p>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <p className="eyebrow">Akses</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Reset Password</h1>
        <p className="mt-2 text-[var(--muted)]">
          Anda akan mereset password untuk pengguna: <span className="font-semibold text-[var(--ink)]">{user.name} ({user.email})</span>.
        </p>
        <div className="mt-4 rounded-[var(--radius-sm)] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Perhatian:</strong> Setelah password direset, password lama tidak akan berlaku lagi. Berikan password baru kepada pengguna yang bersangkutan.
        </div>
      </header>

      <div className="panel p-8 max-w-2xl">
        <ResetPasswordForm userId={user.id} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Full test run**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed

- [ ] **Step 3: Final commit**

```bash
git add src/app/admin/users/\[id\]/reset/page.tsx
git commit -m "feat(admin): apply Design A tokens to reset password page"
```

---

### Task 6: Smoke Test + Push

**Files:**
- None (verification only)

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: 20 files / 60 tests passed

If any tests fail, inspect the failure. Tests should only check behavior, not specific classNames — if a test asserts a specific CSS class, update the test to match the Design A token class.

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`
Expected: Only pre-existing non-blocking TS noise (test globals like `describe`/`it`/`expect`/`vi`). If new TS errors appear, fix them.

- [ ] **Step 3: Build check**

Run: `npm run build` (if build script exists)
Expected: Build succeeds

- [ ] **Step 4: Push**

```bash
git push origin main
```
}
