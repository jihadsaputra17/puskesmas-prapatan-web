export default function LoadingKebijakanPrivasi() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-24 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-9 w-48 bg-slate-300 rounded animate-pulse" />
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          <div className="panel p-6 sm:p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-5 w-2/3 bg-slate-300 rounded animate-pulse" />
                <div className="mt-2 space-y-2">
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
