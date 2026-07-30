import { sql } from "@vercel/postgres";

export type JadwalDokter = {
  id: string;
  doctor: string;
  poli: string;
  day: string;
  hours: string;
  jam_mulai: string;
  jam_selesai: string;
};

export async function getJadwalDokter(): Promise<JadwalDokter[]> {
  try {
    const { rows } = await sql`
      SELECT id, nama_dokter as doctor,
        poli,
        hari as day,
        jam_mulai || ' - ' || jam_selesai as hours,
        jam_mulai,
        jam_selesai
      FROM jadwal_dokter
      ORDER BY poli ASC, nama_dokter ASC
    `;
    return rows as JadwalDokter[];
  } catch (error) {
    console.error("Database Error - getJadwalDokter:", error);
    throw new Error("Gagal mengambil data jadwal dokter.");
  }
}

export async function getBeritaCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM health_news`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Database Error - getBeritaCount:", error);
    throw new Error("Gagal menghitung data berita kesehatan.");
  }
}

export async function getBeritaKesehatan(options?: {
  limit?: number;
  excludeSlug?: string;
}) {
  const limit = Math.min(Math.max(options?.limit ?? 6, 1), 50);
  const excludeSlug = options?.excludeSlug?.trim() || null;

  try {
    if (excludeSlug) {
      const { rows } = await sql`
        SELECT id, title, slug, excerpt, image_url as "imageUrl", published_at as date
        FROM health_news
        WHERE slug <> ${excludeSlug}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows;
    }

    const { rows } = await sql`
      SELECT id, title, slug, excerpt, image_url as "imageUrl", published_at as date
      FROM health_news
      ORDER BY published_at DESC
      LIMIT ${limit}
    `;
    return rows;
  } catch (error) {
    console.error("Database Error - getBeritaKesehatan:", error);
    throw new Error("Gagal mengambil data berita kesehatan.");
  }
}

export async function getBeritaBySlug(slug: string) {
  try {
    const { rows } = await sql`SELECT * FROM health_news WHERE slug = ${slug} LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error("Database Error - getBeritaBySlug:", error);
    throw new Error("Gagal mengambil detail berita.");
  }
}
