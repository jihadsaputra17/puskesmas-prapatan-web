import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const data = await request.json();
    const { name, email, password, role } = data;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Semua field harus diisi.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal harus 8 karakter.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Add User Error:', error);
    if (error.code === '23505') { 
       return NextResponse.json({ error: 'Email sudah terdaftar. Silakan gunakan email lain.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Gagal menambahkan pengguna. Pastikan email belum terdaftar.' }, { status: 500 });
  }
}