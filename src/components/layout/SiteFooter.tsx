import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  {
    href: "https://web.facebook.com/profile.php?id=61564150502560",
    label: "Facebook",
    title: "Facebook Puskesmas Prapatan",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    href: "https://www.instagram.com/puskesmas.prapatan/",
    label: "Instagram",
    title: "Instagram Puskesmas Prapatan",
    path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  {
    href: "https://www.youtube.com/@puskesmasprapatanbalikpapa1711",
    label: "YouTube",
    title: "YouTube Puskesmas Prapatan",
    path: "M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z",
  },
];

export default function SiteFooter({ settings }: { settings: Record<string, string> }) {
  const name = settings.site_name || "Puskesmas Prapatan";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy text-slate-100">
      <div className="content-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:py-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden" aria-hidden="true">
              <Image
                src="/images/logo-pkm.png"
                alt=""
                fill
                className="object-contain"
                sizes="40px"
              />
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
        <div className="content-container flex flex-col gap-4 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {name}. Hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link className="hover:text-white" href="/kebijakan-privasi">Kebijakan privasi</Link>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.title}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-clinic-teal hover:text-white"
                  aria-label={s.label}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
