import { Metadata } from "next";
import { getSettings } from "@/lib/settings-actions";

export const metadata: Metadata = {
  title: "Profil",
  description: "Informasi profil Puskesmas Prapatan.",
};

export default async function ProfilPage() {
  const settings = await getSettings();
  const name = settings.site_name || "Puskesmas Prapatan";

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50 py-14 md:py-20">
        <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Profil</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#12304a] sm:text-5xl">{name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Informasi resmi tentang layanan dan pembaruan puskesmas tersedia melalui halaman ini.</p>
        </div>
      </section>
      <section className="container max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#12304a]">Informasi profil</h2>
        <p className="mt-4 leading-7 text-slate-600">Profil rinci, visi, misi, dan riwayat akan ditampilkan setelah informasi tersebut dikonfirmasi dan diperbarui oleh puskesmas.</p>
      </section>
    </main>
  );
}
