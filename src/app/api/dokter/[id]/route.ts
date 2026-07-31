import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { dokterSchema, formatFieldErrors } from "@/lib/admin-schemas";

const uuidSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalidate() {
  revalidatePath("/admin/dokter");
  revalidatePath("/layanan");
  revalidatePath("/");
}

async function authorize() {
  try {
    await requireAdmin();
  } catch (error) {
    const response = toAuthorizationResponse(error);
    if (response) return response;
    throw error;
  }
}

async function getId(params: Promise<{ id: string }>) {
  const { id } = await params;
  return uuidSchema.test(id) ? id : null;
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize();
    if (denied) return denied;
    const id = await getId(params);
    if (!id) return NextResponse.json({ error: "ID dokter tidak valid." }, { status: 400 });
    await sql`DELETE FROM dokter WHERE id = ${id}::uuid`;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Delete Dokter Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat menghapus data dokter." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize();
    if (denied) return denied;
    const id = await getId(params);
    if (!id) return NextResponse.json({ error: "ID dokter tidak valid." }, { status: 400 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data dokter tidak valid.", fields: {} }, { status: 400 });
    }

    const parsed = dokterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data dokter tidak valid.", fields: formatFieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    const { nama, poli, foto_url, urutan, aktif } = parsed.data;
    await sql`
      UPDATE dokter
      SET nama = ${nama},
          poli = ${poli},
          foto_url = ${foto_url || ""},
          urutan = ${urutan},
          aktif = ${aktif}
      WHERE id = ${id}::uuid
    `;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Update Dokter Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat memperbarui data dokter." },
      { status: 500 },
    );
  }
}
