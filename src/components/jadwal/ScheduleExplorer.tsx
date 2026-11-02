"use client";

import { useState, useMemo } from "react";
import type { JadwalDokter } from "@/lib/actions";

const URUTAN_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const POLI_SORT_ORDER: Record<string, number> = {
  "Poli Umum": 1,
  UMUM: 1,
  "Poli Gigi": 2,
  GIGI: 2,
  "Poli KIA": 3,
  KIA: 3,
  "Poli KB": 4,
  KB: 4,
};

const WITA_WEEKDAY_MAP: Record<string, string> = {
  Mon: "Senin",
  Tue: "Selasa",
  Wed: "Rabu",
  Thu: "Kamis",
  Fri: "Jumat",
  Sat: "Sabtu",
  Sun: "Minggu",
};

function getWitaNow(date = new Date()): { hari: string; minutes: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Makassar",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
    const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

    return {
      hari: WITA_WEEKDAY_MAP[weekday] ?? URUTAN_HARI[(date.getDay() + 6) % 7],
      minutes: hour * 60 + minute,
    };
  } catch {
    return {
      hari: URUTAN_HARI[(date.getDay() + 6) % 7],
      minutes: date.getHours() * 60 + date.getMinutes(),
    };
  }
}

function isWithinHours(jamMulai: string, jamSelesai: string, currentMinutes: number) {
  const [hM, mM] = jamMulai.split(/[:.]/).map(Number);
  const [hS, mS] = jamSelesai.split(/[:.]/).map(Number);
  if (Number.isNaN(hM) || Number.isNaN(hS)) return false;
  const mulai = hM * 60 + (mM || 0);
  const selesai = hS * 60 + (mS || 0);
  return currentMinutes >= mulai && currentMinutes <= selesai;
}

function comparePoli(a: string, b: string) {
  const rankA = POLI_SORT_ORDER[a] ?? 99;
  const rankB = POLI_SORT_ORDER[b] ?? 99;
  if (rankA !== rankB) return rankA - rankB;
  return a.localeCompare(b);
}

