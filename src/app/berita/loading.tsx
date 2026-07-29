export default function LoadingBerita() {
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="panel flex flex-col overflow-hidden">
                <div className="h-48 w-full bg-slate-200 animate-pulse" />
                <div className="flex flex-grow flex-col p-5 space-y-3">
                  <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-full bg-slate-300 rounded animate-pulse" />
                  <div className="space-y-2 flex-grow">
                    <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-4/6 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
