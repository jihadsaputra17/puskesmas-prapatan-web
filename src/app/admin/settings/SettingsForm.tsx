"use client";

import { useState } from "react";
import Link from "next/link";
import AdminFeedback from "@/components/admin/AdminFeedback";
import CoverImageField from "@/components/admin/CoverImageField";
import { formatFieldErrors, settingsSchema } from "@/lib/admin-schemas";

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [fields, setFields] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      setFields(formatFieldErrors(parsed.error));
      setFeedback({ type: "error", message: "Periksa isian formulir." });
      return;
    }
    setFields({});
    setPending(true);
    try {
      const r = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await r.json().catch(() => ({}));
      setFeedback({
        type: r.ok ? "success" : "error",
        message: result.message || (r.ok ? "Pengaturan tersimpan." : "Gagal menyimpan pengaturan."),
      });
      if (!r.ok) setFields(result.fields || {});
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan saat menyimpan pengaturan.",
      });
    } finally {
      setPending(false);
    }
  }

  const input = (name: string, label: string, type = "text", placeholder?: string) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={settings[name]}
        aria-describedby={fields[name] ? `${name}-error` : undefined}
        className="input-field"
      />
      {fields[name] && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
          {fields[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-8">
      <AdminFeedback result={feedback} />

      <section className="panel space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[var(--navy)]">Beranda &amp; Slideshow Utama</h2>
            <p className="text-xs text-slate-500">
              Atur teks sambutan utama serta foto-foto yang tampil pada banner slideshow halaman
              Beranda.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-[var(--teal)] hover:underline"
          >
            Lihat Beranda ↗
          </Link>
        </div>

        {input("hero_title", "Judul utama")}

        <div>
          <label
            htmlFor="hero_subtitle"
            className="mb-1 block text-sm font-medium text-[var(--ink)]"
          >
            Sub-judul
          </label>
          <textarea
            id="hero_subtitle"
            name="hero_subtitle"
            defaultValue={settings.hero_subtitle}
            aria-describedby={fields.hero_subtitle ? "hero_subtitle-error" : undefined}
            className="input-field"
          />
          {fields.hero_subtitle && (
            <p id="hero_subtitle-error" className="mt-1 text-sm text-red-700">
              {fields.hero_subtitle}
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-1 block text-sm font-medium text-[var(--ink)]" id="hero_images-label">
            Foto Slideshow Beranda (Opsional)
          </p>
          <CoverImageField
            name="hero_images"
            defaultValue={settings.hero_images || ""}
            error={fields.hero_images}
            describedBy="hero_images-hint"
            previewTitle={settings.hero_title || "Slideshow Utama Beranda Puskesmas Prapatan"}
            multiple
          />
          <p id="hero_images-hint" className="mt-1 text-xs leading-5 text-slate-500">
            Unggah beberapa foto sekaligus atau tambahkan URL gambar untuk mengganti foto slideshow
            di Beranda. Jika dikosongkan, sistem otomatis menampilkan 7 foto standar gedung &amp;
            pelayanan Puskesmas Prapatan.
          </p>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--navy)]">Informasi Fasyankes &amp; Kontak</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {input("site_name", "Nama Fasyankes")}
          {input("phone", "Nomor telepon")}
          {input("email", "Alamat email", "email")}
          {input("address", "Alamat")}
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[var(--navy)]">
              Kanal Media Sosial Resmi Puskesmas
            </h2>
            <p className="text-xs text-slate-500">
              Tautan ini akan otomatis tampil pada halaman{" "}
              <Link
                href="/media-sosial"
                target="_blank"
                className="font-semibold text-[var(--teal)] hover:underline"
              >
                /media-sosial ↗
              </Link>{" "}
              dan Footer situs.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {input(
            "instagram",
            "Link Instagram",
            "url",
            "https://www.instagram.com/puskesmas.prapatan/",
          )}
          {input(
            "facebook",
            "Link Facebook",
            "url",
            "https://web.facebook.com/profile.php?id=61564150502560",
          )}
          {input(
            "youtube",
            "Link YouTube",
            "url",
            "https://www.youtube.com/@puskesmasprapatanbalikpapa1711",
          )}
          {input(
            "tiktok",
            "Link TikTok (Opsional)",
            "url",
            "https://www.tiktok.com/@puskesmas.prapatan",
          )}
          {input(
            "threads",
            "Link Threads (Opsional)",
            "url",
            "https://www.threads.net/@puskesmas.prapatan",
          )}
          {input(
            "whatsapp",
            "Nomor WhatsApp / Layanan Informasi (Opsional)",
            "text",
            "Contoh: 6281234567890",
          )}
        </div>
      </section>

      <button disabled={pending} className="button-primary">
        {pending ? "Menyimpan..." : "Simpan Semua Pengaturan"}
      </button>
    </form>
  );
}
