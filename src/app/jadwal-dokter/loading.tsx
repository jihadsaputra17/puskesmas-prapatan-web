export default function LoadingJadwalDokter() {
  return (
    <main className="py-16 md:py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Bagian Judul (Statik, langsung muncul agar pengunjung bisa membacanya) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Jadwal Dokter & Pelayanan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Berikut adalah jadwal pelayanan tenaga medis kami. Silakan gunakan fitur pencarian di bawah untuk memfilter jadwal berdasarkan poli atau layanan.
          </p>
        </div>
        
        {/* Bagian Skeleton untuk Tabel & Filter */}
        <div className="space-y-6">
          {/* Skeleton Filter Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded-md w-full sm:w-[200px] animate-pulse"></div>
          </div>

          {/* Skeleton Tabel */}
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
            {/* Header Tabel */}
            <div className="bg-slate-100 border-b border-slate-200 flex h-[57px] items-center px-6 gap-4">
               <div className="h-4 bg-slate-300 rounded w-1/4 animate-pulse"></div>
               <div className="h-4 bg-slate-300 rounded w-1/4 animate-pulse"></div>
               <div className="h-4 bg-slate-300 rounded w-1/4 animate-pulse"></div>
               <div className="h-4 bg-slate-300 rounded w-1/4 animate-pulse"></div>
            </div>
            {/* Baris Tabel */}
            <div className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex h-[73px] items-center px-6 gap-4">
                   <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                   <div className="h-6 bg-teal-100/50 rounded-full w-1/6 animate-pulse"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/5 animate-pulse"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/5 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}