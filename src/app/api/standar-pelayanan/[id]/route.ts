import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { requireAdmin, toAuthorizationResponse } from "@/lib/admin-auth";
import { formatFieldErrors, standarPelayananSchema } from "@/lib/admin-schemas";

const uuidSchema = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const invalidate = () => {
  revalidatePath("/", "layout");
  revalidatePath("/admin/standar-pelayanan");
  revalidatePath("/standar-pelayanan");
  revalidatePath("/");
};

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

function standarPelayananFromForm(formData: FormData) {
  const image = formData.get("image_url") ?? formData.get("images") ?? "";
  const fileUrl = formData.get("file_url") ?? "";
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category") || "standar-pelayanan",
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    image_url: typeof image === "string" ? image : "",
    file_url: typeof fileUrl === "string" ? fileUrl : "",
  };
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await authorize();
    if (denied) return denied;
    const id = await getId(params);
    if (!id) {
      return NextResponse.json(
        { error: "ID Standar Pelayanan tidak valid." },
        { status: 400 },
      );
    }
    await sql`DELETE FROM standar_pelayanan_items WHERE id = ${id}::uuid`;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Delete Standar Pelayanan Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat menghapus data Standar Pelayanan." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await authorize();
    if (denied) return denied;
    const id = await getId(params);
    if (!id) {
      return NextResponse.json(
        { error: "ID Standar Pelayanan tidak valid." },
        { status: 400 },
      );
    }
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Data Standar Pelayanan tidak valid.", fields: {} },
        { status: 400 },
      );
    }
    const parsed = standarPelayananSchema.safeParse(standarPelayananFromForm(formData));
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Data Standar Pelayanan tidak valid.",
          fields: formatFieldErrors(parsed.error),
        },
        { status: 400 },
      );
    }
    const { title, slug, category, excerpt, content, image_url, file_url } = parsed.data;
    await sql`
      UPDATE standar_pelayanan_items
      SET title = ${title},
          slug = ${slug},
          category = ${category},
          excerpt = ${excerpt},
          content = ${content},
          image_url = ${image_url || ""},
          file_url = ${file_url || ""}
      WHERE id = ${id}::uuid
    `;
    invalidate();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("API Update Standar Pelayanan Error:", error);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "Slug/Tautan sudah digunakan. Harap ganti tautan." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server saat memperbarui data Standar Pelayanan." },
      { status: 500 },
    );
  }
}
