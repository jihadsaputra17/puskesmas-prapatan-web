import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddUserForm from "../AddUserForm";

export const metadata: Metadata = {
  title: "Tambah User | Admin",
};

export default async function TambahUserPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/users" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">
          &larr; Kembali ke Manajemen User
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Akun Pegawai</h1>
        <p className="text-slate-600 mt-2">Buat akun baru untuk pegawai atau administrator.</p>
      </header>

      {/* Memanggil komponen AddUserForm yang sudah menggunakan API Route stabil */}
      <AddUserForm />
    </div>
  );
}
