"use client";

import { useState } from 'react';

const scheduleData = [
  { id: 1, doctor: 'dr. Andi Pratama', poli: 'Poli Umum', day: 'Senin - Kamis', hours: '08:00 - 12:00 WITA' },
  { id: 2, doctor: 'dr. Budi Santoso', poli: 'Poli Umum', day: 'Jumat - Sabtu', hours: '08:00 - 11:00 WITA' },
  { id: 3, doctor: 'drg. Citra Lestari', poli: 'Poli Gigi', day: 'Senin - Rabu', hours: '08:30 - 13:00 WITA' },
  { id: 4, doctor: 'drg. Dian Novita', poli: 'Poli Gigi', day: 'Kamis - Sabtu', hours: '08:30 - 12:00 WITA' },
  { id: 5, doctor: 'Bidan Eka Sari', poli: 'Poli KIA & KB', day: 'Senin - Sabtu', hours: '08:00 - 12:00 WITA' },
  { id: 6, doctor: 'Petugas Lab (Analis)', poli: 'Laboratorium', day: 'Senin - Sabtu', hours: '08:00 - 11:30 WITA' },
];

export default function ScheduleTable() {
  const [filterPoli, setFilterPoli] = useState('Semua');

  // Ekstrak daftar poli unik dari data jadwal
  const uniquePoli = ['Semua', ...Array.from(new Set(scheduleData.map(item => item.poli)))];

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