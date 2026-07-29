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
          <p className="eyebrow">Akses</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Manajemen User</h1>
          <p className="mt-2 text-[var(--muted)]">Kelola akses akun pegawai dan administrator website.</p>
        </div>
        <Link href="/admin/users/tambah" className="button-primary">
          + Tambah Akun
        </Link>
      </header>

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--teal-soft)] text-[var(--navy)]">
                <th className="px-6 py-4 font-semibold">Nama Pegawai</th>
                <th className="px-6 py-4 font-semibold">Email / Username</th>
                <th className="px-6 py-4 font-semibold">Hak Akses</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-[var(--teal-soft)]/50">
                  <td className="px-6 py-4 font-medium text-[var(--ink)]">{user.name}</td>
                  <td className="px-6 py-4 text-[var(--muted)]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-[var(--teal-soft)] text-[var(--teal)]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <Link href={`/admin/users/${user.id}/edit`} className="text-sm font-medium text-[var(--teal)] hover:text-[var(--teal-dark)]">
                      Edit
                    </Link>
                    <Link href={`/admin/users/${user.id}/reset`} className="text-sm font-medium text-[var(--navy)] hover:text-[var(--navy-deep)]">
                      Reset Password
                    </Link>
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