"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminFeedback from "@/components/admin/AdminFeedback";
import PpidFormFields from "@/components/admin/PpidFormFields";
import { formatFieldErrors, ppidSchema } from "@/lib/admin-schemas";

export default function TambahPpidForm() {
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
    const parsed = ppidSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setFields(formatFieldErrors(parsed.error));
      setFeedback({ type: "error", message: "Periksa isian formulir PPID." });
      return;
    }
    setFields({});
    setPending(true);
    try {
      const r = await fetch("/api/ppid", { method: "POST", body: form });
      const result = await r.json().catch(() => ({}));
      if (!r.ok || result.error) {
        setFields(result.fields || {});
        setFeedback({
          type: "error",
          message: result.error || "Gagal mempublikasikan informasi PPID.",
        });
      } else {
        router.push("/admin/ppid");
        router.refresh();
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan saat menyimpan informasi PPID.",
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
          <h1 className="text-2xl font-bold text-[var(--navy)]">Tambah informasi PPID</h1>
          <p className="mt-1 text-sm text-slate-600">
            Publikasikan dokumen atau informasi keterbukaan publik ke halaman PPID Puskesmas
            Prapatan.
          </p>
        </div>
        <Link
          href="/admin/ppid"
          className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]"
        >
          ← Batal
        </Link>
      </div>

      <AdminFeedback result={feedback} />

      <form onSubmit={submit} className="space-y-8">
        <PpidFormFields fields={fields} describedBy={describedBy} />
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
          <button type="submit" disabled={pending} className="button-primary">
            {pending ? "Memproses..." : "Publikasikan informasi PPID"}
          </button>
          <Link href="/admin/ppid" className="button-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
