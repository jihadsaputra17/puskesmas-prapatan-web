"use client";

import { useState } from "react";

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [toastMessage, setToastMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    setIsSaving(true); // Aktifkan tombol loading
    setToastMessage(null); // Sembunyikan toast lama jika ada

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    
    // Konversi FormData menjadi Object JSON biasa agar 100% aman dikirim
    formData.forEach((value, key) => {
      if (typeof value === 'string' && !key.startsWith('$')) {
        data[key] = value;
      }
    });
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setToastMessage({
        success: response.ok,
        text: result.message || (response.ok ? 'Berhasil disimpan!' : 'Gagal menyimpan.'),
      });
    } catch (error) {
      setToastMessage({ success: false, text: 'Terjadi kesalahan jaringan. Periksa koneksi Anda.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      
      {/* POP-UP NOTIFIKASI */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl text-white font-medium z-50 flex items-center gap-3 animate-fadeIn ${
          toastMessage.success ? 'bg-teal-600' : 'bg-red-600'
        }`}>
          {toastMessage.success ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          )}
          {toastMessage.text}
        </div>
      )}

      {/* KELOMPOK 1: Informasi Beranda */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">1. Teks Beranda Utama (Hero)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama (Hero Title)</label>
            <input type="text" name="hero_title" defaultValue={settings.hero_title} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul / Deskripsi Pendek</label>
            <textarea name="hero_subtitle" defaultValue={settings.hero_subtitle} required rows={3} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
        </div>
      </div>

      {/* KELOMPOK 2: Kontak & Alamat */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">2. Kontak & Alamat Publik</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nama Fasyankes</label><input type="text" name="site_name" defaultValue={settings.site_name} className="w-full p-3 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label><input type="text" name="phone" defaultValue={settings.phone} className="w-full p-3 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email Resmi</label><input type="email" name="email" defaultValue={settings.email} className="w-full p-3 border border-slate-300 rounded-lg" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label><textarea name="address" defaultValue={settings.address} rows={2} className="w-full p-3 border border-slate-300 rounded-lg" /></div>
        </div>
      </div>

      {/* KELOMPOK 3: Sosial Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">3. Tautan Media Sosial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Link Instagram</label><input type="url" name="instagram" defaultValue={settings.instagram} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Link Facebook</label><input type="url" name="facebook" defaultValue={settings.facebook} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg" /></div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isSaving}
          className={`px-8 py-3 text-white rounded-xl font-bold shadow-md transition-all ${
            isSaving ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </button>
      </div>
    </form>
  );
}