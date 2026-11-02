import Link from "next/link";
import { getBeritaKesehatan } from "@/lib/actions";
import DefaultCoverBanner from "@/components/ui/DefaultCoverBanner";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "./SectionHeading";

export default async function BeritaSection() {
  const rawBerita = await getBeritaKesehatan();
  const beritaData = (rawBerita as Array<{
    id: string;
    imageUrl?: string;
    title: string;
    date: string;
    slug: string;
    excerpt?: string;
  }>).slice(0, 3);

  return (
    <section className="section-band bg-clinic-wash" aria-labelledby="berita-heading">
      <div className="content-container">
        <SectionHeading
          id="berita-heading"
          eyebrow="Informasi"
          title="Berita terbaru"
          description="Kabar dan informasi seputar layanan serta kegiatan kesehatan."
          action={
            <Link href="/berita" className="button-secondary">
              Semua berita
            </Link>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beritaData.length > 0 ? (
            beritaData.map((berita) => {
              return (
                <article
                  key={berita.id}
                  className="group panel panel-lift relative flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 w-full shrink-0 overflow-hidden bg-clinic-soft">
                    {berita.imageUrl ? (
                      <SmartImage
                        src={berita.imageUrl}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <DefaultCoverBanner
                        title={berita.title}
                        badge="Berita & Informasi"
                        variant="card"
                      />
                    )}
                  </div>
                  <div className="flex flex-grow flex-col p-5">
                    <time className="text-xs font-semibold uppercase tracking-wide text-clinic-teal">
                      {new Date(berita.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-navy">
                      <Link
                        href={`/berita/${berita.slug}`}
                        className="before:absolute before:inset-0 focus:outline-none group-hover:text-clinic-teal"
                      >
                        {berita.title}
                      </Link>
                    </h3>
                    {berita.excerpt && (
                      <p className="mt-3 line-clamp-3 flex-grow text-sm leading-6 text-slate-600">
                        {berita.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="panel col-span-full p-10 text-center text-slate-500">
              Belum ada berita.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
