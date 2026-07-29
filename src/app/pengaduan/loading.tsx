export default function LoadingPengaduan() {
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
        <div className="content-container max-w-2xl">
          <div className="panel p-6 sm:p-8">
            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
                  <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
                </div>
              ))}
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
                <div className="h-28 w-full bg-slate-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-11 w-40 bg-slate-300 rounded-[10px] animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
