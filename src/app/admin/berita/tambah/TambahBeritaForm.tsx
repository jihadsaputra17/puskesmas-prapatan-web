"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminFeedback from "@/components/admin/AdminFeedback";
import BeritaFormFields from "@/components/admin/BeritaFormFields";
import { formatFieldErrors, newsSchema } from "@/lib/admin-schemas";

export default function TambahBeritaForm() {
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
    const parsed = newsSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setFields(formatFieldErrors(parsed.error));
      setFeedback({ type: "error", message: "Periksa isian formulir." });
      return;
    }
    setFields({});
    setPending(true);
    try {
      const r = await fetch("/api/berita", { method: "POST", body: form });
      const result = await r.json().catch(() => ({}));
      if (!r.ok || result.error) {
        setFields(result.fields || {});
        setFeedback({ type: "error", message: result.error || "Gagal mempublikasikan berita." });
      } else {
        router.push("/admin/berita");
        router.refresh();
      }
    } catch {
      setFeedback({ type: "error", message: "Terjadi kesalahan jaringan saat menyimpan berita." });
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
          <h1 className="text-2xl font-bold text-[var(--navy)]">Tambah berita</h1>
          <p className="mt-1 text-sm text-slate-600">
            Setelah dipublikasikan, artikel tampil di situs dengan layout majalah (breadcrumb, foto,
            lead, bagikan, berita terkait).
          </p>
        </div>
        <Link
          href="/admin/berita"
          className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]"
        >
          ← Batal
        </Link>
      </div>

      <AdminFeedback result={feedback} />

      <form onSubmit={submit} className="space-y-8">
        <BeritaFormFields fields={fields} describedBy={describedBy} />
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
          <button type="submit" disabled={pending} className="button-primary">
            {pending ? "Memproses..." : "Publikasikan berita"}
          </button>
          <Link href="/admin/berita" className="button-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
