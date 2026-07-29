import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getJadwal } from "@/lib/jadwal-actions";
import DeleteJadwalButton from "./DeleteJadwalButton";

type Jadwal = { id: string; nama_dokter: string; poli: string; hari: string; jam_mulai: string; jam_selesai: string };
export const metadata = { title: "Jadwal Dokter | Admin" };
export default async function ManajemenJadwalPage() {
  await requireAdmin();
  const jadwal = await getJadwal() as Jadwal[];
  const action = (item: Jadwal) => <div className="flex gap-4"><Link href={`/admin/jadwal/${item.id}/edit`} className="text-sm font-medium text-blue-600">Edit</Link><DeleteJadwalButton id={item.id}/></div>;
  return <><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold text-slate-900">Jadwal Dokter</h1><p className="mt-2 text-slate-600">Kelola informasi jadwal praktik dokter di berbagai poli pelayanan.</p></div><Link href="/admin/jadwal/tambah" className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white">+ Tambah Jadwal</Link></header>{jadwal.length === 0 ? <div className="rounded-xl border bg-white p-10 text-center text-slate-500">Belum ada jadwal dokter yang ditambahkan.</div> : <><div className="grid gap-4 md:hidden">{jadwal.map(item => <article key={item.id} className="rounded-xl border bg-white p-5"><h2 className="font-semibold">{item.nama_dokter}</h2><dl className="mt-3 grid grid-cols-2 gap-2 text-sm"><dt className="text-slate-500">Poli</dt><dd>{item.poli}</dd><dt className="text-slate-500">Hari</dt><dd>{item.hari}</dd><dt className="text-slate-500">Jam</dt><dd>{item.jam_mulai} - {item.jam_selesai}</dd></dl><div className="mt-4">{action(item)}</div></article>)}</div><div className="hidden overflow-x-auto rounded-xl border bg-white md:block"><table className="w-full text-left"><thead><tr className="border-b bg-slate-50"><th className="p-4">Nama Dokter</th><th className="p-4">Poli</th><th className="p-4">Hari</th><th className="p-4">Jam</th><th className="p-4">Aksi</th></tr></thead><tbody>{jadwal.map(item => <tr key={item.id} className="border-b"><td className="p-4 font-medium">{item.nama_dokter}</td><td className="p-4">{item.poli}</td><td className="p-4">{item.hari}</td><td className="p-4">{item.jam_mulai} - {item.jam_selesai}</td><td className="p-4">{action(item)}</td></tr>)}</tbody></table></div></>}</>;
}
