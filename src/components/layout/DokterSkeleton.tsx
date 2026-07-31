export default function DokterSkeleton() {
  return (
    <section
      className="section-band bg-[var(--sky-wash)]"
      aria-busy="true"
      aria-label="Memuat dokter"
    >
      <div className="content-container">
        <div className="max-w-2xl accent-bar">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-9 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel overflow-hidden">
              <div className="aspect-[4/5] w-full animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
