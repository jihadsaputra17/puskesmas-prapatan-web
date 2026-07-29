import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, newsSchema } from "@/lib/admin-schemas";

const uuidSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const invalidate = () => { revalidatePath("/admin/berita"); revalidatePath("/berita"); revalidatePath("/"); };
async function authorize() { try { await requireAdmin(); } catch (error) { const response = toAuthorizationResponse(error); if (response) return response; throw error; } }
async function getId(params: Promise<{ id: string }>) { const { id } = await params; return uuidSchema.test(id) ? id : null; }
function newsFromForm(formData: FormData) { return { title: formData.get("title"), slug: formData.get("slug"), excerpt: formData.get("excerpt"), content: formData.get("content"), image_url: formData.get("image_url") ?? formData.get("images") ?? "", template: formData.get("template") || "standard" }; }

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize(); if (denied) return denied;
    const id = await getId(params); if (!id) return NextResponse.json({ error: "ID berita tidak valid." }, { status: 400 });
    await sql`DELETE FROM health_news WHERE id = ${id}::uuid`;
    invalidate(); return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Delete Berita Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus berita." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await authorize(); if (denied) return denied;
    const id = await getId(params); if (!id) return NextResponse.json({ error: "ID berita tidak valid." }, { status: 400 });
    const parsed = newsSchema.safeParse(newsFromForm(await request.formData()));
    if (!parsed.success) return NextResponse.json({ error: "Data berita tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    const { title, slug, excerpt, content, image_url, template } = parsed.data;
    await sql`UPDATE health_news SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, image_url = ${image_url || ""}, template = ${template} WHERE id = ${id}::uuid`;
    invalidate(); return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("API Update Berita Error:", error);
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Slug/Tautan sudah digunakan. Harap ganti tautan." }, { status: 409 });
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui berita." }, { status: 500 });
  }
}
