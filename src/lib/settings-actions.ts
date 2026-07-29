"use server";

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// 1. Fungsi Inisialisasi: Membuat tabel dan mengisi data bawaan jika masih kosong
export async function initSettingsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS website_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT NOT NULL
      )
    `;

    // Data bawaan awal (Default)
    const defaultSettings = {
      site_name: 'Puskesmas Prapatan',
      phone: '(0542) 123456',
      email: 'info@puskesmasprapatan.com',
      address: 'Jl. Prapatan No. 1, Kota Balikpapan',
      instagram: 'https://instagram.com/puskesmasprapatan',
      facebook: 'https://facebook.com/puskesmasprapatan',
      hero_title: 'Pelayanan Kesehatan Terbaik untuk Anda',
      hero_subtitle: 'Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.',
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await sql`
        INSERT INTO website_settings (setting_key, setting_value)
        VALUES (${key}, ${value})
        ON CONFLICT (setting_key) DO NOTHING
      `;
    }
  } catch (error) {
    console.error('Database Error - initSettings:', error);
  }
}

// 2. Mengambil Pengaturan untuk ditampilkan di Form / Halaman Publik
export async function getSettings() {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM website_settings`;
    const settings: Record<string, string> = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    return settings;
  } catch (error) {
    // Jika tabel belum ada atau koneksi database error, kembalikan nilai bawaan
    // Ini mencegah website menjadi "hang" atau macet
    return {
      site_name: 'Puskesmas Prapatan',
      phone: '(0542) 123456',
      email: 'info@puskesmasprapatan.com',
      address: 'Jl. Prapatan No. 1, Kota Balikpapan',
      instagram: 'https://instagram.com/puskesmasprapatan',
      facebook: 'https://facebook.com/puskesmasprapatan',
      hero_title: 'Pelayanan Kesehatan Terbaik untuk Anda',
      hero_subtitle: 'Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.',
    };
  }
}

// 3. Memperbarui Pengaturan dari Form Admin
export async function updateSettings(settings: Record<string, string>) {
  try {
    // Pastikan tabel sudah dibuat hanya ketika admin menekan tombol Simpan
    await initSettingsTable();

    // Menggunakan transaksi untuk memastikan semua pembaruan berhasil atau tidak sama sekali
    const client = await sql.connect();
    await client.query('BEGIN');

    for (const [key, value] of Object.entries(settings)) {
      // Gunakan perintah UPSERT: INSERT jika belum ada, UPDATE jika sudah ada.
      // Ini memastikan tidak ada error jika kunci pengaturan baru ditambahkan.
      await client.query(
        `
        INSERT INTO website_settings (setting_key, setting_value)
        VALUES ($1, $2)
        ON CONFLICT (setting_key) 
        DO UPDATE SET setting_value = $2;
      `,
        [key, value || ''] // Pastikan value tidak null
      );
    }

    await client.query('COMMIT');
    client.release();

    // Bersihkan cache untuk halaman yang menggunakan data ini agar perubahan langsung terlihat
    revalidatePath('/');
    revalidatePath('/admin/settings');
    
  } catch (error) {
    console.error('Database Error - updateSettings:', error);
    throw new Error('Gagal memperbarui pengaturan di database.');
  }
}
