import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, newsSchema } from "@/lib/admin-schemas";

function newsFromForm(formData: FormData) {
  const image =
    formData.get("image_url") ??
    formData.get("images") ??
    "";
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    image_url: typeof image === "string" ? image : "",
    template: formData.get("template") || "standard",
  };
}
function invalidate() { revalidatePath("/admin/berita"); revalidatePath("/berita"); revalidatePath("/"); }

export async function POST(request: Request) {
  try {
    try { await requireAdmin(); } catch (error) {
      const response = toAuthorizationResponse(error);
      if (response) return response;
      throw error;
    }
    let formData: FormData;
    try { formData = await request.formData(); } catch {
      return NextResponse.json({ error: "Data berita tidak valid.", fields: {} }, { status: 400 });
    }
    const parsed = newsSchema.safeParse(newsFromForm(formData));
    if (!parsed.success) return NextResponse.json({ error: "Data berita tidak valid.", fields: formatFieldErrors(parsed.error) }, { status: 400 });
    const { title, slug, excerpt, content, image_url, template } = parsed.data;
    await sql`INSERT INTO health_news (title, slug, excerpt, content, image_url, template) VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${image_url || ""}, ${template})`;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("API Add Berita Error:", error);
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Slug/Tautan sudah digunakan. Harap ganti tautan." }, { status: 409 });
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menyimpan berita." }, { status: 500 });
  }
}
