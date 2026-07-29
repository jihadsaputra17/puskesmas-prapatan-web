import { getServerSession } from "next-auth";
import { getSettings } from "@/lib/settings-actions";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./SettingsForm";

export const metadata = {
  title: "Pengaturan Situs | Admin",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  // Proteksi rute yang aman tanpa 'as any'
  if (session?.user?.role !== 'superadmin') {
    redirect('/admin');
  }

  // Ambil data pengaturan yang ada di database saat ini
  const settings = await getSettings();

  return (
    <div className="max-w-4xl">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pengaturan Situs</h1>
          <p className="text-slate-600 mt-2">Ubah informasi kontak, teks sambutan, dan detail publik website di sini.</p>
        </div>
      </header>

      {/* Gunakan Komponen Client di sini */}
      <SettingsForm settings={settings} />
    </div>
  );
}