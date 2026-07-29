"use client";

import { useState, useEffect } from 'react';
import type { JadwalDokter } from '../../lib/actions';

export default function ScheduleTable({ 
  scheduleData,
  initialPoli
}: { 
  scheduleData: JadwalDokter[];
  initialPoli?: string;
}) {
  const [filterPoli, setFilterPoli] = useState('Semua');

  // Ekstrak daftar poli unik dari data jadwal
  const uniquePoli = ['Semua', ...Array.from(new Set(scheduleData.map(item => item.poli)))];

  // Set nilai awal filter jika pengunjung datang dari link spesifik
  useEffect(() => {
    if (initialPoli && uniquePoli.includes(initialPoli)) {
      setFilterPoli(initialPoli);
    }
  }, [initialPoli]); // Hanya berjalan ketika parameter URL diubah/diterima

  // Filter data berdasarkan poli yang dipilih
  const filteredSchedule = filterPoli === 'Semua'
    ? scheduleData
    : scheduleData.filter(item => item.poli === filterPoli);

  return (
    <div className="space-y-6">
      {/* Kontrol Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
        <label htmlFor="filter-poli" className="font-medium text-slate-700">
          Cari berdasarkan Layanan:
        </label>
        <select
          id="filter-poli"
          value={filterPoli}
          onChange={(e) => setFilterPoli(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-white min-w-[200px] shadow-sm transition-shadow cursor-pointer"
        >
          {uniquePoli.map(poli => (
            <option key={poli} value={poli}>{poli}</option>
          ))}
        </select>
      </div>

      {/* Tabel Jadwal */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Nama Dokter / Tenaga Medis</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Layanan (Poli)</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Hari Praktik</th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">Jam Pelayanan</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{row.doctor}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {row.poli}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.day}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{row.hours}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada jadwal yang ditemukan untuk layanan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}