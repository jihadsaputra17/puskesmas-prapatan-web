import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="content-container max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="page-intro-title mt-3">Halaman tidak ditemukan</h1>
        <p className="page-intro-copy">
          Alamat yang Anda buka tidak tersedia atau telah berubah.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="button-primary">
            Kembali ke beranda
          </Link>
          <Link href="/layanan" className="button-secondary">
            Lihat layanan
          </Link>
        </div>
      </div>
    </div>
  );
}
