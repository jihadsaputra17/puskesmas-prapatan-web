import type { Metadata } from "next";
import ScheduleExplorer from "@/components/jadwal/ScheduleExplorer";
import { getJadwalDokter } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Jadwal Dokter — Puskesmas Prapatan",
  description:
    "Cari jadwal praktik dokter dan pelayanan poli di Puskesmas Prapatan berdasarkan poli, hari, atau nama tenaga medis.",
};

export default async function JadwalDokterPage({
  searchParams,
}: {
  searchParams: Promise<{ poli?: string | string[] }>;
}) {
  const [scheduleData, params] = await Promise.all([getJadwalDokter(), searchParams]);
  const initialPoli = typeof params.poli === "string" ? params.poli : undefined;

  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Kunjungan</p>
          <h1 className="page-intro-title mt-3">Jadwal Dokter</h1>
          <p className="page-intro-copy">
            Cari jadwal pelayanan berdasarkan poli, hari, atau nama dokter sebelum berkunjung.
          </p>
        </div>
      </section>
      <div className="page-shell">
        <div className="content-container max-w-5xl">
          <ScheduleExplorer scheduleData={scheduleData} initialPoli={initialPoli} />
        </div>
      </div>
    </>
  );
}
