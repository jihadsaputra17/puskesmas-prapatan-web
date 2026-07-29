import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Mengambil data sesi pengguna saat ini secara aman di server
  const session = await getServerSession(authOptions);

  // PROTEKSI RUTE UNTUK SEMUA HALAMAN ADMIN
  // Ambil role dari sesi. Role ini ditambahkan dari callback di `auth.ts`.
  const role = session?.user?.role;

  // Redirect jika tidak ada sesi atau tidak ada role (lebih aman).
  if (!session || !role) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigasi Admin Ditempatkan Di Sini */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Panel Admin</h2>
          <p className="text-sm text-slate-400 mt-1">Puskesmas Prapatan</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Dashboard Utama</Link>
          <Link href="/admin/berita" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Kelola Berita</Link>
          
          {role === 'superadmin' && (
            <>
              <Link href="/admin/jadwal" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Jadwal Dokter</Link>
              <Link href="/admin/layanan" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Layanan Poli</Link>
              <Link href="/admin/settings" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Pengaturan Situs</Link>
              <Link href="/admin/users" className="block px-4 py-2.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">Manajemen User</Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4">
            <p className="text-sm font-medium text-white truncate">{session.user?.name || 'Pengguna'}</p>
            <p className="text-xs text-teal-400 uppercase tracking-wider font-semibold mt-0.5">{role}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Area Konten Dinamis */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}