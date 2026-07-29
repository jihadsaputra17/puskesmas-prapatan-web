import { requireSuperadmin } from "@/lib/admin-auth";
import Link from "next/link";
import { getUsers } from "@/lib/user-actions";
import DeleteUserButton from "./DeleteUserButton";

export const metadata = {
  title: "Manajemen User | Admin",
};

export default async function ManajemenUserPage() {
  const session = await requireSuperadmin();
  const users = await getUsers();

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen User</h1>
          <p className="text-slate-600 mt-2">Kelola akses akun pegawai dan administrator website.</p>
        </div>
        <Link 
          href="/admin/users/tambah" 
          className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          + Tambah Akun
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="px-6 py-4 font-semibold">Nama Pegawai</th>
                <th className="px-6 py-4 font-semibold">Email / Username</th>
                <th className="px-6 py-4 font-semibold">Hak Akses</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                    <Link href={`/admin/users/${user.id}/reset`} className="text-sm text-teal-600 hover:text-teal-800 font-medium">
                      Reset Password
                    </Link>
                    {/* Sembunyikan tombol hapus untuk akun diri sendiri */}
                    {session.id !== user.id && (
                      <DeleteUserButton id={user.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}