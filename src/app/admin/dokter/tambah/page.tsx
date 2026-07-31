import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import TambahDokterForm from "./TambahDokterForm";

export const metadata: Metadata = {
  title: "Tambah Dokter | Admin",
};

export default async function TambahDokterPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link
          href="/admin/dokter"
          className="mb-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          &larr; Kembali ke Manajemen Dokter
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Dokter</h1>
        <p className="mt-2 text-slate-600">
          Masukkan nama, poli, dan foto dokter untuk ditampilkan di blok Pelayanan.
        </p>
      </header>

      <TambahDokterForm />
    </div>
  );
}
