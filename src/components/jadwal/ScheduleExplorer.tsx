"use client";

import { useState, useMemo } from "react";
import type { JadwalDokter } from "@/lib/actions";

const URUTAN_HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
const HARI_INI = URUTAN_HARI[(new Date().getDay() + 6) % 7]; // getDay(): 0=Minggu

function todayMidnight() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

function statusSabtu(jamMulai: string, jamSelesai: string) {
  const now = new Date();
  const [hM,mM] = jamMulai.split(":").map(Number);
  const [hS,mS] = jamSelesai.split(":").map(Number);
  const mulai = hM*60 + mM;
  const selesai = hS*60 + mS;
  const sekarang = now.getHours()*60 + now.getMinutes();
  return sekarang >= mulai && sekarang <= selesai;
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

  const hariTerpakai = useMemo(() => {
    const set = new Set(filtered.map((r) => r.day));
    return URUTAN_HARI.filter((h) => set.has(h)).sort((a, b) =>
      a === HARI_INI ? -1 : b === HARI_INI ? 1 : 0,
    );
  }, [filtered]);

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
                  {hari === HARI_INI && <span className="badge-today">Hari ini</span>}
                </div>
                <ul className="card-list">
                  {group
                    .sort((a, b) => a.poli.localeCompare(b.poli))
                    .map((row) => {
                      const isToday = hari === HARI_INI;
                      const buka = isToday && statusSabtu(row.jam_mulai, row.jam_selesai);

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
