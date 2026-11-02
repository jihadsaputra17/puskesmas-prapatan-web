"use client";

import { useState, useMemo } from "react";
import type { JadwalDokter } from "@/lib/actions";

const URUTAN_HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

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

export default function ScheduleExplorer({
  scheduleData,
  initialPoli,
}: {
  scheduleData: JadwalDokter[];
  initialPoli?: string;
}) {
  const [search, setSearch] = useState("");
  const [filterPoli, setFilterPoli] = useState(
    initialPoli && scheduleData.some((r) => r.poli === initialPoli)
      ? initialPoli : "",
  );
  const [filterHari, setFilterHari] = useState("");

  const daftarPoli = useMemo(
    () => [...new Set(scheduleData.map((r) => r.poli))].sort(),
    [scheduleData],
  );
  const daftarHari = useMemo(
    () => URUTAN_HARI.filter((h) => scheduleData.some((r) => r.day === h)),
    [scheduleData],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scheduleData.filter(
      (r) =>
        (!q || r.doctor.toLowerCase().includes(q) || r.poli.toLowerCase().includes(q)) &&
        (!filterPoli || r.poli === filterPoli) &&
        (!filterHari || r.day === filterHari),
    );
  }, [scheduleData, search, filterPoli, filterHari]);

  const { hari: hariIni, minutes: witaMinutes } = useMemo(() => getWitaNow(), []);

  const hariTerpakai = useMemo(() => {
    const set = new Set(filtered.map((r) => r.day));
    return URUTAN_HARI.filter((h) => set.has(h)).sort((a, b) =>
      a === hariIni ? -1 : b === hariIni ? 1 : 0,
    );
  }, [filtered, hariIni]);

  return (
    <>
      <div className="panel controls-panel">
        <div className="field">
          <label htmlFor="cari-dokter">Cari nama dokter</label>
          <input
            id="cari-dokter"
            type="text"
            placeholder="mis. budi"
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
              <option key={p} value={p}>{p}</option>
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
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel empty-state">
          <strong>Tidak ada jadwal ditemukan</strong>
          <span>Coba ubah kata kunci pencarian atau filter yang dipilih.</span>
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
                    .sort((a, b) => a.poli.localeCompare(b.poli))
                    .map((row) => {
                      const isToday = hari === hariIni;
                      const buka = isToday && isWithinHours(row.jam_mulai, row.jam_selesai, witaMinutes);

                      return (
                        <li
                          key={row.id}
                          className={`card${isToday ? " is-today" : ""}`}
                        >
                          <div className="card-main">
                            <div className="card-name">{row.doctor}</div>
                            <div className="card-meta">{row.poli}</div>
                          </div>
                          <div className="card-right">
                            <span className="time-chip">{row.hours}</span>
                            {isToday && (
                              <span className={`status-chip ${buka ? "status-open" : "status-closed"}`}>
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
        Jadwal dapat berubah. Hubungi puskesmas untuk konfirmasi sebelum berkunjung.
      </p>
    </>
  );
}
