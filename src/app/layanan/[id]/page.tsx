import { getLayananById } from "@/lib/layanan-actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import { plainText } from "@/lib/public-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const layanan = await getLayananById(resolvedParams.id);

  if (!layanan) return { title: "Layanan Tidak Ditemukan" };

  return {
    title: layanan.nama_poli,
    description: plainText(layanan.deskripsi).slice(0, 160),
  };
}

export default async function DetailLayananPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const layanan = await getLayananById(resolvedParams.id);

  if (!layanan) {
    notFound();
  }

  const initial = (layanan.nama_poli || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="page-shell">
      <div className="content-container max-w-3xl">
        <Link
          href="/layanan"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-clinic-teal hover:underline"
        >
          ← Kembali ke daftar layanan
        </Link>

        <article className="panel mt-6 overflow-hidden" lang="id">
          <header className="border-b border-slate-100 p-6 sm:p-8">
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-clinic-soft text-xl font-bold text-clinic-teal"
              aria-hidden="true"
            >
              {initial}
            </span>
            <p className="eyebrow mt-5">Layanan poli</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {layanan.nama_poli}
            </h1>
          </header>

          <div
            className="p-6 text-base leading-7 text-slate-700 sm:p-8 sm:text-lg sm:leading-8
              [&_*]:max-w-full [&_*]:break-words
              [&_p]:mb-4
              [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:mb-1
              [&_img]:mx-auto [&_img]:mb-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl
              [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy
              [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy
              [&_a]:text-clinic-teal [&_a]:underline
              [&_strong]:font-bold [&_strong]:text-navy"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(layanan.deskripsi) }}
          />

          <div className="border-t border-slate-100 p-6 sm:p-8">
            <Link
              href={`/jadwal-dokter?poli=${encodeURIComponent(layanan.nama_poli)}`}
              className="button-primary"
            >
              Lihat jadwal {layanan.nama_poli}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
