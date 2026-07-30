import { Metadata } from "next";
import PengaduanForm from "./PengaduanForm";

export const metadata: Metadata = {
  title: "Pengaduan — Puskesmas Prapatan",
  description: "Sampaikan pengaduan, saran, atau masukan untuk Puskesmas Prapatan.",
};

export default function PengaduanPage() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Pengaduan</p>
          <h1 className="page-intro-title mt-3">Sampaikan pengaduan atau masukan</h1>
          <p className="page-intro-copy">
            Setiap masukan dari Anda membantu kami meningkatkan kualitas pelayanan.
            Pengaduan akan dikirim langsung ke email resmi Puskesmas Prapatan.
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
