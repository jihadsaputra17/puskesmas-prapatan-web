"use client";

import { useState } from "react";

export default function PengaduanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah halaman me-reload secara default
    setIsSubmitting(true);

    const form = e.currentTarget; // Simpan referensi form secara sinkron

    // Simulasi proses pengiriman data (misalnya ke backend API)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      form.reset(); // Mengosongkan form setelah sukses menggunakan variabel yang disimpan
      
      // Menghilangkan pesan sukses setelah 5 detik
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Formulir Pesan / Pengaduan</h2>
      
      {/* Menampilkan pesan sukses secara kondisional */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium">Terima kasih! Pesan atau Pengaduan Anda telah berhasil dikirim.</p>
        </div>
      )}

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
            Pesan / Keluhan <span className="text-red-500">*</span>
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
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
}