import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description: "Berita terbaru, pengumuman, dan artikel kesehatan dari Puskesmas Prapatan.",
};

const beritaData = [
  {
    id: 'berita-1',
    title: 'Vaksinasi Polio Massal di Puskesmas Prapatan',
    date: '10 Maret 2026',
    excerpt: 'Puskesmas Prapatan akan mengadakan program vaksinasi polio massal untuk anak-anak balita di wilayah Prapatan.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 1%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'berita-2',
    title: 'Penyuluhan Gizi Buruk Ibu Hamil',
    date: '05 Maret 2026',
    excerpt: 'Kegiatan penyuluhan tentang pentingnya asupan gizi yang seimbang bagi ibu hamil di balai warga Prapatan.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 2%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'berita-3',
    title: 'Jadwal Baru Poli Gigi Bulan Ramadhan',
    date: '28 Februari 2026',
    excerpt: 'Penyesuaian jadwal layanan Poli Gigi selama bulan suci Ramadhan. Simak jadwal selengkapnya di sini.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 3%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'berita-4',
    title: 'Layanan Konsultasi Psikologi Remaja',
    date: '20 Februari 2026',
    excerpt: 'Puskesmas Prapatan kini membuka layanan konsultasi psikologi khusus untuk remaja setiap hari Jumat.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 4%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'berita-5',
    title: 'Pemeriksaan Kesehatan Gratis Lansia',
    date: '15 Februari 2026',
    excerpt: 'Dalam rangka hari lansia, diadakan pemeriksaan kesehatan dan cek gula darah gratis di balai desa Prapatan.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 5%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'berita-6',
    title: 'Tips Menjaga Daya Tahan Tubuh Saat Pancaroba',
    date: '02 Februari 2026',
    excerpt: 'Musim pancaroba telah tiba. Simak panduan dan tips dari dokter kami agar Anda dan keluarga tetap sehat.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Berita 6%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
];

export default function BeritaPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Halaman Berita */}
      <section className="bg-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Berita & Informasi Terkini
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Dapatkan kabar, pengumuman, dan artikel kesehatan terbaru langsung dari tenaga medis Puskesmas Prapatan.
          </p>
        </div>
      </section>

      {/* Daftar Grid Berita */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {beritaData.map((berita) => (
              <article 
                key={berita.id} 
                className="group flex flex-col rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2"
              >
                <div className="relative w-full h-48 bg-slate-100 shrink-0 overflow-hidden">
                  <Image src={berita.imageUrl} alt={`Ilustrasi untuk berita: ${berita.title}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                
                <div className="flex flex-col flex-grow p-6">
                  <time className="text-sm font-medium text-teal-600 mb-2">
                    {berita.date}
                  </time>
                  <h2 className="font-bold leading-tight text-xl mb-3">
                    <Link href={`/berita/${berita.id}`} className="focus:outline-none before:absolute before:inset-0 group-hover:text-teal-600 transition-colors" aria-label={`Baca selengkapnya mengenai ${berita.title}`}>
                      {berita.title}
                    </Link>
                  </h2>
                  <p className="text-base text-slate-600 line-clamp-3 mb-4 flex-grow">
                    {berita.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Tombol Load More (Hanya UI) */}
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2">
              Muat Lebih Banyak Berita
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}