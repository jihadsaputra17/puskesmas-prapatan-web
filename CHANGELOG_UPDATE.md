# Dokumentasi Pembaruan Website UPTD Puskesmas Prapatan

**Tanggal Pembaruan Terakhir**: 3 November 2026  
**Domain Produksi**: https://pkmprapatanbpn.web.id/  
**Repository**: `https://github.com/jihadsaputra17/puskesmas-prapatan-web.git` (`main`)

---

## 1. Segmen & CMS PPID (Pejabat Pengelola Informasi dan Dokumentasi)
- **Halaman Publik PPID (`/ppid` & `/ppid/[slug]`)**:
  - Menampilkan profil, tugas & fungsi PPID sesuai UU No. 14 Tahun 2008, alur permohonan informasi publik, pencarian dokumen, dan halaman baca detail dokumen PPID.
- **6 Kategori Resmi Informasi Publik (PPID)**:
  1. `INFORMASI PUBLIK YANG WAJIB DIUMUMKAN SECARA BERKALA` (`berkala`)
  2. `INFORMASI PUBLIK TERSEDIA SETIAP SAAT` (`setiap-saat`)
  3. `PELAYANAN INFORMASI PUBLIK` (`pelayanan-informasi`)
  4. `SARANA DAN PRASARANA BADAN PUBLIK` (`sarana-prasarana`)
  5. `DIGITALISASI KETERBUKAAN INFORMASI PUBLIK DI MEDIA SOSIAL` (`digitalisasi-medsos`)
  6. `KOMITMEN BADAN PUBLIK` (`komitmen`)
- **Manajemen Admin PPID (`/admin/ppid`)**:
  - Tambah, edit, dan hapus dokumen/informasi PPID.
  - **Slug Otomatis**: Tautan (`/ppid/...`) terisi otomatis saat pengguna mengetik judul informasi.
  - **Hover Submenu di Header**: Menu `PPID` di navigasi utama otomatis menampilkan daftar dokumen PPID terbaru saat kursor diarahkan (*hover*) tanpa ikon panah tambahan.
  - **Multi-Tautan Dokumen & Klik untuk Lihat Dokumen**:
    - Mendukung penambahan lebih dari 1 link file Google Drive / PDF (`+ Tambah Tautan Dokumen`) lengkap dengan nama dokumen masing-masing.
    - Pada halaman `/ppid/[slug]`, dokumen ditampilkan sebagai daftar kartu ringkas dan akan memuat *preview* langsung di dalam halaman website (`<iframe>`) saat pengunjung mengklik tombol **👁️ Lihat Dokumen**, sehingga halaman tetap ringan walau memiliki >10 dokumen.

---

## 2. Segmen & CMS Standar Pelayanan (`/standar-pelayanan` & `/admin/standar-pelayanan`)
- **Menu Navigasi & Hover Submenu Otomatis**:
  - Ditambahkan tepat di sebelah menu **PPID** pada Header (`src/components/layout/SiteHeader.tsx`) dan Footer (`src/components/layout/SiteFooter.tsx`).
  - Saat kursor diarahkan (*hover*) ke menu **Standar Pelayanan**, daftar dokumen Standar Pelayanan yang sudah dipublikasikan di Admin Panel otomatis tampil sebagai submenu dropdown (tanpa ikon panah, identik dengan menu PPID).
- **Halaman Publik Standar Pelayanan (`/standar-pelayanan` & `/standar-pelayanan/[slug]`)**:
  - Menampilkan penjelasan Standar Pelayanan sesuai UU No. 25 Tahun 2009 & PermenPAN-RB No. 15 Tahun 2014, filter kategori & pencarian dokumen (`src/components/standar-pelayanan/StandarPelayananExplorer.tsx`), serta halaman detail dokumen.
- **6 Kategori Standar Pelayanan**:
  1. `Standar Pelayanan Puskesmas` (`standar-pelayanan`)
  2. `Maklumat Pelayanan & Janji Layanan` (`maklumat-pelayanan`)
  3. `SOP & Alur Pelayanan` (`sop-alur`)
  4. `Tarif / Biaya Pelayanan Kesehatan` (`tarif-biaya`)
  5. `Survei Kepuasan Masyarakat (SKM / IKM)` (`survei-kepuasan`)
  6. `Kompensasi & Penanganan Pengaduan Layanan` (`kompensasi-pengaduan`)
