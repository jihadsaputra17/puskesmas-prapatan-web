import type { Metadata } from "next";
import ScheduleExplorer from "@/components/jadwal/ScheduleExplorer";
import { getJadwalDokter } from "@/lib/actions";

export const metadata: Metadata = {
  title: "Jadwal dokter",
  description:
    "Informasi jadwal praktik dokter dan pelayanan poli di Puskesmas Prapatan.",
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
          <h1 className="page-intro-title mt-3">Jadwal dokter</h1>
          <p className="page-intro-copy">
            Cari jadwal pelayanan berdasarkan poli atau hari sebelum berkunjung.
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
