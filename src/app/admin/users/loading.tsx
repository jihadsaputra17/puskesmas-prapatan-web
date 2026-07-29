export default function UsersLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Memuat data pengguna...</p>
      </div>
    </div>
  );
}