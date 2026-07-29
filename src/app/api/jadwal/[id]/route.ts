import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, scheduleSchema } from "@/lib/admin-schemas";

const uuidSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const invalidate = () => { revalidatePath("/admin/jadwal"); revalidatePath("/jadwal-dokter"); revalidatePath("/"); };
async function authorize() { try { await requireAdmin(); } catch (error) { const response = toAuthorizationResponse(error); if (response) return response; throw error; } }
async function getId(params: Promise<{ id: string }>) { const { id } = await params; return uuidSchema.test(id) ? id : null; }

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize(); if (denied) return denied;
    const id = await getId(params); if (!id) return NextResponse.json({ error: "ID jadwal tidak valid." }, { status: 400 });
    await sql`DELETE FROM jadwal_dokter WHERE id = ${id}::uuid`;
    invalidate(); return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Delete Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus jadwal." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize(); if (denied) return denied;
    const id = await getId(params); if (!id) return NextResponse.json({ error: "ID jadwal tidak valid." }, { status: 400 });
    const body = await request.json();
    const hari = Array.isArray(body.hari) ? body.hari : typeof body.hari === "string" ? body.hari.split(",").map((day: string) => day.trim()).filter(Boolean) : body.hari;
    const parsed = scheduleSchema.safeParse({ ...body, hari });
    if (!parsed.success) return NextResponse.json({ error: "Data jadwal tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    const { nama_dokter, poli, hari: days, jam_mulai, jam_selesai } = parsed.data;
    await sql`UPDATE jadwal_dokter SET nama_dokter = ${nama_dokter}, poli = ${poli}, hari = ${days.join(", ")}, jam_mulai = ${jam_mulai}, jam_selesai = ${jam_selesai} WHERE id = ${id}::uuid`;
    invalidate(); return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Update Jadwal Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui jadwal." }, { status: 500 });
  }
}
