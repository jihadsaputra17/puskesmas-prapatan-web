export default function LayananSkeleton() {
  return (
    <section className="section-band bg-white" id="layanan" aria-busy="true" aria-label="Memuat layanan">
      <div className="content-container">
        <div className="max-w-2xl accent-bar">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-9 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel flex h-full flex-col p-6">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
              <div className="mt-5 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
