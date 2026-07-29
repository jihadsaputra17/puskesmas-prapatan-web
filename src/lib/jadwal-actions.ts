"use server";

import { sql } from '@vercel/postgres';

// 1. Inisialisasi Tabel (Otomatis dibuat jika belum ada)
export async function initJadwalTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS jadwal_dokter (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nama_dokter VARCHAR(255) NOT NULL,
        poli VARCHAR(100) NOT NULL,
        hari VARCHAR(50) NOT NULL,
        jam_mulai VARCHAR(10) NOT NULL,
        jam_selesai VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error('Database Error - initJadwalTable:', error);
  }
}

// 2. Menghitung Semua Jadwal
export async function getJadwalCount(): Promise<number> {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM jadwal_dokter`;
    return Number(rows[0]?.count ?? 0);
  } catch (error) {
    console.error('Database Error - getJadwalCount:', error);
    throw new Error('Gagal menghitung data jadwal dokter.');
  }
}

// 3. Mengambil Semua Jadwal
export async function getJadwal() {
  await initJadwalTable();
  const { rows } = await sql`SELECT * FROM jadwal_dokter ORDER BY poli ASC, hari ASC`;
  return rows;
}

// 3. Menghapus Jadwal
export async function deleteJadwal(id: string) {
  try {
    await sql`DELETE FROM jadwal_dokter WHERE id = ${id}::uuid`;
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal menghapus jadwal.' };
  }
}

// 4. Menambah Jadwal Baru
export async function addJadwal(data: { nama_dokter: string, poli: string, hari: string | string[], jam_mulai: string, jam_selesai: string }) {
  const { nama_dokter, poli, hari, jam_mulai, jam_selesai } = data;

  if (!nama_dokter || !poli || !hari || !jam_mulai || !jam_selesai || hari.length === 0) {
    return { error: 'Semua kolom wajib diisi.' };
  }

  try {
    // Logic Cerdas: Ubah input hari menjadi format array (dari checkbox atau input teks pisah koma)
    let daysArray: string[] = [];
    if (Array.isArray(hari)) {
      daysArray = hari;
    } else {
      daysArray = hari.split(',').map(d => d.trim()).filter(d => d !== '');
    }

    // Looping untuk menyimpan setiap hari sebagai baris tersendiri (Database Normalization)
    for (const day of daysArray) {
      await sql`
        INSERT INTO jadwal_dokter (nama_dokter, poli, hari, jam_mulai, jam_selesai)
        VALUES (${nama_dokter}, ${poli}, ${day}, ${jam_mulai}, ${jam_selesai})
      `;
    }
  } catch (error) {
    console.error('Database Error - addJadwal:', error);
    return { error: 'Gagal menambahkan jadwal dokter.' };
  }
  
  return { success: true };
}

// 5. Mendapatkan Jadwal Berdasarkan ID
export async function getJadwalById(id: string) {
  try {
    const cleanId = id ? id.trim() : '';
    if (!cleanId) return null;
    const { rows } = await sql`SELECT * FROM jadwal_dokter WHERE id = ${cleanId}::uuid LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}