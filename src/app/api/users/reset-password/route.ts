import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { requireSuperadmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, passwordResetSchema } from "@/lib/admin-schemas";

export async function POST(request: Request) {
  try {
    await requireSuperadmin();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data kata sandi tidak valid.", fields: {} }, { status: 400 });
    }

    const parsed = passwordResetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data kata sandi tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${parsed.data.id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const authorizationResponse = toAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    console.error("API Reset Password Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui kata sandi." }, { status: 500 });
  }
}
