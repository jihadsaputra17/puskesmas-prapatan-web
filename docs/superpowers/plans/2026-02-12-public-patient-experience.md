# Public Patient Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver accessible, trust-first public Puskesmas website without changing existing database records or inventing clinic facts.

**Architecture:** Server components continue to obtain services, news, schedules, and site settings from existing data helpers. Shared presentation components and CSS tokens form one public design system; client components are restricted to interactive navigation and schedule/service filters. Existing URLs and Postgres data contracts remain intact.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 3, next/font, Vercel Postgres, Vitest + React Testing Library.

## Global Constraints

- Preserve database records and existing public URLs.
- Existing uncommitted files are user work: inspect before editing and never reset/overwrite unrelated changes.
- Site-level facts come only from `website_settings`; do not invent hours, contacts, emergency numbers, services, or metrics.
- Deep navy, restrained clinical teal, white/slate surfaces; WCAG AA contrast.
- 16px minimum body type, 44px minimum interactive targets, visible keyboard focus, semantic landmarks, skip link.
- Motion is minimal and must honor `prefers-reduced-motion`.
- Never render stored rich HTML without sanitization.
- Complete each task with specified tests, `npm run lint`, and a focused commit.

---

## File Structure

- `src/app/globals.css` — public design tokens, base element/accessibility styles, reusable component classes.
- `src/components/layout/SiteHeader.tsx` — accessible responsive public navigation.
- `src/components/layout/SiteFooter.tsx` — settings-driven contact/footer content.
- `src/components/layout/ClinicHero.tsx` — settings-driven home hero and task routes.
- `src/components/layout/QuickAccess.tsx` — service, schedule, complaint shortcuts.
- `src/components/layout/SectionHeading.tsx` — shared public heading primitive.
- `src/components/layout/ServicePreview.tsx` and `NewsPreview.tsx` — safe homepage content previews.
- `src/components/jadwal/ScheduleExplorer.tsx` — poli/day filtering with responsive table/card rendering.
- `src/components/layanan/ServiceExplorer.tsx` — client-side service search/empty state.
- `src/lib/public-content.ts` — safe plain-text excerpt and display mapping helpers.
- `src/lib/sanitize-html.ts` — single safe stored-HTML rendering boundary.
- `src/app/layout.tsx`, `src/app/page.tsx`, public route pages — assemble new public system while retaining routes.
- `src/app/not-found.tsx`, route `error.tsx` files — safe public fallback states.
- `vitest.config.ts`, `src/test/setup.ts`, `src/**/*.test.ts(x)` — automated behavior tests.

## Task 1: Establish test harness and public data helpers

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/lib/public-content.ts`
- Create: `src/lib/public-content.test.ts`

**Interfaces:**
- Produces `plainText(html: string): string`, `truncateText(value: string, maxLength: number): string`, and `toServiceSearchText(name: string, description: string): string`.
- Later service/news components consume these helpers; no component strips HTML independently.

- [ ] **Step 1: Add test dependencies and scripts**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest"
```

- [ ] **Step 2: Create test setup and configuration**

Create `vitest.config.ts`:
```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

Create `src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write failing helper tests**

Create `src/lib/public-content.test.ts`:
```ts
import { plainText, toServiceSearchText, truncateText } from "./public-content";

describe("public content helpers", () => {
  it("removes markup and normalizes whitespace", () => {
    expect(plainText("<p>Poli <strong>umum</strong></p>\n<p>untuk warga</p>"))
      .toBe("Poli umum untuk warga");
  });
  it("truncates without breaking the maximum length", () => {
    expect(truncateText("abcdef", 5)).toBe("abcd…");
  });
  it("returns normalized searchable service text", () => {
    expect(toServiceSearchText("Poli Umum", "<p>Untuk warga</p>"))
      .toBe("poli umum untuk warga");
  });
});
```

- [ ] **Step 4: Verify test fails**

Run: `npm test -- src/lib/public-content.test.ts`  
Expected: FAIL because `./public-content` does not exist.

