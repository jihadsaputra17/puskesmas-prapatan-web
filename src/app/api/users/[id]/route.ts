import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { requireSuperadmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, userIdParamSchema, userUpdateSchema } from "@/lib/admin-schemas";

type Context = { params: Promise<{ id: string }> };

async function parseId(params: Context["params"]) {
  return userIdParamSchema.safeParse(await params);
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    await requireSuperadmin();
    const parsedId = await parseId(params);
    if (!parsedId.success) {
      return NextResponse.json({ error: "ID pengguna tidak valid.", fields: formatFieldErrors(parsedId.error) }, { status: 400 });
    }

    await sql`DELETE FROM users WHERE id = ${parsedId.data.id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const authorizationResponse = toAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    console.error("API Delete User Error:", error);
    return NextResponse.json({ error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Context) {
  try {
    await requireSuperadmin();
    const parsedId = await parseId(params);
    if (!parsedId.success) {
      return NextResponse.json({ error: "ID pengguna tidak valid.", fields: formatFieldErrors(parsedId.error) }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Data pengguna tidak valid.", fields: {} }, { status: 400 });
    }

    const parsedUser = userUpdateSchema.safeParse(body);
    if (!parsedUser.success) {
      return NextResponse.json({ error: "Data pengguna tidak valid.", fields: formatFieldErrors(parsedUser.error) }, { status: 400 });
    }

    const { name, email, role } = parsedUser.data;
    await sql`UPDATE users SET name = ${name}, email = ${email}, role = ${role} WHERE id = ${parsedId.data.id}::uuid`;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const authorizationResponse = toAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;

    console.error("API Update User Error:", error);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Email sudah digunakan oleh pengguna lain." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal memperbarui pengguna." }, { status: 500 });
  }
}
