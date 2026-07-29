export default function BeritaSkeleton() {
  return (
    <section className="section-band bg-clinic-wash" aria-busy="true" aria-label="Memuat berita">
      <div className="content-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl accent-bar">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-9 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-[10px] bg-slate-200" />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article key={i} className="panel overflow-hidden">
              <div className="h-44 w-full animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
