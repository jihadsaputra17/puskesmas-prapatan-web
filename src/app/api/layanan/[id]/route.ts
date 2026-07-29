import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Cek Sesi (Hanya Superadmin)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID layanan tidak ditemukan." }, { status: 400 });
    }

    await sql`DELETE FROM layanan_poli WHERE id = ${id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Delete Layanan Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus layanan." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Cek Sesi (Hanya Superadmin)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID layanan tidak ditemukan." }, { status: 400 });
    }

    const body = await request.json();
    const { nama_poli, deskripsi, icon } = body;

    await sql`
      UPDATE layanan_poli 
      SET nama_poli = ${nama_poli}, deskripsi = ${deskripsi}, icon = ${icon || '🏥'}
      WHERE id = ${id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Update Layanan Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui layanan." }, { status: 500 });
  }
}