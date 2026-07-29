import { getBeritaBySlug } from "../../../lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ArticleContent from "../../../components/berita/ArticleContent";

// Fitur SEO Dinamis: Judul halaman otomatis menyesuaikan judul berita
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const berita = await getBeritaBySlug(resolvedParams.slug);
  
  if (!berita) return { title: "Berita Tidak Ditemukan" };
  
  return {
    title: `${berita.title} | Puskesmas Prapatan`,
    description: berita.excerpt,
  };
}

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const berita = await getBeritaBySlug(resolvedParams.slug);

  // Jika URL tidak cocok dengan berita apa pun, alihkan ke halaman 404
  if (!berita) {
    notFound();
  }

  // Gunakan gambar dari database, atau fallback jika tidak ada
  const imageUrl = berita.image_url || 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 800 400%22%3E%3Crect width%3D%22800%22 height%3D%22400%22 fill%3D%22%23e2e8f0%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 font-family%3D%22sans-serif%22 font-size%3D%2224%22 fill%3D%22%2364748b%22%3ETidak Ada Gambar%3C%2Ftext%3E%3C%2Fsvg%3E';
  const template = berita.template || 'standard';

  return (
    <main className="bg-white min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/berita" className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 mb-8 transition-colors focus:outline-none focus:underline">
          &larr; Kembali ke Daftar Berita
        </Link>

        {template === 'hero-overlay' ? (
          <div>
            <div className="relative w-full h-[50vh] min-h-[400px] mb-10 overflow-hidden rounded-2xl shadow-lg border border-slate-200">
              <Image src={imageUrl} alt={berita.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 text-white">
                <time className="text-sm font-medium text-teal-400 mb-3 block">
                  {new Date(berita.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
                  {berita.title}
                </h1>
              </div>
            </div>
            <ArticleContent content={berita.content} />
          </div>
        ) : template === 'minimalist' ? (
          <div className="max-w-3xl mx-auto">
            <header className="mb-10 text-center border-b border-slate-200 pb-8">
              <time className="text-sm font-medium text-teal-600 mb-3 block uppercase tracking-widest">
                {new Date(berita.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {berita.title}
              </h1>
            </header>
            <ArticleContent content={berita.content} />
          </div>
        ) : (
          <div>
            <header className="mb-10">
              <time className="text-sm font-medium text-slate-500 mb-3 block">{new Date(berita.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">{berita.title}</h1>
            </header>
            <div className="relative w-full h-64 sm:h-96 lg:h-[480px] bg-slate-100 rounded-2xl overflow-hidden mb-10 shadow-sm border border-slate-200">
              <Image src={imageUrl} alt={berita.title} fill className="object-cover" priority />
            </div>
            <ArticleContent content={berita.content} />
          </div>
        )}
      </div>
    </main>
  );
}