"use server";

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function initLayananTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS layanan_poli (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nama_poli VARCHAR(255) NOT NULL,
        deskripsi TEXT NOT NULL,
        icon VARCHAR(100) DEFAULT '🏥',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error('Database Error - initLayananTable:', error);
  }
}

export async function deleteLayanan(id: string) {
  try {
    const cleanId = id ? id.trim() : '';
    if (!cleanId) return { error: "ID tidak valid" };
    await sql`DELETE FROM layanan_poli WHERE id = ${cleanId}::uuid`;
    revalidatePath('/admin/layanan');
    revalidatePath('/layanan');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Database Error - deleteLayanan:', error);
    return { error: 'Gagal menghapus layanan dari database.' };
  }
}

export async function getLayananCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM layanan_poli`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error('Database Error - getLayananCount:', error);
    throw new Error('Gagal menghitung data layanan.');
  }
}

export async function getLayanan() {
  try {
    const { rows } = await sql`SELECT * FROM layanan_poli ORDER BY created_at ASC`;
    return rows;
  } catch (error) {
    // Mengembalikan array kosong jika tabel belum ada tanpa memblokir halaman
    return [];
  }
}

export async function getLayananById(id: string) {
  try {
    const cleanId = id ? id.trim() : '';
    if (!cleanId) return null;
    const { rows } = await sql`SELECT * FROM layanan_poli WHERE id = ${cleanId}::uuid LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
