export default function PpidLoading() {
  return (
    <div className="page-shell">
      <div className="content-container max-w-6xl space-y-8">
        <div className="h-44 animate-pulse rounded-[var(--radius-lg)] bg-slate-200" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel h-72 animate-pulse bg-slate-100 p-5" />
          ))}
        </div>
      </div>
    </div>
  );
}
