import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getJadwal } from "@/lib/jadwal-actions";
import DeleteJadwalButton from "./DeleteJadwalButton";

type Jadwal = { id: string; nama_dokter: string; poli: string; hari: string; jam_mulai: string; jam_selesai: string };
export const metadata = { title: "Jadwal Dokter | Admin" };

export default async function ManajemenJadwalPage() {
  await requireAdmin();
  const jadwal = await getJadwal() as Jadwal[];
  const action = (item: Jadwal) => (
    <div className="flex gap-4">
      <Link href={`/admin/jadwal/${item.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteJadwalButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Penjadwalan</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Jadwal Dokter</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola informasi jadwal praktik dokter di berbagai poli pelayanan.</p>
        </div>
        <Link href="/admin/jadwal/tambah" className="button-primary">
          + Tambah Jadwal
        </Link>
      </header>

      {jadwal.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada jadwal dokter yang ditambahkan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {jadwal.map(item => (
              <article key={item.id} className="panel p-5">
                <h2 className="font-semibold text-[var(--navy)]">{item.nama_dokter}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-[var(--muted)]">Poli</dt>
                  <dd className="text-[var(--ink)]">{item.poli}</dd>
                  <dt className="text-[var(--muted)]">Hari</dt>
                  <dd className="text-[var(--ink)]">{item.hari}</dd>
                  <dt className="text-[var(--muted)]">Jam</dt>
                  <dd className="text-[var(--ink)]">{item.jam_mulai} - {item.jam_selesai}</dd>
                </dl>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Nama Dokter</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Poli</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Hari</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Jam</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 font-medium text-[var(--ink)]">{item.nama_dokter}</td>
                    <td className="p-4 text-[var(--muted)]">{item.poli}</td>
                    <td className="p-4 text-[var(--muted)]">{item.hari}</td>
                    <td className="p-4 text-[var(--muted)]">{item.jam_mulai} - {item.jam_selesai}</td>
                    <td className="p-4">{action(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
