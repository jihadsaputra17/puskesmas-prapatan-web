import SectionHeading from "./SectionHeading";
import DokterCard from "./DokterCard";
import DokterCarousel from "./DokterCarousel";
import { getDokterPublik } from "@/lib/dokter-actions";

const CAROUSEL_MIN = 4;

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
        {doctors.length >= CAROUSEL_MIN ? (
          <div className="mt-10">
            <DokterCarousel doctors={doctors} />
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <li key={d.id}>
                <DokterCard d={d} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
