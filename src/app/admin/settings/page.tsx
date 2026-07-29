import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings-actions";
import SettingsForm from "./SettingsForm";

export const metadata = {
  title: "Pengaturan Situs | Admin",
};

export default async function SettingsPage() {
  await requireAdmin();

  // Ambil data pengaturan yang ada di database saat ini
  const settings = await getSettings();

  return (
    <div className="max-w-4xl">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="eyebrow">Konfigurasi</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">Pengaturan Situs</h1>
          <p className="mt-2 text-[var(--muted)]">Ubah informasi kontak, teks sambutan, dan detail publik website di sini.</p>
        </div>
      </header>

      {/* Gunakan Komponen Client di sini */}
      <SettingsForm settings={settings} />
    </div>
  );
}
