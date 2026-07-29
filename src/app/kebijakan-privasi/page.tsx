import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Informasi privasi untuk website Puskesmas Prapatan.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-white py-14 md:py-20">
      <article className="container max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="border-b border-slate-200 pb-5 text-4xl font-extrabold tracking-tight text-[#12304a]">Kebijakan privasi</h1>
        <div className="mt-8 space-y-7 leading-7 text-slate-700">
          <p>Halaman ini menjelaskan informasi privasi untuk penggunaan website publik Puskesmas Prapatan.</p>
          <section><h2 className="text-2xl font-bold text-[#12304a]">Informasi yang Anda kirim</h2><p className="mt-3">Jangan masukkan rekam medis, diagnosis, nomor identitas, atau data kesehatan sensitif ke formulir publik. Data yang dikirim melalui formulir hanya boleh diproses setelah layanan penerimaan pengaduan resmi tersedia dan kebijakannya dikonfirmasi.</p></section>
          <section><h2 className="text-2xl font-bold text-[#12304a]">Pembaruan kebijakan</h2><p className="mt-3">Kebijakan ini dapat diperbarui saat proses pengelolaan data dan kanal kontak resmi telah ditetapkan.</p></section>
        </div>
      </article>
    </main>
  );
}
