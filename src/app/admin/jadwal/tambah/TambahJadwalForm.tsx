"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahJadwalForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (selectedDays.length === 0) {
      setError("Pilih minimal satu hari praktik.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const data = {
      nama_dokter: formData.get('nama_dokter') as string,
      poli: formData.get('poli') as string,
      hari: selectedDays, // Array hari yang dicentang
      jam_mulai: formData.get('jam_mulai') as string,
      jam_selesai: formData.get('jam_selesai') as string,
    };

    try {
      // Gunakan fetch ke API murni agar stabil
      const response = await fetch("/api/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result.error) {
        setError(result.error || "Gagal menyimpan jadwal.");
        setIsLoading(false);
      } else {
        router.push('/admin/jadwal');
        router.refresh();
      }
    } catch (err: any) {
      console.error("Form Error:", err);
      setError("Terjadi kesalahan sistem saat menyimpan jadwal.");
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
          <label htmlFor="nama_dokter" className="block text-sm font-medium text-slate-700 mb-1">
            Nama Dokter (beserta gelar)
          </label>
          <input
            type="text"
            id="nama_dokter"
            name="nama_dokter"
            required
            placeholder="Contoh: dr. Budi Santoso, Sp.A"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="poli" className="block text-sm font-medium text-slate-700 mb-1">
            Poli Pelayanan
          </label>
          <select
            id="poli"
            name="poli"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
          >
            <option value="">-- Pilih Poli --</option>
            <option value="Poli Umum">Poli Umum</option>
            <option value="Poli Gigi">Poli Gigi</option>
            <option value="Poli KIA & KB">Poli KIA & KB</option>
            <option value="Poli Anak">Poli Anak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Hari Praktik (Pilih 1 atau lebih)</label>
          <div className="flex flex-wrap gap-4">
            {daysList.map((day) => (
              <label key={day} className="flex items-center space-x-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => handleDayChange(day)} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-600" />
                <span className="text-sm font-medium text-slate-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="jam_mulai" className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
            <input type="time" id="jam_mulai" name="jam_mulai" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="jam_selesai" className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
            <input type="time" id="jam_selesai" name="jam_selesai" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            {isLoading ? "Menyimpan..." : "Simpan Jadwal Dokter"}
          </button>
        </div>
      </form>
    </div>
  );
}