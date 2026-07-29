export default function LayananSkeleton() {
  return (
    <section className="py-16 bg-white" id="layanan">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Bagian Judul (Statik, agar pengunjung bisa langsung membacanya) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Layanan Poli Kami
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan kesehatan primer yang terjangkau dan berkualitas untuk masyarakat.
          </p>
        </div>

        {/* Bagian Skeleton Kartu Poli */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-slate-200 rounded-xl mb-6 animate-pulse"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="space-y-3 flex-grow">
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}