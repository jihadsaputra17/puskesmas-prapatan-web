import Link from "next/link";

export default function NotFound() {
  return <main className="container max-w-3xl px-4 py-20 sm:px-6 lg:px-8"><p className="font-semibold text-teal-700">404</p><h1 className="mt-2 text-4xl font-extrabold text-[#12304a]">Halaman tidak ditemukan</h1><p className="mt-4 text-lg text-slate-600">Alamat yang Anda buka tidak tersedia atau telah berubah.</p><Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Kembali ke beranda</Link></main>;
}
