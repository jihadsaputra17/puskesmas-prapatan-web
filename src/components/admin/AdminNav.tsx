"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavProps = {
  role: "admin" | "superadmin";
  userName?: string;
};

const sharedLinks = [
  { href: "/admin", label: "Dashboard Utama" },
  { href: "/admin/berita", label: "Kelola Berita" },
  { href: "/admin/layanan", label: "Layanan Poli" },
  { href: "/admin/jadwal", label: "Jadwal Dokter" },
  { href: "/admin/settings", label: "Pengaturan Situs" },
];

export default function AdminNav({ role, userName }: AdminNavProps) {
  const pathname = usePathname();
  const links = role === "superadmin"
    ? [...sharedLinks, { href: "/admin/users", label: "Manajemen Pengguna" }]
    : sharedLinks;

  return (
    <nav aria-label="Navigasi admin" className="flex-1 p-4 space-y-1">
      {userName && <p className="px-4 pb-3 text-sm text-slate-400">{userName}</p>}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className="flex min-h-11 items-center rounded-lg px-4 py-2.5 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 aria-[current=page]:bg-teal-700 aria-[current=page]:text-white"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
