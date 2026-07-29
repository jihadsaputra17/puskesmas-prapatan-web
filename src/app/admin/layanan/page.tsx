import { requireAdmin } from "@/lib/admin-auth";
import { getLayanan } from "@/lib/layanan-actions";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import Link from "next/link";
import { DeleteLayananButton } from "./DeleteLayananButton";

type Layanan = { id: string; icon: string; nama_poli: string; deskripsi: string };
export const metadata = { title: "Layanan Poli | Admin" };
export default async function ManajemenLayananPage() {
  await requireAdmin();
  const layanan = await getLayanan() as Layanan[];
  const action = (item: Layanan) => <div className="flex items-center gap-4"><Link href={`/admin/layanan/${item.id}/edit`} className="text-sm font-medium text-blue-600">Edit</Link><DeleteLayananButton id={item.id}/></div>;
  return <><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold text-slate-900">Manajemen Layanan (Poli)</h1><p className="mt-2 text-slate-600">Kelola daftar layanan kesehatan yang tersedia di Puskesmas.</p></div><Link href="/admin/layanan/tambah" className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white">+ Tambah Layanan</Link></header>{layanan.length === 0 ? <div className="rounded-xl border bg-white p-10 text-center text-slate-500">Belum ada layanan poli yang ditambahkan.</div> : <><div className="grid gap-4 md:hidden">{layanan.map(item => <article key={item.id} className="rounded-xl border bg-white p-5"><div className="flex items-center gap-3"><span className="text-2xl">{item.icon}</span><h2 className="font-semibold">{item.nama_poli}</h2></div><div className="mt-3 line-clamp-3 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/><div className="mt-4">{action(item)}</div></article>)}</div><div className="hidden overflow-x-auto rounded-xl border bg-white md:block"><table className="w-full text-left"><thead><tr className="border-b bg-slate-50"><th className="p-4">Icon</th><th className="p-4">Nama Poli</th><th className="p-4">Deskripsi Singkat</th><th className="p-4">Aksi</th></tr></thead><tbody>{layanan.map(item => <tr key={item.id} className="border-b"><td className="p-4 text-2xl">{item.icon}</td><td className="p-4 font-medium">{item.nama_poli}</td><td className="p-4"><div className="line-clamp-2 max-w-md text-sm" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/></td><td className="p-4">{action(item)}</td></tr>)}</tbody></table></div></>}</>;
}
