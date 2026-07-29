"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/layanan", label: "Layanan" },
  { href: "/jadwal-dokter", label: "Jadwal dokter" },
  { href: "/berita", label: "Berita" },
  { href: "/pengaduan", label: "Pengaduan" },
];

export default function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navigation = (mobile = false) => (
    <nav aria-label={mobile ? "Navigasi utama" : "Navigasi utama desktop"} className={mobile ? "grid gap-1 p-4" : "hidden items-center gap-1 lg:flex"}>
      {links.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)} className="nav-link">{link.label}</Link>)}
      {isAdmin && <Link href="/admin" className="nav-link font-semibold">Panel admin</Link>}
    </nav>
  );
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="content-container flex h-16 items-center justify-between"><Link href="/" className="font-bold text-[#12304a]">Puskesmas Prapatan</Link>{navigation()}<button type="button" aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="button-icon lg:hidden">{open ? "Tutup" : "Menu"}</button></div>{open && <div id="mobile-navigation" className="border-t border-slate-200 lg:hidden">{navigation(true)}</div>}</header>;
}
