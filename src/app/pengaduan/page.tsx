import { Metadata } from "next";
import PengaduanForm from "./PengaduanForm";

export const metadata: Metadata = {
  title: "Pengaduan",
  description: "Sampaikan pengaduan atau masukan untuk Puskesmas Prapatan.",
};

export default function PengaduanPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Pengaduan</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#12304a] sm:text-5xl">Sampaikan pengaduan atau masukan</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Gunakan formulir ini untuk menyiapkan pengaduan. Informasi kontak resmi akan ditampilkan setelah dikonfirmasi oleh puskesmas.</p>
        </div>
      </section>
      <section className="container max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><PengaduanForm /></section>
    </main>
  );
}
