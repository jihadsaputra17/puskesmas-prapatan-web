import { Metadata } from "next";
import ServiceExplorer from "@/components/layanan/ServiceExplorer";
import { getLayanan } from "@/lib/layanan-actions";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Daftar layanan di Puskesmas Prapatan.",
};

export default async function LayananPage() {
  const services = await getLayanan();

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-14 md:py-20">
        <div className="container max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#12304a] sm:text-5xl">Layanan kesehatan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">Temukan layanan yang tersedia dan baca informasi lebih lanjut sebelum berkunjung.</p>
        </div>
      </section>
      <main className="container max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ServiceExplorer services={services.map((service) => ({
          id: String(service.id), nama_poli: service.nama_poli, deskripsi: service.deskripsi, icon: service.icon,
        }))} />
      </main>
    </>
  );
}
