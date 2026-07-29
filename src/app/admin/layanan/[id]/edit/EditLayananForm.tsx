"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import secara dinamis agar tidak error saat SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditLayananForm({ layanan }: { layanan: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ success: boolean; text: string } | null>(null);
  
  // Mengisi form deskripsi dengan data yang sudah ada di database
  const [deskripsi, setDeskripsi] = useState(layanan.deskripsi || "");

  // Konfigurasi Toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setToastMessage(null);

    if (!deskripsi || deskripsi === "<p><br></p>") {
      setError("Deskripsi layanan tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nama_poli: formData.get('nama_poli') as string,
      deskripsi: deskripsi,
      icon: formData.get('icon') as string,
    };

    try {
      const response = await fetch(`/api/layanan/${layanan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal memperbarui layanan.");
        setIsLoading(false);
      } else {
        setToastMessage({ success: true, text: "Layanan berhasil diperbarui!" });
        setTimeout(() => {
          router.push('/admin/layanan');
          router.refresh();
        }, 1500); // Jeda 1.5 detik sebelum pindah halaman
      }
    } catch (err: any) {
      console.error("Form Error:", err);
      setError("Terjadi kesalahan sistem saat memperbarui layanan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
      {/* POP-UP NOTIFIKASI TOAST */}
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nama_poli" className="block text-sm font-medium text-slate-700 mb-1">
            Nama Poli / Layanan
          </label>
          <input type="text" id="nama_poli" name="nama_poli" defaultValue={layanan.nama_poli} required placeholder="Contoh: Poli Umum" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1">
            Icon (Emoji)
          </label>
          <input type="text" id="icon" name="icon" defaultValue={layanan.icon} placeholder="Contoh: 🏥, 🩺, 🦷, 👶" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
        </div>

        <div className="pb-10">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Deskripsi Layanan
          </label>
          <ReactQuill 
            theme="snow" 
            value={deskripsi} 
            onChange={setDeskripsi} 
            modules={modules}
            className="h-48 mb-6"
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition-colors">
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}