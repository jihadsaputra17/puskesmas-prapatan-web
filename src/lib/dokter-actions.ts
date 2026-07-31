import { sql } from "@vercel/postgres";

export type Dokter = {
  id: string;
  nama: string;
  poli: string;
  foto_url: string;
  urutan: number;
  aktif: boolean;
  created_at?: string;
};

function mapRow(row: Record<string, unknown>): Dokter {
  return {
    id: String(row.id),
    nama: String(row.nama ?? ""),
    poli: String(row.poli ?? ""),
    foto_url: String(row.foto_url ?? ""),
    urutan: Number(row.urutan ?? 0),
    aktif: row.aktif === true || row.aktif === "t" || row.aktif === "true",
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

export async function getDokter(): Promise<Dokter[]> {
  try {
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      ORDER BY urutan ASC, nama ASC
    `;
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getDokterById(id: string): Promise<Dokter | null> {
  try {
    const cleanId = id.trim();
    if (!cleanId) return null;
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      WHERE id = ${cleanId}::uuid
      LIMIT 1
    `;
    const row = rows[0];
    return row ? mapRow(row as Record<string, unknown>) : null;
  } catch (error) {
    console.error("Database Error - getDokterById:", error);
    return null;
  }
}

export async function getDokterPublik(): Promise<Dokter[]> {
  try {
    const { rows } = await sql`
      SELECT id, nama, poli, foto_url, urutan, aktif, created_at
      FROM dokter
      WHERE aktif = true
      ORDER BY urutan ASC, nama ASC
    `;
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  } catch (error) {
    console.error("Database Error - getDokterPublik:", error);
    return [];
  }
}
