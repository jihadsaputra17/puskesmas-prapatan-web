"use client";

import { useState } from "react";
import type { JadwalDokter } from "@/lib/actions";

export default function ScheduleExplorer({
  scheduleData,
  initialPoli,
}: {
  scheduleData: JadwalDokter[];
  initialPoli?: string;
}) {
  const poliOptions = ["Semua", ...Array.from(new Set(scheduleData.map((row) => row.poli)))];
  const dayOptions = ["Semua", ...Array.from(new Set(scheduleData.map((row) => row.day)))];
  const [poli, setPoli] = useState(
    initialPoli && poliOptions.includes(initialPoli) ? initialPoli : "Semua",
  );
  const [day, setDay] = useState("Semua");
  const rows = scheduleData.filter(
    (row) => (poli === "Semua" || row.poli === poli) && (day === "Semua" || row.day === day),
  );

  return (
    <section aria-label="Daftar jadwal" className="space-y-6">
      <div className="panel grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Filter poli
          <select
            aria-label="Filter poli"
            value={poli}
            onChange={(event) => setPoli(event.target.value)}
            className="input-field"
          >
            {poliOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Filter hari
          <select
            aria-label="Filter hari"
            value={day}
            onChange={(event) => setDay(event.target.value)}
            className="input-field"
          >
            {dayOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {rows.length ? (
        <>
          <div className="panel hidden overflow-hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-clinic-soft/70 text-sm text-slate-700">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Tenaga medis</th>
                  <th className="px-5 py-3.5 font-semibold">Poli</th>
                  <th className="px-5 py-3.5 font-semibold">Hari</th>
                  <th className="px-5 py-3.5 font-semibold">Jam</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-navy">{row.doctor}</td>
                    <td className="px-5 py-4 text-slate-700">{row.poli}</td>
                    <td className="px-5 py-4 text-slate-700">{row.day}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-clinic-soft px-3 py-1 text-sm font-medium text-clinic-teal">
                        {row.hours}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="panel p-4">
                <p className="font-bold text-navy">{row.doctor}</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-500">Poli</dt>
                  <dd className="font-medium text-slate-800">{row.poli}</dd>
                  <dt className="text-slate-500">Hari</dt>
                  <dd className="font-medium text-slate-800">{row.day}</dd>
                  <dt className="text-slate-500">Jam</dt>
                  <dd className="font-medium text-clinic-teal">{row.hours}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="panel p-8 text-center text-slate-600">
          Tidak ada jadwal yang sesuai filter.
        </p>
      )}

      <p className="text-sm leading-6 text-slate-600">
        Jadwal dapat berubah. Hubungi puskesmas untuk konfirmasi sebelum berkunjung.
      </p>
    </section>
  );
}
