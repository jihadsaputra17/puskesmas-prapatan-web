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
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Pelayanan</p>
          <h1 className="page-intro-title mt-3">Layanan kesehatan</h1>
          <p className="page-intro-copy">
            Temukan layanan yang tersedia dan baca informasi lebih lanjut sebelum berkunjung.
          </p>
        </div>
      </section>
      <div className="page-shell">
        <div className="content-container">
          <ServiceExplorer
            services={services.map((service) => ({
              id: String(service.id),
              nama_poli: service.nama_poli,
              deskripsi: service.deskripsi,
              icon: service.icon,
            }))}
          />
        </div>
      </div>
    </>
  );
}
