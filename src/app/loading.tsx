export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      {/* Lingkaran Loading (Spinner) */}
      <div className="w-12 h-12 border-4 border-slate-100 border-t-teal-600 rounded-full animate-spin"></div>
      {/* Teks Berkedip Halus */}
      <p className="text-slate-500 font-medium animate-pulse">Memuat halaman...</p>
    </div>
  );
}