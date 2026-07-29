import { getLayanan } from "@/lib/layanan-actions";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";
import Link from "next/link";

type Layanan = { id: string; icon: string; nama_poli: string; deskripsi: string };

export default async function LayananSection() {
  // Mengambil data langsung dari database
  const layanan = await getLayanan();

  return (
    <section className="py-16 bg-white" id="layanan">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Layanan Poli Kami
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan kesehatan primer yang terjangkau dan berkualitas untuk masyarakat.
          </p>
        </div>

        {layanan && layanan.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(layanan as Layanan[]).map((item) => (
              <Link 
                href={`/layanan/${item.id}`}
                key={item.id} 
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.nama_poli}
                </h3>
                <div 
                  className="prose prose-slate max-w-none prose-sm text-slate-600 line-clamp-3 flex-grow w-full break-words [&_*]:!whitespace-pre-wrap [&_*]:!m-0 [&_img]:hidden [&_.ql-align-justify]:text-justify"
                  dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(item.deskripsi) }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500">Belum ada layanan yang ditambahkan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
