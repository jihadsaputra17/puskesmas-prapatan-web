"use client";

import { useState } from "react";
import type { JadwalDokter } from "@/lib/actions";

export default function ScheduleExplorer({ scheduleData, initialPoli }: { scheduleData: JadwalDokter[]; initialPoli?: string }) {
  const poliOptions = ["Semua", ...Array.from(new Set(scheduleData.map((row) => row.poli)))];
  const dayOptions = ["Semua", ...Array.from(new Set(scheduleData.map((row) => row.day)))];
  const [poli, setPoli] = useState(initialPoli && poliOptions.includes(initialPoli) ? initialPoli : "Semua");
  const [day, setDay] = useState("Semua");
  const rows = scheduleData.filter((row) => (poli === "Semua" || row.poli === poli) && (day === "Semua" || row.day === day));
  const selectClass = "min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-900";

  return <section aria-label="Daftar jadwal" className="space-y-6"><div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2"><label className="grid gap-2 font-semibold text-[#12304a]">Filter poli<select aria-label="Filter poli" value={poli} onChange={(event) => setPoli(event.target.value)} className={selectClass}>{poliOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 font-semibold text-[#12304a]">Filter hari<select aria-label="Filter hari" value={day} onChange={(event) => setDay(event.target.value)} className={selectClass}>{dayOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div>{rows.length ? <><div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block"><table className="w-full text-left"><thead className="bg-slate-100 text-sm text-slate-700"><tr><th className="p-4">Tenaga medis</th><th className="p-4">Poli</th><th className="p-4">Hari</th><th className="p-4">Jam</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-slate-200"><td className="p-4 font-semibold text-[#12304a]">{row.doctor}</td><td className="p-4">{row.poli}</td><td className="p-4">{row.day}</td><td className="p-4">{row.hours}</td></tr>)}</tbody></table></div><ul className="grid gap-3 md:hidden">{rows.map((row) => <li key={row.id} className="rounded-xl border border-slate-200 bg-white p-4"><p className="font-bold text-[#12304a]">{row.doctor}</p><dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm"><dt className="text-slate-600">Poli</dt><dd>{row.poli}</dd><dt className="text-slate-600">Hari</dt><dd>{row.day}</dd><dt className="text-slate-600">Jam</dt><dd>{row.hours}</dd></dl></li>)}</ul></> : <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">Tidak ada jadwal yang sesuai filter.</p>}<p className="text-sm leading-6 text-slate-600">Jadwal dapat berubah. Hubungi puskesmas untuk konfirmasi sebelum berkunjung.</p></section>;
}
