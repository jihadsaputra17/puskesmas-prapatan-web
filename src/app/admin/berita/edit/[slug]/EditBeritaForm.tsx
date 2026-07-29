"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "../../../../../components/admin/ImageUploader";

export default function EditBeritaForm({ berita }: { berita: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`/api/berita/${berita.id}`, {
        method: "PUT",
        body: formData, // FormData mengurus transfer teks dan gambar (base64)
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal memperbarui berita.");
        setIsLoading(false);
      } else {
        router.push('/admin/berita');
        router.refresh();
      }
    } catch (err: any) {
      console.error("Form Error:", err);
      setError("Terjadi kesalahan sistem saat menyimpan berita.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Edit Berita</h1>
        <Link href="/admin/berita" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          &larr; Batal & Kembali
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Judul Berita <span className="text-red-500">*</span></label>
          <input type="text" id="title" name="title" defaultValue={berita.title} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-1">Tautan / Slug (Tanpa Spasi) <span className="text-red-500">*</span></label>
          <input type="text" id="slug" name="slug" defaultValue={berita.slug} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors" />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">Ringkasan Singkat <span className="text-red-500">*</span></label>
          <textarea id="excerpt" name="excerpt" defaultValue={berita.excerpt} rows={3} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors resize-none"></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Isi Berita Lengkap <span className="text-red-500">*</span></label>
          <textarea id="content" name="content" defaultValue={berita.content} rows={8} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors resize-none"></textarea>
        </div>
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-slate-700 mb-1">Pilih Template Tampilan <span className="text-red-500">*</span></label>
          <select id="template" name="template" defaultValue={berita.template || 'standard'} required className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors">
            <option value="standard">Standar (Gambar di bawah Judul)</option>
            <option value="hero-overlay">Hero Banner (Judul menyatu dengan Gambar Utama)</option>
            <option value="minimalist">Minimalis (Tanpa Gambar Utama, Fokus Teks)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unggah Gambar / Galeri Berita</label>
          {/* Memasukkan gambar lama sebagai default ke Uploader */}
          <ImageUploader defaultImage={berita.image_url} />
        </div>
        <div className="pt-6">
          <button type="submit" disabled={isLoading} className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
            {isLoading ? "Menyimpan Perubahan..." : "Simpan Perubahan Berita"}
          </button>
        </div>
      </form>
    </div>
  );
}