import { Metadata } from "next";
import ScheduleTable from "../../components/jadwal/ScheduleTable";

export const metadata: Metadata = {
  title: "Jadwal Dokter",
  description: "Informasi jadwal praktik dokter dan pelayanan poli di Puskesmas Prapatan.",
};

export default function JadwalDokterPage() {
  return (
    <main className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Jadwal Dokter & Pelayanan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Berikut adalah jadwal pelayanan tenaga medis kami. Silakan gunakan fitur pencarian di bawah untuk memfilter jadwal berdasarkan poli atau layanan.
          </p>
        </div>
        
        <ScheduleTable />
      </div>
    </main>
  );
}