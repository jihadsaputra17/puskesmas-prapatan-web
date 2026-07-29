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
      <div className="min-h-screen bg-slate-100 md:flex">
        <aside className="flex w-full flex-col bg-slate-900 text-slate-300 shadow-xl md:min-h-screen md:w-64">
          <div className="border-b border-slate-800 p-6">
            <h2 className="text-xl font-bold text-white">Panel Admin</h2>
            <p className="mt-1 text-sm text-slate-400">Puskesmas Prapatan</p>
          </div>
          <AdminNav role={role} userName={session?.user?.name ?? undefined} />
          <div className="border-t border-slate-800 p-4">
            <p className="mb-1 truncate text-sm font-medium text-white">{session?.user?.name ?? "Pengguna"}</p>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-teal-400">{role}</p>
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
