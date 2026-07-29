"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal harus 8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      // Memanggil API Route secara langsung, menghindari bug Server Action Next.js
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, password }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Gagal mereset password.");
      } else {
        setSuccess("Password berhasil direset. Anda akan diarahkan kembali ke halaman manajemen user...");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/admin/users");
          router.refresh();
        }, 2500);
      }
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError("Terjadi kesalahan yang tidak terduga saat mereset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm">{success}</div>}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
          Password Baru
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors"
          placeholder="Masukkan password baru (min. 8 karakter)"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
          Konfirmasi Password Baru
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-colors"
          placeholder="Ketik ulang password baru"
        />
      </div>

      <button type="submit" disabled={isLoading || success !== ""} className="w-full mt-6 py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
        {isLoading ? "Menyimpan..." : "Reset Password"}
      </button>
    </form>
  );
}