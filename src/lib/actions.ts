'use server';

import { sql } from '@vercel/postgres';

export type JadwalDokter = {
  id: string;
  doctor: string;
  poli: string;
  day: string;
  hours: string;
};

export async function getJadwalDokter(): Promise<JadwalDokter[]> {
  try {
    // PROTEKSI KEBOCORAN: Kita secara eksplisit HANYA mengambil kolom publik.
    // Jika suatu saat tabel ini dimodifikasi dan digabung dengan ID internal pegawai, 
    // query ini menjamin data internal tidak akan bocor terkirim ke frontend.
    const { rows } = await sql`
      SELECT 
        id, 
        doctor_name as doctor, 
        poli, 
        practice_days as day, 
        practice_hours as hours
      FROM doctors_schedule
      ORDER BY poli ASC, doctor_name ASC
    `;
    return rows as JadwalDokter[];
  } catch (error) {
    console.error('Database Error - getJadwalDokter:', error);
    throw new Error('Gagal mengambil data jadwal dokter.');
  }
}

export async function getBeritaKesehatan() {
  try {
    const { rows } = await sql`
      SELECT 
        id, title, slug, excerpt, image_url as "imageUrl", published_at as date
      FROM health_news
      ORDER BY published_at DESC
      LIMIT 6
    `;
    return rows;
  } catch (error) {
    console.error('Database Error - getBeritaKesehatan:', error);
    throw new Error('Gagal mengambil data berita kesehatan.');
  }
}