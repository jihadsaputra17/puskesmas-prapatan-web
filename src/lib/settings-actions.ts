import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import type { settingsSchema } from "@/lib/admin-schemas";

const fallbackSettings = {
  site_name: "Puskesmas Prapatan",
  phone: "(0542) 123456",
  email: "info@puskesmasprapatan.com",
  address: "Jl. Prapatan No. 1, Kota Balikpapan",
  instagram: "https://instagram.com/puskesmasprapatan",
  facebook: "https://facebook.com/puskesmasprapatan",
  hero_title: "Pelayanan Kesehatan Terbaik untuk Anda",
  hero_subtitle: "Kami berkomitmen memberikan pelayanan kesehatan yang berkualitas, terjangkau, dan merata bagi seluruh warga Kota Balikpapan.",
};

type SettingsInput = z.infer<typeof settingsSchema>;

export async function updateSettings(settings: SettingsInput) {
  const client = await sql.connect();
  try {
    await client.query("BEGIN");
    for (const [key, value] of Object.entries(settings)) {
      await client.query(`INSERT INTO website_settings (setting_key, setting_value)
        VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2`, [key, value || ""]);
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
  revalidatePath("/admin/settings");
}

export async function getSettings() {
  try {
    const { rows } = await sql`SELECT setting_key, setting_value FROM website_settings`;
    return rows.reduce<Record<string, string>>((settings, row) => {
      settings[row.setting_key] = row.setting_value;
      return settings;
    }, {});
  } catch {
    return fallbackSettings;
  }
}
