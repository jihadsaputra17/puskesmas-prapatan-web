import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import { getPollSummary } from "@/lib/poll-actions";

const voteSchema = z
  .object({
    option: z.enum([
      "sangat_bermanfaat",
      "cukup_bermanfaat",
      "bermanfaat",
      "kurang_bermanfaat",
    ]),
  })
  .strict();

export async function GET() {
  const summary = await getPollSummary();
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Pilihan polling tidak valid." }, { status: 400 });
    }

    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Pilihan polling tidak valid." }, { status: 400 });
    }

    const { option } = parsed.data;
    await sql`
      INSERT INTO website_poll (option_key, votes, updated_at)
      VALUES (${option}, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (option_key)
      DO UPDATE SET votes = website_poll.votes + 1, updated_at = CURRENT_TIMESTAMP
    `;

    revalidatePath("/");
    const summary = await getPollSummary();
    return NextResponse.json({ success: true, ...summary });
  } catch (error) {
    console.error("API Poll Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan suara polling. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
