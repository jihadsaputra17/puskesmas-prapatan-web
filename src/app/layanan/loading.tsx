export default function LoadingLayanan() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-20 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-9 w-56 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-5 w-72 bg-slate-200 rounded animate-pulse" />
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container">
          {/* Search bar skeleton */}
          <div className="mb-6 h-10 w-full max-w-md bg-slate-200 rounded-lg animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="panel flex h-full flex-col p-6">
                <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
                <div className="mt-5 h-5 w-2/3 bg-slate-300 rounded animate-pulse" />
                <div className="mt-3 space-y-2 flex-grow">
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
