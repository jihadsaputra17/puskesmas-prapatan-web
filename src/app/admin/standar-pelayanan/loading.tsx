export default function StandarPelayananAdminLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--teal)]"></div>
        <p className="animate-pulse font-medium text-[var(--muted)]">Memuat daftar Standar Pelayanan...</p>
      </div>
    </div>
  );
}
