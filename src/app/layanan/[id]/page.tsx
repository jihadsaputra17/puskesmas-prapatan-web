import { getLayananById } from "@/lib/layanan-actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

// SEO Dinamis menyesuaikan nama Poli
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const layanan = await getLayananById(resolvedParams.id);
  
  if (!layanan) return { title: "Layanan Tidak Ditemukan" };
  
  return {
    title: `${layanan.nama_poli} | Puskesmas Prapatan`,
    description: layanan.deskripsi,
  };
}

export default async function DetailLayananPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const layanan = await getLayananById(resolvedParams.id);

  if (!layanan) {
    notFound();
  }

  return (
    <main className="bg-white min-h-[70vh] py-16 md:py-24 overflow-x-hidden max-w-[100vw]">
      {/* overflow-x-hidden di sini adalah kunci mutlak agar halaman TIDAK BISA digeser ke kanan */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-10">
          <Link href="/#layanan" className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors focus:outline-none focus:underline">
            &larr; Kembali ke Daftar Layanan
          </Link>
        </div>

        <article lang="id">
          <header className="mb-12 border-b border-slate-200 pb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 text-teal-600 rounded-full text-5xl mb-6 shadow-sm border border-teal-100">
              {layanan.icon}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium mb-4">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">Layanan Poli</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {layanan.nama_poli}
            </h1>
          </header>

          <div 
            className="w-full text-slate-700 text-lg md:text-xl leading-relaxed text-justify break-words
              [&_*]:!whitespace-normal [&_*]:!break-words [&_*]:!max-w-full [&_*]:!w-auto
              [&_p]:mb-5 
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:mb-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:mx-auto [&_img]:mb-5 [&_img]:shadow-sm
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-left
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-left
              [&_a]:text-teal-600 [&_a]:underline hover:[&_a]:text-teal-700 [&_a]:!break-words
              [&_strong]:font-bold [&_strong]:text-slate-900
              [&_.ql-align-center]:!text-center [&_.ql-align-right]:!text-right [&_.ql-align-justify]:!text-justify"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(layanan.deskripsi) }}
          />
          
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-center sm:justify-start">
            <Link href={`/jadwal-dokter?poli=${encodeURIComponent(layanan.nama_poli)}`} className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
              Lihat Jadwal Dokter {layanan.nama_poli} &rarr;
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}