import { expect, it } from "vitest";
import {
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
