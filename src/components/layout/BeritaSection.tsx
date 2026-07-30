import Link from "next/link";
import { getBeritaKesehatan } from "@/lib/actions";
import SmartImage from "@/components/ui/SmartImage";
import SectionHeading from "./SectionHeading";

const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 400 300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e8f4f3%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2216%22 fill%3D%22%230f766e%22%3EBerita%3C%2Ftext%3E%3C%2Fsvg%3E";

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
              const imgUrl = berita.imageUrl || PLACEHOLDER;
              return (
                <article
                  key={berita.id}
                  className="group panel panel-lift relative flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 w-full shrink-0 overflow-hidden bg-clinic-soft">
                    <SmartImage
                      src={imgUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
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
