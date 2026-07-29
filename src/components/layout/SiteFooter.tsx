import Link from "next/link";

export default function SiteFooter({ settings }: { settings: Record<string, string> }) {
  const name = settings.site_name || "Puskesmas Prapatan";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy text-slate-100">
      <div className="content-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:py-14">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
              </svg>
            </span>
            <p className="text-lg font-bold tracking-tight text-white">{name}</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
            Informasi layanan kesehatan primer untuk masyarakat. Data pada situs ini bersumber dari pengaturan resmi puskesmas.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-200">Navigasi</p>
          <div className="mt-4 grid gap-1 text-sm">
            <Link className="footer-link mt-0" href="/layanan">Layanan</Link>
            <Link className="footer-link mt-0" href="/jadwal-dokter">Jadwal dokter</Link>
            <Link className="footer-link mt-0" href="/berita">Berita</Link>
            <Link className="footer-link mt-0" href="/pengaduan">Pengaduan</Link>
            <Link className="footer-link mt-0" href="/profil">Profil</Link>
          </div>
        </div>

        <address className="not-italic">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-200">Hubungi kami</p>
          <div className="mt-4 space-y-2 text-sm leading-7 text-slate-200">
            {settings.address && <p>{settings.address}</p>}
            {settings.phone && (
              <a className="footer-link mt-0" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a className="footer-link mt-0" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            )}
          </div>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="content-container flex flex-col gap-3 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {name}. Hak cipta dilindungi.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-white" href="/kebijakan-privasi">Kebijakan privasi</Link>
            {settings.instagram && (
              <a className="hover:text-white" href={settings.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            {settings.facebook && (
              <a className="hover:text-white" href={settings.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
