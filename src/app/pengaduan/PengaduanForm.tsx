"use client";

import { useState } from "react";

export default function PengaduanForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(
      "Formulir belum terhubung ke layanan penerimaan pengaduan. Silakan gunakan kontak resmi puskesmas yang telah dikonfirmasi.",
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy sm:text-2xl">Formulir pengaduan</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Jangan kirim data medis sensitif. Formulir ini menyiapkan pesan pengaduan saja.
      </p>

      {message ? (
        <p
          className="mt-6 rounded-[10px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama lengkap <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
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
            className="input-field min-h-[8rem] resize-y py-3"
            placeholder="Tuliskan pesan, saran, atau keluhan Anda secara ringkas..."
          />
        </div>

        <button type="submit" className="button-primary w-full sm:w-auto">
          Kirim pengaduan
        </button>
      </form>
    </div>
  );
}
