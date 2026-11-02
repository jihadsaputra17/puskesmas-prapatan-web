"use client";

export default function PpidError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="page-shell">
      <div className="content-container max-w-xl">
        <div className="panel p-8 text-center">
          <h2 className="text-xl font-bold text-navy">Gagal memuat data PPID</h2>
          <p className="mt-2 text-sm text-slate-600">
            Terjadi kendala saat mengambil daftar informasi publik. Silakan coba kembali.
          </p>
          <button type="button" onClick={() => reset()} className="button-primary mt-5">
            Muat ulang
          </button>
        </div>
      </div>
    </div>
  );
}
