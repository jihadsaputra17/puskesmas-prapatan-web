"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default function DeletePpidButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const remove = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/ppid/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Gagal menghapus data PPID.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus data PPID.");
    } finally {
      setPending(false);
    }
  };

  return <ConfirmDeleteButton itemName="data PPID" pending={pending} onConfirm={remove} />;
}
