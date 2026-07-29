"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteLayananButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      setIsPending(true);
      try {
        const response = await fetch(`/api/layanan/${id}`, { method: "DELETE" });
        const result = await response.json().catch(() => ({})); // Menghindari error parsing jika JSON kosong

        if (!response.ok || result.error) {
          alert(result.error || "Gagal menghapus layanan.");
        } else {
          router.refresh();
        }
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Terjadi kesalahan saat menghapus layanan.");
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
      {isPending ? "Menghapus..." : "Hapus"}
    </button>
  );
}
