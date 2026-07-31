import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { dokterSchema, formatFieldErrors } from "@/lib/admin-schemas";

function invalidate() {
  revalidatePath("/admin/dokter");
  revalidatePath("/layanan");
  revalidatePath("/");
}

export async function POST(request: Request) {
  try {
    try {
      await requireAdmin();
    } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }

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
      INSERT INTO dokter (nama, poli, foto_url, urutan, aktif)
      VALUES (${nama}, ${poli}, ${foto_url || ""}, ${urutan}, ${aktif})
    `;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Dokter Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat menyimpan data dokter." },
      { status: 500 },
    );
  }
}
