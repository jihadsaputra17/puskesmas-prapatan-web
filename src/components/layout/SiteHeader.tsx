"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/layanan", label: "Layanan" },
  { href: "/jadwal-dokter", label: "Jadwal" },
  { href: "/berita", label: "Berita" },
  { href: "/pengaduan", label: "Pengaduan" },
];

function isActive(pathname: string | null, href: string) {
  const path = pathname || "/";
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function ClinicMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-navy text-white shadow-sm ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      </svg>
    </span>
  );
}

export default function SiteHeader({
  isAdmin,
  siteName = "Puskesmas Prapatan",
}: {
  isAdmin: boolean;
  siteName?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
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

  const navItems = (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(pathname, link.href) ? "page" : undefined}
          onClick={() => setOpen(false)}
          className="nav-link"
        >
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link href="/admin" onClick={() => setOpen(false)} className="nav-link font-semibold">
          Panel admin
        </Link>
      )}
    </>
  );

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

        <nav aria-label="Navigasi utama desktop" className="hidden items-center gap-0.5 lg:flex">
          {navItems}
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
              {navItems}
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
