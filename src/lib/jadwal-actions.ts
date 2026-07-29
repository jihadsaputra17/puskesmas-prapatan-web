import { sql } from "@vercel/postgres";

export async function getJadwalCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM jadwal_dokter`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error("Database Error - getJadwalCount:", error);
    throw new Error("Gagal menghitung data jadwal dokter.");
  }
}

export async function getJadwal() {
  const { rows } = await sql`SELECT * FROM jadwal_dokter ORDER BY poli ASC, hari ASC`;
  return rows;
}

export async function getJadwalById(id: string) {
  try {
    const cleanId = id.trim();
    if (!cleanId) return null;
    const { rows } = await sql`SELECT * FROM jadwal_dokter WHERE id = ${cleanId}::uuid LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}
