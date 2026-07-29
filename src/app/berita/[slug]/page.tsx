import { getBeritaBySlug } from "../../../lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ArticleContent from "../../../components/berita/ArticleContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const berita = await getBeritaBySlug(resolvedParams.slug);

  if (!berita) return { title: "Berita Tidak Ditemukan" };

  return {
    title: berita.title,
    description: berita.excerpt,
  };
}

const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 800 400%22%3E%3Crect width%3D%22800%22 height%3D%22400%22 fill%3D%22%23e8f4f3%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 fill%3D%22%230f766e%22%3EBerita%3C%2Ftext%3E%3C%2Fsvg%3E";

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const berita = await getBeritaBySlug(resolvedParams.slug);

  if (!berita) {
    notFound();
  }

  const imageUrl = berita.image_url || PLACEHOLDER;
  const template = berita.template || "standard";
  const dateLabel = new Date(berita.published_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-shell">
      <div className="content-container max-w-3xl">
        <Link
          href="/berita"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-clinic-teal hover:underline"
        >
          ← Kembali ke daftar berita
        </Link>

        {template === "hero-overlay" ? (
          <article className="mt-6">
            <div className="relative mb-8 h-[42vh] min-h-[320px] overflow-hidden rounded-[18px] border border-slate-200 shadow-soft">
              <Image src={imageUrl} alt="" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <time className="text-xs font-semibold uppercase tracking-wide text-teal-200">
                  {dateLabel}
                </time>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {berita.title}
                </h1>
              </div>
            </div>
            <ArticleContent content={berita.content} />
          </article>
        ) : template === "minimalist" ? (
          <article className="mt-6">
            <header className="mb-8 border-b border-slate-200 pb-8 text-center">
              <time className="text-xs font-semibold uppercase tracking-[0.14em] text-clinic-teal">
                {dateLabel}
              </time>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {berita.title}
              </h1>
            </header>
            <ArticleContent content={berita.content} />
          </article>
        ) : (
          <article className="mt-6">
            <header className="mb-6">
              <time className="text-xs font-semibold uppercase tracking-wide text-clinic-teal">
                {dateLabel}
              </time>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {berita.title}
              </h1>
            </header>
            <div className="relative mb-8 h-56 overflow-hidden rounded-[18px] border border-slate-200 bg-clinic-soft sm:h-80 lg:h-96">
              <Image src={imageUrl} alt="" fill className="object-cover" priority />
            </div>
            <ArticleContent content={berita.content} />
          </article>
        )}
      </div>
    </div>
  );
}
