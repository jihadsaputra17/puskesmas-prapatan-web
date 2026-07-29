import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Cek Sesi (Hanya Superadmin seperti di halaman UI)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'superadmin') {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    // 2. Ambil ID dari URL params
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID jadwal tidak ditemukan." }, { status: 400 });
    }

    // 3. Hapus data dari database
    await sql`DELETE FROM jadwal_dokter WHERE id = ${id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Delete Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus jadwal." }, { status: 500 });
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
      return NextResponse.json({ error: "ID jadwal tidak ditemukan." }, { status: 400 });
    }

    const data = await request.json();
    const { nama_dokter, poli, hari, jam_mulai, jam_selesai } = data;

    if (!nama_dokter || !poli || !hari || !jam_mulai || !jam_selesai) {
      return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
    }

    await sql`UPDATE jadwal_dokter SET nama_dokter = ${nama_dokter}, poli = ${poli}, hari = ${hari}, jam_mulai = ${jam_mulai}, jam_selesai = ${jam_selesai} WHERE id = ${id}::uuid`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Update Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui jadwal." }, { status: 500 });
  }
}