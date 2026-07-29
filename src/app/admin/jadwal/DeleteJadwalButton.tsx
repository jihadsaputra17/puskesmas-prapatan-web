"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteJadwalButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      startTransition(async () => {
        try {
          // Gunakan fetch ke API murni agar tidak terblokir bug Server Action Next.js
          const response = await fetch(`/api/jadwal/${id}`, {
            method: "DELETE",
          });
          
          const result = await response.json();
          
          if (!response.ok || result.error) {
            alert(result.error || "Gagal menghapus jadwal.");
          } else {
            router.refresh();
          }
        } catch (err) {
          console.error("Delete Error:", err);
          alert("Terjadi kesalahan saat menghapus jadwal.");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 font-medium p-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}