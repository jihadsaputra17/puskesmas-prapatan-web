"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell">
      <div className="content-container max-w-2xl">
        <p className="eyebrow">Gangguan</p>
        <h1 className="page-intro-title mt-3">Halaman belum dapat dimuat</h1>
        <p className="page-intro-copy">
          Silakan coba lagi. Jika masalah berlanjut, hubungi puskesmas melalui kanal resmi yang
          telah dikonfirmasi.
        </p>
        <button type="button" onClick={reset} className="button-primary mt-8">
          Coba lagi
        </button>
      </div>
    </div>
  );
}
