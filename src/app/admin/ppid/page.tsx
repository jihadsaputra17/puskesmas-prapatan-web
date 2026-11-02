import { requireAdmin } from "@/lib/admin-auth";
import { getPpidCategoryLabel, getPpidItems, type PpidItem } from "@/lib/ppid-actions";
import Link from "next/link";
import { Metadata } from "next";
import DeletePpidButton from "./DeletePpidButton";

export const metadata: Metadata = { title: "Kelola PPID | Admin" };

export default async function KelolaPpidPage() {
  await requireAdmin();
  const items = await getPpidItems({ limit: 50 });

  const formatDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const action = (item: PpidItem) => (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/ppid/edit/${item.slug}`}
        className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]"
      >
        Edit
      </Link>
      <DeletePpidButton id={item.id} />
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Keterbukaan Informasi Publik</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">
            Kelola PPID
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Kelola dokumen dan informasi publik PPID (Informasi Berkala, Serta Merta, Setiap Saat,
            serta Regulasi &amp; SOP).
          </p>
        </div>
        <Link href="/admin/ppid/tambah" className="button-primary">
          + Tambah Informasi PPID
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">
          Belum ada data informasi PPID yang dipublikasikan.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {items.map((item) => (
              <article key={item.id} className="panel p-5">
                <span className="inline-block rounded-full bg-[var(--teal-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--teal)]">
                  {getPpidCategoryLabel(item.category)}
                </span>
                <h2 className="mt-2 font-semibold text-[var(--navy)]">{item.title}</h2>
                <p className="mt-1 text-sm text-[var(--teal)]">/ppid/{item.slug}</p>
                {item.fileUrl && (
                  <p className="mt-1 text-xs text-slate-500">📎 Memiliki tautan dokumen lampiran</p>
                )}
                <p className="mt-3 text-sm text-[var(--muted)]">{formatDate(item.date)}</p>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Judul Informasi / Dokumen</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Kategori PPID</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Tanggal Publish</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4 font-medium text-[var(--ink)]">
                      {item.title}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-normal text-[var(--teal)]">
                        <span>/ppid/{item.slug}</span>
                        {item.fileUrl && (
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                            📎 Lampiran Dokumen
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal)]">
                        {getPpidCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--muted)]">{formatDate(item.date)}</td>
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
