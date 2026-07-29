"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); const [isLoading, setIsLoading] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    if (password !== confirmPassword) return setError("Kata sandi dan konfirmasi kata sandi harus sama.");
    if (password.length < 8) return setError("Kata sandi minimal 8 karakter.");
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: userId, password }) });
      if (!response.ok) { setError("Gagal mereset kata sandi. Periksa isian lalu coba lagi."); return; }
      router.push("/admin/users"); router.refresh();
    } catch { setError("Gagal mereset kata sandi. Periksa koneksi lalu coba lagi."); }
    finally { setIsLoading(false); }
  };
  return <form onSubmit={submit} className="space-y-5" noValidate>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    <div><label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Kata Sandi Baru</label><input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} aria-describedby={error ? "password-error" : undefined} className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Minimal 8 karakter" /></div>
    <div><label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">Konfirmasi Kata Sandi Baru</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600" placeholder="Ketik ulang kata sandi baru" /></div>
    <button type="submit" disabled={isLoading} className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 disabled:bg-slate-400">{isLoading ? "Menyimpan..." : "Reset Kata Sandi"}</button>
  </form>;
}
