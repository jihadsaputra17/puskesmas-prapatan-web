import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil, Visi, Misi, dan Sejarah Puskesmas Prapatan Kota Balikpapan.",
};

export default function ProfilPage() {
  return (
    <main className="bg-white">
      {/* Hero Profil */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Profil Puskesmas Prapatan
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Mengenal lebih dekat Puskesmas Prapatan sebagai fasilitas pelayanan kesehatan tingkat pertama yang berkomitmen memberikan layanan optimal bagi masyarakat.
          </p>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-64 sm:h-80 md:h-full min-h-[300px] rounded-xl overflow-hidden shadow-md bg-slate-100">
              {/* Gunakan placeholder gambar sementara */}
              <Image 
                src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 600 800%22%3E%3Crect width%3D%22600%22 height%3D%22800%22 fill%3D%22%23e2e8f0%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2224%22 fill%3D%22%2364748b%22%3EFoto Gedung Puskesmas%3C%2Ftext%3E%3C%2Fsvg%3E" 
                alt="Gedung Puskesmas Prapatan" 
                fill 
                className="object-cover" 
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Sejarah Singkat</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Puskesmas Prapatan telah berdiri sejak tahun [Tahun Berdiri] dan berlokasi di pusat wilayah Kecamatan Balikpapan Kota. Sejak awal berdirinya, Puskesmas Prapatan selalu menjadi garda terdepan dalam pelayanan kesehatan masyarakat.
                </p>
                <p>
                  Seiring dengan perkembangan zaman dan meningkatnya kebutuhan masyarakat akan fasilitas kesehatan yang memadai, Puskesmas Prapatan terus melakukan pembenahan, baik dari segi infrastruktur, sarana prasarana medis, hingga peningkatan kualitas Sumber Daya Manusia (SDM).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi dan Misi */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Visi */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Visi</h2>
              <p className="text-lg text-slate-600 italic">
                &ldquo;Terwujudnya Masyarakat Prapatan yang Sehat, Mandiri, dan Berkualitas melalui Pelayanan Kesehatan Prima.&rdquo;
              </p>
            </div>

            {/* Card Misi */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Misi</h2>
              <ul className="space-y-3 text-slate-600 text-lg list-disc list-inside ml-4">
                <li>Memberikan pelayanan kesehatan tingkat pertama yang bermutu, merata, dan terjangkau.</li>
                <li>Mendorong kemandirian masyarakat untuk hidup sehat melalui promosi dan penyuluhan kesehatan.</li>
                <li>Meningkatkan profesionalisme dan kompetensi SDM di lingkungan Puskesmas Prapatan.</li>
                <li>Menjalin kemitraan dan kerja sama lintas sektor dalam mendukung pembangunan kesehatan.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}