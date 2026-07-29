import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, serviceSchema } from "@/lib/admin-schemas";

export async function POST(request: Request) {
  try {
    try { await requireAdmin(); } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }

    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: "Data layanan tidak valid.", fields: {} }, { status: 400 });
    }
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Data layanan tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });

    const { nama_poli, deskripsi, icon } = parsed.data;
    await sql`INSERT INTO layanan_poli (nama_poli, deskripsi, icon) VALUES (${nama_poli}, ${deskripsi}, ${icon || "🏥"})`;
    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Add Layanan Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat menyimpan layanan." }, { status: 500 });
  }
}
