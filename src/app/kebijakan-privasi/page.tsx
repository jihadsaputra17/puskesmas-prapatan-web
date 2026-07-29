import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Informasi privasi untuk website Puskesmas Prapatan.",
};

export default function KebijakanPrivasiPage() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Hukum & privasi</p>
          <h1 className="page-intro-title mt-3">Kebijakan privasi</h1>
          <p className="page-intro-copy">
            Informasi privasi untuk penggunaan website publik Puskesmas Prapatan.
          </p>
        </div>
      </section>
      <section className="page-shell">
        <article className="content-container max-w-3xl">
          <div className="panel space-y-8 p-6 leading-7 text-slate-700 sm:p-8">
            <p>
              Halaman ini menjelaskan informasi privasi untuk penggunaan website publik Puskesmas
              Prapatan.
            </p>
            <section>
              <h2 className="text-xl font-bold text-navy">Informasi yang Anda kirim</h2>
              <p className="mt-3">
                Jangan masukkan rekam medis, diagnosis, nomor identitas, atau data kesehatan
                sensitif ke formulir publik. Data yang dikirim melalui formulir hanya boleh
                diproses setelah layanan penerimaan pengaduan resmi tersedia dan kebijakannya
                dikonfirmasi.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-navy">Pembaruan kebijakan</h2>
              <p className="mt-3">
                Kebijakan ini dapat diperbarui saat proses pengelolaan data dan kanal kontak resmi
                telah ditetapkan.
              </p>
            </section>
          </div>
        </article>
      </section>
    </>
  );
}
