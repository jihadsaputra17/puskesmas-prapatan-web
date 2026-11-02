"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

export type PpidNavLink = {
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
  { href: "/pengaduan", label: "Pengaduan" },
];

const CATEGORY_SHORT_LABEL: Record<string, string> = {
  berkala: "Informasi Berkala",
  "serta-merta": "Informasi Serta Merta",
  "setiap-saat": "Informasi Setiap Saat",
  regulasi: "Regulasi & SOP",
};

function isActive(pathname: string | null, href: string) {
  const path = pathname || "/";
  if (href === "/") return path === "/";
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
}: {
  isAdmin: boolean;
  siteName?: string;
  ppidLinks?: PpidNavLink[];
}) {
  const [open, setOpen] = useState(false);
  const [ppidOpen, setPpidOpen] = useState(false);
  const [mobilePpidOpen, setMobilePpidOpen] = useState(false);
  const ppidMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const menuId = useId();
  const ppidDropdownId = useId();

  useEffect(() => {
    setOpen(false);
    setPpidOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!ppidOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ppidMenuRef.current && !ppidMenuRef.current.contains(event.target as Node)) {
        setPpidOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPpidOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ppidOpen]);

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
            if (link.href === "/ppid") {
              const active = isActive(pathname, "/ppid");
              return (
                <div
                  key={link.href}
                  ref={ppidMenuRef}
                  className="group/ppid relative"
                  onMouseEnter={() => setPpidOpen(true)}
                  onMouseLeave={() => setPpidOpen(false)}
                >
                  <div className="inline-flex items-center">
                    <Link
                      href="/ppid"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setPpidOpen(false)}
                      className="nav-link gap-1"
                    >
                      <span>{link.label}</span>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-4 w-4 text-slate-500 transition-transform duration-200 group-hover/ppid:rotate-180 ${
                          ppidOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      aria-label="Tampilkan daftar menu PPID"
                      aria-expanded={ppidOpen}
                      aria-controls={ppidDropdownId}
                      onClick={() => setPpidOpen((v) => !v)}
                      className="sr-only focus:not-sr-only focus:inline-flex focus:h-9 focus:w-7 focus:items-center focus:justify-center focus:rounded-md"
                    >
                      ▾
                    </button>
                  </div>

                  <div
                    id={ppidDropdownId}
                    className={`absolute left-0 top-full z-50 w-80 pt-2 transition-all duration-150 ${
                      ppidOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0 group-hover/ppid:visible group-hover/ppid:translate-y-0 group-hover/ppid:opacity-100 group-focus-within/ppid:visible group-focus-within/ppid:translate-y-0 group-focus-within/ppid:opacity-100"
                    }`}
                  >
                    <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white shadow-[var(--shadow-lift)]">
                      <div className="border-b border-slate-100 bg-[var(--teal-soft)]/60 px-4 py-3">
                        <Link
                          href="/ppid"
                          onClick={() => setPpidOpen(false)}
                          className="flex items-center justify-between text-sm font-bold text-navy hover:text-[var(--teal)]"
                        >
                          <span>Halaman Utama PPID</span>
                          <span className="text-xs font-semibold text-[var(--teal)]">
                            Lihat semua →
                          </span>
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Profil, Tugas &amp; Daftar Informasi Publik
                        </p>
                      </div>

                      {ppidLinks.length > 0 ? (
                        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto py-1">
                          {ppidLinks.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/ppid/${item.slug}`}
                                onClick={() => setPpidOpen(false)}
                                className="block px-4 py-2.5 transition hover:bg-[var(--teal-soft)]/50"
                              >
                                {item.category && (
                                  <span className="block text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--teal)]">
                                    {CATEGORY_SHORT_LABEL[item.category] || "Informasi PPID"}
                                  </span>
                                )}
                                <span className="mt-0.5 block line-clamp-2 text-sm font-semibold text-navy">
                                  {item.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-500">
                          Belum ada dokumen PPID tambahan. Klik Halaman Utama PPID untuk info
                          lengkap.
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
                      <div className="flex items-center justify-between">
                        <Link
                          href="/ppid"
                          aria-current={isActive(pathname, "/ppid") ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className="nav-link flex-1"
                        >
                          {link.label}
                        </Link>
                        {ppidLinks.length > 0 && (
                          <button
                            type="button"
                            aria-label="Tampilkan daftar PPID"
                            aria-expanded={mobilePpidOpen}
                            onClick={() => setMobilePpidOpen((v) => !v)}
                            className="button-icon"
                          >
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className={`h-5 w-5 transition-transform ${
                                mobilePpidOpen ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      {mobilePpidOpen && ppidLinks.length > 0 && (
                        <ul className="ml-3 space-y-1 border-l-2 border-[var(--teal-soft)] pl-3">
                          {ppidLinks.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/ppid/${item.slug}`}
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
