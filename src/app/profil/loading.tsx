export default function LoadingProfil() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-16 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-9 w-56 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-5 w-72 bg-slate-200 rounded animate-pulse" />
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          <div className="panel p-6 sm:p-8">
            <div className="h-6 w-40 bg-slate-300 rounded animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="mt-1 h-4 w-40 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
