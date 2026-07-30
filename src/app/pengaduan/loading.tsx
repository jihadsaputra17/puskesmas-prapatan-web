export default function LoadingPengaduan() {
  return (
    <div className="animate-pulse">
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 rounded bg-slate-300" />
          <div className="mt-2 h-5 w-full max-w-lg rounded bg-slate-200" />
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="space-y-5">
              <div className="h-6 w-48 rounded bg-slate-300" />
              <div className="h-9 w-full rounded-lg bg-slate-100" />
              <div className="grid grid-cols-2 gap-5">
                <div className="h-9 rounded-lg bg-slate-100" />
                <div className="h-9 rounded-lg bg-slate-100" />
              </div>
              <div className="h-28 w-full rounded-lg bg-slate-100" />
              <div className="h-11 w-40 rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
