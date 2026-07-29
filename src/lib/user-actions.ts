"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireSuperadmin } from "@/lib/admin-auth";
import { passwordResetSchema, userIdParamSchema, userSchema } from "@/lib/admin-schemas";

type UserInput = { name?: unknown; email?: unknown; password?: unknown; role?: unknown };

function readUserInput(formData: FormData | UserInput): UserInput {
  if (formData instanceof FormData) {
    return {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };
  }
  return formData;
}

export async function getUsers() {
  await requireSuperadmin();
  try {
    const { rows } = await sql`SELECT id, name, email, role FROM users ORDER BY name ASC`;
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Gagal mengambil data pengguna.");
  }
}

export async function getUserById(id: string): Promise<{ id: string; name: string; email: string; role: "admin" | "superadmin" } | null> {
  await requireSuperadmin();
  const parsedId = userIdParamSchema.safeParse({ id });
  if (!parsedId.success) return null;

  try {
    const { rows } = await sql`SELECT id, name, email, role FROM users WHERE id = ${parsedId.data.id}::uuid LIMIT 1`;
    return (rows[0] as { id: string; name: string; email: string; role: "admin" | "superadmin" } | undefined) || null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

export async function addUser(formData: FormData | UserInput) {
  await requireSuperadmin();
  const parsed = userSchema.safeParse(readUserInput(formData));
  if (!parsed.success) return { error: "Data pengguna tidak valid." };

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    await sql`INSERT INTO users (name, email, password, role) VALUES (${parsed.data.name}, ${parsed.data.email}, ${hashedPassword}, ${parsed.data.role})`;
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    console.error("Database Error:", error);
    if ((error as { code?: string }).code === "23505") return { error: "Email sudah terdaftar. Silakan gunakan email lain." };
    return { error: "Gagal menambahkan pengguna." };
  }
}

export async function resetPassword(id: string, newPassword: string) {
  await requireSuperadmin();
  const parsed = passwordResetSchema.safeParse({ id, password: newPassword });
  if (!parsed.success) return { error: "Data kata sandi tidak valid." };

  try {
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${parsed.data.id}::uuid`;
    return { success: true };
  } catch (error) {
    console.error("Action Error (resetPassword):", error);
    return { error: "Gagal memperbarui kata sandi." };
  }
}

export async function deleteUser(id: string) {
  await requireSuperadmin();
  const parsedId = userIdParamSchema.safeParse({ id });
  if (!parsedId.success) return { error: "ID pengguna tidak valid." };

  try {
    await sql`DELETE FROM users WHERE id = ${parsedId.data.id}::uuid`;
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal menghapus pengguna." };
  }
}
