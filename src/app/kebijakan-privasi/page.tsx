import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi dan pelindungan data di website publik Puskesmas Prapatan.",
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="bg-white py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-200 pb-4">
          Kebijakan Privasi & Pelindungan Data
        </h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p className="text-lg">
            Puskesmas Prapatan sangat menghargai privasi dan pelindungan data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengelola informasi pada website publik kami, yang disusun berdasarkan kepatuhan terhadap <strong>Undang-Undang Pelindungan Data Pribadi (UU PDP)</strong> dan regulasi Kementerian Kesehatan Republik Indonesia.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Data Medis & Rekam Medis Elektronik (RME)</h2>
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800">
            <strong>PENTING: Website ini TIDAK PERNAH meminta, memproses, ataupun menyimpan data rekam medis, diagnosis, atau riwayat kesehatan Anda.</strong>
          </div>
          <p>
            Data Rekam Medis Elektronik (RME) dikelola secara terpisah secara ketat di dalam <em>Sistem Informasi Manajemen Puskesmas (SIMPUS)</em> internal kami. Sistem tersebut berjalan pada jaringan tertutup / infrastruktur terenkripsi yang memenuhi standar keamanan Kemenkes (terintegrasi dengan SATUSEHAT) dan sama sekali tidak memiliki akses silang dengan portal website publik ini.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Informasi yang Kami Kumpulkan</h2>
          <p>Melalui website profil ini, kami hanya mengumpulkan data yang secara sukarela Anda berikan pada formulir spesifik:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Formulir Pengaduan Publik:</strong> Nama lengkap, nomor telepon kontak, dan isi pesan pengaduan Anda.</li>
            <li><strong>Data Navigasi (Analitik Dasar):</strong> Informasi peramban web dan durasi kunjungan semata-mata untuk mengukur kinerja aksesibilitas website. Kami tidak melacak aktivitas Anda di luar domain kami.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Penggunaan & Keamanan Informasi</h2>
          <p>
            Informasi yang Anda sampaikan pada form pengaduan dilindungi dengan enkripsi transmisi (HTTPS) dan murni digunakan oleh staf Manajemen Puskesmas untuk menindaklanjuti keluhan terkait mutu layanan instansi. Kami menjamin untuk tidak pernah mendistribusikan, menjual, atau mengekspos data ini kepada pihak ketiga, agen komersial, ataupun entitas pemasaran manapun.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Perubahan Kebijakan</h2>
          <p>
            Demi menjaga kepatuhan hukum, kami dapat memodifikasi Kebijakan Privasi ini. Segala pembaruan yang berkaitan dengan regulasi keamanan siber fasyankes akan selalu kami refleksikan melalui laman ini.
          </p>
          
          <p className="mt-10 pt-6 border-t border-slate-200 text-sm font-medium">
            Terakhir diperbarui: Maret 2026
          </p>
        </div>
      </div>
    </main>
  );
}