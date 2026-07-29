"use client";

export default function JadwalDokterError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="container max-w-4xl px-4 py-16 sm:px-6 lg:px-8"><h1 className="text-3xl font-bold text-[#12304a]">Jadwal dokter belum dapat dimuat</h1><p className="mt-3 text-slate-600">Silakan coba lagi nanti.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-lg bg-teal-700 px-5 font-semibold text-white">Coba lagi</button></section>;
}
