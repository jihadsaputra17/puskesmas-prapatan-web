export default function BeritaSkeleton() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bagian Judul Statik */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Berita Terbaru
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl">
              Kabar dan informasi terkini seputar layanan dan kegiatan kesehatan di Puskesmas Prapatan.
            </p>
          </div>
          {/* Tombol Skeleton */}
          <div className="h-[46px] w-[160px] bg-slate-200 border border-slate-300 rounded-md animate-pulse"></div>
        </div>

        {/* Bagian Skeleton Kartu Berita */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article key={i} className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="w-full h-48 bg-slate-200 animate-pulse"></div>
              
              <div className="flex flex-col p-6 space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 bg-slate-300 rounded w-3/4 animate-pulse"></div>
                <div className="space-y-2 mt-2">
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}