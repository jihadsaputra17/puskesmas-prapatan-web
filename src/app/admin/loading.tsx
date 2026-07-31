export default function AdminDashboardLoading() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
      </header>

      <section aria-label="Memuat ringkasan konten" className="grid gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="panel p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </section>

      <section className="section-band">
        <div className="panel p-6">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-6 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-12 w-full animate-pulse rounded bg-slate-200" />
        </div>
      </section>
    </div>
  );
}
