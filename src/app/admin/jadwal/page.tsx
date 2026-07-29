import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getJadwal } from "@/lib/jadwal-actions";
import DeleteJadwalButton from "./DeleteJadwalButton";

export const metadata = {
  title: "Jadwal Dokter | Admin",
};

export default async function ManajemenJadwalPage() {
  const session = await getServerSession(authOptions);
  
  // PROTEKSI GANDA: Jika bukan superadmin, tendang kembali ke dashboard
  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  const jadwal = await getJadwal();

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jadwal Dokter</h1>
          <p className="text-slate-600 mt-2">Kelola informasi jadwal praktik dokter di berbagai poli pelayanan.</p>
        </div>
        <Link 
          href="/admin/jadwal/tambah" 
          className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          + Tambah Jadwal
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="px-6 py-4 font-semibold">Nama Dokter</th>
                <th className="px-6 py-4 font-semibold">Poli Pelayanan</th>
                <th className="px-6 py-4 font-semibold">Hari Praktik</th>
                <th className="px-6 py-4 font-semibold">Jam Praktik</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {jadwal.length > 0 ? (
                jadwal.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama_dokter}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium">{item.poli}</span></td>
                    <td className="px-6 py-4 text-slate-600">{item.hari}</td>
                    <td className="px-6 py-4 text-slate-600">{item.jam_mulai} - {item.jam_selesai}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                      <Link href={`/admin/jadwal/${item.id}/edit`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </Link>
                      <DeleteJadwalButton id={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Belum ada jadwal dokter yang ditambahkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}