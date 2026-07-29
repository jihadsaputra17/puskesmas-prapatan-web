import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getBeritaCount, getBeritaKesehatan } from "@/lib/actions";
import { getLayananCount } from "@/lib/layanan-actions";
import { getJadwalCount } from "@/lib/jadwal-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard | Puskesmas Prapatan",
};

type LoadResult<T> =
  | { status: "available"; data: T }
  | { status: "unavailable" };

async function loadData<T>(load: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { status: "available", data: await load() };
  } catch {
    return { status: "unavailable" };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const [newsCount, recentNews, layananCount, jadwalCount] = await Promise.all([
    loadData(getBeritaCount),
    loadData(getBeritaKesehatan),
    loadData(getLayananCount),
    loadData(getJadwalCount),
  ]);
  const latestNews = recentNews.status === "available"
    ? recentNews.data[0] as { title?: string; date?: string } | undefined
    : undefined;
  const summaries = [
    ["Berita", newsCount],
    ["Layanan Poli", layananCount],
    ["Jadwal Dokter", jadwalCount],
  ] as const;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Selamat datang, {session?.user?.name || "Admin"}</h1>
        <p className="mt-2 text-slate-600">Ringkasan konten website Puskesmas Prapatan.</p>
      </header>

      <section aria-label="Ringkasan konten" className="grid gap-4 sm:grid-cols-3">
        {summaries.map(([label, result]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            {result.status === "available" ? (
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.data}
              </p>
            ) : (
              <p className="mt-2 text-slate-600">Data belum tersedia.</p>
            )}
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Berita terbaru</h2>
        {recentNews.status === "unavailable" ? (
          <p className="mt-3 text-slate-600">Data belum tersedia.</p>
        ) : latestNews ? (
          <div className="mt-3">
            <p className="font-medium text-slate-800">{latestNews.title || "Data belum tersedia."}</p>
            {latestNews.date && <p className="mt-1 text-sm text-slate-600">{new Date(latestNews.date).toLocaleDateString("id-ID")}</p>}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">Belum ada berita.</p>
        )}
      </section>
    </>
  );
}
