import { Metadata } from "next";
import Link from "next/link";
import { getBeritaKesehatan } from "../../lib/actions";
import { parseArticleImages } from "../../lib/article-images";
import DefaultCoverBanner from "../../components/ui/DefaultCoverBanner";
import SmartImage from "../../components/ui/SmartImage";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description:
    "Berita terbaru, pengumuman, dan artikel kesehatan dari Puskesmas Prapatan.",
};

type BeritaCard = {
  id: string;
  imageUrl?: string;
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
};

export default async function BeritaPage() {
  const beritaData = (await getBeritaKesehatan({ limit: 24 })) as BeritaCard[];

  return (
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Informasi</p>
          <h1 className="page-intro-title mt-3">Berita &amp; informasi</h1>
          <p className="page-intro-copy">
            Kabar, pengumuman, dan informasi kesehatan dari Puskesmas Prapatan.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="content-container">
          {beritaData.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {beritaData.map((berita) => {
                const photos = parseArticleImages(berita.imageUrl);
                const coverUrl = photos[0] || "";
                return (
                  <article
                    key={berita.id}
                    className="group panel panel-lift relative flex flex-col overflow-hidden"
                  >
                    <div className="relative h-48 w-full shrink-0 overflow-hidden bg-clinic-soft">
                      {coverUrl ? (
                        <SmartImage
                          src={coverUrl}
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
                      {photos.length > 1 && (
                        <span className="absolute right-3 top-3 z-20 rounded-full bg-navy/85 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                          {photos.length} Foto
                        </span>
                      )}
                    </div>
                    <div className="flex flex-grow flex-col p-5">
                      <time
                        dateTime={new Date(berita.date).toISOString()}
                        className="text-xs font-semibold uppercase tracking-wide text-clinic-teal"
                      >
                        {new Date(berita.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                      <h2 className="mt-2 text-lg font-bold leading-snug text-navy">
                        <Link
                          href={`/berita/${berita.slug}`}
                          className="before:absolute before:inset-0 focus:outline-none group-hover:text-clinic-teal"
                          aria-label={`Baca selengkapnya mengenai ${berita.title}`}
                        >
                          {berita.title}
                        </Link>
                      </h2>
                      {berita.excerpt && (
                        <p className="mt-3 line-clamp-3 flex-grow text-sm leading-6 text-slate-600">
                          {berita.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="panel p-10 text-center text-slate-500">Belum ada berita.</div>
          )}
        </div>
      </section>
    </>
  );
}
