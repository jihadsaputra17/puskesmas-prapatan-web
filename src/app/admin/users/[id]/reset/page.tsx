import { Metadata } from "next";
import { requireSuperadmin } from "@/lib/admin-auth";
import { getUserById } from "@/lib/user-actions";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Admin",
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSuperadmin();
  const resolvedParams = await params;
  const user = await getUserById(resolvedParams.id);

  if (!user) {
    return (
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--navy)]">Pengguna Tidak Ditemukan</h1>
        <p className="mt-2 text-[var(--muted)]">Pengguna dengan ID ini tidak dapat ditemukan di database.</p>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <p className="eyebrow">Akses</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Reset Password</h1>
        <p className="mt-2 text-[var(--muted)]">
          Anda akan mereset password untuk pengguna: <span className="font-semibold text-[var(--ink)]">{user.name} ({user.email})</span>.
        </p>
        <div className="mt-4 rounded-[var(--radius-sm)] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Perhatian:</strong> Setelah password direset, password lama tidak akan berlaku lagi. Berikan password baru kepada pengguna yang bersangkutan.
        </div>
      </header>

      <div className="panel p-8 max-w-2xl">
        <ResetPasswordForm userId={user.id} />
      </div>
    </>
  );
}