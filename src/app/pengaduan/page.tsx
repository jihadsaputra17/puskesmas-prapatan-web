import { Metadata } from "next";
import PengaduanForm from "./PengaduanForm";

export const metadata: Metadata = {
  title: "Pengaduan",
  description: "Sampaikan pengaduan atau masukan untuk Puskesmas Prapatan.",
};

export default function PengaduanPage() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Pengaduan</p>
          <h1 className="page-intro-title mt-3">Sampaikan pengaduan atau masukan</h1>
          <p className="page-intro-copy">
            Gunakan formulir ini untuk menyiapkan pengaduan. Informasi kontak resmi akan ditampilkan
            setelah dikonfirmasi oleh puskesmas.
          </p>
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          <div className="panel p-6 sm:p-8">
            <PengaduanForm />
          </div>
        </div>
      </section>
    </>
  );
}
