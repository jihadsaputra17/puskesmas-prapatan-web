"use client";

import { useState } from "react";

export default function PengaduanForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Formulir belum terhubung ke layanan penerimaan pengaduan. Silakan gunakan kontak resmi puskesmas yang telah dikonfirmasi.");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Formulir Pesan / Pengaduan</h2>
      
      {message ? <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">{message}</p> : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors bg-slate-50 focus:bg-white"
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Nomor HP / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors bg-slate-50 focus:bg-white"
              placeholder="08xxxxxxxxxx"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email (Opsional)</label>
            <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors bg-slate-50 focus:bg-white" placeholder="email@contoh.com" />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Isi pengaduan <span className="text-red-500">*</span>
          </label>
          <textarea 
            id="message" 
            name="message" 
            rows={5} 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors bg-slate-50 focus:bg-white resize-none"
            placeholder="Tuliskan pesan, saran, atau keluhan Anda di sini secara detail..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
Kirim pengaduan
        </button>
      </form>
    </div>
  );
}