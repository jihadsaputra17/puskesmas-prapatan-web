"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addJadwal } from "@/lib/jadwal-actions";

export default function AddJadwalForm() {
  const router = useRouter();
  const [namaDokter, setNamaDokter] = useState("");
  const [poli, setPoli] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedDays.length === 0) {
      setError("Pilih minimal satu hari praktik.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await addJadwal({
        nama_dokter: namaDokter,
        poli: poli,
        hari: selectedDays, // Array hari yang dicentang
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.success) {
        router.push('/admin/jadwal');
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      setError("Terjadi kesalahan sistem saat menyimpan jadwal.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Dokter</label>
          <input type="text" required value={namaDokter} onChange={(e) => setNamaDokter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-600 focus:border-teal-600" placeholder="Misal: dr. Budi Santoso" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Poliklinik</label>
          <input type="text" required value={poli} onChange={(e) => setPoli(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-600 focus:border-teal-600" placeholder="Misal: Poli Umum" />
        </div>
      </div>

      {/* Input Checkbox Hari Praktik */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Hari Praktik</label>
        <div className="flex flex-wrap gap-4">
          {daysList.map((day) => (
            <label key={day} className="flex items-center space-x-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={selectedDays.includes(day)} onChange={() => handleDayChange(day)} className="w-4 h-4 text-teal-600 rounded focus:ring-teal-600" />
              <span className="text-sm font-medium text-slate-700">{day}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">*Anda bisa memilih lebih dari satu hari sekaligus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
          <input type="time" required value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-600 focus:border-teal-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
          <input type="time" required value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-600 focus:border-teal-600" />
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold rounded-lg shadow-md transition-all">
          {isLoading ? "Menyimpan Jadwal..." : "Simpan Jadwal Dokter"}
        </button>
      </div>
    </form>
  );
}