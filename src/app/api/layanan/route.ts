import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const data = await request.json();
    const { nama_poli, deskripsi, icon } = data;

    if (!nama_poli || !deskripsi) {
      return NextResponse.json({ error: 'Nama Poli dan Deskripsi wajib diisi.' }, { status: 400 });
    }

    await sql`
      INSERT INTO layanan_poli (nama_poli, deskripsi, icon)
      VALUES (${nama_poli}, ${deskripsi}, ${icon || '🏥'})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Layanan Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat menyimpan layanan." }, { status: 500 });
  }
}