- **Manajemen Admin Standar Pelayanan (`/admin/standar-pelayanan`)**:
  - Tersedia di sidebar Panel Admin (`Standar Pelayanan`) dan kartu ringkasan Dashboard Utama.
  - Mendukung fitur lengkap seperti PPID: auto-slug dari judul, pilihan 6 kategori Standar Pelayanan, multi-tautan dokumen (`+ Tambah Tautan Dokumen`) dengan fitur klik-untuk-pratinjau di website, gambar sampul opsional dengan fallback `DefaultCoverBanner`, editor teks lengkap, serta tombol bagikan ke sosial media.
  - Tabel database: `standar_pelayanan_items` (`db/migrations/006_standar_pelayanan_items.sql`).

---

## 3. Sampul Default Otomatis (`DefaultCoverBanner`) & Tombol Bagikan Sosial Media
- **Sampul Default Otomatis (`src/components/ui/DefaultCoverBanner.tsx`)**:
  - Apabila **Gambar sampul (Opsional)** pada PPID, Standar Pelayanan, atau Berita dikosongkan, sistem otomatis menampilkan sampul resmi UPTD Puskesmas Prapatan (gradasi *navy–teal*, foto gedung Puskesmas, logo resmi, kategori, dan judul artikel/dokumen).
  - Pratinjau sampul otomatis juga tampil langsung di formulir Admin (`src/components/admin/CoverImageField.tsx`).
- **Fitur Bagikan Artikel (`src/components/berita/ArticleShare.tsx`)**:
  - Dilengkapi tombol bagikan ke **WhatsApp**, **Facebook**, **Instagram**, **TikTok**, **Threads**, serta tombol **Salin Tautan**.

---

## 4. Fitur Polling Pengunjung di Beranda
- **Pertanyaan**: *Apakah Website Ini Bermanfaat ?*
- **Pilihan**:
  1. `Sangat Bermanfaat`
  2. `Cukup Bermanfaat`
  3. `Bermanfaat`
  4. `Kurang Bermanfaat`
- **Penyimpanan**: Tersimpan secara *real-time* di tabel PostgreSQL `website_poll` (`db/migrations/004_website_poll.sql`) dengan visualisasi persentase suara dan jumlah responden.

---

## 5. Pembaruan Jadwal Dokter & Tenaga Medis (`/jadwal-dokter` & `/admin/jadwal`)
- Memperbarui database `jadwal_dokter` (`db/migrations/005_jadwal_medis.sql`) dengan 9 Tenaga Medis resmi beserta kolom **Jenis Tenaga Medis** dan **Jam Kerja**:
  - **Poli Umum**:
    - `dr. Novida Fridiani` (`Dokter`)
    - `dr. Tien Fatimatuzzahra, M.K.M` (`Dokter`)
    - `dr. Yose Yandriani` (`Dokter`)
  - **Poli Gigi**:
    - `drg. Diana Riasari Setianingsih` (`Dokter Gigi`)
  - **Poli KIA**:
    - `Bulan Siahaan, A.Md.Keb` (`Bidan`)
    - `Suci Astrilia, A.Md.Keb` (`Bidan`)
    - `Yuliana, A.Md Keb` (`Bidan`)
    - `Wulan Murti Eka Sari, A.Md.Keb` (`Bidan`)
  - **Poli KB**:
    - `Yunita Andriani, A.Md.Keb` (`Bidan`)
  - **Jam Kerja Pelayanan**:
    - Senin – Kamis: `08:00 - 15:00`
    - Jumat: `08:00 - 11:30`
    - Sabtu: `08:00 - 13:30`
    - Minggu & Libur Nasional: `-` (Tutup)
- Dilengkapi tampilan **Jadwal Per Hari** (dengan status *live* WITA `Sedang praktik` / `Tutup`) dan **Tabel Ringkasan Jam Kerja** di `/jadwal-dokter`.

---

## 6. Pembaruan Data Kontak Resmi ("Hubungi Kami")
- **Alamat Resmi**: `Jl. Prapatan No. 31 (Jl. Prapatan Dalam), RT. 029, Kelurahan Prapatan, Kecamatan Balikpapan Kota, Kota Balikpapan, Kalimantan Timur 76111`
- **Telepon**: `(0542) 426008`
- **Email**: `puskesmasprapatan123@gmail.com`
- Disinkronkan pada Footer seluruh halaman, halaman Profil (`/profil`), dan tabel `website_settings` di database.
