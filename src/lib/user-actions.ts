"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// 1. Mengambil semua data user
export async function getUsers() {
  try {
    const { rows } = await sql`SELECT id, name, email, role FROM users ORDER BY name ASC`;
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data pengguna.');
  }
}

// 2. Mendapatkan User Berdasarkan ID
export async function getUserById(id: string) {
  try {
    const cleanId = id ? id.trim() : '';
    if (!cleanId) return null;
    const { rows } = await sql`SELECT id, name, email, role FROM users WHERE id = ${cleanId}::uuid LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// 3. Menambah User Baru
export async function addUser(formData: FormData | any) {
  try {
    // Mendukung pengiriman melalui FormData maupun plain object (JSON)
    const name = formData instanceof FormData ? formData.get('name') as string : formData.name;
    const email = formData instanceof FormData ? formData.get('email') as string : formData.email;
    const password = formData instanceof FormData ? formData.get('password') as string : formData.password;
    const role = formData instanceof FormData ? formData.get('role') as string : formData.role;

    if (!name || !email || !password || !role) {
      return { error: 'Semua field harus diisi.' };
    }

    if (password.length < 8) {
      return { error: 'Password minimal harus 8 karakter.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Database Error:', error);
    // 23505 adalah kode error PostgreSQL untuk constraint unique violation (Duplikat)
    if (error.code === '23505') { 
       return { error: 'Email sudah terdaftar. Silakan gunakan email lain.' };
    }
    return { error: 'Gagal menambahkan pengguna. Pastikan email belum terdaftar.' };
  }
}

// 4. Reset Password User
export async function resetPassword(id: string, newPassword: string) {
  try {
    if (!id || !newPassword) {
      return { error: 'ID atau Password baru tidak boleh kosong.' };
    }

    if (newPassword.length < 8) {
      return { error: 'Password minimal harus 8 karakter.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}::uuid`;
    
    // revalidatePath dihapus untuk mencegah bug re-render "unexpected response" Next.js
    return { success: true };
  } catch (error: any) {
    console.error('Action Error (resetPassword):', error);
    // Mengirimkan pesan asli jika database error
    return { error: `Terjadi kesalahan internal: ${error.message || 'Unknown Error'}` };
  }
}

// 5. Menghapus User
export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}::uuid`;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menghapus pengguna.');
  }
}
