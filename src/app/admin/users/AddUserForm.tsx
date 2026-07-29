"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "superadmin";
type FieldErrors = Partial<Record<"name" | "email" | "password" | "role", string>>;

function readFieldErrors(data: unknown): FieldErrors {
  if (!data || typeof data !== "object" || !("fields" in data)) return {};
  const errors = (data as { fields?: unknown }).fields;
  return errors && typeof errors === "object" ? errors as FieldErrors : {};
}

export default function AddUserForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), password: formData.get("password"), role: formData.get("role") as UserRole }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        setFieldErrors(readFieldErrors(result));
        setError("Gagal menyimpan pengguna. Periksa isian lalu coba lagi.");
        return;
      }

      router.push("/admin/users");
      router.refresh();
    } catch {
      setError("Gagal menyimpan pengguna. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="panel p-8 max-w-2xl">
    {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <Field label="Nama Lengkap" name="name" error={fieldErrors.name}><input type="text" id="name" name="name" required aria-describedby={fieldErrors.name ? "name-error" : undefined} placeholder="Contoh: Budi Santoso" className="input-field" /></Field>
      <Field label="Email" name="email" error={fieldErrors.email}><input type="email" id="email" name="email" required aria-describedby={fieldErrors.email ? "email-error" : undefined} placeholder="contoh@puskesmas.com" className="input-field" /></Field>
      <Field label="Kata Sandi" name="password" error={fieldErrors.password}><input type="password" id="password" name="password" required minLength={8} aria-describedby={fieldErrors.password ? "password-error" : undefined} placeholder="Minimal 8 karakter" className="input-field" /></Field>
      <Field label="Peran" name="role" error={fieldErrors.role}><select id="role" name="role" required aria-describedby={fieldErrors.role ? "role-error" : undefined} defaultValue="admin" className="input-field"><option value="admin">Admin</option><option value="superadmin">Superadmin</option></select></Field>
      <div className="border-t border-[var(--line)] pt-4"><button type="submit" disabled={isLoading} className="button-primary sm:w-auto">{isLoading ? "Menyimpan..." : "Simpan Pengguna"}</button></div>
    </form>
  </div>;
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={name} className="mb-1 block text-sm font-medium text-[var(--ink)]">{label}</label>{children}{error && <p id={`${name}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}</div>;
}
