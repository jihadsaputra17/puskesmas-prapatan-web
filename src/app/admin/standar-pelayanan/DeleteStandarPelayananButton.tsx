"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default function DeleteStandarPelayananButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const remove = async () => {
    setPending(true);
    try {
      const response = await fetch(`/api/standar-pelayanan/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || "Gagal menghapus data Standar Pelayanan.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat menghapus data Standar Pelayanan.");
    } finally {
      setPending(false);
    }
  };

  return <ConfirmDeleteButton itemName="data Standar Pelayanan" pending={pending} onConfirm={remove} />;
}
