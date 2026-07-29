"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserForm({ user }: { user: any }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    };

    try {
      // Memanggil API method PUT untuk mengupdate data
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal memperbarui pengguna.");
        setIsLoading(false);
      } else {
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input 
            type="text" id="name" name="name" 
            defaultValue={user.name} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" id="email" name="email" 
            defaultValue={user.email} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" 
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Hak Akses (Role)</label>
          <select 
            id="role" name="role" 
            defaultValue={user.role} required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
          >
            <option value="admin">Admin Biasa</option>
            <option value="superadmin">Superadmin</option>
          </select>
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