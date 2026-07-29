"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBeritaButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.")) {
      startTransition(async () => {
        try {
          const response = await fetch(`/api/berita/${id}`, { method: "DELETE" });
          const result = await response.json();
          
          if (!response.ok || result.error) {
            alert(result.error || "Gagal menghapus berita.");
          } else {
            router.refresh();
          }
        } catch (err) {
          console.error("Delete Error:", err);
          alert("Terjadi kesalahan saat menghapus berita.");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}