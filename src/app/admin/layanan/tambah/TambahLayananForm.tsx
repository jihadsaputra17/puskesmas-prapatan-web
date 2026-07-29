"use client";

import dynamic from "next/dynamic";
import type ReactQuillType from "react-quill-new";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import AdminFeedback from "@/components/admin/AdminFeedback";
import { formatFieldErrors, serviceSchema } from "@/lib/admin-schemas";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as typeof import("react-quill-new").default;
type Feedback = { type: "success" | "error"; message: string } | null;
const modules = { toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline"], [{ align: [] }], [{ list: "ordered" }, { list: "bullet" }], ["clean"]] };

export default function TambahLayananForm() {
  const router = useRouter();
  const [deskripsi, setDeskripsi] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const editor = useRef<ReactQuillType>(null);
  const error = (name: string) => fields[name] ? `${name}-error` : undefined;

  useEffect(() => {
    const root = editor.current?.getEditor().root;
    if (!root) return;
    root.id = "deskripsi";
    root.setAttribute("aria-labelledby", "deskripsi-label");
    if (fields.deskripsi) root.setAttribute("aria-describedby", "deskripsi-error");
    else root.removeAttribute("aria-describedby");
  }, [fields.deskripsi]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = serviceSchema.safeParse({ nama_poli: String(form.get("nama_poli") || ""), icon: String(form.get("icon") || ""), deskripsi: deskripsi.replace(/<[^>]*>/g, "").trim() ? deskripsi : "" });
    if (!parsed.success) { setFields(formatFieldErrors(parsed.error)); setFeedback({ type: "error", message: "Periksa isian formulir." }); return; }
    setFields({}); setFeedback(null); setPending(true);
    try {
      const response = await fetch("/api/layanan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const result: { error?: string; message?: string; fields?: Record<string, string> } = await response.json().catch(() => ({}));
      if (!response.ok || result.error) { setFields(result.fields || {}); setFeedback({ type: "error", message: result.error || result.message || "Gagal menyimpan layanan." }); return; }
      router.push("/admin/layanan"); router.refresh();
    } catch { setFeedback({ type: "error", message: "Terjadi kesalahan jaringan saat menyimpan layanan." }); }
    finally { setPending(false); }
  }

  return <div className="panel p-8"><AdminFeedback result={feedback}/><form onSubmit={submit} className="space-y-6"><div><label htmlFor="nama_poli" className="mb-1 block text-sm font-medium text-[var(--ink)]">Nama Poli / Layanan</label><input id="nama_poli" name="nama_poli" required aria-describedby={error("nama_poli")} className="input-field"/>{fields.nama_poli && <p id="nama_poli-error" className="mt-1 text-sm text-red-700">{fields.nama_poli}</p>}</div><div><label htmlFor="icon" className="mb-1 block text-sm font-medium text-[var(--ink)]">Icon (Emoji)</label><input id="icon" name="icon" defaultValue="🏥" aria-describedby={error("icon")} className="input-field"/>{fields.icon && <p id="icon-error" className="mt-1 text-sm text-red-700">{fields.icon}</p>}</div><div><label id="deskripsi-label" className="mb-1 block text-sm font-medium text-[var(--ink)]">Deskripsi Layanan</label><ReactQuill ref={editor} theme="snow" value={deskripsi} onChange={setDeskripsi} modules={modules} className="mb-16 h-48" placeholder="Jelaskan secara rinci tentang layanan ini..."/>{fields.deskripsi && <p id="deskripsi-error" className="mt-1 text-sm text-red-700">{fields.deskripsi}</p>}</div><button type="submit" disabled={pending} className="button-primary">{pending ? "Menyimpan..." : "Simpan Layanan"}</button></form></div>;
}
