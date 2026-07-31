import SectionHeading from "./SectionHeading";
import SmartImage from "@/components/ui/SmartImage";
import { getDokterPublik } from "@/lib/dokter-actions";

function initials(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function DokterSection() {
  const doctors = await getDokterPublik();
  if (doctors.length === 0) return null;

  return (
    <section
      className="section-band bg-[var(--sky-wash)]"
      id="dokter"
      aria-labelledby="dokter-heading"
    >
      <div className="content-container">
        <SectionHeading
          id="dokter-heading"
          eyebrow="Tim medis"
          title="Dokter kami"
          description="Tenaga medis yang melayani di Puskesmas Prapatan sesuai data yang dipublikasikan."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((d) => (
            <li key={d.id}>
              <article className="panel panel-lift flex h-full flex-col overflow-hidden">
                {d.foto_url ? (
                  <SmartImage
                    src={d.foto_url}
                    alt={d.nama}
                    width={400}
                    height={500}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
