import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    // Mengizinkan admin atau superadmin untuk menghapus
    if (!session?.user) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID berita tidak ditemukan." }, { status: 400 });
    }

    await sql`DELETE FROM health_news WHERE id = ${id}`;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Delete Berita Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat menghapus berita." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID berita tidak ditemukan." }, { status: 400 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const excerpt = formData.get('excerpt') as string;
    let content = formData.get('content') as string;
    const template = (formData.get('template') as string) || 'standard';

    const images = formData.getAll('images') as string[];
    const coverImage = images.length > 0 ? images[0] : '';

    if (images.length > 1) {
      content += '\n\n<div class="mt-10 pt-6 border-t border-slate-200 not-prose">';
      content += '\n<h3 class="text-xl font-bold mb-4 text-slate-800">Galeri Foto</h3>';
      content += '\n<div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scroll-smooth" style="scrollbar-width: thin;">';
      for(let i = 1; i < images.length; i++){
        content += `\n<img src="${images[i]}" alt="Galeri Berita ${i}" class="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[60%] h-64 sm:h-80 object-cover rounded-xl shadow-sm border border-slate-200 cursor-zoom-in hover:opacity-95 transition-opacity m-0" />`;
      }
      content += '\n</div>\n</div>';
    }

    await sql`UPDATE health_news SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, image_url = ${coverImage}, template = ${template} WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Update Berita Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server saat memperbarui berita." }, { status: 500 });
  }
}