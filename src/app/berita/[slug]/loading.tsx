export default function LoadingBeritaDetail() {
  return (
    <main className="bg-white min-h-[70vh] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Skeleton untuk Link Kembali */}
        <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mb-10"></div>

        <article className="space-y-8">
          {/* Skeleton untuk Judul & Metadata */}
          <div className="space-y-4">
            <div className="h-10 bg-slate-300 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-slate-300 rounded w-1/2 animate-pulse"></div>
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse pt-2"></div>
          </div>

          {/* Skeleton untuk Gambar Utama */}
          <div className="w-full h-64 md:h-80 bg-slate-200 rounded-xl animate-pulse"></div>

          {/* Skeleton untuk Konten Artikel */}
          <div className="prose prose-slate max-w-none prose-lg space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse mt-6"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-full animate-pulse mt-6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
          </div>
        </article>
      </div>
    </main>
  );
}