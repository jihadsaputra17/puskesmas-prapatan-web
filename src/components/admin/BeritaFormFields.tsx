"use client";

import CoverImageField from "@/components/admin/CoverImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";

/** Shared field chrome for tambah/edit berita — magazine public template. */

export const CATEGORY_OPTIONS = [
  {
    value: "standard",
    label: "Berita Kesehatan",
    hint: "Kabar umum layanan & kegiatan",
  },
  {
    value: "hero-overlay",
    label: "Sorotan",
    hint: "Prioritas / highlight di chip artikel",
  },
  {
    value: "minimalist",
    label: "Artikel",
    hint: "Edukasi / bacaan panjang",
  },
] as const;

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

export function FieldHint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={`${id}-hint`} className="mt-1 text-xs leading-5 text-slate-500">
      {children}
    </p>
  );
}

export function ContentGuide() {
  return (
    <aside className="rounded-[var(--radius-sm)] border border-teal-100 bg-clinic-soft/70 p-4 text-sm text-slate-700">
      <p className="font-semibold text-navy">Cara isi tampil di website</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
        <li>
          <strong>Ringkasan</strong> → teks pembuka (lead) + keterangan di bawah foto sampul
        </li>
        <li>
          <strong>Gambar sampul</strong> → unggah file atau tempel URL (foto besar 16:9)
        </li>
        <li>
          <strong>Kategori</strong> → chip kecil di atas judul (bukan layout berbeda)
        </li>
        <li>
          <strong>Isi berita</strong> → editor kaya (heading, daftar, kutipan, tautan, gambar)
        </li>
        <li>Paragraf di situs tampil rata kiri–kanan (justify) otomatis</li>
      </ul>
    </aside>
  );
}

type Values = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  template?: string;
};

export default function BeritaFormFields({
  values = {},
  fields,
  describedBy,
}: {
  values?: Values;
  fields: Record<string, string>;
  describedBy: (id: string) => string | undefined;
}) {
  const category = values.template || "standard";

  return (
    <div className="space-y-6">
      <ContentGuide />

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Judul berita
        </label>
        <input
          id="title"
          name="title"
          defaultValue={values.title}
          required
          aria-describedby={describedBy("title") || "title-hint"}
          className="input-field"
          placeholder="Contoh: Kegiatan Posyandu Balita di Wilayah Kerja"
        />
        <FieldHint id="title">Judul besar di halaman publik. Jelas dan informatif.</FieldHint>
        <FieldError id="title" message={fields.title} />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Tautan / slug
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">/berita/</span>
          <input
            id="slug"
            name="slug"
            defaultValue={values.slug}
            required
            aria-describedby={describedBy("slug") || "slug-hint"}
            className="input-field min-w-0 flex-1"
            placeholder="kegiatan-posyandu-balita"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          />
        </div>
        <FieldHint id="slug">
          Huruf kecil, angka, dan tanda hubung saja. Contoh: <code>imunisasi-dasar-lengkap</code>
        </FieldHint>
        <FieldError id="slug" message={fields.slug} />
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
          placeholder="1–2 kalimat ringkas yang muncul sebagai lead dan caption foto."
        />
        <FieldHint id="excerpt">
          Dipakai sebagai lead di atas isi, caption di bawah foto sampul, dan cuplikan di daftar
          berita.
        </FieldHint>
        <FieldError id="excerpt" message={fields.excerpt} />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Kategori (chip di artikel)
        </label>
        <select
          id="category"
          name="template"
          defaultValue={category}
          className="input-field"
          aria-describedby="category-hint"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.hint}
            </option>
          ))}
        </select>
        <FieldHint id="category">
          Hanya mengubah label chip di atas judul. Semua berita memakai layout majalah yang sama.
        </FieldHint>
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-[var(--ink)]" id="image_url-label">
          Gambar sampul
        </p>
        <CoverImageField
          name="image_url"
          defaultValue={values.image_url}
          error={fields.image_url}
          describedBy={describedBy("image_url") || "image_url-hint"}
        />
        <FieldHint id="image_url">
          Unggah dari perangkat atau tempel URL HTTPS. Ideal rasio 16:9. Kosong = placeholder.
        </FieldHint>
      </div>

      <div>
        <label
          id="content-label"
          htmlFor="content-editor"
          className="mb-1 block text-sm font-medium text-[var(--ink)]"
        >
          Isi berita
        </label>
        <RichTextEditor
          name="content"
          labelId="content-label"
          defaultValue={values.content || ""}
          error={fields.content}
          describedBy={describedBy("content") || "content-hint"}
          placeholder="Tulis isi berita. Gunakan toolbar untuk heading, daftar, kutipan, dan gambar."
        />
        <FieldHint id="content">
          Editor kaya teks. Konten disimpan sebagai HTML aman; skrip berbahaya dibersihkan di
          server.
        </FieldHint>
      </div>
    </div>
  );
}
