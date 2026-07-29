"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "superadmin";
type User = { id: string; name: string; email: string; role: UserRole };
type FieldErrors = Partial<Record<"name" | "email" | "role", string>>;

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFieldErrors({}); setIsLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), role: form.get("role") as UserRole }) });
      const result: unknown = await response.json();
      if (!response.ok) {
        const errors = result && typeof result === "object" && "fields" in result ? (result as { fields?: FieldErrors }).fields : undefined;
        setFieldErrors(errors ?? {}); setError("Gagal memperbarui pengguna. Periksa isian lalu coba lagi."); return;
      }
      router.push("/admin/users"); router.refresh();
    } catch { setError("Gagal memperbarui pengguna. Periksa koneksi lalu coba lagi."); }
    finally { setIsLoading(false); }
  };

  return <div className="panel p-8">
    {error && <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit} className="space-y-6" noValidate>
      <Input label="Nama Lengkap" name="name" defaultValue={user.name} error={fieldErrors.name} />
      <Input label="Email" name="email" type="email" defaultValue={user.email} error={fieldErrors.email} />
      <div><label htmlFor="role" className="mb-1 block text-sm font-medium text-[var(--ink)]">Peran</label><select id="role" name="role" defaultValue={user.role} required aria-describedby={fieldErrors.role ? "role-error" : undefined} className="input-field"><option value="admin">Admin</option><option value="superadmin">Superadmin</option></select>{fieldErrors.role && <p id="role-error" role="alert" className="mt-1 text-sm text-red-700">{fieldErrors.role}</p>}</div>
      <div className="border-t border-[var(--line)] pt-4"><button type="submit" disabled={isLoading} className="button-primary sm:w-auto">{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</button></div>
    </form>
  </div>;
}

function Input({ label, name, type = "text", defaultValue, error }: { label: string; name: string; type?: string; defaultValue: string; error?: string }) { return <div><label htmlFor={name} className="mb-1 block text-sm font-medium text-[var(--ink)]">{label}</label><input id={name} name={name} type={type} defaultValue={defaultValue} required aria-describedby={error ? `${name}-error` : undefined} className="input-field" />{error && <p id={`${name}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}</div>; }
