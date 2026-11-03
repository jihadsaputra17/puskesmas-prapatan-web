import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import type { settingsSchema } from "@/lib/admin-schemas";

export const DEFAULT_SOCIAL_SETTINGS = {
  site_name: "Puskesmas Prapatan",
  phone: "(0542) 426008",
  email: "puskesmasprapatan123@gmail.com",
  address:
    "Jl. Prapatan No. 31 (Jl. Prapatan Dalam), RT. 029, Kelurahan Prapatan, Kecamatan Balikpapan Kota, Kota Balikpapan, Kalimantan Timur 76111",
  instagram: "https://www.instagram.com/puskesmas.prapatan/",
  facebook: "https://web.facebook.com/profile.php?id=61564150502560",
  youtube: "https://www.youtube.com/@puskesmasprapatanbalikpapa1711",
  tiktok: "https://www.tiktok.com/@puskesmas.prapatan",
  threads: "https://www.threads.net/@puskesmas.prapatan",
  whatsapp: "",
  hero_title: "Pelayanan Kesehatan Terbaik untuk Anda",
  hero_subtitle:
    "Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
};

type SettingsInput = z.infer<typeof settingsSchema>;

export async function updateSettings(settings: SettingsInput) {
  const client = await sql.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `INSERT INTO website_settings (setting_key, setting_value)
        VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2`,
        [key, value || ""],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database Error - updateSettings:", error);
    throw new Error("Gagal memperbarui pengaturan di database.");
  } finally {
    client.release();
  }
  revalidatePath("/");
  revalidatePath("/media-sosial");
  revalidatePath("/profil");
  revalidatePath("/ppid");
  revalidatePath("/admin/settings");
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM website_settings`;
    const dbSettings = rows.reduce<Record<string, string>>((settings, row) => {
      settings[row.setting_key] = row.setting_value;
      return settings;
    }, {});
    return {
      ...DEFAULT_SOCIAL_SETTINGS,
      ...Object.fromEntries(
        Object.entries(dbSettings).filter(([, v]) => typeof v === "string" && v.trim() !== ""),
      ),
    };
  } catch {
    return { ...DEFAULT_SOCIAL_SETTINGS };
  }
}
