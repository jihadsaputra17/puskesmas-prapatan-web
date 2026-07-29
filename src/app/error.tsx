"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="container max-w-3xl px-4 py-20 sm:px-6 lg:px-8"><h1 className="text-4xl font-extrabold text-[#12304a]">Halaman belum dapat dimuat</h1><p className="mt-4 text-lg text-slate-600">Silakan coba lagi. Jika masalah berlanjut, hubungi puskesmas melalui kanal resmi yang telah dikonfirmasi.</p><button type="button" onClick={reset} className="mt-8 min-h-11 rounded-lg bg-teal-700 px-5 font-semibold text-white hover:bg-teal-800">Coba lagi</button></main>;
}
