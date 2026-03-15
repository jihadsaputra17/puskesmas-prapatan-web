import Image from 'next/image';
import Link from 'next/link';

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
];

const BeritaSection = () => {
  return (
    <section className="py-16 bg-slate-50" aria-labelledby="berita-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 id="berita-heading" className="text-3xl font-bold tracking-tight text-slate-900">
              Berita Terbaru
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl">
              Kabar dan informasi terkini seputar layanan dan kegiatan kesehatan di Puskesmas Prapatan.
            </p>
          </div>
          <Link 
            href="/berita" 
            className="inline-flex items-center px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 whitespace-nowrap"
          >
            Lihat Semua Berita
          </Link>
        </div>

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
                <h3 className="font-bold leading-tight text-lg mb-3">
                  <Link href={`/berita/${berita.id}`} className="focus:outline-none before:absolute before:inset-0 group-hover:text-teal-600 transition-colors" aria-label={`Baca selengkapnya mengenai ${berita.title}`}>
                    {berita.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">
                  {berita.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeritaSection;