"use client";

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
          <strong>Gambar sampul</strong> → foto besar 16:9 di atas artikel
        </li>
        <li>
          <strong>Kategori</strong> → chip kecil di atas judul (bukan layout berbeda)
        </li>
        <li>
          Isi boleh HTML aman: <code className="rounded bg-white px-1">&lt;p&gt;</code>,{" "}
          <code className="rounded bg-white px-1">&lt;h2&gt;</code>,{" "}
          <code className="rounded bg-white px-1">&lt;ul&gt;&lt;li&gt;</code>,{" "}
          <code className="rounded bg-white px-1">&lt;img&gt;</code>,{" "}
          <code className="rounded bg-white px-1">&lt;blockquote&gt;</code>
        </li>
        <li>Paragraf kosong diganti Enter biasa / bungkus tiap paragraf dengan &lt;p&gt;…&lt;/p&gt;</li>
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
          Dipakai sebagai lead di atas isi, caption di bawah foto sampul, dan cuplikan di daftar berita.
        </FieldHint>
        <FieldError id="excerpt" message={fields.excerpt} />
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Kategori (chip di artikel)
        </label>
        {/* Keep name="template" for API/DB column compatibility */}
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
        <label htmlFor="image_url" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          URL gambar sampul (opsional)
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          inputMode="url"
          defaultValue={values.image_url}
          placeholder="https://..."
          aria-describedby={describedBy("image_url") || "image_url-hint"}
          className="input-field"
        />
        <FieldHint id="image_url">
          Pakai tautan gambar HTTPS. Ideal rasio 16:9. Kosong = placeholder teal.
        </FieldHint>
        <FieldError id="image_url" message={fields.image_url} />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-[var(--ink)]">
          Isi berita
        </label>
        <textarea
          id="content"
          name="content"
          defaultValue={values.content}
          rows={14}
          required
          aria-describedby={describedBy("content") || "content-hint"}
          className="input-field font-mono text-sm leading-6"
          placeholder={`<p>Paragraf pembuka...</p>\n\n<h2>Judul bagian</h2>\n<p>Lanjutan cerita...</p>\n\n<ul>\n  <li>Poin satu</li>\n  <li>Poin dua</li>\n</ul>\n\n<blockquote>Kutipan penting.\n<cite>— Nama sumber</cite></blockquote>`}
        />
        <FieldHint id="content">
          Teks biasa OK. Untuk heading, daftar, kutipan, dan gambar inline, gunakan HTML sederhana di atas.
          Script dan tautan berbahaya dibersihkan otomatis.
        </FieldHint>
        <FieldError id="content" message={fields.content} />
      </div>
    </div>
  );
}
