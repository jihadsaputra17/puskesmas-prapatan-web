import SmartImage from "@/components/ui/SmartImage";
import type { Dokter } from "@/lib/dokter-actions";

function initials(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function DokterCard({ d }: { d: Dokter }) {
  return (
    <article className="panel panel-lift flex h-full flex-col overflow-hidden">
      {d.foto_url ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--teal-soft)]">
          <SmartImage
            src={d.foto_url}
            alt={d.nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div
          className="flex aspect-[4/5] w-full items-center justify-center bg-[var(--teal-soft)] text-3xl font-bold text-[var(--navy)]"
          aria-hidden="true"
        >
          {initials(d.nama) || "Dr"}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="text-base font-bold tracking-tight text-navy">{d.nama}</h3>
        <p className="text-sm font-medium text-[var(--teal)]">{d.poli}</p>
      </div>
    </article>
  );
}
