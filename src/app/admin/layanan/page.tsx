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
  const action = (item: Layanan) => (
    <div className="flex items-center gap-4">
      <Link href={`/admin/layanan/${item.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteLayananButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Fasyankes</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Manajemen Layanan (Poli)</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola daftar layanan kesehatan yang tersedia di Puskesmas.</p>
        </div>
        <Link href="/admin/layanan/tambah" className="button-primary">
          + Tambah Layanan
        </Link>
      </header>

      {layanan.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada layanan poli yang ditambahkan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {layanan.map(item => (
              <article key={item.id} className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h2 className="font-semibold text-[var(--navy)]">{item.nama_poli}</h2>
                </div>
                <div className="mt-3 line-clamp-3 text-sm text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Icon</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Nama Poli</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Deskripsi Singkat</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {layanan.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 text-2xl">{item.icon}</td>
                    <td className="p-4 font-medium text-[var(--ink)]">{item.nama_poli}</td>
                    <td className="p-4">
                      <div className="line-clamp-2 max-w-md text-sm text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}/>
                    </td>
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
