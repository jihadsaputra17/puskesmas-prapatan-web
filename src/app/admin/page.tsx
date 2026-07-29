import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Puskesmas Prapatan",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Selamat datang, {session?.user?.name || 'Admin'}!</h1>
        <p className="text-slate-600 mt-2">Ini adalah halaman pusat kendali (CMS) website Puskesmas Prapatan.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Pintasan Cepat</h3>
          <p className="text-slate-600 text-sm mb-4">Gunakan menu di sebelah kiri untuk mulai memperbarui konten website Anda, menambah jadwal, atau memposting artikel kesehatan baru.</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Sistem Berjalan Normal
          </span>
        </div>
      </div>
    </>
  );
}