import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import TambahLayananForm from "./TambahLayananForm";

export const metadata: Metadata = {
  title: "Tambah Layanan | Admin",
};

export default async function TambahLayananPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/layanan" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">&larr; Kembali ke Layanan Poli</Link>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Layanan Baru</h1>
        <p className="text-slate-600 mt-2">Masukkan informasi poli atau layanan baru yang tersedia.</p>
      </header>

      <TambahLayananForm />
    </div>
  );
}