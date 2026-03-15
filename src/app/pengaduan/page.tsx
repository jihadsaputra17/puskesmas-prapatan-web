import { Metadata } from "next";
import PengaduanForm from "./PengaduanForm";

export const metadata: Metadata = {
  title: "Pengaduan & Kontak",
  description: "Layanan pengaduan masyarakat dan informasi kontak Puskesmas Prapatan.",
};

export default function PengaduanPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Pengaduan */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Layanan Pengaduan & Kontak
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Kami selalu terbuka untuk mendengarkan saran, kritik, maupun pertanyaan Anda guna meningkatkan kualitas pelayanan kesehatan di Puskesmas Prapatan.
          </p>
        </div>
      </section>

      {/* Area Utama: Info Kontak & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Bagian Kiri: Informasi Kontak */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Hubungi Kami</h2>
              <p className="text-slate-600 mb-8">
                Silakan hubungi kami melalui kontak di bawah ini, atau datang langsung ke lokasi puskesmas kami pada jam operasional.
              </p>

              <div className="space-y-6">
                {/* Item Alamat */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Alamat</h3>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      Jl. Prapatan Dalam No. 6, Prapatan, <br />
                      Kec. Balikpapan Kota, Kota Balikpapan, <br />
                      Kalimantan Timur 76111
                    </p>
                  </div>
                </div>

                {/* Item Telepon & WA */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Telepon & WhatsApp</h3>
                    <p className="text-slate-600 mt-1">Telepon: (0542) 123-456</p>
                    <p className="text-slate-600">WhatsApp: +62 812-3456-7890 (Chat Only)</p>
                  </div>
                </div>

                {/* Item Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Email</h3>
                    <p className="text-slate-600 mt-1">info@puskesmasprapatan.go.id</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Kanan: Formulir Pengaduan */}
            <PengaduanForm />
          </div>
        </div>
      </section>
    </main>
  );
}