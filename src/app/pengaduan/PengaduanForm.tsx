"use client";

import { useState, type FormEvent } from "react";

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function PengaduanForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "sending" });

    const fd = new FormData(event.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    };

    const form = event.currentTarget;

    try {
      const res = await fetch("/api/pengaduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          message:
            result.error ||
            "Gagal mengirim pengaduan. Silakan coba lagi.",
        });
        return;
      }

      setStatus({ type: "success" });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message:
          "Terjadi kesalahan jaringan. Silakan periksa koneksi Anda dan coba lagi.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy sm:text-2xl">Formulir pengaduan</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Jangan kirim data medis sensitif. Pengaduan Anda akan dikirim ke email resmi Puskesmas Prapatan.
      </p>

      {status.type === "success" && (
        <div
          className="mt-6 rounded-[10px] border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-950"
          role="status"
        >
          Pengaduan berhasil dikirim. Terima kasih atas masukan Anda.
        </div>
      )}

      {status.type === "error" && (
        <div
          className="mt-6 rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-950"
          role="alert"
        >
          {status.message}
        </div>
      )}

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit}
        aria-busy={status.type === "sending"}
      >
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama lengkap <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={status.type === "sending"}
            className="input-field"
            placeholder="Masukkan nama lengkap Anda"
            autoComplete="name"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nomor HP / WhatsApp <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
              disabled={status.type === "sending"}
              className="input-field"
              placeholder="08xxxxxxxxxx"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email (opsional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled={status.type === "sending"}
              className="input-field"
              placeholder="email@contoh.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Isi pengaduan <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={status.type === "sending"}
            className="input-field min-h-[8rem] resize-y py-3"
            placeholder="Tuliskan pesan, saran, atau keluhan Anda secara ringkas..."
          />
        </div>

        <button
          type="submit"
          disabled={status.type === "sending"}
          className="button-primary w-full sm:w-auto"
        >
          {status.type === "sending" ? "Mengirim..." : "Kirim pengaduan"}
        </button>
      </form>
    </div>
  );
}
