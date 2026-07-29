import { Metadata } from "next";
import LayananSection from "../../components/layout/LayananSection";
import LayananSkeleton from "../../components/layout/LayananSkeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Layanan & Fasilitas",
  description: "Daftar layanan poli dan fasilitas penunjang di Puskesmas Prapatan.",
};

export default async function LayananPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Khusus Halaman Layanan */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Layanan & Fasilitas
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Puskesmas Prapatan menyediakan berbagai layanan kesehatan primer yang terjangkau dan berkualitas untuk memenuhi kebutuhan masyarakat di wilayah kerja kami.
          </p>
        </div>
      </section>

      {/* Bagian Layanan Poli dari Komponen yang sudah ada */}
      <div className="-mt-8">
        <Suspense fallback={<LayananSkeleton />}>
          <LayananSection />
        </Suspense>
      </div>

      {/* Fasilitas Penunjang */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Fasilitas Penunjang</h2>
            <p className="mt-4 text-lg text-slate-600">Selain layanan poli, kami juga dilengkapi dengan fasilitas medis pendukung untuk memaksimalkan pelayanan kesehatan Anda.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Laboratorium */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Laboratorium Dasar</h3>
                <p className="text-slate-600 leading-relaxed">Melayani pemeriksaan darah rutin, urine, gula darah, kolesterol, dan tes penunjang dasar lainnya secara cepat dan akurat untuk membantu diagnosis dokter.</p>
              </div>
            </div>

            {/* Farmasi */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Apotek / Farmasi</h3>
                <p className="text-slate-600 leading-relaxed">Penyediaan obat-obatan sesuai resep dokter puskesmas dengan pendampingan edukasi aturan pakai yang jelas oleh petugas farmasi yang handal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}