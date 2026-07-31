import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDokterById } from "@/lib/dokter-actions";
import EditDokterForm from "./EditDokterForm";

export const metadata: Metadata = {
  title: "Edit Dokter | Admin",
};

export default async function EditDokterPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const resolvedParams = await params;
  const dokter = await getDokterById(resolvedParams.id);

  if (!dokter) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link
          href="/admin/dokter"
          className="mb-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          &larr; Kembali ke Manajemen Dokter
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Dokter</h1>
        <p className="mt-2 text-slate-600">
          Perbarui foto, nama, atau poli untuk <span className="font-semibold">{dokter.nama}</span>.
        </p>
      </header>

      <EditDokterForm dokter={dokter} />
    </div>
  );
}
