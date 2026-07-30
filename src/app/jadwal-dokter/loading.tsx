export default function LoadingJadwalDokter() {
  return (
    <div className="animate-pulse">
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-48 rounded bg-slate-300" />
          <div className="mt-2 h-5 w-96 max-w-full rounded bg-slate-200" />
        </div>
      </section>
      <div className="page-shell">
        <div className="content-container max-w-5xl space-y-4">
          <div className="panel h-32 rounded-xl bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 rounded bg-slate-200" />
                  <div className="h-10 w-full rounded-lg bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
          {[0, 1, 2].map((g) => (
            <div key={g} className="space-y-3">
              <div className="h-5 w-24 rounded bg-slate-300" />
              <div className="grid gap-3">
                {[1, 2].map((c) => (
                  <div key={c} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                    <div className="h-7 w-28 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
