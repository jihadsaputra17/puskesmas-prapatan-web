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
    <>
      <section className="page-intro">
        <div className="content-container max-w-3xl">
          <p className="eyebrow">Profil</p>
          <h1 className="page-intro-title mt-3">{name}</h1>
          <p className="page-intro-copy">
            Informasi resmi tentang layanan dan pembaruan puskesmas tersedia melalui halaman ini.
          </p>
        </div>
      </section>
      <section className="page-shell">
        <div className="content-container max-w-3xl">
          <div className="panel p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy">Informasi profil</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Profil rinci, visi, misi, dan riwayat akan ditampilkan setelah informasi tersebut
              dikonfirmasi dan diperbarui oleh puskesmas.
            </p>
            {(settings.address || settings.phone || settings.email) && (
              <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                {settings.address && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Alamat</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700">{settings.address}</dd>
                  </div>
                )}
                {settings.phone && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Telepon</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700">{settings.phone}</dd>
                  </div>
                )}
                {settings.email && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-700">{settings.email}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
