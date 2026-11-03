import { readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "@vercel/postgres";

const rootDir = path.resolve(import.meta.dirname, "..");

if (!process.env.POSTGRES_URL) {
  const envText = await readFile(path.join(rootDir, ".env.local"), "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

for (const file of [
  "db/migrations/003_ppid_items.sql",
  "db/migrations/004_website_poll.sql",
  "db/migrations/005_jadwal_medis.sql",
  "db/migrations/006_standar_pelayanan_items.sql",
]) {
  const migration = await readFile(path.join(rootDir, file), "utf8");
  const statements = migration
    .split(";")
    .map((s) =>
      s
        .split(/\r?\n/)
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);

  for (const stmt of statements) {
    await sql.query(stmt);
  }
}

const OFFICIAL_STAFF = [
  { poli: "Poli Umum", nama: "dr. Novida Fridiani", jenis: "Dokter" },
  { poli: "Poli Umum", nama: "dr. Tien Fatimatuzzahra, M.K.M", jenis: "Dokter" },
  { poli: "Poli Umum", nama: "dr. Yose Yandriani", jenis: "Dokter" },
  { poli: "Poli Gigi", nama: "drg. Diana Riasari Setianingsih", jenis: "Dokter Gigi" },
  { poli: "Poli KIA", nama: "Bulan Siahaan, A.Md.Keb", jenis: "Bidan" },
  { poli: "Poli KIA", nama: "Suci Astrilia, A.Md.Keb", jenis: "Bidan" },
  { poli: "Poli KIA", nama: "Yuliana, A.Md Keb", jenis: "Bidan" },
  { poli: "Poli KIA", nama: "Wulan Murti Eka Sari, A.Md.Keb", jenis: "Bidan" },
  { poli: "Poli KB", nama: "Yunita Andriani, A.Md.Keb", jenis: "Bidan" },
];

const DAILY_HOURS = [
  { hari: "Senin", jam_mulai: "08:00", jam_selesai: "15:00" },
  { hari: "Selasa", jam_mulai: "08:00", jam_selesai: "15:00" },
  { hari: "Rabu", jam_mulai: "08:00", jam_selesai: "15:00" },
  { hari: "Kamis", jam_mulai: "08:00", jam_selesai: "15:00" },
  { hari: "Jumat", jam_mulai: "08:00", jam_selesai: "11:30" },
  { hari: "Sabtu", jam_mulai: "08:00", jam_selesai: "13:30" },
];

// Replace jadwal_dokter with the official 9 medical staff schedules (54 rows across Mon-Sat)
await sql`DELETE FROM jadwal_dokter`;

for (const staff of OFFICIAL_STAFF) {
  for (const slot of DAILY_HOURS) {
    await sql`
      INSERT INTO jadwal_dokter (nama_dokter, jenis_tenaga_medis, poli, hari, jam_mulai, jam_selesai)
      VALUES (${staff.nama}, ${staff.jenis}, ${staff.poli}, ${slot.hari}, ${slot.jam_mulai}, ${slot.jam_selesai})
    `;
  }
}

// Keep dr. Tien's degree title synchronized in dokter profiles table
await sql`
  UPDATE dokter
  SET nama = 'dr. Tien Fatimatuzzahra, M.K.M'
  WHERE nama = 'dr. Tien Fatimatuzzahra'
`;

// Synchronize official Puskesmas Prapatan contact information in website_settings
const officialSettings = [
  [
    "address",
    "Jl. Prapatan No. 31 (Jl. Prapatan Dalam), RT. 029, Kelurahan Prapatan, Kecamatan Balikpapan Kota, Kota Balikpapan, Kalimantan Timur 76111",
  ],
  ["email", "puskesmasprapatan123@gmail.com"],
  ["phone", "(0542) 426008"],
  ["instagram", "https://www.instagram.com/puskesmas.prapatan/"],
  ["facebook", "https://web.facebook.com/profile.php?id=61564150502560"],
];

for (const [key, value] of officialSettings) {
  await sql`
    INSERT INTO website_settings (setting_key, setting_value)
    VALUES (${key}, ${value})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value
  `;
}

console.log("Successfully provisioned migrations and updated official jadwal_dokter and website_settings records.");
process.exit(0);
