import { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_SOCIAL_SETTINGS, getSettings } from "@/lib/settings-actions";

export const metadata: Metadata = {
  title: "Media Sosial Resmi — UPTD Puskesmas Prapatan",
  description:
    "Kanal Media Sosial Resmi UPTD Puskesmas Prapatan Kota Balikpapan — Instagram, Facebook, YouTube, TikTok, Threads, dan Digitalisasi Keterbukaan Informasi Publik.",
};

type SocialChannel = {
  id: string;
  platform: string;
  handle: string;
  badge: string;
  description: string;
  href: string;
  accentGradient: string;
  iconBg: string;
  ctaLabel: string;
  icon: React.ReactNode;
};

function cleanSocialUrl(value: string | undefined, fallback: string, legacySubstring?: string) {
  if (!value || !value.trim()) return fallback;
  if (legacySubstring && value.includes(legacySubstring)) return fallback;
  return value.trim();
}

function extractHandle(url: string, fallbackHandle: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      if (last && last !== "profile.php") {
        return last.startsWith("@") ? last : `@${last}`;
      }
    }
    return fallbackHandle;
  } catch {
    return fallbackHandle;
  }
}

export default async function MediaSosialPage() {
  const settings = await getSettings();

  const instagramUrl = cleanSocialUrl(
    settings.instagram,
    DEFAULT_SOCIAL_SETTINGS.instagram,
    "instagram.com/puskesmasprapatan",
  );
  const facebookUrl = cleanSocialUrl(
    settings.facebook,
    DEFAULT_SOCIAL_SETTINGS.facebook,
    "facebook.com/puskesmasprapatan",
  );
  const youtubeUrl = cleanSocialUrl(settings.youtube, DEFAULT_SOCIAL_SETTINGS.youtube);
  const tiktokUrl = cleanSocialUrl(settings.tiktok, DEFAULT_SOCIAL_SETTINGS.tiktok);
  const threadsUrl = cleanSocialUrl(settings.threads, DEFAULT_SOCIAL_SETTINGS.threads);

  const phone =
    settings.phone && !settings.phone.includes("123456")
      ? settings.phone
      : DEFAULT_SOCIAL_SETTINGS.phone;
  const email =
    settings.email && !settings.email.includes("info@puskesmasprapatan.com")
      ? settings.email
      : DEFAULT_SOCIAL_SETTINGS.email;
  const whatsappRaw = (settings.whatsapp || "").replace(/[^0-9]/g, "");
  const whatsappUrl = whatsappRaw ? `https://wa.me/${whatsappRaw}` : "";

  const channels: SocialChannel[] = [
    {
      id: "instagram",
      platform: "Instagram Resmi",
      handle: extractHandle(instagramUrl, "@puskesmas.prapatan"),
      badge: "Aktif Setiap Hari · Edukasi & Informasi Layanan",
      description:
        "Ikuti pengumuman jadwal pelayanan terbaru, liputan kegiatan Posyandu & Puskesmas Keliling, infografis kesehatan masyarakat, serta informasi publik berkala di Instagram resmi UPTD Puskesmas Prapatan.",
      href: instagramUrl,
      accentGradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
      iconBg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
      ctaLabel: "Buka Instagram @puskesmas.prapatan ↗",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      platform: "Facebook Resmi",
      handle: "Puskesmas Prapatan Balikpapan",
      badge: "Halaman Komunitas & Pengumuman Warga",
      description:
        "Saluran berbagi berita kegiatan Puskesmas, sosialisasi program kesehatan Pemerintah Kota Balikpapan, serta ruang interaksi informasi layanan bagi masyarakat Kelurahan Prapatan dan sekitarnya.",
      href: facebookUrl,
      accentGradient: "from-[#1877F2] to-[#0c5dc7]",
      iconBg: "bg-[#1877F2]",
      ctaLabel: "Kunjungi Halaman Facebook Resmi ↗",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      id: "youtube",
      platform: "YouTube Channel",
      handle: extractHandle(youtubeUrl, "@puskesmasprapatanbalikpapa1711"),
      badge: "Video Edukasi & Profil Layanan",
      description:
        "Tonton dokumentasi video profil UPTD Puskesmas Prapatan, penyuluhan kesehatan oleh dokter dan tenaga medis, inovasi layanan (Madu Kendi, Gardu, Proteks Sehat), serta panduan alur pelayanan pasien.",
      href: youtubeUrl,
      accentGradient: "from-[#FF0000] to-[#cc0000]",
      iconBg: "bg-[#FF0000]",
      ctaLabel: "Tonton di YouTube Channel ↗",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
        </svg>
      ),
    },
    {
      id: "tiktok",
      platform: "TikTok Edukasi Kesehatan",
      handle: extractHandle(tiktokUrl, "@puskesmas.prapatan"),
      badge: "Video Singkat Promosi Kesehatan",
      description:
        "Konten video pendek yang ringan dan edukatif seputar tips hidup sehat, pencegahan penyakit menular & tidak menular, kesehatan ibu & anak, serta sosialisasi layanan ramah masyarakat.",
      href: tiktokUrl,
      accentGradient: "from-slate-900 via-slate-800 to-[#fe2c55]",
      iconBg: "bg-slate-900",
      ctaLabel: "Lihat Konten di TikTok ↗",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
    {
      id: "threads",
      platform: "Threads Resmi",
      handle: extractHandle(threadsUrl, "@puskesmas.prapatan"),
      badge: "Update Ringkas & Pengumuman Cepat",
      description:
        "Informasi singkat harian mengenai jadwal layanan poli, pengumuman kegiatan vaksinasi/imunisasi, serta tips kesehatan praktis yang terhubung langsung dengan akun Instagram resmi kami.",
      href: threadsUrl,
      accentGradient: "from-slate-800 to-slate-950",
      iconBg: "bg-slate-900",
      ctaLabel: "Ikuti di Threads ↗",
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.123-1.149 3.595-1.213 1.07-.047 2.063.07 2.976.345-.08-.86-.355-1.515-.82-1.95-.557-.523-1.416-.793-2.554-.803h-.027c-.967 0-1.766.26-2.375.774-.496.418-.792.952-.881 1.588l-2.07-.292c.156-1.106.689-2.05 1.585-2.806.993-.839 2.278-1.263 3.82-1.263h.045c1.714.014 3.063.485 4.01 1.399.857.827 1.337 1.988 1.428 3.452.036.578.027 1.178-.027 1.791 1.158.622 2.023 1.484 2.52 2.529.744 1.565.814 4.244-1.357 6.373-1.835 1.8-4.104 2.634-7.359 2.662zm-.931-8.33c-1.036.046-1.843.306-2.333.751-.443.402-.652.893-.622 1.46.038.698.395 1.217 1.06 1.544.573.281 1.325.405 2.172.359 1.08-.058 1.883-.441 2.455-1.171.425-.543.719-1.298.876-2.252-.813-.245-1.712-.365-2.69-.365-.304 0-.61.008-.918.022z" />
        </svg>
      ),
    },
    {
      id: "kontak",
      platform: whatsappUrl ? "WhatsApp & Layanan Informasi" : "Telepon & Email Resmi",
      handle: `${phone} · ${email}`,
      badge: "Saluran Komunikasi & Pengaduan Resmi",
      description:
        "Hubungi petugas informasi dan pengaduan UPTD Puskesmas Prapatan melalui sambungan telepon pada jam pelayanan kerja atau kirim surat elektronik ke alamat email resmi kami.",
      href: whatsappUrl || `mailto:${email}`,
      accentGradient: "from-[var(--teal)] to-navy",
      iconBg: "bg-[var(--teal)]",
      ctaLabel: whatsappUrl ? "Hubungi via WhatsApp Resmi ↗" : `Kirim Email ke ${email} ↗`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const pillars = [
    {
      title: "Publikasi Informasi Berkala & Serta-Merta",
      desc: "Menyebarluaskan pengumuman jadwal layanan, perubahan jam operasional, imbauan kewaspadaan penyakit, dan kegiatan kesehatan masyarakat secara cepat melalui media sosial.",
    },
    {
      title: "Edukasi & Promosi Kesehatan Digital",
      desc: "Menghadirkan konten infografis dan video pendek yang mudah dipahami warga untuk meningkatkan literasi kesehatan keluarga di wilayah kerja Puskesmas Prapatan.",
    },
    {
      title: "Interaksi & Respons Cepat Masyarakat",
      desc: "Memudahkan warga memperoleh informasi persyaratan layanan, alur pendaftaran BPJS, serta menyampaikan masukan secara transparan dan akuntabel.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--navy-deep)] via-navy to-[var(--teal)] py-14 md:py-20">
        <div className="content-container max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">
            Digitalisasi Keterbukaan Informasi Publik · PPID Puskesmas Prapatan
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Kanal Media Sosial Resmi Puskesmas Prapatan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200/95 sm:text-lg">
            Terhubung langsung dengan UPTD Puskesmas Prapatan Kota Balikpapan melalui berbagai
            jejaring media sosial resmi kami untuk mendapatkan informasi layanan, jadwal praktik,
            dan edukasi kesehatan terkini.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container max-w-6xl space-y-14">
          {/* Daftar Kartu Media Sosial */}
          <div>
            <div className="accent-bar mb-6">
              <p className="eyebrow">Jejaring Digital Resmi</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                Pilih &amp; Ikuti Kanal Resmi Kami
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Klik pada salah satu kartu di bawah ini untuk membuka akun resmi UPTD Puskesmas
                Prapatan.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((ch) => (
                <article
                  key={ch.id}
                  className="group panel panel-lift flex flex-col overflow-hidden"
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${ch.accentGradient}`} />
                  <div className="flex flex-grow flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform duration-300 group-hover:scale-105 ${ch.iconBg}`}
                      >
                        {ch.icon}
                      </span>
                      <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-[0.6875rem] font-bold text-[var(--teal)]">
                        Akun Resmi
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold tracking-tight text-navy">
                      {ch.platform}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-clinic-teal">{ch.handle}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">{ch.badge}</p>

                    <p className="mt-4 flex-grow text-sm leading-6 text-slate-600">
                      {ch.description}
                    </p>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <a
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--teal)]"
                      >
                        {ch.ctaLabel}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Peran Digitalisasi Media Sosial dalam PPID */}
          <div className="panel p-6 sm:p-8">
            <div className="accent-bar">
              <p className="eyebrow">Transparansi &amp; Inovasi Digital</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-navy">
                Digitalisasi Keterbukaan Informasi Publik di Media Sosial
              </h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Sebagai bagian dari pelaksanaan{" "}
              <strong>Pejabat Pengelola Informasi dan Dokumentasi (PPID)</strong>, UPTD Puskesmas
              Prapatan mengoptimalkan pemanfaatan media sosial resmi agar informasi kesehatan dan
              layanan publik dapat menjangkau seluruh lapisan masyarakat Kota Balikpapan secara
              inklusif, cepat, dan mudah diakses.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-[var(--radius)] border border-teal-100 bg-[var(--teal-soft)]/50 p-5"
                >
                  <h3 className="text-base font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA ke PPID, Standar Pelayanan & Pengaduan */}
          <div className="rounded-[var(--radius-lg)] bg-gradient-to-br from-navy to-[var(--navy-deep)] p-8 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Cari Dokumen Resmi atau Ingin Menyampaikan Pengaduan?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-200/90 sm:text-base">
              Selain melalui media sosial, Anda dapat mengakses dokumen keterbukaan informasi publik
              (PPID), Standar Pelayanan, serta formulir pengaduan langsung di situs ini.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/ppid" className="button-primary">
                Buka Halaman PPID
              </Link>
              <Link href="/standar-pelayanan" className="button-ghost-light">
                Lihat Standar Pelayanan
              </Link>
              <Link href="/pengaduan" className="button-ghost-light">
                Sampaikan Pengaduan / Masukan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
