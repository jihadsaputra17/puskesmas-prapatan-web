import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { requireSuperadmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, userSchema } from "@/lib/admin-schemas";

export async function POST(request: Request) {
  try {
    await requireSuperadmin();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data pengguna tidak valid.", fields: {} }, { status: 400 });
    }

    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data pengguna tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (name, email, password, role) VALUES (${name}, ${email}, ${hashedPassword}, ${role})`;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const authorizationResponse = toAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    console.error("API Add User Error:", error);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan gunakan email lain." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menambahkan pengguna." }, { status: 500 });
  }
}
