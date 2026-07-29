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
    const { nama_dokter, poli, hari, jam_mulai, jam_selesai } = data;

    if (!nama_dokter || !poli || !hari || !jam_mulai || !jam_selesai || hari.length === 0) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // Cerdas membaca input berformat Array (dari Checkbox)
    let daysArray: string[] = [];
    if (Array.isArray(hari)) {
      daysArray = hari;
    } else {
      daysArray = hari.split(',').map((d: string) => d.trim()).filter((d: string) => d !== '');
    }

    // Melakukan looping kilat untuk menyimpan setiap hari
    for (const day of daysArray) {
      await sql`
        INSERT INTO jadwal_dokter (nama_dokter, poli, hari, jam_mulai, jam_selesai)
        VALUES (${nama_dokter}, ${poli}, ${day}, ${jam_mulai}, ${jam_selesai})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menyimpan jadwal." }, { status: 500 });
  }
}