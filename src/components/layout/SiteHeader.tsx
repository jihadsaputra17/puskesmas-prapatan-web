"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

export type PpidNavLink = {
  title: string;
  slug: string;
  category?: string;
};

export type StandarPelayananNavLink = {
  title: string;
  slug: string;
  category?: string;
};

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/layanan", label: "Layanan" },
  { href: "/jadwal-dokter", label: "Jadwal" },
  { href: "/berita", label: "Berita" },
  { href: "/ppid", label: "PPID" },
  { href: "/standar-pelayanan", label: "Standar Pelayanan" },
  { href: "/pengaduan", label: "Pengaduan" },
];

const CATEGORY_SHORT_LABEL: Record<string, string> = {
  berkala: "Informasi Wajib Berkala",
  "setiap-saat": "Tersedia Setiap Saat",
  "pelayanan-informasi": "Pelayanan Informasi Publik",
  "sarana-prasarana": "Sarana & Prasarana",
  "digitalisasi-medsos": "Digitalisasi & Medsos",
  komitmen: "Komitmen Badan Publik",
};

const SP_CATEGORY_SHORT_LABEL: Record<string, string> = {
  "standar-pelayanan": "Standar Pelayanan",
  "maklumat-pelayanan": "Maklumat Pelayanan",
  "sop-alur": "SOP & Alur",
  "tarif-biaya": "Tarif & Biaya",
  "survei-kepuasan": "Survei Kepuasan (SKM)",
  "kompensasi-pengaduan": "Kompensasi & Pengaduan",
};

function isActive(pathname: string | null, href: string) {
  const path = pathname || "/";
  if (href === "/") return path === "/";
  if (href === "/ppid" && path.startsWith("/media-sosial")) return true;
  return path === href || path.startsWith(`${href}/`);
}

function ClinicMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 overflow-hidden ${className}`} aria-hidden="true">
      <Image
        src="/images/logo-pkm.png"
        alt=""
        fill
        className="object-contain"
        sizes="40px"
        priority
      />
    </span>
  );
}

export default function SiteHeader({
  isAdmin,
  siteName = "Puskesmas Prapatan",
  ppidLinks = [],
  standarPelayananLinks = [],
}: {
  isAdmin: boolean;
  siteName?: string;
  ppidLinks?: PpidNavLink[];
  standarPelayananLinks?: StandarPelayananNavLink[];
}) {
  const [open, setOpen] = useState(false);
  const [profilHover, setProfilHover] = useState(false);
  const [ppidHover, setPpidHover] = useState(false);
  const [spHover, setSpHover] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
    setProfilHover(false);
    setPpidHover(false);
    setSpHover(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="h-0.5 bg-gradient-to-r from-clinic-teal via-teal-500 to-navy" aria-hidden="true" />
      <div className="content-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3 rounded-[10px] pr-2 focus-visible:outline-none"
        >
          <ClinicMark />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight text-navy sm:text-base">
              {siteName}
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              UPTD · Kota Balikpapan
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Navigasi utama desktop" className="hidden items-center gap-0.5 lg:flex">
          {links.map((link) => {
            if (link.href === "/profil") {
              const active = isActive(pathname, "/profil");
              return (
                <div
                  key={link.href}
                  className="group/profil relative"
                  onMouseEnter={() => setProfilHover(true)}
                  onMouseLeave={() => setProfilHover(false)}
                >
                  <Link
                    href="/profil"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setProfilHover(false)}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>

                  <div
                    className={`absolute left-0 top-full z-50 w-64 pt-2 transition-all duration-150 ${
                      profilHover
                        ? "visible translate-y-0 opacity-100"
                        : "invisible pointer-events-none -translate-y-1 opacity-0 group-hover/profil:visible group-hover/profil:pointer-events-auto group-hover/profil:translate-y-0 group-hover/profil:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white shadow-[var(--shadow-lift)]">
                      <ul className="divide-y divide-slate-100 py-1">
                        <li>
                          <Link
                            href="/profil"
                            onClick={() => setProfilHover(false)}
                            className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/60"
                          >
                            <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                              Tentang Fasyankes
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold uppercase text-navy">
                              PROFIL &amp; JAM LAYANAN PUSKESMAS
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/media-sosial"
                            onClick={() => setProfilHover(false)}
                            className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/60"
                          >
                            <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                              Jejaring Resmi
                            </span>
                            <span className="mt-0.5 block text-sm font-semibold uppercase text-navy">
                              KANAL MEDIA SOSIAL RESMI PUSKESMAS
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            if (link.href === "/ppid") {
              const active = isActive(pathname, "/ppid");
              return (
                <div
                  key={link.href}
                  className="group/ppid relative"
                  onMouseEnter={() => setPpidHover(true)}
                  onMouseLeave={() => setPpidHover(false)}
                >
                  <Link
                    href="/ppid"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setPpidHover(false)}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>

                  <div
                    className={`absolute left-0 top-full z-50 w-72 pt-2 transition-all duration-150 ${
                      ppidHover
                        ? "visible translate-y-0 opacity-100"
                        : "invisible pointer-events-none -translate-y-1 opacity-0 group-hover/ppid:visible group-hover/ppid:pointer-events-auto group-hover/ppid:translate-y-0 group-hover/ppid:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white shadow-[var(--shadow-lift)]">
                      <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto py-1">
                        <li className="bg-[var(--teal-soft)]/35">
                          <Link
                            href="/media-sosial"
                            onClick={() => setPpidHover(false)}
                            className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/80"
                          >
                            <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                              Digitalisasi &amp; Medsos
                            </span>
                            <span className="mt-0.5 block text-sm font-bold uppercase text-navy">
                              KANAL MEDIA SOSIAL RESMI PUSKESMAS
                            </span>
                          </Link>
                        </li>
                        {ppidLinks.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/ppid/${item.slug}`}
                              onClick={() => setPpidHover(false)}
                              className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/60"
                            >
                              {item.category && (
                                <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                                  {CATEGORY_SHORT_LABEL[item.category] || "Informasi PPID"}
                                </span>
                              )}
                              <span className="mt-0.5 block line-clamp-2 text-sm font-semibold uppercase text-navy">
                                {item.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            if (link.href === "/standar-pelayanan") {
              const active = isActive(pathname, "/standar-pelayanan");
              return (
                <div
                  key={link.href}
                  className="group/sp relative"
                  onMouseEnter={() => setSpHover(true)}
                  onMouseLeave={() => setSpHover(false)}
                >
                  <Link
                    href="/standar-pelayanan"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setSpHover(false)}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>

                  <div
                    className={`absolute left-0 top-full z-50 w-72 pt-2 transition-all duration-150 ${
                      spHover
                        ? "visible translate-y-0 opacity-100"
                        : "invisible pointer-events-none -translate-y-1 opacity-0 group-hover/sp:visible group-hover/sp:pointer-events-auto group-hover/sp:translate-y-0 group-hover/sp:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white shadow-[var(--shadow-lift)]">
                      {standarPelayananLinks.length > 0 ? (
                        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto py-1">
                          {standarPelayananLinks.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/standar-pelayanan/${item.slug}`}
                                onClick={() => setSpHover(false)}
                                className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/60"
                              >
                                {item.category && (
                                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                                    {SP_CATEGORY_SHORT_LABEL[item.category] || "Standar Pelayanan"}
                                  </span>
                                )}
                                <span className="mt-0.5 block line-clamp-2 text-sm font-semibold uppercase text-navy">
                                  {item.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-500">
                          Belum ada informasi Standar Pelayanan yang ditambahkan.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="nav-link"
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="nav-link font-semibold">
              Panel admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/jadwal-dokter" className="button-primary hidden sm:inline-flex">
            Cek jadwal
          </Link>
          <button
            type="button"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-controls={menuId}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="button-icon lg:hidden"
          >
            <span className="sr-only">{open ? "Tutup" : "Menu"}</span>
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-navy/40"
            aria-label="Tutup overlay navigasi"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white shadow-lift animate-drawerIn"
          >
            <nav aria-label="Navigasi utama" className="content-container grid gap-1 py-4">
              {links.map((link) => {
                if (link.href === "/ppid") {
                  return (
                    <div key={link.href} className="space-y-1">
                      <Link
                        href="/ppid"
                        aria-current={isActive(pathname, "/ppid") ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="nav-link w-full"
                      >
                        {link.label}
                      </Link>
                      <ul className="ml-3 space-y-1 border-l-2 border-[var(--teal-soft)] pl-3">
                        <li>
                          <Link
                            href="/media-sosial"
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm font-semibold uppercase text-[var(--teal)] hover:bg-[var(--teal-soft)]"
                          >
                            KANAL MEDIA SOSIAL RESMI PUSKESMAS
                          </Link>
                        </li>
                        {ppidLinks.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/ppid/${item.slug}`}
                              onClick={() => setOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm uppercase text-slate-700 hover:bg-[var(--teal-soft)] hover:text-[var(--teal)]"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                if (link.href === "/standar-pelayanan") {
                  return (
                    <div key={link.href} className="space-y-1">
                      <Link
                        href="/standar-pelayanan"
                        aria-current={isActive(pathname, "/standar-pelayanan") ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="nav-link w-full"
                      >
                        {link.label}
                      </Link>
                      {standarPelayananLinks.length > 0 && (
                        <ul className="ml-3 space-y-1 border-l-2 border-[var(--teal-soft)] pl-3">
                          {standarPelayananLinks.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/standar-pelayanan/${item.slug}`}
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-[var(--teal-soft)] hover:text-[var(--teal)]"
                              >
                                {item.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(pathname, link.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="nav-link font-semibold">
                  Panel admin
                </Link>
              )}
              <Link
                href="/jadwal-dokter"
                onClick={() => setOpen(false)}
                className="button-primary mt-2 w-full"
              >
                Cek jadwal dokter
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