export default function ScheduleExplorer({
  scheduleData,
  initialPoli,
}: {
  scheduleData: JadwalDokter[];
  initialPoli?: string;
}) {
  const [search, setSearch] = useState("");
  const [filterPoli, setFilterPoli] = useState(
    initialPoli && scheduleData.some((r) => r.poli === initialPoli) ? initialPoli : "",
  );
  const [filterJenis, setFilterJenis] = useState("");
  const [filterHari, setFilterHari] = useState("");
  const [viewMode, setViewMode] = useState<"harian" | "tabel">("harian");

  const daftarPoli = useMemo(
    () => [...new Set(scheduleData.map((r) => r.poli))].sort(comparePoli),
    [scheduleData],
  );
  const daftarJenis = useMemo(
    () =>
      [...new Set(scheduleData.map((r) => r.jenis_tenaga_medis || "Dokter"))].sort(),
    [scheduleData],
  );
  const daftarHari = useMemo(
    () => URUTAN_HARI.filter((h) => scheduleData.some((r) => r.day === h)),
    [scheduleData],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scheduleData.filter((r) => {
      const jenis = r.jenis_tenaga_medis || "Dokter";
      return (
        (!q ||
          r.doctor.toLowerCase().includes(q) ||
          r.poli.toLowerCase().includes(q) ||
          jenis.toLowerCase().includes(q)) &&
        (!filterPoli || r.poli === filterPoli) &&
        (!filterJenis || jenis === filterJenis) &&
        (!filterHari || r.day === filterHari)
      );
    });
  }, [scheduleData, search, filterPoli, filterJenis, filterHari]);

  const { hari: hariIni, minutes: witaMinutes } = useMemo(() => getWitaNow(), []);

  const hariTerpakai = useMemo(() => {
    const set = new Set(filtered.map((r) => r.day));
    return URUTAN_HARI.filter((h) => set.has(h)).sort((a, b) =>
      a === hariIni ? -1 : b === hariIni ? 1 : 0,
    );
  }, [filtered, hariIni]);

  // Group by Tenaga Medis for the official summary table
  const summaryRows = useMemo(() => {
    const map = new Map<
      string,
      {
        poli: string;
        doctor: string;
        jenis: string;
        byDay: Record<string, string>;
      }
    >();

    for (const row of filtered) {
      const jenis = row.jenis_tenaga_medis || "Dokter";
      const key = `${row.poli}||${row.doctor}||${jenis}`;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          poli: row.poli,
          doctor: row.doctor,
          jenis,
          byDay: {},
        };
        map.set(key, entry);
      }
      entry.byDay[row.day] = `${row.jam_mulai} - ${row.jam_selesai}`;
    }

    return Array.from(map.values()).sort((a, b) => {
      const p = comparePoli(a.poli, b.poli);
      if (p !== 0) return p;
      return a.doctor.localeCompare(b.doctor);
    });
  }, [filtered]);

  return (
    <>
      <div className="panel controls-panel sm:!grid-cols-2 lg:!grid-cols-4">
        <div className="field">
          <label htmlFor="cari-dokter">Cari nama tenaga medis</label>
          <input
            id="cari-dokter"
            type="text"
            placeholder="mis. dr. Novida, Bidan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filter-poli">Filter poli</label>
          <select
            id="filter-poli"
            value={filterPoli}
            onChange={(e) => setFilterPoli(e.target.value)}
          >
            <option value="">Semua</option>
            {daftarPoli.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-jenis">Jenis tenaga medis</label>
          <select
            id="filter-jenis"
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
          >
            <option value="">Semua</option>
            {daftarJenis.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-hari">Filter hari</label>
          <select
            id="filter-hari"
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value)}
          >
            <option value="">Semua</option>
            {daftarHari.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("harian")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              viewMode === "harian"
                ? "bg-[var(--teal)] text-white shadow-sm"
                : "text-slate-600 hover:text-[var(--navy)]"
            }`}
          >
            Jadwal Per Hari
          </button>
          <button
            type="button"
            onClick={() => setViewMode("tabel")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              viewMode === "tabel"
                ? "bg-[var(--teal)] text-white shadow-sm"
                : "text-slate-600 hover:text-[var(--navy)]"
            }`}
          >
            Tabel Ringkasan Jam Kerja
          </button>
        </div>
        <p className="text-xs font-medium text-slate-600">
          Jam Kerja: Senin–Kamis 08:00–15:00 • Jumat 08:00–11:30 • Sabtu 08:00–13:30 • Minggu &amp; Libur Nasional: Tutup
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="panel empty-state">
          <strong>Tidak ada jadwal ditemukan</strong>
          <span>Coba ubah kata kunci pencarian atau filter yang dipilih.</span>
        </div>
      ) : viewMode === "tabel" ? (
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-200/80 bg-[var(--teal-soft)]/60 px-5 py-3.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--navy)]">
              Daftar Tenaga Medis &amp; Jam Kerja Pelayanan
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[var(--navy)]">
                  <th className="px-4 py-3">Nama Poli</th>
                  <th className="px-4 py-3">Nama Tenaga Medis</th>
                  <th className="px-4 py-3">Jenis Tenaga Medis</th>
                  <th className="px-4 py-3">Jam Kerja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summaryRows.map((item) => {
                  const jamKerjaParts = URUTAN_HARI.map((h) => {
                    const val = item.byDay[h] || "-";
                    return `${h.toUpperCase()} : ${val}`;
                  });
                  jamKerjaParts.push("LIBUR NASIONAL : -");

                  return (
                    <tr
                      key={`${item.poli}-${item.doctor}`}
                      className="align-top transition-colors hover:bg-[var(--sky-wash)]"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[var(--teal)]">
                        {item.poli}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[var(--navy)]">
                        {item.doctor}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <span className="inline-flex rounded-full bg-[var(--teal-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--teal)]">
                          {item.jenis}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs leading-6 text-slate-600">
                        {jamKerjaParts.join("; ")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="schedule-results">
          {hariTerpakai.map((hari) => {
            const group = filtered.filter((r) => r.day === hari);
            return (
              <div key={hari} className="day-group">
                <div className="day-heading">
                  {hari}
                  {hari === hariIni && <span className="badge-today">Hari ini</span>}
                </div>
                <ul className="card-list">
                  {group
                    .sort((a, b) => {
                      const p = comparePoli(a.poli, b.poli);
                      if (p !== 0) return p;
                      return a.doctor.localeCompare(b.doctor);
                    })
                    .map((row) => {
                      const isToday = hari === hariIni;
                      const buka =
                        isToday &&
                        isWithinHours(row.jam_mulai, row.jam_selesai, witaMinutes);
                      const jenis = row.jenis_tenaga_medis || "Dokter";

                      return (
                        <li
                          key={row.id}
                          className={`card${isToday ? " is-today" : ""}`}
                        >
                          <div className="card-main">
                            <div className="card-name">{row.doctor}</div>
                            <div className="card-meta flex flex-wrap items-center gap-1.5">
                              <span>{row.poli}</span>
                              <span aria-hidden="true">•</span>
                              <span className="font-medium text-[var(--teal)]">
                                {jenis}
                              </span>
                            </div>
                          </div>
                          <div className="card-right">
                            <span className="time-chip">{row.hours}</span>
                            {isToday && (
                              <span
                                className={`status-chip ${buka ? "status-open" : "status-closed"}`}
                              >
                                {buka ? "Sedang praktik" : "Tutup"}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <p className="footnote">
        Hari Minggu dan Libur Nasional pelayanan tutup. Jadwal dapat berubah sewaktu-waktu — hubungi puskesmas untuk konfirmasi sebelum berkunjung.
      </p>
    </>
  );
}
