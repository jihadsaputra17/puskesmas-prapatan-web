export default function LoadingLayananDetail() {
  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-20 bg-slate-300 rounded animate-pulse" />
          <div className="mt-3 h-9 w-56 bg-slate-300 rounded animate-pulse" />
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          {/* Back link skeleton */}
          <div className="mb-8 h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="panel p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 bg-slate-200 rounded-xl shrink-0 animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-2/3 bg-slate-300 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
