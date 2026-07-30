# Checkpoint: Pengaduan — Email via SMTP

**Commit:** `ff9e087`
**Date:** 2026-07-31
**Branch:** `main`
**Deploy:** https://puskesmas-prapatan-web.vercel.app/pengaduan

---

## Done

### Form pengaduan → email
- `PengaduanForm.tsx` — client component with **sending / error / success** states
- POST to `/api/pengaduan` (uses `FormData`, no `form.name` bug)
- Loading skeleton (`loading.tsx`)
- Clean copy on page + metadata

### API `/api/pengaduan`
- Validates required fields (name, phone, message)
- Calls `kirimPengaduan()` from `src/lib/email.ts`
- Returns 400 on validation fail, 500 on SMTP/config error

### Email engine (`src/lib/email.ts`)
- Nodemailer with Gmail SMTP
- HTML table layout (name, phone, email, message)
- Reply-to: pengirim email or no. HP
- Fallback `PENGADUAN_TO` → `puskesmasprapatan123@gmail.com`

### Vercel env vars (set via CLI)

| Key | Value |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `puskesmasprapatan123@gmail.com` |
| `SMTP_PASS` | Gmail App Password |
| `PENGADUAN_TO` | `puskesmasprapatan123@gmail.com` |

### Tests
- `PengaduanForm.test.tsx` — 3 tests: renders required fields, error on API fail, success banner on OK response
- Full suite: **68 tests pass** ✅
- Build: **0 errors** ✅

## Files changed

| File | Change |
|---|---|
| `src/lib/email.ts` | **New** — nodemailer transporter + `kirimPengaduan()` |
| `src/app/api/pengaduan/route.ts` | **New** — POST endpoint |
| `src/app/pengaduan/PengaduanForm.tsx` | Rewrite with API fetch, 3-state UI |
| `src/app/pengaduan/PengaduanForm.test.tsx` | Rewrite with fetch mock tests |
| `src/app/pengaduan/page.tsx` | Updated copy |
| `src/app/pengaduan/loading.tsx` | Rewrite skeleton |
| `package.json` / `package-lock.json` | Added `nodemailer` + `@types/nodemailer` |

## Known
- Email pertama mungkin masuk **Spam** — tandai sebagai "Bukan Spam" di Gmail
- App Password tersimpan aman di Vercel env (sensitive), tidak di repo
