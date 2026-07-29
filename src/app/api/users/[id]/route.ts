import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Cek Sesi (Hanya Superadmin)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    // 2. Ambil ID dari URL params
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID pengguna tidak ditemukan." }, { status: 400 });
    }

    // 3. Hapus data dari database
    await sql`DELETE FROM users WHERE id = ${id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Delete User Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus pengguna." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    if (!id) {
      return NextResponse.json({ error: "ID pengguna tidak ditemukan." }, { status: 400 });
    }

    const data = await request.json();
    const { name, email, role } = data;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
    }

    await sql`UPDATE users SET name = ${name}, email = ${email}, role = ${role} WHERE id = ${id}::uuid`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Update User Error:", error);
    // 23505 adalah kode PostgreSQL untuk constraint unique (Email duplikat)
    if (error.code === '23505') { 
       return NextResponse.json({ error: 'Email sudah digunakan oleh pengguna lain.' }, { status: 400 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui pengguna." }, { status: 500 });
  }
}