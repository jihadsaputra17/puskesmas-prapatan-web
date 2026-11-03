export default function DetailStandarPelayananLoading() {
  return (
    <div className="page-shell bg-white">
      <div className="content-container max-w-4xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200" />
        <div className="aspect-video w-full animate-pulse rounded-[var(--radius-lg)] bg-slate-200" />
      </div>
    </div>
  );
}
