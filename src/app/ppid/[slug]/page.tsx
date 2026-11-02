import {
  getPpidBySlug,
  getPpidCategoryLabel,
  getPpidItems,
} from "@/lib/ppid-actions";
import { parsePpidAttachments } from "@/lib/ppid-files";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import ArticleContent from "@/components/berita/ArticleContent";
import ArticleShare from "@/components/berita/ArticleShare";
import PpidDocumentList from "@/components/ppid/PpidDocumentList";
import DefaultCoverBanner from "@/components/ui/DefaultCoverBanner";
import SmartImage from "@/components/ui/SmartImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const item = await getPpidBySlug(resolvedParams.slug);

  if (!item) return { title: "Informasi PPID Tidak Ditemukan" };

  return {
    title: `${item.title} — PPID`,
    description: item.excerpt,
  };
}

function plainTextFromHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readingMinutes(content: string, excerpt?: string) {
  const words = plainTextFromHtml(`${excerpt || ""} ${content}`)
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function DetailPpidPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const item = await getPpidBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const categoryLabel = getPpidCategoryLabel(item.category);
  const attachments = parsePpidAttachments(item.fileUrl);
  const minutes = readingMinutes(String(item.content || ""), String(item.excerpt || ""));
  const published = new Date(item.date);
  const dateLabel = published.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const siteBaseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://pkmprapatanbpn.web.id"
  ).replace(/\/$/, "");
  const shareUrl = `${siteBaseUrl}/ppid/${item.slug}`;

  const related = await getPpidItems({
    limit: 3,
    excludeSlug: item.slug,
  });

  return (
    <div className="bg-white">
      <nav
        className="content-container max-w-4xl pt-5 text-[0.8125rem] text-slate-400"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-x-1">
          <li>
            <Link href="/" className="text-slate-600 transition hover:text-clinic-teal">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">
            /
          </li>
          <li>
            <Link href="/ppid" className="text-slate-600 transition hover:text-clinic-teal">
              PPID
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">
            /
          </li>
          <li className="truncate text-slate-600" aria-current="page">
            {item.title}
          </li>
        </ol>
      </nav>

      <header className="content-container max-w-4xl pb-8 pt-6">
        <span className="inline-flex items-center rounded-full bg-clinic-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-clinic-teal">
          {categoryLabel}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
          {item.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-clinic-teal to-navy text-xs font-bold text-white"
              aria-hidden="true"
            >
              PP
            </span>
            <span>
              <span className="block font-semibold text-slate-900">PPID Puskesmas Prapatan</span>
              <span className="block text-[0.8125rem] text-slate-400">
                Pejabat Pengelola Informasi dan Dokumentasi
              </span>
            </span>
          </div>
          <span className="hidden text-slate-400 sm:inline" aria-hidden="true">
            •
          </span>
          <time dateTime={published.toISOString()}>{dateLabel}</time>
          <span className="hidden text-slate-400 sm:inline" aria-hidden="true">
            •
          </span>
          <span>{minutes} menit baca</span>
        </div>
      </header>

      <figure className="content-container max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-clinic-soft shadow-[var(--shadow-soft)]">
          {item.imageUrl ? (
            <SmartImage
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          ) : (
            <DefaultCoverBanner
              title={item.title}
              badge={`PPID · ${categoryLabel}`}
              subtitle="Pejabat Pengelola Informasi dan Dokumentasi · Puskesmas Prapatan"
              variant="hero"
            />
          )}
        </div>
        {item.excerpt ? (
          <figcaption className="mt-2.5 text-center text-[0.8125rem] text-slate-400">
            {item.excerpt}
          </figcaption>
        ) : null}
      </figure>

      <div className="content-container max-w-4xl pb-4 pt-8">
        {item.excerpt ? (
          <p className="article-lead mb-6 text-xl font-medium leading-relaxed text-slate-900">
            {String(item.excerpt || "")
              .replace(/&nbsp;/gi, " ")
              .replace(/\u00A0/g, " ")
              .replace(/\s+/g, " ")
              .trim()}
          </p>
        ) : null}

        <ArticleContent content={String(item.content || "")} />

        <PpidDocumentList attachments={attachments} parentTitle={String(item.title)} />

        <ArticleShare title={String(item.title)} url={shareUrl} />

        <div className="mt-10 flex items-center gap-4 rounded-[var(--radius)] bg-slate-100 p-5">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-clinic-teal to-navy text-sm font-bold text-white"
            aria-hidden="true"
          >
            PP
          </span>
          <div>
            <p className="font-bold text-navy">PPID UPTD Puskesmas Prapatan</p>
            <p className="text-[0.8125rem] text-slate-600">
              Pelayanan &amp; Keterbukaan Informasi Publik · Kota Balikpapan
            </p>
          </div>
        </div>

        <Link
          href="/ppid"
          className="mt-7 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-clinic-teal hover:underline"
        >
          ← Kembali ke halaman PPID
        </Link>
      </div>

      {related.length > 0 ? (
        <section
          className="mt-8 bg-clinic-wash py-12 md:py-14"
          aria-labelledby="related-ppid-heading"
        >
          <div className="content-container max-w-5xl">
            <h2
              id="related-ppid-heading"
              className="text-[1.375rem] font-extrabold tracking-tight text-navy"
            >
              Informasi PPID lainnya
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => {
                const relDate = new Date(rel.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <Link
                    key={rel.id}
                    href={`/ppid/${rel.slug}`}
                    className="group panel panel-lift overflow-hidden"
                  >
                    <div className="relative h-[8.5rem] w-full overflow-hidden bg-clinic-soft">
                      {rel.imageUrl ? (
                        <SmartImage
                          src={rel.imageUrl}
                          alt=""
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <DefaultCoverBanner
                          title={rel.title}
                          badge="PPID Puskesmas Prapatan"
                          variant="compact"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[0.6875rem] font-bold uppercase tracking-wide text-clinic-teal">
                        {getPpidCategoryLabel(rel.category)} · {relDate}
                      </span>
                      <h3 className="mt-1.5 text-[0.9375rem] font-bold leading-snug text-navy group-hover:text-clinic-teal">
                        {rel.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
