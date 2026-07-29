import { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import TambahJadwalForm from "./TambahJadwalForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tambah Jadwal Dokter | Admin",
};

export default async function TambahJadwalPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/jadwal" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">&larr; Kembali ke Jadwal Dokter</Link>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Jadwal Baru</h1>
        <p className="text-slate-600 mt-2">Masukkan informasi dokter dan waktu praktiknya ke dalam sistem.</p>
      </header>

      <TambahJadwalForm />
    </div>
  );
}