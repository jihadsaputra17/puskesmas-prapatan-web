import Link from "next/link";

export default function ClinicHero({ settings }: { settings: Record<string, string> }) {
  const name = settings.site_name || "Puskesmas Prapatan";
  const title = settings.hero_title || "Pelayanan kesehatan untuk masyarakat";
  const subtitle = settings.hero_subtitle || "Temukan informasi layanan, jadwal dokter, dan saluran pengaduan dalam satu tempat.";
  return <section className="bg-[#12304a] py-14 text-white md:py-20"><div className="content-container grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><div><p className="text-sm font-semibold tracking-wide text-teal-200">LAYANAN KESEHATAN MASYARAKAT</p><h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1><p className="mt-4 text-2xl font-semibold text-teal-100">{title}</p><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{subtitle}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/layanan" className="button-primary">Lihat layanan</Link><Link href="/jadwal-dokter" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white px-5 py-3 font-semibold text-white hover:bg-white/10">Jadwal dokter</Link></div></div><aside className="rounded-xl border border-white/20 bg-white/10 p-6"><p className="font-semibold">Butuh bantuan?</p><p className="mt-2 text-slate-200">Gunakan pengaduan untuk menyampaikan masukan atau kendala layanan.</p><Link href="/pengaduan" className="mt-5 inline-flex font-semibold text-teal-100 underline underline-offset-4">Sampaikan pengaduan</Link></aside></div></section>;
}
