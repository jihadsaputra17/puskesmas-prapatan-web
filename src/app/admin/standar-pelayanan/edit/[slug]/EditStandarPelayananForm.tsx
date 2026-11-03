"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminFeedback from "@/components/admin/AdminFeedback";
import StandarPelayananFormFields from "@/components/admin/StandarPelayananFormFields";
import { formatFieldErrors, standarPelayananSchema } from "@/lib/admin-schemas";
import type { StandarPelayananItem } from "@/lib/standar-pelayanan-actions";

export default function EditStandarPelayananForm({ item }: { item: StandarPelayananItem }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [fields, setFields] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);
    const form = new FormData(e.currentTarget);
    const parsed = standarPelayananSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setFields(formatFieldErrors(parsed.error));
      setFeedback({ type: "error", message: "Periksa isian formulir Standar Pelayanan." });
      return;
    }
    setFields({});
    setPending(true);
    try {
      const r = await fetch(`/api/standar-pelayanan/${item.id}`, { method: "PUT", body: form });
      const result = await r.json().catch(() => ({}));
      if (!r.ok || result.error) {
        setFields(result.fields || {});
        setFeedback({
          type: "error",
          message: result.error || "Gagal memperbarui informasi Standar Pelayanan.",
        });
      } else {
        router.push("/admin/standar-pelayanan");
        router.refresh();
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan saat menyimpan informasi Standar Pelayanan.",
      });
    } finally {
      setPending(false);
    }
  }

  const describedBy = (id: string) =>
    [fields[id] ? `${id}-error` : null, `${id}-hint`].filter(Boolean).join(" ") || undefined;

  return (
    <div className="panel mx-auto max-w-3xl p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)]">Edit Standar Pelayanan</h1>
          <p className="mt-1 text-sm text-slate-600">
            Perubahan langsung tampil di{" "}
            <Link
              href={`/standar-pelayanan/${item.slug || ""}`}
              className="font-semibold text-clinic-teal hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /standar-pelayanan/{item.slug || "…"}
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/standar-pelayanan"
          className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]"
        >
          ← Batal
        </Link>
      </div>

      <AdminFeedback result={feedback} />

      <form onSubmit={submit} className="space-y-8">
        <StandarPelayananFormFields
          values={{
            title: item.title,
            slug: item.slug,
            category: item.category || "standar-pelayanan",
            excerpt: item.excerpt,
            content: item.content,
            image_url: item.imageUrl,
            file_url: item.fileUrl,
          }}
          fields={fields}
          describedBy={describedBy}
        />
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
          <button type="submit" disabled={pending} className="button-primary">
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
          <Link href="/admin/standar-pelayanan" className="button-secondary">
            Batal
          </Link>
          {item.slug ? (
            <Link
              href={`/standar-pelayanan/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-clinic-teal hover:underline"
            >
              Lihat di situs ↗
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
