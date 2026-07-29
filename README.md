# Puskesmas Prapatan Web

Website publik dan CMS Puskesmas Prapatan, dibangun dengan Next.js.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Verifikasi

```bash
npm test
npm run build
npm run lint
```

Aplikasi memerlukan `POSTGRES_URL` untuk data layanan, jadwal, berita, pengguna, dan pengaturan. Tanpa variabel itu, halaman publik memakai kondisi kosong/fallback dan build dapat mencetak peringatan koneksi database.

## Kebijakan CMS dan keamanan konten

Konten HTML layanan dan berita diproses melalui `sanitizeArticleHtml` sebelum dirender. Jangan menambahkan `dangerouslySetInnerHTML` baru untuk konten CMS tanpa sanitasi ini.

- Peran CMS hanya `admin` dan `superadmin`. Manajemen akun pengguna hanya untuk `superadmin`.
- Gambar CMS harus memakai URL HTTPS publik; aplikasi tidak menerima unggahan atau data gambar inline.
- Setiap mutasi CMS baru wajib memvalidasi data dan mengotorisasi peran di server, termasuk API route dan server action. Validasi klien hanya bantuan UX.
- Form pengaduan publik tidak menyimpan keluhan atau data pengirim. Gunakan kanal resmi puskesmas untuk pengaduan yang perlu ditindaklanjuti.

## Deployment

Sediakan `POSTGRES_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, dan `NEXT_PUBLIC_SITE_URL` pada lingkungan deployment. Gunakan domain HTTPS produksi pada dua variabel URL.
