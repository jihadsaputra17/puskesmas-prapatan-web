"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus akun pegawai ini? Tindakan ini tidak dapat dibatalkan.")) {
      startTransition(async () => {
        try {
          const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
          const result = await response.json();
          
          if (!response.ok || result.error) {
            alert(result.error || "Gagal menghapus pengguna.");
          } else {
            router.refresh();
          }
        } catch (err) {
          console.error("Delete Error:", err);
          alert("Terjadi kesalahan saat menghapus pengguna.");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}