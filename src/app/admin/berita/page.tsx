import { getBeritaKesehatan } from "../../../lib/actions";
import Link from "next/link";
import { Metadata } from "next";
import DeleteBeritaButton from "./DeleteBeritaButton";

type Berita = { id: string; title: string; slug: string; date: string | Date };
export const metadata: Metadata = { title: "Kelola Berita | Admin" };
export default async function KelolaBeritaPage() {
  const berita = await getBeritaKesehatan() as Berita[];
  const date = (value: string | Date) => new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const action = (item: Berita) => <div className="flex gap-4"><Link href={`/admin/berita/edit/${item.slug}`} className="text-sm font-medium text-amber-600">Edit</Link><DeleteBeritaButton id={item.id}/></div>;
  return <><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold text-slate-900">Kelola Berita</h1><p className="mt-2 text-slate-600">Manajemen artikel dan pengumuman kesehatan Puskesmas.</p></div><Link href="/admin/berita/tambah" className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white">+ Tambah Berita Baru</Link></header>{berita.length === 0 ? <div className="rounded-xl border bg-white p-10 text-center text-slate-500">Belum ada berita yang dipublikasikan.</div> : <><div className="grid gap-4 md:hidden">{berita.map(item => <article key={item.id} className="rounded-xl border bg-white p-5"><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-teal-600">/{item.slug}</p><p className="mt-3 text-sm text-slate-600">{date(item.date)}</p><div className="mt-4">{action(item)}</div></article>)}</div><div className="hidden overflow-x-auto rounded-xl border bg-white md:block"><table className="w-full text-left"><thead><tr className="border-b bg-slate-50"><th className="p-4">Judul Berita</th><th className="p-4">Tanggal Publish</th><th className="p-4">Aksi</th></tr></thead><tbody>{berita.map(item => <tr key={item.id} className="border-b"><td className="p-4 font-medium">{item.title}<div className="mt-1 text-xs font-normal text-teal-600">/{item.slug}</div></td><td className="p-4">{date(item.date)}</td><td className="p-4">{action(item)}</td></tr>)}</tbody></table></div></>}</>;
}
