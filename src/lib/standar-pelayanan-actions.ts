import { sql } from "@vercel/postgres";
import {
  STANDAR_PELAYANAN_CATEGORIES,
  type StandarPelayananCategory,
} from "@/lib/admin-schemas";

export type StandarPelayananItem = {
  id: string;
  title: string;
  slug: string;
  category: StandarPelayananCategory;
  excerpt: string;
  content: string;
  imageUrl: string;
  fileUrl: string;
  date: string;
};

export const STANDAR_PELAYANAN_CATEGORY_META: Record<
  StandarPelayananCategory,
  { label: string; shortLabel: string; description: string }
> = {
  "standar-pelayanan": {
    label: "Standar Pelayanan Puskesmas",
    shortLabel: "Standar Pelayanan",
    description:
      "Komponen standar pelayanan pada tiap unit/poli UPTD Puskesmas Prapatan meliputi persyaratan, prosedur, waktu pelayanan, biaya/tarif, produk pelayanan, dan pengelolaan pengaduan.",
  },
  "maklumat-pelayanan": {
    label: "Maklumat Pelayanan & Janji Layanan",
    shortLabel: "Maklumat Pelayanan",
    description:
      "Pernyataan tertulis kesanggupan dan komitmen seluruh penyelenggara UPTD Puskesmas Prapatan dalam memberikan pelayanan sesuai standar yang telah ditetapkan.",
  },
  "sop-alur": {
    label: "SOP & Alur Pelayanan",
    shortLabel: "SOP & Alur",
    description:
      "Standar Operasional Prosedur (SOP) serta bagan alur pelayanan pasien dari pendaftaran, pemeriksaan poli, penunjang, hingga penyerahan obat dan rujukan.",
  },
  "tarif-biaya": {
    label: "Tarif / Biaya Pelayanan Kesehatan",
    shortLabel: "Tarif & Biaya",
    description:
      "Informasi transparan mengenai tarif retribusi pelayanan kesehatan daerah Kota Balikpapan bagi pasien umum serta ketentuan penjaminan peserta BPJS Kesehatan.",
  },
  "survei-kepuasan": {
    label: "Survei Kepuasan Masyarakat (SKM / IKM)",
    shortLabel: "Survei Kepuasan (SKM)",
    description:
      "Hasil pengukuran berkala Indeks Kepuasan Masyarakat (IKM) dan tindak lanjut peningkatan mutu pelayanan publik di UPTD Puskesmas Prapatan.",
  },
  "kompensasi-pengaduan": {
    label: "Kompensasi & Penanganan Pengaduan Layanan",
    shortLabel: "Kompensasi & Pengaduan",
    description:
      "Kebijakan pemberian kompensasi layanan apabila pelayanan tidak sesuai standar serta mekanisme penanganan saran, masukan, dan pengaduan masyarakat.",
  },
};

export function getStandarPelayananCategoryLabel(category?: string): string {
  if (!category) return STANDAR_PELAYANAN_CATEGORY_META["standar-pelayanan"].label;
  return (
    STANDAR_PELAYANAN_CATEGORY_META[category as StandarPelayananCategory]?.label ??
    STANDAR_PELAYANAN_CATEGORY_META["standar-pelayanan"].label
  );
}

export function getStandarPelayananCategoryShortLabel(category?: string): string {
  if (!category) return STANDAR_PELAYANAN_CATEGORY_META["standar-pelayanan"].shortLabel;
  return (
    STANDAR_PELAYANAN_CATEGORY_META[category as StandarPelayananCategory]?.shortLabel ??
    STANDAR_PELAYANAN_CATEGORY_META["standar-pelayanan"].shortLabel
  );
}

function mapStandarPelayananRow(row: Record<string, unknown>): StandarPelayananItem {
  const rawCat = String(row.category ?? "standar-pelayanan");
  const validCat: StandarPelayananCategory = (
    STANDAR_PELAYANAN_CATEGORIES as readonly string[]
  ).includes(rawCat)
    ? (rawCat as StandarPelayananCategory)
    : "standar-pelayanan";

  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    category: validCat,
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    imageUrl: String(row.image_url ?? row.imageUrl ?? ""),
    fileUrl: String(row.file_url ?? row.fileUrl ?? ""),
    date: row.published_at
      ? new Date(String(row.published_at)).toISOString()
      : row.date
        ? new Date(String(row.date)).toISOString()
        : new Date().toISOString(),
  };
}

export async function getStandarPelayananCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM standar_pelayanan_items`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Database Error - getStandarPelayananCount:", error);
    return 0;
  }
}

export async function getStandarPelayananItems(options?: {
  limit?: number;
  category?: string;
  excludeSlug?: string;
}): Promise<StandarPelayananItem[]> {
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);
  const excludeSlug = options?.excludeSlug?.trim() || null;
  const category = options?.category?.trim() || null;

  try {
    if (excludeSlug && category) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM standar_pelayanan_items
        WHERE slug <> ${excludeSlug} AND category = ${category}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapStandarPelayananRow(r as Record<string, unknown>));
    }

    if (excludeSlug) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM standar_pelayanan_items
        WHERE slug <> ${excludeSlug}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapStandarPelayananRow(r as Record<string, unknown>));
    }

    if (category) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM standar_pelayanan_items
        WHERE category = ${category}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapStandarPelayananRow(r as Record<string, unknown>));
    }

    const { rows } = await sql`
      SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
      FROM standar_pelayanan_items
      ORDER BY published_at DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => mapStandarPelayananRow(r as Record<string, unknown>));
  } catch (error) {
    console.error("Database Error - getStandarPelayananItems:", error);
    return [];
  }
}

export async function getStandarPelayananBySlug(
  slug: string,
): Promise<StandarPelayananItem | null> {
  try {
    const cleanSlug = slug.trim();
    if (!cleanSlug) return null;
    const { rows } = await sql`
      SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
      FROM standar_pelayanan_items
      WHERE slug = ${cleanSlug}
      LIMIT 1
    `;
    return rows[0] ? mapStandarPelayananRow(rows[0] as Record<string, unknown>) : null;
  } catch (error) {
    console.error("Database Error - getStandarPelayananBySlug:", error);
    return null;
  }
}
