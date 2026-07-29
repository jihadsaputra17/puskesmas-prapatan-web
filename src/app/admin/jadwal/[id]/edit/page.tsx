import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getJadwalById } from "@/lib/jadwal-actions";
import EditJadwalForm from "./EditJadwalForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edit Jadwal Dokter | Admin",
};

export default async function EditJadwalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  const resolvedParams = await params;
  const jadwal = await getJadwalById(resolvedParams.id);

  if (!jadwal) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Jadwal Tidak Ditemukan</h1>
        <p className="text-slate-600 mt-2">Data jadwal dengan ID ini tidak ada di database.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <Link href="/admin/jadwal" className="text-teal-600 hover:text-teal-700 text-sm font-medium mb-4 inline-block">
          &larr; Kembali ke Jadwal Dokter
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Jadwal Dokter</h1>
        <p className="text-slate-600 mt-2">Ubah informasi jadwal untuk <span className="font-semibold">{jadwal.nama_dokter}</span> di hari <span className="font-semibold">{jadwal.hari}</span>.</p>
      </header>

      <EditJadwalForm jadwal={jadwal} />
    </div>
  );
}