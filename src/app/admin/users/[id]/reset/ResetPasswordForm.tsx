"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldErrors = Partial<Record<"id" | "password", string>>;

function readFieldErrors(data: unknown): FieldErrors {
  if (!data || typeof data !== "object" || !("fields" in data)) return {};
  const errors = (data as { fields?: unknown }).fields;
  return errors && typeof errors === "object" ? errors as FieldErrors : {};
}

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); const [fieldErrors, setFieldErrors] = useState<FieldErrors>({}); const [isLoading, setIsLoading] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFieldErrors({});
    if (password !== confirmPassword) return setError("Kata sandi dan konfirmasi kata sandi harus sama.");
    if (password.length < 8) return setError("Kata sandi minimal 8 karakter.");
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: userId, password }) });
      const result: unknown = await response.json();
      if (!response.ok) { setFieldErrors(readFieldErrors(result)); setError("Gagal mereset kata sandi. Periksa isian lalu coba lagi."); return; }
      router.push("/admin/users"); router.refresh();
    } catch { setError("Gagal mereset kata sandi. Periksa koneksi lalu coba lagi."); }
    finally { setIsLoading(false); }
  };
  return <form onSubmit={submit} className="space-y-5" noValidate>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    <div><label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--ink)]">Kata Sandi Baru</label><input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} aria-describedby={fieldErrors.password ? "password-error" : undefined} className="input-field" placeholder="Minimal 8 karakter" />{fieldErrors.password && <p id="password-error" role="alert" className="mt-1 text-sm text-red-700">{fieldErrors.password}</p>}</div>
    <div><label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-[var(--ink)]">Konfirmasi Kata Sandi Baru</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="input-field" placeholder="Ketik ulang kata sandi baru" /></div>
    <button type="submit" disabled={isLoading} className="button-primary mt-6">{isLoading ? "Menyimpan..." : "Reset Kata Sandi"}</button>
  </form>;
}
