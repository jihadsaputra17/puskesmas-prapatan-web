import { updateSettings } from "@/lib/settings-actions";
import { NextResponse } from "next/server";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, settingsSchema } from "@/lib/admin-schemas";

export async function POST(request: Request) {
  try {
    try { await requireAdmin(); } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Data pengaturan tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    await updateSettings(parsed.data);
    return NextResponse.json({ message: "Pengaturan berhasil disimpan!" });
  } catch (error) {
    console.error("API Settings Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
