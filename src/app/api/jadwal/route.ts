import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, scheduleSchema } from "@/lib/admin-schemas";

export async function POST(request: Request) {
  try {
    try { await requireAdmin(); } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }
    const body = await request.json();
    const hari = Array.isArray(body.hari) ? body.hari : typeof body.hari === "string" ? body.hari.split(",").map((day: string) => day.trim()).filter(Boolean) : body.hari;
    const parsed = scheduleSchema.safeParse({ ...body, hari });
    if (!parsed.success) return NextResponse.json({ error: "Data jadwal tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    const { nama_dokter, poli, hari: days, jam_mulai, jam_selesai } = parsed.data;
    for (const hari of days) await sql`INSERT INTO jadwal_dokter (nama_dokter, poli, hari, jam_mulai, jam_selesai) VALUES (${nama_dokter}, ${poli}, ${hari}, ${jam_mulai}, ${jam_selesai})`;
    revalidatePath("/admin/jadwal"); revalidatePath("/jadwal-dokter"); revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menyimpan jadwal." }, { status: 500 });
  }
}
