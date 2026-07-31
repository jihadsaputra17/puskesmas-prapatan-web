"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminFeedback from "@/components/admin/AdminFeedback";
import CoverImageField from "@/components/admin/CoverImageField";
import { dokterSchema, formatFieldErrors } from "@/lib/admin-schemas";
import type { Dokter } from "@/lib/dokter-actions";

type Feedback = { type: "success" | "error"; message: string } | null;

export default function EditDokterForm({ dokter }: { dokter: Dokter }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const error = (name: string) => (fields[name] ? `${name}-error` : undefined);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = dokterSchema.safeParse({
      nama: String(form.get("nama") || ""),
      poli: String(form.get("poli") || ""),
      foto_url: String(form.get("foto_url") || ""),
      urutan: Number(form.get("urutan") || 0),
      aktif: form.get("aktif") === "on" || form.get("aktif") === "true",
    });
    if (!parsed.success) {
      setFields(formatFieldErrors(parsed.error));
      setFeedback({ type: "error", message: "Periksa isian formulir." });
      return;
    }
    setFields({});
    setFeedback(null);
    setPending(true);
    try {
      const response = await fetch(`/api/dokter/${dokter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result: { error?: string; fields?: Record<string, string> } = await response
        .json()
        .catch(() => ({}));
      if (!response.ok || result.error) {
        setFields(result.fields || {});
        setFeedback({ type: "error", message: result.error || "Gagal memperbarui data dokter." });
        return;
      }
      setFeedback({ type: "success", message: "Data dokter berhasil diperbarui." });
      router.push("/admin/dokter");
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan saat memperbarui data dokter.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="panel p-8">
      <AdminFeedback result={feedback} />
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="nama" className="mb-1 block text-sm font-medium text-[var(--ink)]">
            Nama Dokter
          </label>
          <input
            id="nama"
            name="nama"
            required
            defaultValue={dokter.nama}
            aria-describedby={error("nama")}
            className="input-field"
          />
          {fields.nama && (
            <p id="nama-error" className="mt-1 text-sm text-red-700">
              {fields.nama}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="poli" className="mb-1 block text-sm font-medium text-[var(--ink)]">
            Poliklinik
          </label>
          <input
            id="poli"
            name="poli"
            required
            defaultValue={dokter.poli}
            aria-describedby={error("poli")}
            className="input-field"
          />
          {fields.poli && (
            <p id="poli-error" className="mt-1 text-sm text-red-700">
              {fields.poli}
            </p>
          )}
        </div>

        <div>
          <p className="mb-1 block text-sm font-medium text-[var(--ink)]">
            Foto Dokter <span className="font-normal text-[var(--muted)]">(otomatis dipotong 4:5)</span>
          </p>
          <CoverImageField
            name="foto_url"
            defaultValue={dokter.foto_url}
            error={fields.foto_url}
            describedBy={error("foto_url")}
            aspectClass="aspect-[4/5]"
            aspectLabel="4:5"
            cropAspect={0.8}
          />
        </div>

        <div>
          <label htmlFor="urutan" className="mb-1 block text-sm font-medium text-[var(--ink)]">
            Urutan tampil
          </label>
          <input
            id="urutan"
            name="urutan"
            type="number"
            min={0}
            defaultValue={dokter.urutan}
            aria-describedby={error("urutan")}
            className="input-field"
          />
          {fields.urutan && (
            <p id="urutan-error" className="mt-1 text-sm text-red-700">
              {fields.urutan}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            name="aktif"
            defaultChecked={dokter.aktif}
            className="h-4 w-4 accent-[var(--teal)]"
          />
          Tampilkan di situs publik
        </label>

        <button type="submit" disabled={pending} className="button-primary">
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
