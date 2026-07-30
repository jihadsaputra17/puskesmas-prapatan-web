export default function LoadingBeritaDetail() {
  return (
    <div className="bg-white">
      <div className="content-container max-w-4xl pt-5">
        <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="content-container max-w-4xl space-y-4 pb-8 pt-6">
        <div className="h-6 w-32 animate-pulse rounded-full bg-clinic-soft" />
        <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        <div className="mt-2 flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="content-container max-w-4xl">
        <div className="aspect-video w-full animate-pulse rounded-[18px] bg-slate-200" />
      </div>
      <div className="content-container max-w-4xl space-y-3 py-8">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
