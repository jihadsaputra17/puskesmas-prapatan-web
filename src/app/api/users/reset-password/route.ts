// c:\Website_Puskesmas-Prapatan\puskesmas-prapatan-web\src\app\api\users\reset-password\route.ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // 1. Cek sesi & hak akses (sama seperti di halaman)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak. Anda tidak memiliki izin." }, { status: 403 });
    }

    // 2. Ambil data yang dikirim dari klien
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: "ID pengguna atau password tidak boleh kosong." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password minimal harus 8 karakter." }, { status: 400 });
    }

    // 3. Enkripsi dan update ke database
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}::uuid`;
    
    // 4. Sukses
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Reset Password Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menyimpan ke database." }, { status: 500 });
  }
}
