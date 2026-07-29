import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const { role } = await requireAdmin();
    const session = await getServerSession(authOptions);

    return (
      <div className="min-h-screen bg-[var(--sky-wash)] md:flex">
        <aside className="flex w-full flex-col bg-[var(--navy-deep)] text-[var(--muted)] shadow-[var(--shadow-lift)] md:min-h-screen md:w-64">
          <div className="border-b border-[var(--navy)] p-6">
            <h2 className="text-xl font-bold text-white">Panel Admin</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Puskesmas Prapatan</p>
          </div>
          <AdminNav role={role} userName={session?.user?.name ?? undefined} />
          <div className="border-t border-[var(--navy)] p-4">
            <p className="mb-1 truncate text-sm font-medium text-white">{session?.user?.name ?? "Pengguna"}</p>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">{role}</p>
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    );
  } catch {
    redirect("/login");
  }
}
