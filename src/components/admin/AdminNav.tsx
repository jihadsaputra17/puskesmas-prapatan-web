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
  { href: "/admin/dokter", label: "Kelola Dokter" },
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
      {userName && <p className="px-4 pb-3 text-sm text-[var(--muted)]">{userName}</p>}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href))
              ? "page"
              : undefined
          }
          className="relative inline-flex min-h-11 w-full items-center rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-[var(--navy)] hover:text-white aria-[current=page]:bg-[var(--teal)] aria-[current=page]:text-white focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2 focus:ring-offset-[var(--navy-deep)]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
