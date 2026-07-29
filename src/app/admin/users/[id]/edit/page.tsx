import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/user-actions";
import EditUserForm from "./EditUserForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit User | Admin",
};

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  const resolvedParams = await params;
  const user = await getUserById(resolvedParams.id);

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengguna Tidak Ditemukan</h1>
        <p className="text-slate-600 mt-2">Pengguna dengan ID ini tidak dapat ditemukan di database.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/users" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">
          &larr; Kembali ke Manajemen User
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Akun Pegawai</h1>
        <p className="text-slate-600 mt-2">Ubah informasi dan hak akses untuk <span className="font-semibold">{user.name}</span>.</p>
      </header>

      <EditUserForm user={user} />
    </div>
  );
}