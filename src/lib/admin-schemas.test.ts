import { expect, it } from "vitest";
import {
  dokterSchema,
  newsSchema,
  passwordResetSchema,
  scheduleSchema,
  serviceSchema,
  settingsSchema,
  userSchema,
} from "./admin-schemas";

it("rejects a javascript image URL", () => {
  expect(newsSchema.safeParse({
    title: "Info",
    slug: "info",
    excerpt: "Ringkas",
    content: "Isi",
    image_url: "javascript:alert(1)",
    template: "standard",
  }).success).toBe(false);
});

it("accepts compressed data-image cover uploads", () => {
  const tiny =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  expect(newsSchema.safeParse({
    title: "Info",
    slug: "info",
    excerpt: "Ringkas",
    content: "<p>Isi berita</p>",
    image_url: tiny,
    template: "standard",
  }).success).toBe(true);
});

it("rejects empty quill placeholder content", () => {
  expect(newsSchema.safeParse({
    title: "Info",
    slug: "info",
    excerpt: "Ringkas",
    content: "<p><br></p>",
    image_url: "",
    template: "standard",
  }).success).toBe(false);
});

it("requires service name and description", () => {
  expect(serviceSchema.safeParse({ nama_poli: "", deskripsi: "" }).success).toBe(false);
});

it("requires at least one clinic day for a schedule", () => {
  expect(scheduleSchema.safeParse({
    nama_dokter: "Dr. Sari",
    poli: "Umum",
    hari: [],
    jam_mulai: "08:00",
    jam_selesai: "12:00",
  }).success).toBe(false);
});

it("rejects unknown settings keys", () => {
  expect(settingsSchema.safeParse({
    site_name: "Puskesmas Prapatan",
    unexpected_redirect: "https://attacker.test",
  }).success).toBe(false);
});

it("rejects unknown user roles and short passwords", () => {
  expect(userSchema.safeParse({
    name: "Admin",
    email: "admin@example.test",
    password: "short",
    role: "owner",
  }).success).toBe(false);
});

it("requires password reset target and secure replacement", () => {
  expect(passwordResetSchema.safeParse({ id: "", password: "short" }).success).toBe(false);
});

it("requires dokter nama and poli", () => {
  expect(dokterSchema.safeParse({ nama: "", poli: "", foto_url: "" }).success).toBe(false);
});

it("accepts dokter with https photo and defaults", () => {
  const parsed = dokterSchema.safeParse({
    nama: "Dr. Sari",
    poli: "Poli Umum",
    foto_url: "https://cdn.example.test/dr-sari.webp",
  });
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.data.urutan).toBe(0);
    expect(parsed.data.aktif).toBe(true);
  }
});

it("accepts compressed data-image dokter photo", () => {
  const tiny =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  expect(
    dokterSchema.safeParse({
      nama: "Dr. Sari",
      poli: "Poli Gigi",
      foto_url: tiny,
      urutan: 2,
      aktif: false,
    }).success,
  ).toBe(true);
});

it("rejects javascript dokter photo URL", () => {
  expect(
    dokterSchema.safeParse({
      nama: "Dr. Sari",
      poli: "Umum",
      foto_url: "javascript:alert(1)",
    }).success,
  ).toBe(false);
});
