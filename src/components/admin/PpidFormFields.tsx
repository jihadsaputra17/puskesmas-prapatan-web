"use client";

import { useState } from "react";
import CoverImageField from "@/components/admin/CoverImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { FieldError, FieldHint, slugifyTitle } from "@/components/admin/BeritaFormFields";

export const PPID_CATEGORY_OPTIONS = [
  {
    value: "berkala",
    label: "Informasi Berkala",
    hint: "Wajib disediakan dan diumumkan secara berkala (profil, program kerja, laporan kinerja)",
  },
  {
    value: "serta-merta",
    label: "Informasi Serta Merta",
    hint: "Informasi darurat / peringatan dini terkait keselamatan dan kesehatan masyarakat",
  },
  {
    value: "setiap-saat",
    label: "Informasi Setiap Saat",
    hint: "Wajib tersedia setiap saat (Daftar Informasi Publik, SOP pelayanan, rencana kerja)",
  },
  {
    value: "regulasi",
    label: "Regulasi & Standar Pelayanan",
    hint: "Peraturan, SK Kepala Puskesmas, Maklumat Pelayanan, tarif retribusi resmi",
  },
] as const;

export function PpidContentGuide() {
  return (
    <aside className="rounded-[var(--radius-sm)] border border-teal-100 bg-clinic-soft/70 p-4 text-sm text-slate-700">
      <p className="font-semibold text-navy">Panduan Pengisian Informasi PPID</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
        <li>
          <strong>Judul &amp; Tautan Otomatis</strong> → tautan (slug) dibuat otomatis saat Anda
          mengetik judul informasi
        </li>
        <li>
          <strong>Kategori PPID</strong> → menentukan pengelompokan dokumen di halaman publik{" "}
          <code>/ppid</code> (Informasi Berkala, Serta Merta, Setiap Saat, atau Regulasi &amp; SOP)
        </li>
        <li>
          <strong>Tautan Dokumen / PDF (Opsional)</strong> → tempel link Google Drive, OneDrive, atau
          URL PDF resmi agar warga dapat langsung mengunduh/membuka dokumen
        </li>
        <li>
          <strong>Gambar Sampul &amp; Isi Informasi</strong> → mendukung foto sampul serta isi artikel
          lengkap (heading, tabel/daftar, gambar, tautan) seperti halaman Berita
        </li>
      </ul>
    </aside>
  );
}

type Values = {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  file_url?: string;
};

export default function PpidFormFields({
  values = {},
  fields,
  describedBy,
}: {
  values?: Values;
  fields: Record<string, string>;
  describedBy: (id: string) => string | undefined;
}) {
  const category = values.category || "berkala";
  const [title, setTitle] = useState(values.title ?? "");
  const [slug, setSlug] = useState(values.slug ?? "");
  const [manualSlug, setManualSlug] = useState(Boolean(values.slug));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (!manualSlug) {
      setSlug(slugifyTitle(nextTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSlug = e.target.value;
    setSlug(nextSlug);
    setManualSlug(nextSlug.trim().length > 0);
  };

  return (
    <div className="space-y-6">
      <PpidContentGuide />

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Judul informasi / dokumen PPID
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={handleTitleChange}
          required
          aria-describedby={describedBy("title") || "title-hint"}
          className="input-field"
          placeholder="Contoh: Maklumat Pelayanan dan Standar Pelayanan Publik Tahun 2026"
        />
        <FieldHint id="title">
          Nama dokumen atau judul informasi publik yang jelas bagi masyarakat.
        </FieldHint>
        <FieldError id="title" message={fields.title} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <label htmlFor="slug" className="block text-sm font-medium text-[var(--ink)]">
            Tautan / slug (otomatis dari judul)
          </label>
          {manualSlug && title.trim() && (
            <button
              type="button"
              onClick={() => {
                setSlug(slugifyTitle(title));
                setManualSlug(false);
              }}
              className="text-xs font-semibold text-[var(--teal)] hover:underline"
            >
              Sesuaikan dengan judul
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">/ppid/</span>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={handleSlugChange}
            required
            aria-describedby={describedBy("slug") || "slug-hint"}
            className="input-field min-w-0 flex-1 bg-slate-50/70"
            placeholder="maklumat-pelayanan-publik-2026"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          />
        </div>
        <FieldHint id="slug">
          Terisi otomatis saat Anda mengetik judul di atas (Anda juga tetap bisa mengubahnya jika
          perlu).
        </FieldHint>
        <FieldError id="slug" message={fields.slug} />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Kategori Informasi Publik (PPID)
        </label>
        <select
          id="category"
          name="category"
          defaultValue={category}
          className="input-field"
          aria-describedby="category-hint"
        >
          {PPID_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.hint}
            </option>
          ))}
        </select>
        <FieldHint id="category">
          Klasifikasi informasi publik sesuai Undang-Undang No. 14 Tahun 2008 (KIP).
        </FieldHint>
        <FieldError id="category" message={fields.category} />
      </div>

      <div>
        <label htmlFor="file_url" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Tautan Dokumen / File Lampiran (Opsional)
        </label>
        <input
          id="file_url"
          name="file_url"
          type="url"
          defaultValue={values.file_url}
          aria-describedby={describedBy("file_url") || "file_url-hint"}
          className="input-field"
          placeholder="https://drive.google.com/file/d/..."
        />
        <FieldHint id="file_url">
          Opsional. Isi dengan URL HTTPS (mis. Google Drive, PDF resmi) jika ada dokumen yang dapat
          diunduh atau dilihat langsung oleh masyarakat.
        </FieldHint>
        <FieldError id="file_url" message={fields.file_url} />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Ringkasan singkat
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={values.excerpt}
          rows={3}
          required
          aria-describedby={describedBy("excerpt") || "excerpt-hint"}
          className="input-field"
          placeholder="1–2 kalimat ringkas mengenai isi dokumen atau informasi publik ini."
        />
        <FieldHint id="excerpt">
          Ditampilkan pada kartu daftar PPID dan sebagai teks pembuka di halaman detail.
        </FieldHint>
        <FieldError id="excerpt" message={fields.excerpt} />
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-[var(--ink)]" id="image_url-label">
          Gambar sampul (Opsional)
        </p>
        <CoverImageField
          name="image_url"
          defaultValue={values.image_url}
          error={fields.image_url}
          describedBy={describedBy("image_url") || "image_url-hint"}
        />
        <FieldHint id="image_url">
          Unggah gambar sampul/infografis (mis. poster maklumat pelayanan, bagan alur) atau biarkan
          kosong.
        </FieldHint>
      </div>

      <div>
        <label
          id="content-label"
          htmlFor="content-editor"
          className="mb-1 block text-sm font-medium text-[var(--ink)]"
        >
          Isi informasi / rincian dokumen
        </label>
        <RichTextEditor
          name="content"
          labelId="content-label"
          defaultValue={values.content || ""}
          error={fields.content}
          describedBy={describedBy("content") || "content-hint"}
          placeholder="Tulis rincian informasi publik, daftar dokumen, atau penjelasan lengkap..."
        />
        <FieldHint id="content">
          Editor kaya teks. Konten disimpan sebagai HTML aman; skrip berbahaya dibersihkan di
          server.
        </FieldHint>
      </div>
    </div>
  );
}
