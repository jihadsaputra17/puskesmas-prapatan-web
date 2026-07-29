import { Metadata } from "next";
import { getBeritaBySlug } from "../../../../../lib/actions";
import EditBeritaForm from "./EditBeritaForm";

export const metadata: Metadata = {
  title: "Edit Berita | Admin",
};

export default async function EditBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const berita = await getBeritaBySlug(resolvedParams.slug);

  if (!berita) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Berita Tidak Ditemukan</h1>
        <p className="text-slate-600">Berita yang ingin Anda edit tidak ada di database.</p>
      </div>
    );
  }

  return <EditBeritaForm berita={berita} />;
}