import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/user-actions";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Admin",
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ id: string }> }) {
  // Mengambil data sesi dan data pengguna secara sekuensial untuk stabilitas.
  const session = await getServerSession(authOptions);

  // Proteksi ganda: Hanya superadmin yang bisa mengakses
  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  // Ekstrak params menggunakan await sesuai aturan Next.js versi terbaru
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
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
        <p className="text-slate-600 mt-2">
          Anda akan mereset password untuk pengguna: <span className="font-semibold text-slate-800">{user.name} ({user.email})</span>.
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mt-4 border border-amber-200">
          <strong>Perhatian:</strong> Setelah password direset, password lama tidak akan berlaku lagi. Berikan password baru kepada pengguna yang bersangkutan.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <ResetPasswordForm userId={user.id} />
      </div>
    </>
  );
}