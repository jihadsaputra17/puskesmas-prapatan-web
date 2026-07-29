import Link from "next/link";

export default function ClinicHero({ settings }: { settings: Record<string, string> }) {
  const name = settings.site_name || "Puskesmas Prapatan";
  const title = settings.hero_title || "Pelayanan kesehatan untuk masyarakat";
  const subtitle =
    settings.hero_subtitle ||
    "Temukan informasi layanan, jadwal dokter, dan saluran pengaduan dalam satu tempat.";

  const contactBits = [
    settings.address ? { label: "Alamat", value: settings.address } : null,
    settings.phone
      ? {
          label: "Telepon",
          value: settings.phone,
          href: `tel:${settings.phone.replace(/[^+\d]/g, "")}`,
        }
      : null,
    settings.email
      ? {
          label: "Email",
          value: settings.email,
          href: `mailto:${settings.email}`,
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string }>;

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 85% 15%, rgba(15,118,110,0.45), transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(56,189,248,0.12), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.04)_40%,rgba(255,255,255,0.04)_60%,transparent_60%)] lg:block"
        aria-hidden="true"
      />

      <div className="content-container relative grid gap-10 py-14 md:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="accent-bar">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">
            Layanan kesehatan masyarakat
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {name}
          </h1>
          <p className="mt-4 max-w-2xl text-xl font-semibold text-teal-100 sm:text-2xl">
            {title}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/layanan" className="button-primary">
              Lihat layanan
            </Link>
            <Link href="/jadwal-dokter" className="button-ghost-light">
              Jadwal dokter
            </Link>
            <Link href="/pengaduan" className="button-ghost-light">
              Pengaduan
            </Link>
          </div>
        </div>

        <aside className="rounded-[18px] border border-white/15 bg-white/10 p-6 shadow-soft backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-200">
            Info kontak
          </p>
          {contactBits.length > 0 ? (
            <dl className="mt-5 space-y-4">
              {contactBits.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-300">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-white">
                    {item.href ? (
                      <a className="underline-offset-4 hover:underline" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Gunakan menu layanan dan jadwal untuk merencanakan kunjungan Anda.
            </p>
          )}
          <Link
            href="/pengaduan"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-teal-100 underline underline-offset-4 hover:text-white"
          >
            Sampaikan pengaduan
          </Link>
        </aside>
      </div>
    </section>
  );
}
