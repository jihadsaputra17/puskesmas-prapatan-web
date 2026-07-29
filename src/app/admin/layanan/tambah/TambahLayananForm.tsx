"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Import secara dinamis agar tidak error saat SSR (Server-Side Rendering) di Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TambahLayananForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");

  // Konfigurasi Toolbar (Rata Kiri Kanan & Numbering)
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

    // Validasi manual karena React Quill tidak memiliki atribut 'required' bawaan HTML
    if (!deskripsi || deskripsi === "<p><br></p>") {
      setError("Deskripsi layanan tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nama_poli: formData.get('nama_poli') as string,
      deskripsi: deskripsi, // <-- Ambil nilai dari State React Quill
      icon: formData.get('icon') as string,
    };

    try {
      const response = await fetch("/api/layanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal menyimpan layanan.");
        setIsLoading(false);
      } else {
        router.push('/admin/layanan');
        router.refresh();
      }
    } catch (err: any) {
      console.error("Form Error:", err);
      setError("Terjadi kesalahan sistem saat menyimpan layanan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
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
          <input type="text" id="nama_poli" name="nama_poli" required placeholder="Contoh: Poli Umum" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1">
            Icon (Emoji)
          </label>
          <input type="text" id="icon" name="icon" placeholder="Contoh: 🏥, 🩺, 🦷, 👶" defaultValue="🏥" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
          <p className="text-xs text-slate-500 mt-1">Anda bisa memasukkan emoji (Tekan Windows + . atau Control + Cmd + Space).</p>
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
            placeholder="Jelaskan secara rinci tentang layanan ini..."
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Simpan Layanan"}
          </button>
        </div>
      </form>
    </div>
  );
}