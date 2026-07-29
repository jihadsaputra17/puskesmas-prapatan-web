import type { Metadata } from "next";
import ScheduleExplorer from "@/components/jadwal/ScheduleExplorer";
import { getJadwalDokter } from "@/lib/actions";

export const metadata: Metadata = { title: "Jadwal dokter", description: "Informasi jadwal praktik dokter dan pelayanan poli di Puskesmas Prapatan." };

export default async function JadwalDokterPage({ searchParams }: { searchParams: Promise<{ poli?: string | string[] }> }) {
  const [scheduleData, params] = await Promise.all([getJadwalDokter(), searchParams]);
  const initialPoli = typeof params.poli === "string" ? params.poli : undefined;
  return <div className="page-shell"><div className="content-container max-w-5xl"><h1 className="text-4xl font-bold tracking-tight text-[#12304a]">Jadwal dokter</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Cari jadwal pelayanan berdasarkan poli atau hari sebelum berkunjung.</p><div className="mt-10"><ScheduleExplorer scheduleData={scheduleData} initialPoli={initialPoli} /></div></div></div>;
}
