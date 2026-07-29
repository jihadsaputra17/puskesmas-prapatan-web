"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Mencegah halaman termuat ulang secara otomatis
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Mengambil semua data dari inputan form
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    };

    try {
      // Memanggil API Route murni yang sudah kita buat sebelumnya
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal menyimpan pengguna.");
        setIsLoading(false);
      } else {
        // Jika sukses, arahkan kembali ke halaman tabel user
        router.push('/admin/users');
        router.refresh();
      }
    } catch (err: any) {
      console.error("Form Error:", err);
      setError("Terjadi kesalahan sistem saat menyimpan data.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="Contoh: Budi Santoso"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="contoh@puskesmas.com"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" 
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            minLength={8} 
            placeholder="Masukkan minimal 8 karakter"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" 
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Hak Akses (Role)</label>
          <select 
            id="role" 
            name="role" 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
          >
            <option value="">-- Pilih Role --</option>
            <option value="admin">Admin Biasa</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Simpan Pengguna"}
          </button>
        </div>
      </form>
    </div>
  );
}
