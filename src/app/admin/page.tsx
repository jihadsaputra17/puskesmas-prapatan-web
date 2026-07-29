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
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">
          Selamat datang, {session?.user?.name || "Admin"}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--muted)]">
          Ringkasan konten website Puskesmas Prapatan.
        </p>
      </header>

      <section aria-label="Ringkasan konten" className="grid gap-5 sm:grid-cols-3">
        {summaries.map(([label, result]) => (
          <article key={label} className="panel p-5">
            <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
            {result.status === "available" ? (
              <p className="mt-2 text-3xl font-bold text-[var(--navy)]">
                {result.data}
              </p>
            ) : (
              <p className="mt-2 text-[var(--muted)]">Data belum tersedia.</p>
            )}
          </article>
        ))}
      </section>

      <section className="section-band">
        <div className="panel p-6">
          <p className="eyebrow">Terkini</p>
          <h2 className="mt-1 text-lg font-bold text-[var(--navy)]">Berita terbaru</h2>
          {recentNews.status === "unavailable" ? (
            <p className="mt-3 text-[var(--muted)]">Data belum tersedia.</p>
          ) : latestNews ? (
            <div className="accent-bar mt-4">
              <p className="font-medium text-[var(--ink)]">{latestNews.title || "Data belum tersedia."}</p>
              {latestNews.date && <p className="mt-1 text-sm text-[var(--muted)]">{new Date(latestNews.date).toLocaleDateString("id-ID")}</p>}
            </div>
          ) : (
            <p className="mt-3 text-[var(--muted)]">Belum ada berita.</p>
          )}
        </div>
      </section>
    </>
  );
}
