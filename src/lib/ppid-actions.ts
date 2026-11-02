import { sql } from "@vercel/postgres";
import type { PpidCategory } from "@/lib/admin-schemas";

export type PpidItem = {
  id: string;
  title: string;
  slug: string;
  category: PpidCategory;
  excerpt: string;
  content: string;
  imageUrl: string;
  fileUrl: string;
  date: string;
};

export const PPID_CATEGORY_META: Record<
  PpidCategory,
  { label: string; shortLabel: string; description: string }
> = {
  berkala: {
    label: "Informasi Berkala",
    shortLabel: "Berkala",
    description:
      "Informasi yang wajib disediakan dan diumumkan secara rutin serta berkala oleh Puskesmas Prapatan (profil, program kerja, laporan kinerja, dan standar layanan).",
  },
  "serta-merta": {
    label: "Informasi Serta Merta",
    shortLabel: "Serta Merta",
    description:
      "Informasi yang berkaitan dengan hajat hidup orang banyak serta ketertiban dan keselamatan umum (peringatan dini wabah, bencana kesehatan, atau pengumuman darurat layanan).",
  },
  "setiap-saat": {
    label: "Informasi Setiap Saat",
    shortLabel: "Setiap Saat",
    description:
      "Informasi yang wajib tersedia untuk diakses oleh pemohon informasi publik setiap saat (Daftar Informasi Publik, SOP pelayanan, rencana strategis, dan dokumen publik).",
  },
  regulasi: {
    label: "Regulasi & Standar Pelayanan",
    shortLabel: "Regulasi & SOP",
    description:
      "Peraturan, Surat Keputusan (SK), Maklumat Pelayanan, tarif retribusi resmi, serta pedoman pelaksanaan keterbukaan informasi publik.",
  },
};

export function getPpidCategoryLabel(category?: string): string {
  if (!category) return PPID_CATEGORY_META.berkala.label;
  return (
    PPID_CATEGORY_META[category as PpidCategory]?.label ??
    PPID_CATEGORY_META.berkala.label
  );
}

function mapPpidRow(row: Record<string, unknown>): PpidItem {
  const rawCat = String(row.category ?? "berkala");
  const validCat: PpidCategory =
    rawCat === "berkala" ||
    rawCat === "serta-merta" ||
    rawCat === "setiap-saat" ||
    rawCat === "regulasi"
      ? rawCat
      : "berkala";

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

export async function getPpidCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM ppid_items`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Database Error - getPpidCount:", error);
    return 0;
  }
}

export async function getPpidItems(options?: {
  limit?: number;
  category?: string;
  excludeSlug?: string;
}): Promise<PpidItem[]> {
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);
  const excludeSlug = options?.excludeSlug?.trim() || null;
  const category = options?.category?.trim() || null;

  try {
    if (excludeSlug && category) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM ppid_items
        WHERE slug <> ${excludeSlug} AND category = ${category}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapPpidRow(r as Record<string, unknown>));
    }

    if (excludeSlug) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM ppid_items
        WHERE slug <> ${excludeSlug}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapPpidRow(r as Record<string, unknown>));
    }

    if (category) {
      const { rows } = await sql`
        SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
        FROM ppid_items
        WHERE category = ${category}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => mapPpidRow(r as Record<string, unknown>));
    }

    const { rows } = await sql`
      SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
      FROM ppid_items
      ORDER BY published_at DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => mapPpidRow(r as Record<string, unknown>));
  } catch (error) {
    console.error("Database Error - getPpidItems:", error);
    return [];
  }
}

export async function getPpidBySlug(slug: string): Promise<PpidItem | null> {
  try {
    const cleanSlug = slug.trim();
    if (!cleanSlug) return null;
    const { rows } = await sql`
      SELECT id, title, slug, category, excerpt, content, image_url, file_url, published_at
      FROM ppid_items
      WHERE slug = ${cleanSlug}
      LIMIT 1
    `;
    return rows[0] ? mapPpidRow(rows[0] as Record<string, unknown>) : null;
  } catch (error) {
    console.error("Database Error - getPpidBySlug:", error);
    return null;
  }
}
