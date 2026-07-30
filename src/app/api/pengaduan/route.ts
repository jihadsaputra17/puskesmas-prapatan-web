import { NextResponse } from "next/server";
import { kirimPengaduan } from "@/lib/email";

export async function POST(request: Request) {
  try {
    let body: { name?: string; phone?: string; email?: string; message?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Data pengaduan tidak valid." },
        { status: 400 },
      );
    }

    const { name, phone, email, message } = body;
    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nama, nomor HP, dan isi pengaduan wajib diisi." },
        { status: 400 },
      );
    }

    await kirimPengaduan({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Pengaduan Error:", error);
    const errMsg =
      error instanceof Error ? error.message : "Gagal mengirim pengaduan.";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 },
    );
  }
}
