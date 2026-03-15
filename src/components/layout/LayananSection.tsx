import Image from 'next/image';
import Link from 'next/link';

const layananData = [
  {
    id: 'poli-umum',
    title: 'Poli Umum',
    description: 'Pemeriksaan kesehatan umum untuk dewasa dengan dokter berpengalaman.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Poli Umum%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'poli-gigi',
    title: 'Poli Gigi',
    description: 'Pemeriksaan dan perawatan kesehatan gigi serta mulut secara profesional.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Poli Gigi%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
  {
    id: 'poli-kia',
    title: 'Poli KIA & KB',
    description: 'Kesehatan Ibu, Anak, dan Keluarga Berencana untuk generasi yang sehat.',
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f1f5f9%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%2394a3b8%22%3EGambar Poli KIA%3C%2Ftext%3E%3C%2Fsvg%3E',
  },
];

const LayananSection = () => {
  return (
    <section className="py-16 bg-white" aria-labelledby="layanan-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="layanan-heading" className="text-3xl font-bold tracking-tight text-slate-900">
            Layanan Poli Kami
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Puskesmas Prapatan menyediakan berbagai layanan poli untuk kebutuhan kesehatan Anda.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {layananData.map((layanan) => (
            <div 
              key={layanan.id} 
              className="group relative rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2"
            >
              {/* Bagian Gambar Header Card dengan alt text */}
              <div className="relative w-full h-48 bg-slate-100">
                <Image
                  src={layanan.imageUrl}
                  alt={`Fasilitas dan pelayanan di ${layanan.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Bagian Konten Card */}
              <div className="p-6">
                <div className="space-y-1.5 mb-4">
                  <h3 className="font-semibold leading-none tracking-tight text-xl">
                    <Link 
                      href={`/layanan#${layanan.id}`}
                      className="focus:outline-none before:absolute before:inset-0"
                      aria-label={`Lihat selengkapnya mengenai ${layanan.title}`}
                    >
                      {layanan.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-2">
                    {layanan.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LayananSection;