import { requireAdmin } from "@/lib/admin-auth";
import { getDokter, type Dokter } from "@/lib/dokter-actions";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { DeleteDokterButton } from "./DeleteDokterButton";

export const metadata = { title: "Dokter | Admin" };

function initials(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PhotoThumb({ item }: { item: Dokter }) {
  if (item.foto_url) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[var(--teal-soft)]">
        <SmartImage src={item.foto_url} alt={item.nama} fill className="object-cover" sizes="48px" />
      </div>
    );
  }
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--teal-soft)] text-sm font-bold text-[var(--navy)]"
      aria-hidden="true"
    >
      {initials(item.nama) || "Dr"}
    </div>
  );
}

export default async function ManajemenDokterPage() {
  await requireAdmin();
  const dokter = await getDokter();
  const action = (item: Dokter) => (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/dokter/${item.id}/edit`}
        className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]"
      >
        Edit
      </Link>
      <DeleteDokterButton id={item.id} />
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Fasyankes</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Manajemen Dokter</h1>
          <p className="mt-2 text-[var(--muted)]">
            Kelola foto, nama, dan poli dokter yang tampil di blok Pelayanan.
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Jadwal praktik tetap dikelola di menu Jadwal Dokter.
          </p>
        </div>
        <Link href="/admin/dokter/tambah" className="button-primary">
          + Tambah Dokter
        </Link>
      </header>

      {dokter.length === 0 ? (
        <div className="panel p-10 text-center text-[var(--muted)]">Belum ada data dokter.</div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {dokter.map((item) => (
              <article key={item.id} className="panel p-5">
                <div className="flex items-center gap-3">
                  <PhotoThumb item={item} />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[var(--navy)]">{item.nama}</h2>
                    <p className="text-sm text-[var(--teal)]">{item.poli}</p>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm text-[var(--muted)]">
                  <div>
                    <dt className="font-medium text-[var(--ink)]">Urutan</dt>
                    <dd>{item.urutan}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--ink)]">Status</dt>
                    <dd>{item.aktif ? "Aktif" : "Nonaktif"}</dd>
                  </div>
                </dl>
                <div className="mt-4">{action(item)}</div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)] md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)]">
                  <th className="p-4 font-semibold text-[var(--navy)]">Foto</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Nama</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Poli</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Urutan</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Status</th>
                  <th className="p-4 font-semibold text-[var(--navy)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dokter.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="p-4">
                      <PhotoThumb item={item} />
                    </td>
                    <td className="p-4 font-medium text-[var(--ink)]">{item.nama}</td>
                    <td className="p-4 text-sm text-[var(--muted)]">{item.poli}</td>
                    <td className="p-4 text-sm text-[var(--muted)]">{item.urutan}</td>
                    <td className="p-4 text-sm text-[var(--muted)]">{item.aktif ? "Aktif" : "Nonaktif"}</td>
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
