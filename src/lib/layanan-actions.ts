import { sql } from "@vercel/postgres";

export async function getLayananCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM layanan_poli`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Database Error - getLayananCount:", error);
    throw new Error("Gagal menghitung data layanan.");
  }
}

export async function getLayanan() {
  try {
    const { rows } = await sql`SELECT * FROM layanan_poli ORDER BY created_at ASC`;
    return rows;
  } catch {
    return [];
  }
}

export async function getLayananById(id: string) {
  try {
    const cleanId = id.trim();
    if (!cleanId) return null;
    const { rows } = await sql`SELECT * FROM layanan_poli WHERE id = ${cleanId}::uuid LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}
