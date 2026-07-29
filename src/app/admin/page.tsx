import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getBeritaKesehatan } from "@/lib/actions";
import { getLayanan } from "@/lib/layanan-actions";
import { getJadwal } from "@/lib/jadwal-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Puskesmas Prapatan",
};

async function availableRecords<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const [berita, layanan, jadwal] = await Promise.all([
    availableRecords(getBeritaKesehatan),
    availableRecords(getLayanan),
    availableRecords(getJadwal),
  ]);
  const recentNews = berita[0] as { title?: string; date?: string } | undefined;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Selamat datang, {session?.user?.name || "Admin"}</h1>
        <p className="mt-2 text-slate-600">Ringkasan konten website Puskesmas Prapatan.</p>
      </header>

      <section aria-label="Ringkasan konten" className="grid gap-4 sm:grid-cols-3">
        {[
          ["Berita", berita.length],
          ["Layanan Poli", layanan.length],
          ["Jadwal Dokter", jadwal.length],
        ].map(([label, count]) => (
          <article key={label as string} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{count}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Berita terbaru</h2>
        {recentNews ? (
          <div className="mt-3">
            <p className="font-medium text-slate-800">{recentNews.title || "Data belum tersedia."}</p>
            {recentNews.date && <p className="mt-1 text-sm text-slate-600">{new Date(recentNews.date).toLocaleDateString("id-ID")}</p>}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">Data belum tersedia.</p>
        )}
      </section>
    </>
  );
}
