import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, ppidSchema } from "@/lib/admin-schemas";

function ppidFromForm(formData: FormData) {
  const image = formData.get("image_url") ?? formData.get("images") ?? "";
  const fileUrl = formData.get("file_url") ?? "";
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category") || "berkala",
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    image_url: typeof image === "string" ? image : "",
    file_url: typeof fileUrl === "string" ? fileUrl : "",
  };
}

function invalidate() {
  revalidatePath("/admin/ppid");
  revalidatePath("/ppid");
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

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Data PPID tidak valid.", fields: {} },
        { status: 400 },
      );
    }

    const parsed = ppidSchema.safeParse(ppidFromForm(formData));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data PPID tidak valid.", fields: formatFieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    const { title, slug, category, excerpt, content, image_url, file_url } = parsed.data;
    await sql`
      INSERT INTO ppid_items (title, slug, category, excerpt, content, image_url, file_url)
      VALUES (${title}, ${slug}, ${category}, ${excerpt}, ${content}, ${image_url || ""}, ${file_url || ""})
    `;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("API Add PPID Error:", error);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "Slug/Tautan sudah digunakan. Harap ganti tautan." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat menyimpan data PPID." },
      { status: 500 },
    );
  }
}
