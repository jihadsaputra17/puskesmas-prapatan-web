import Link from "next/link";

const items = [
  {
    href: "/layanan",
    title: "Layanan kesehatan",
    text: "Poli dan layanan yang tersedia",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  {
    href: "/jadwal-dokter",
    title: "Jadwal dokter",
    text: "Cari berdasarkan poli dan hari",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    href: "/berita",
    title: "Berita & info",
    text: "Pengumuman dan artikel kesehatan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h12a2 2 0 012 2v12H6a2 2 0 01-2-2V5z" />
        <path strokeLinecap="round" d="M8 9h6M8 13h4" />
      </svg>
    ),
  },
  {
    href: "/pengaduan",
    title: "Pengaduan",
    text: "Sampaikan masukan layanan",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8.5 8.5 0 11-3.2-6.6L21 5v7z" />
      </svg>
    ),
  },
];

export default function QuickAccess() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-8 md:py-10" aria-labelledby="quick-access-heading">
      <div className="content-container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Akses cepat</p>
            <h2 id="quick-access-heading" className="mt-2 text-xl font-bold tracking-tight text-navy sm:text-2xl">
              Ke mana Anda ingin pergi?
            </h2>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                className="group flex h-full items-start gap-3 rounded-panel border border-slate-200 bg-clinic-wash/60 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-white hover:shadow-lift"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-clinic-soft text-clinic-teal transition group-hover:bg-clinic-teal group-hover:text-white">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-navy group-hover:text-clinic-teal">
                    {item.title}
                  </span>
                  <span className="mt-1 block truncate text-sm leading-6 text-slate-600" title={item.text}>
                    {item.text}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
