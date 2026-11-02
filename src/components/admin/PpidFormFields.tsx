"use client";

import { useState } from "react";
import CoverImageField from "@/components/admin/CoverImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { FieldError, FieldHint, slugifyTitle } from "@/components/admin/BeritaFormFields";
import {
  parsePpidAttachments,
  serializePpidAttachments,
  type PpidAttachment,
} from "@/lib/ppid-files";

export const PPID_CATEGORY_OPTIONS = [
  {
    value: "berkala",
    label: "INFORMASI PUBLIK YANG WAJIB DIUMUMKAN SECARA BERKALA",
  },
  {
    value: "setiap-saat",
    label: "INFORMASI PUBLIK TERSEDIA SETIAP SAAT",
  },
  {
    value: "pelayanan-informasi",
    label: "PELAYANAN INFORMASI PUBLIK",
  },
  {
    value: "sarana-prasarana",
    label: "SARANA DAN PRASARANA BADAN PUBLIK",
  },
  {
    value: "digitalisasi-medsos",
    label: "DIGITALISASI KETERBUKAAN INFORMASI PUBLIK DI MEDIA SOSIAL",
  },
  {
    value: "komitmen",
    label: "KOMITMEN BADAN PUBLIK",
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
          <strong>Kategori Informasi Publik (PPID)</strong> → pilih salah satu dari 6 kategori resmi
          PPID Badan Publik
        </li>
        <li>
          <strong>Tautan Dokumen / File Lampiran (Bisa Lebih dari 1 File)</strong> → tempel link
          satuan file Google Drive (<code>https://drive.google.com/file/d/.../view</code>) atau PDF
          resmi. Setiap file akan langsung ditampilkan (preview embed) di dalam halaman website tanpa
          harus membuka folder Google Drive
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

  const [attachments, setAttachments] = useState<PpidAttachment[]>(() => {
    const parsed = parsePpidAttachments(values.file_url);
    return parsed.length > 0 ? parsed : [{ label: "", url: "" }];
  });

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

  const updateAttachment = (index: number, patch: Partial<PpidAttachment>) => {
    setAttachments((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)),
    );
  };

  const addAttachmentRow = () => {
    setAttachments((prev) => [...prev, { label: "", url: "" }]);
  };

  const removeAttachmentRow = (index: number) => {
    setAttachments((prev) => {
      if (prev.length <= 1) {
        return [{ label: "", url: "" }];
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const serializedFileUrl = serializePpidAttachments(attachments);

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
              {opt.label}
            </option>
          ))}
        </select>
        <FieldHint id="category">
          Klasifikasi resmi Kategori Informasi Publik (PPID) Badan Publik.
        </FieldHint>
        <FieldError id="category" message={fields.category} />
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label className="block text-sm font-medium text-[var(--ink)]">
            Tautan Dokumen / File Lampiran (Opsional — Bisa Lebih dari 1 File)
          </label>
          <button
            type="button"
            onClick={addAttachmentRow}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--teal-soft)] px-3 py-1.5 text-xs font-bold text-[var(--teal)] transition hover:bg-[var(--teal)] hover:text-white"
          >
            + Tambah Tautan Dokumen
          </button>
        </div>

        <input type="hidden" name="file_url" value={serializedFileUrl} />

        <div className="space-y-3" aria-describedby={describedBy("file_url") || "file_url-hint"}>
          {attachments.map((att, index) => (
            <div
              key={index}
              className="rounded-[var(--radius-sm)] border border-slate-200 bg-slate-50/70 p-3.5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  Dokumen #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachmentRow(index)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  {attachments.length > 1 ? "Hapus dokumen ini" : "Kosongkan"}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr]">
                <div>
                  <label
                    htmlFor={`file-label-${index}`}
                    className="mb-1 block text-xs font-medium text-slate-600"
                  >
                    Nama / Judul Dokumen (Opsional)
                  </label>
                  <input
                    id={`file-label-${index}`}
                    type="text"
                    value={att.label}
                    onChange={(e) => updateAttachment(index, { label: e.target.value })}
                    className="input-field text-sm"
                    placeholder={`Contoh: SK PPID / Dokumen ${index + 1}`}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`file-url-${index}`}
                    className="mb-1 block text-xs font-medium text-slate-600"
                  >
                    URL File Google Drive / PDF
                  </label>
                  <input
                    id={`file-url-${index}`}
                    type="url"
                    value={att.url}
                    onChange={(e) => updateAttachment(index, { url: e.target.value })}
                    className="input-field text-sm"
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <FieldHint id="file_url">
          Tempel tautan langsung ke masing-masing file di Google Drive (klik kanan file → Bagikan →
          Salin link, pastikan akses &ldquo;Siapa saja yang memiliki link&rdquo;). Semua file yang
          ditambahkan akan langsung tampil (preview di dalam halaman website) secara berurutan.
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
