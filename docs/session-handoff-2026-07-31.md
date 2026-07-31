# Session Handoff — 2026-07-31

**Head commit:** `0dceee3`
**Branch:** `main`
**Live:** https://puskesmas-prapatan-web.vercel.app
**Custom domain (in progress):** `pkmprapatanbpn.web.id`

---

## Last Update

Custom domain `pkmprapatanbpn.web.id` (bought at idwebhost) being pointed to Vercel — NS delegation switch pending, see `docs/checkpoint-domain-pkmprapatanbpn-2026-07-31.md`. Earlier: Pengaduan form connected to email via SMTP → `puskesmasprapatan123@gmail.com`. Works ✅

## Custom domain progress (evening)

- `vercel domains add pkmprapatanbpn.web.id puskesmas-prapatan-web` ✅
- idwebhost DNS records added (A 216.198.79.1 + 64.29.17.1, www CNAME cname.vercel-dns.com) but zone REFUSED on their NS (lame delegation)
- Nameservers switched at idwebhost → `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (saved, propagation pending, ~24h worst case)
- Polled 18:18–18:23: registry still shows idwebhost NS
- **Next:** once NS = vercel-dns.com → `vercel dns add` A/CNAME → swap NEXTAUTH_URL + NEXT_PUBLIC_SITE_URL to `https://pkmprapatanbpn.web.id` → `vercel --prod` → SSL auto-cert

## Progress This Session

### 1. Quill + Cover Image Upload (`8e49fd6`)
- `RichTextEditor.tsx` — react-quill-new with inline image insertion (compressed WebP)
- `CoverImageField.tsx` — drag/drop cover upload → data URL
- `SmartImage.tsx` — renders data:/remote images
- `BeritaFormFields.tsx` wired with both

### 2. nbsp Justify Fix (`e4b6168`)
- Root cause: `&nbsp;` from Quill blocks CSS justify word wrap
- `normalizeArticleWhitespace()` strips on save (schema) + render (sanitize)
- CSS `overflow-wrap: break-word` + `hyphens: auto`

### 3. Jadwal Dokter Redesign (`a7ce20b`)
- Card layout grouped by day, today first
- Search by name, filter poli/hari
- Live status (Sedang praktik / Tutup)
- No override (deferred)

### 4. Pengaduan Email (`ff9e087` + `b4d7fad`)
- Nodemailer + Gmail SMTP
- Vercel env set: `SMTP_HOST/PORT/USER/PASS`, `PENGADUAN_TO`
- Works live ✅

## Key Files

| Path | Purpose |
|---|---|
| `src/lib/email.ts` | Nodemailer transporter + `kirimPengaduan()` |
| `src/app/api/pengaduan/route.ts` | POST endpoint for complaints |
| `src/app/pengaduan/PengaduanForm.tsx` | Form with 3-state (sending/error/success) |
| `src/components/admin/RichTextEditor.tsx` | Quill wrapper for berita |
| `src/components/admin/CoverImageField.tsx` | Cover image upload (drag/drop) |
| `src/components/ui/SmartImage.tsx` | Hybrid data:/remote Image component |
| `src/lib/image-compress.ts` | Browser WebP compression |
| `src/lib/sanitize-html.ts` | `normalizeArticleWhitespace()` + strip Ql-align |
| `src/components/jadwal/ScheduleExplorer.tsx` | New card layout for jadwal |
| `src/app/globals.css` | Added schedule, article, quill styles |

## Checkpoints
- `docs/checkpoint-quill-nbsp-justify-2026-07-31.md`
- `docs/checkpoint-jadwal-dokter-2026-07-31.md`
- `docs/checkpoint-pengaduan-email-2026-07-31.md`

## Pending / Future Ideas
- Author fields (name, role) for berita
- Override (cuti/dinas) for jadwal dokter — DB migration needed
- Vercel Blob for images instead of data URLs
- Image gallery / table of contents in articles
- Admin panel for viewing complaints in DB