- [ ] **Step 5: Implement minimal helpers**

Create `src/lib/public-content.ts`:
```ts
export function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function toServiceSearchText(name: string, description: string): string {
  return `${name} ${plainText(description)}`.toLocaleLowerCase("id-ID");
}
```

- [ ] **Step 6: Verify and commit**

Run:
```bash
npm test -- src/lib/public-content.test.ts
npm run lint
```
Expected: PASS; lint exits 0.

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/lib/public-content.ts src/lib/public-content.test.ts
git commit -m "test: add public content test harness"
```

## Task 2: Build accessible public design system and global shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/SectionHeading.tsx`
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/SiteHeader.test.tsx`

**Interfaces:**
- `SectionHeading({ title, description, id }: { title: string; description?: string; id?: string })` returns a semantic heading group.
- `SiteHeader({ isAdmin }: { isAdmin: boolean })` exposes public routes and menu button.
- `SiteFooter({ settings }: { settings: Record<string, string> })` omits empty contacts.

- [ ] **Step 1: Write failing header accessibility test**

Create `src/components/layout/SiteHeader.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import SiteHeader from "./SiteHeader";

vi.mock("next/link", () => ({ default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a> }));

describe("SiteHeader", () => {
  it("opens and closes mobile navigation with accurate state", () => {
    render(<SiteHeader isAdmin={false} />);
    const button = screen.getByRole("button", { name: "Buka menu navigasi" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Navigasi utama" })).toBeVisible();
  });
});
```

- [ ] **Step 2: Verify test fails**

Run: `npm test -- src/components/layout/SiteHeader.test.tsx`  
Expected: FAIL because `SiteHeader` does not exist.

- [ ] **Step 3: Implement global tokens, shell, and components**

Add CSS variables/classes in `globals.css` for navy `#12304a`, teal `#007f7b`, slate/white surfaces, `:focus-visible` 3px teal outline, `.skip-link`, `.page-shell`, `.content-container`, `.button-primary`, `.button-secondary`, and `@media (prefers-reduced-motion: reduce)` disabling transitions/animations.

Implement `SiteHeader` as client component: six existing public links, `aria-current="page"` for active pathname, desktop navigation at `lg`, 44px menu button below `lg`, menu closes after navigation, no hand-written SVG (use text menu/close labels until icon dependency is deliberately added). Keep Admin link conditional.

Implement `SiteFooter` from settings keys `site_name`, `address`, `phone`, `email`, `instagram`, `facebook`; render links only for non-empty values and use `tel:`/`mailto:` where applicable.

Change `RootLayout` to use `SiteHeader`, `SiteFooter`, `<a className="skip-link" href="#main-content">Lewati ke isi utama</a>`, and `<main id="main-content">`. Keep `getServerSession`, `getSettings`, and Indonesian language. Retain old `Header`/`Footer` only as re-export shims to avoid breaking current imports.

- [ ] **Step 4: Verify and commit**

Run:
```bash
npm test -- src/components/layout/SiteHeader.test.tsx
npm run lint
npm run build
```
Expected: PASS; production build completes.

```bash
git add src/app/globals.css src/app/layout.tsx src/components/layout
git commit -m "feat: add accessible public site shell"
```

## Task 3: Rebuild home page around patient tasks and factual settings

**Files:**
- Create: `src/components/layout/ClinicHero.tsx`
- Create: `src/components/layout/QuickAccess.tsx`
- Create: `src/components/layout/ServicePreview.tsx`
- Create: `src/components/layout/NewsPreview.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/layout/HeroSection.tsx`
- Modify: `src/components/layout/LayananSection.tsx`
- Modify: `src/components/layout/BeritaSection.tsx`
- Create: `src/components/layout/ClinicHero.test.tsx`

**Interfaces:**
- `ClinicHero({ settings }: { settings: Record<string, string> })` renders configured identity/copy and links to `/layanan` and `/jadwal-dokter`.
- `QuickAccess` links to `/layanan`, `/jadwal-dokter`, `/pengaduan`.
- Previews accept existing DB row shapes and render plain-text excerpts via Task 1 helpers.

- [ ] **Step 1: Write failing hero data-boundary test**

Create `src/components/layout/ClinicHero.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import ClinicHero from "./ClinicHero";

vi.mock("next/link", () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));

describe("ClinicHero", () => {
  it("uses configured identity and does not claim unknown opening hours", () => {
    render(<ClinicHero settings={{ site_name: "Puskesmas Prapatan", hero_title: "Melayani warga" }} />);
    expect(screen.getByRole("heading", { name: /puskesmas prapatan/i })).toBeVisible();
    expect(screen.queryByText(/buka|tutup/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify test fails**

Run: `npm test -- src/components/layout/ClinicHero.test.tsx`  
Expected: FAIL because `ClinicHero` does not exist.

- [ ] **Step 3: Implement home composition**

`ClinicHero` uses `settings.site_name`, `hero_title`, and `hero_subtitle` with existing fallback strings; display address/phone only if set. Do not include an emergency claim or operating status. Primary CTA label: `Lihat layanan`; secondary: `Jadwal dokter`.

`QuickAccess` uses three clear task cards/links: `Layanan kesehatan`, `Jadwal dokter`, `Sampaikan pengaduan`.

Update service/news sections to use `SectionHeading`, semantic lists, server data, safe `plainText` excerpt, factual empty states, and links to existing detail routes. Replace `dangerouslySetInnerHTML` on service preview with text only. Rewrite `app/page.tsx` to request settings once and render hero, quick access, previews, and FAQ in this order.

Keep legacy component filenames as wrappers if current imports require them.

- [ ] **Step 4: Verify and commit**

Run:
```bash
npm test -- src/components/layout/ClinicHero.test.tsx src/lib/public-content.test.ts
npm run lint
npm run build
```
Expected: PASS; home works if service/news tables are empty or unavailable.

```bash
git add src/app/page.tsx src/components/layout
git commit -m "feat: rebuild patient-focused home page"
```

## Task 4: Create responsive schedule explorer

**Files:**
- Create: `src/components/jadwal/ScheduleExplorer.tsx`
- Create: `src/components/jadwal/ScheduleExplorer.test.tsx`
- Modify: `src/components/jadwal/ScheduleTable.tsx`
- Modify: `src/app/jadwal-dokter/page.tsx`

**Interfaces:**
- `ScheduleExplorer({ scheduleData, initialPoli }: { scheduleData: JadwalDokter[]; initialPoli?: string })` filters existing `JadwalDokter` rows by `poli` and `day`.
- `ScheduleTable` becomes compatibility wrapper or is removed only after imports update.

- [ ] **Step 1: Write failing schedule filter test**

Create `src/components/jadwal/ScheduleExplorer.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import ScheduleExplorer from "./ScheduleExplorer";

const rows = [
  { id: "1", doctor: "Dr. A", poli: "Umum", day: "Senin", hours: "08.00 - 12.00" },
  { id: "2", doctor: "Dr. B", poli: "Gigi", day: "Selasa", hours: "08.00 - 12.00" },
];

describe("ScheduleExplorer", () => {
  it("filters rows by selected poli", () => {
    render(<ScheduleExplorer scheduleData={rows} />);
    fireEvent.change(screen.getByLabelText("Filter poli"), { target: { value: "Gigi" } });
    expect(screen.getByText("Dr. B")).toBeVisible();
    expect(screen.queryByText("Dr. A")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Verify test fails**

Run: `npm test -- src/components/jadwal/ScheduleExplorer.test.tsx`  
Expected: FAIL because `ScheduleExplorer` does not exist.

- [ ] **Step 3: Implement schedule explorer**

Provide labelled `<select>` controls `Filter poli` and `Filter hari`, each defaulting to `Semua`. Derive unique options from records. Render desktop semantic table from `md` upward and equivalent labelled cards below `md`; both must use filtered rows. Render `Tidak ada jadwal yang sesuai filter.` when no records match. Page copy must say `Jadwal dapat berubah. Hubungi puskesmas untuk konfirmasi sebelum berkunjung.` without an invented update timestamp.

- [ ] **Step 4: Verify and commit**

Run:
```bash
npm test -- src/components/jadwal/ScheduleExplorer.test.tsx
npm run lint
npm run build
```
Expected: PASS.

```bash
git add src/components/jadwal src/app/jadwal-dokter/page.tsx
git commit -m "feat: improve doctor schedule discovery"
```

## Task 5: Make services and news safe, readable, and searchable

**Files:**
- Create: `src/components/layanan/ServiceExplorer.tsx`
- Create: `src/components/layanan/ServiceExplorer.test.tsx`
- Create: `src/lib/sanitize-html.ts`
- Create: `src/lib/sanitize-html.test.ts`
- Modify: `src/app/layanan/page.tsx`
- Modify: `src/app/layanan/[id]/page.tsx`
- Modify: `src/app/berita/page.tsx`
- Modify: `src/app/berita/[slug]/page.tsx`
- Modify: `src/components/berita/ArticleContent.tsx`

**Interfaces:**
- `ServiceExplorer({ services }: { services: Array<{ id: string; nama_poli: string; deskripsi: string; icon?: string }> })` provides keyword filtering.
- `sanitizeArticleHtml(html: string): string` permits only article-safe markup and safe URL protocols.
- Article content renderer consumes sanitized string only.

- [ ] **Step 1: Install sanitization dependency and write failing tests**

Run:
```bash
npm install isomorphic-dompurify
```

Create `src/lib/sanitize-html.test.ts`:
```ts
import { sanitizeArticleHtml } from "./sanitize-html";

describe("sanitizeArticleHtml", () => {
  it("removes script and event handler attributes", () => {
    const result = sanitizeArticleHtml('<p onclick="alert(1)">Aman</p><script>alert(1)</script>');
    expect(result).toBe("<p>Aman</p>");
  });
  it("removes unsafe links", () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">tautan</a>')).toBe("<a>tautan</a>");
  });
});
```

Create `src/components/layanan/ServiceExplorer.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import ServiceExplorer from "./ServiceExplorer";

vi.mock("next/link", () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));

describe("ServiceExplorer", () => {
  it("finds service by name and reports no matches", () => {
    render(<ServiceExplorer services={[{ id: "1", nama_poli: "Poli Gigi", deskripsi: "Perawatan gigi" }]} />);
    fireEvent.change(screen.getByLabelText("Cari layanan"), { target: { value: "gigi" } });
    expect(screen.getByText("Poli Gigi")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Cari layanan"), { target: { value: "mata" } });
    expect(screen.getByText("Layanan tidak ditemukan.")).toBeVisible();
  });
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- src/lib/sanitize-html.test.ts src/components/layanan/ServiceExplorer.test.tsx`  
Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement safe listing/detail behavior**

Implement `sanitizeArticleHtml` with `isomorphic-dompurify` allowing `p`, `br`, headings, lists, emphasis, `blockquote`, `img`, `a`, `div`, `span`; forbid scripts, styles, event attributes, forms, iframes, and non-HTTP(S) image/link URLs. Add `rel="noopener noreferrer"` to external target-blank links in renderer.

Implement `ServiceExplorer` with a labelled search input, debounced-free immediate filter, text-only service excerpts via `plainText`, existing `/layanan/${id}` links, and empty state. Convert services page to server-load records and pass them to explorer. Detail page must use sanitized rich description or omit empty description.

Update news index/detail presentation to use semantic `<article>`, `<time dateTime>`, meaningful image alt based on title, and sanitizer-backed `ArticleContent`. Preserve current slug URLs and show non-sensitive factual not-found behavior when record absent.

- [ ] **Step 4: Verify and commit**

Run:
```bash
npm test -- src/lib/sanitize-html.test.ts src/components/layanan/ServiceExplorer.test.tsx
npm run lint
npm run build
```
Expected: PASS.

```bash
git add package.json package-lock.json src/components/layanan src/components/berita src/lib/sanitize-html.ts src/lib/sanitize-html.test.ts src/app/layanan src/app/berita
git commit -m "feat: improve public services and news"
```

## Task 6: Finish supporting public pages, metadata, and recovery states

**Files:**
- Modify: `src/app/profil/page.tsx`
- Modify: `src/app/pengaduan/page.tsx`
- Modify: `src/app/pengaduan/PengaduanForm.tsx`
- Modify: `src/app/kebijakan-privasi/page.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`
- Create: `src/app/layanan/error.tsx`
- Create: `src/app/berita/error.tsx`
- Create: `src/app/jadwal-dokter/error.tsx`
- Create: `src/app/pengaduan/PengaduanForm.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Complaint form shows labels, required errors, pending state, and success/error message without exposing internal failures.
- Error boundaries provide reset action and contact path.

- [ ] **Step 1: Write failing complaint form test**

Create `src/app/pengaduan/PengaduanForm.test.tsx`:
```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import PengaduanForm from "./PengaduanForm";

describe("PengaduanForm", () => {
  it("exposes labelled required fields", () => {
    render(<PengaduanForm />);
    expect(screen.getByLabelText(/nama/i)).toBeRequired();
    expect(screen.getByLabelText(/isi pengaduan/i)).toBeRequired();
    fireEvent.click(screen.getByRole("button", { name: /kirim pengaduan/i }));
  });
});
```

- [ ] **Step 2: Verify test fails or exposes current accessibility gap**

Run: `npm test -- src/app/pengaduan/PengaduanForm.test.tsx`  
Expected: FAIL until labels/required controls satisfy the test.

- [ ] **Step 3: Implement supporting routes and recovery**

Use `SectionHeading` across profile, complaint, and privacy pages. Profile has only verified static/site-setting content already present. Complaint form has visible labels, `aria-describedby` linked field errors, disabled pending submit button, `aria-live="polite"` submission message, and never displays raw server/database errors. Privacy wording only describes data collected by existing complaint/login/content behavior; omit claims not implemented.

Create public `not-found` page with `Halaman tidak ditemukan`, link home, and contact path. Create route error client components with `error` and `reset` props; display generic `Kami tidak dapat memuat halaman ini.` and retry button. Do not render `error.message`.

Ensure robots/sitemap list only existing public routes and derive host from `NEXTAUTH_URL` only when valid, otherwise omit dynamic host-dependent entries. Update README with Node requirement, install/dev/test/lint/build commands, environment variable names only, and deployment verification checklist.

- [ ] **Step 4: Verify full Phase 1 and commit**

Run:
```bash
npm test
npm run lint
npm run build
git diff --check
```
Expected: all commands exit 0; no whitespace errors.

Manually verify at `http://localhost:3000` in 375px and 1440px viewports: skip link, keyboard navigation, header menu, home task links, service search, schedule filters, article display, complaint validation, and error pages.

```bash
git add src/app/profil src/app/pengaduan src/app/kebijakan-privasi src/app/not-found.tsx src/app/error.tsx src/app/layanan/error.tsx src/app/berita/error.tsx src/app/jadwal-dokter/error.tsx src/app/robots.ts src/app/sitemap.ts README.md
git commit -m "feat: complete accessible public patient experience"
```

## Plan Self-Review

- Spec coverage: Tasks 1–6 cover global shell, home, services, schedules, news safety, profile/complaint/privacy, metadata, errors, responsive behavior, and Phase 1 verification.
- Excluded by phase: CMS/roles/security hardening and production platform changes belong in separate Phase 2/3 plans.
- No unassigned interfaces: public helper, sanitizer, header/footer, hero, explorer, and form contracts are declared before consumers.
- No invented clinic facts: all clinic details use stored settings/data or are omitted.
