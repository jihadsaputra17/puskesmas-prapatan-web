import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLayanan } from "@/lib/layanan-actions";
import { DeleteLayananButton } from "./DeleteLayananButton";

export const metadata = {
  title: "Layanan Poli | Admin",
};

export default async function ManajemenLayananPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  const layanan = await getLayanan();

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Layanan (Poli)</h1>
          <p className="text-slate-600 mt-2">Kelola daftar layanan kesehatan yang tersedia di Puskesmas.</p>
        </div>
        <Link href="/admin/layanan/tambah" className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors">
          + Tambah Layanan
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="px-6 py-4 font-semibold w-16">Icon</th>
                <th className="px-6 py-4 font-semibold">Nama Poli</th>
                <th className="px-6 py-4 font-semibold">Deskripsi Singkat</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {layanan && layanan.length > 0 ? (
                layanan.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-2xl">{item.icon}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama_poli}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div 
                        className="line-clamp-2 max-w-md text-sm [&_p]:mb-1 [&_ul]:list-inside [&_ul]:list-disc [&_ol]:list-inside [&_ol]:list-decimal"
                        dangerouslySetInnerHTML={{ __html: item.deskripsi }}
                      />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap flex items-center justify-end gap-4">
                      <Link href={`/admin/layanan/${item.id}/edit`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </Link>
                      <DeleteLayananButton id={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">Belum ada layanan poli yang ditambahkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
