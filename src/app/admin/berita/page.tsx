import { requireAdmin } from "@/lib/admin-auth";
import { getBeritaKesehatan } from "../../../lib/actions";
import Link from "next/link";
import { Metadata } from "next";
import DeleteBeritaButton from "./DeleteBeritaButton";

type Berita = { id: string; title: string; slug: string; date: string | Date };
export const metadata: Metadata = { title: "Kelola Berita | Admin" };

export default async function KelolaBeritaPage() {
  await requireAdmin();
  const berita = (await getBeritaKesehatan({ limit: 50 })) as Berita[];
  const date = (value: string | Date) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const action = (item: Berita) => (
    <div className="flex gap-4">
      <Link href={`/admin/berita/edit/${item.slug}`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">Edit</Link>
      <DeleteBeritaButton id={item.id}/>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Konten</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Kelola Berita</h1>
          <p className="mt-2 text-[var(--muted)]">
            Artikel dipublikasikan ke layout majalah di situs publik. Daftar menampilkan hingga 50 berita terbaru.
          </p>
        </div>
        <Link href="/admin/berita/tambah" className="button-primary">
          + Tambah Berita Baru
        </Link>
      </header>

      {berita.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada berita yang dipublikasikan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {berita.map(item => (
              <article key={item.id} className="panel p-5">
                <h2 className="font-semibold text-[var(--navy)]">{item.title}</h2>
                <p className="mt-1 text-sm text-[var(--teal)]">/{item.slug}</p>
                <p className="mt-3 text-sm text-[var(--muted)]">{date(item.date)}</p>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Judul Berita</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Tanggal Publish</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {berita.map(item => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 font-medium text-[var(--ink)]">
                      {item.title}
                      <div className="mt-1 text-xs font-normal text-[var(--teal)]">/{item.slug}</div>
                    </td>
                    <td className="p-4 text-[var(--muted)]">{date(item.date)}</td>
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
