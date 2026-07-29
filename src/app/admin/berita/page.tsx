import { getBeritaKesehatan } from "../../../lib/actions";
import Link from "next/link";
import { Metadata } from "next";
import DeleteBeritaButton from "./DeleteBeritaButton";

export const metadata: Metadata = {
  title: "Kelola Berita | Admin",
};

export default async function KelolaBeritaPage() {
  // Mengambil daftar berita dari database menggunakan server action yang kita buat
  const berita = await getBeritaKesehatan();

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kelola Berita</h1>
          <p className="text-slate-600 mt-2">Manajemen artikel dan pengumuman kesehatan Puskesmas.</p>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          + Tambah Berita Baru
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Judul Berita</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">Tanggal Publish</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {berita.length > 0 ? (
                berita.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.title}
                      <div className="text-xs text-slate-500 font-normal mt-1 text-teal-600">/{item.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap flex items-center justify-end gap-4">
                      <Link href={`/admin/berita/edit/${item.slug}`} className="text-sm text-amber-600 hover:text-amber-800 font-medium">Edit</Link>
                      <DeleteBeritaButton id={item.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Belum ada berita yang dipublikasikan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}