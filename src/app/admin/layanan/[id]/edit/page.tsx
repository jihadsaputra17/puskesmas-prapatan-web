import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLayananById } from "@/lib/layanan-actions";
import EditLayananForm from "./EditLayananForm";

export const metadata: Metadata = {
  title: "Edit Layanan | Admin",
};

export default async function EditLayananPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const resolvedParams = await params;
  const layanan = await getLayananById(resolvedParams.id);

  if (!layanan) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/layanan" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">&larr; Kembali ke Layanan Poli</Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Layanan</h1>
        <p className="text-slate-600 mt-2">Perbarui informasi, emoji, atau deskripsi untuk {layanan.nama_poli}.</p>
      </header>

      <EditLayananForm layanan={layanan} />
    </div>
  );
}